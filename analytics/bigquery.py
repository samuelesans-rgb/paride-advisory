"""Read-only BigQuery REST client. No credential material is logged."""

import json
import shutil
import subprocess
import time
import urllib.error
import urllib.request
import uuid
from analytics.core import PROJECT


class DataError(Exception):
    pass


class BigQuery:
    def __init__(self):
        self.credentials = None
        self.gcloud = shutil.which("gcloud")
        self.remaining = 10_000_000_000  # hard per-run dry-run budget (10 GB)
        self.audit = []
        try:
            import google.auth

            self.credentials, self.auth_project = google.auth.default(
                scopes=["https://www.googleapis.com/auth/bigquery"]
            )
        except Exception:
            self.auth_project = None
        if not self.credentials and not self.gcloud:
            raise DataError(
                "GOOGLE_AUTH_UNAVAILABLE: configure existing-account ADC; no Google keys were created"
            )

    def token(self):
        try:
            if self.credentials:
                from google.auth.transport.requests import Request

                if not self.credentials.valid:
                    self.credentials.refresh(Request())
                return self.credentials.token
            assert self.gcloud is not None
            return subprocess.run(
                [self.gcloud, "auth", "print-access-token"],
                check=True,
                capture_output=True,
                text=True,
                timeout=30,
            ).stdout.strip()
        except Exception:
            raise DataError(
                "GOOGLE_AUTH_FAILED: authentication refresh failed"
            ) from None

    def request(self, path, body=None):
        req = urllib.request.Request(
            "https://bigquery.googleapis.com/bigquery/v2/projects/"
            + PROJECT
            + "/"
            + path,
            data=json.dumps(body).encode() if body is not None else None,
            headers={
                "Authorization": "Bearer " + self.token(),
                "Content-Type": "application/json",
            },
        )
        try:
            with urllib.request.urlopen(req, timeout=60) as response:
                return json.load(response)
        except urllib.error.HTTPError as e:
            # Never output provider bodies: they can contain SQL, URLs, or credential context.
            code = {
                403: "ACCESS_DENIED_OR_API_DISABLED",
                404: "DATASET_OR_TABLE_ABSENT",
                400: "QUERY_SCHEMA_OR_COST_ERROR",
            }.get(e.code, "GOOGLE_HTTP_ERROR")
            raise DataError(f"{code}: HTTP {e.code}") from None
        except (OSError, ValueError):
            raise DataError("GOOGLE_NETWORK_OR_RESPONSE_ERROR") from None

    def inventory(self, dataset):
        d = self.request("datasets/" + dataset)
        tables, token = [], ""
        while True:
            page = self.request(
                "datasets/"
                + dataset
                + "/tables?maxResults=1000"
                + ("&pageToken=" + token if token else "")
            )
            for t in page.get("tables", []):
                name = t["tableReference"]["tableId"]
                m = self.request("datasets/" + dataset + "/tables/" + name)
                tables.append(
                    {
                        k: m.get(k)
                        for k in [
                            "tableReference",
                            "type",
                            "creationTime",
                            "lastModifiedTime",
                            "numRows",
                            "schema",
                            "timePartitioning",
                        ]
                    }
                )
            token = page.get("nextPageToken")
            if not token:
                break
        return {"location": d["location"], "tables": tables}

    def query(self, sql, location):
        config = {
            "query": sql,
            "useLegacySql": False,
            "maximumBytesBilled": "1000000000",
        }
        dry = self.request(
            "jobs",
            {
                "configuration": {"dryRun": True, "query": config},
                "jobReference": {"projectId": PROJECT, "location": location},
            },
        )
        estimate = int(
            dry.get("statistics", {}).get("query", {}).get("totalBytesProcessed", 0)
        )
        if estimate > 1_000_000_000 or estimate > self.remaining:
            raise DataError("BIGQUERY_COST_LIMIT: query/run budget exceeded")
        self.remaining -= estimate
        job_id = "sanso_analytics_" + uuid.uuid4().hex
        self.request(
            "jobs",
            {
                "configuration": {"query": config, "jobTimeoutMs": "180000"},
                "jobReference": {
                    "projectId": PROJECT,
                    "location": location,
                    "jobId": job_id,
                },
            },
        )
        self.audit.append(
            {"job_id": job_id, "location": location, "estimated_bytes": estimate}
        )
        path = (
            "queries/"
            + job_id
            + "?location="
            + location
            + "&maxResults=10000&timeoutMs=10000"
        )
        deadline = time.monotonic() + 240
        rows, schema = [], None
        while True:
            result = self.request(path)
            if result.get("errors"):
                raise DataError("BIGQUERY_JOB_ERROR: query could not complete")
            if not result.get("jobComplete"):
                if time.monotonic() > deadline:
                    raise DataError("BIGQUERY_JOB_TIMEOUT")
                time.sleep(1)
                continue
            schema = result.get("schema", {}).get("fields", schema or [])
            for row in result.get("rows", []):
                item = {}
                for f, v in zip(schema, row["f"]):
                    value = v.get("v")
                    if value is not None:
                        if f["type"] in ("INTEGER", "INT64"):
                            value = int(value)
                        elif f["type"] in ("FLOAT", "FLOAT64", "NUMERIC"):
                            value = float(value)
                    item[f["name"]] = value
                rows.append(item)
            if len(rows) > 200000:
                raise DataError("BIGQUERY_RESULT_LIMIT: over 200000 aggregate rows")
            token = result.get("pageToken")
            if not token:
                break
            path = (
                "queries/"
                + job_id
                + "?location="
                + location
                + "&maxResults=10000&pageToken="
                + token
            )
        return rows
