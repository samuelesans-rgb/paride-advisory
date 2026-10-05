"""Read the inspected Google bulk-export schema; never infer missing metrics."""

import datetime as dt
import os
from typing import Any

from analytics.bigquery import DataError
from analytics.core import PROJECT, SC, normalize_url, ratio, sc_state, check_grain

TABLES = {"query": "searchdata_site_impression", "url": "searchdata_url_impression"}
POSITION = {"query": "sum_top_position", "url": "sum_position"}
PROPERTIES = {
    "https://sansoadvisory.it/",
    "https://www.sansoadvisory.it/",
    "sc-domain:sansoadvisory.it",
}
THRESHOLDS = {
    "minimum_observed_days": 28,
    "minimum_web_impressions": 1000,
    "minimum_dimension_impressions": 200,
    "low_ctr": 0.02,
}


def fields(table):
    return {f["name"]: f["type"] for f in table["schema"]["fields"]}


def validate_schema(table, expected):
    actual = fields(table)
    incompatible = [name for name, kind in expected.items() if actual.get(name) != kind]
    if incompatible:
        raise ValueError("SC_SCHEMA_INCOMPATIBLE: " + ", ".join(incompatible))
    return actual


def sum_sql(name):
    # SUM alone silently drops NULLs and would present partial counts as complete.
    return f"IF(COUNTIF({name} IS NULL)>0, NULL, SUM({name}))"


def daily_sql(table, dimension, column, prop, web, start, end, anonymized=False):
    dim = f"IF(is_anonymized_query, NULL, {dimension})" if anonymized else dimension
    return f"""SELECT data_date, {dim} dimension, COUNT(*) export_rows,
{sum_sql("impressions")} impressions, {sum_sql("clicks")} clicks,
{sum_sql(column)} position_sum
FROM `{PROJECT}.{SC}.{table}`
WHERE data_date BETWEEN DATE '{start}' AND DATE '{end}'
AND site_url='{prop}' AND search_type='{web}'
GROUP BY data_date, dimension ORDER BY data_date, dimension"""


def aggregate(rows, start, end, urls=False):
    groups: dict[str, Any] = {}
    for row in rows:
        if not row.get("data_date") or not str(start) <= row["data_date"] <= str(end):
            continue
        key = normalize_url(row["dimension"]) if urls else row["dimension"]
        key = key or "(anonymous/invalid)"
        group = groups.setdefault(
            key,
            {
                "dimension": key,
                "impressions": 0,
                "clicks": 0,
                "position_sum": 0,
                "export_rows": 0,
                "dates": set(),
            },
        )
        group["dates"].add(row["data_date"])
        group["export_rows"] += row["export_rows"]
        for metric in ["impressions", "clicks", "position_sum"]:
            value = row.get(metric)
            group[metric] = (
                None
                if value is None or group[metric] is None
                else group[metric] + value
            )
    for group in groups.values():
        group["ctr"] = ratio(group["clicks"], group["impressions"])
        position = ratio(group["position_sum"], group["impressions"])
        group["position"] = None if position is None else position + 1
        dates = sorted(group.pop("dates"))
        group.update(first_date=dates[0], last_date=dates[-1], observed_days=len(dates))
    return sorted(
        groups.values(), key=lambda x: (-(x["impressions"] or 0), x["dimension"])
    )


def summary(rows, start, end):
    # Summing aggregate dimensions is valid for bulk impressions/clicks, not GA users.
    totals = aggregate([dict(row, dimension="total") for row in rows], start, end)
    result = (
        totals[0]
        if totals
        else {
            "impressions": 0,
            "clicks": 0,
            "position_sum": None,
            "export_rows": 0,
            "ctr": None,
            "position": None,
            "first_date": None,
            "last_date": None,
            "observed_days": 0,
        }
    )
    result.pop("dimension", None)
    return result


def position_bands(rows):
    bands: dict[str, list[dict[str, Any]]] = {
        "1–3": [],
        "4–10": [],
        "11–20": [],
        ">20": [],
        "unavailable": [],
    }
    for row in rows:
        if row["dimension"] == "(anonymous/invalid)":
            continue
        p = row["position"]
        key = (
            "unavailable"
            if p is None
            else (
                "1–3"
                if p <= 3
                else "4–10"
                if p <= 10
                else "11–20"
                if p <= 20
                else ">20"
            )
        )
        bands[key].append(row)
    return bands


def read(client, inventory, end=None, days=28):
    result: dict[str, Any] = {
        "state": "ERROR",
        "report_status": "ERROR",
        "opportunities": [],
        "warnings": [],
        "thresholds": THRESHOLDS,
    }
    if not 1 <= days <= 90:
        raise ValueError("days must be 1..90")
    if inventory is None:
        return result
    tables = {t["tableReference"]["tableId"]: t for t in inventory["tables"]}
    result["state"] = sc_state(tables)
    result["report_status"] = "INSUFFICIENT_DATA"
    location = inventory["location"]
    try:
        result["export_log"] = []
        if "ExportLog" in tables:
            validate_schema(
                tables["ExportLog"],
                {
                    "agenda": "STRING",
                    "namespace": "STRING",
                    "data_date": "DATE",
                    "epoch_version": "INTEGER",
                    "publish_time": "TIMESTAMP",
                },
            )
            result["export_log"] = client.query(
                f"""SELECT agenda, namespace, data_date, epoch_version,
CAST(publish_time AS STRING) publish_time FROM `{PROJECT}.{SC}.ExportLog`
ORDER BY data_date DESC, namespace""",
                location,
            )
            result["export_log_latest_date"] = max(
                (r["data_date"] for r in result["export_log"] if r.get("data_date")),
                default=None,
            )
        else:
            result["warnings"].append(
                "SC_EXPORT_LOG_MISSING: publication cannot be verified"
            )
        if result["state"] == "PENDING":
            result["warnings"].append("Search Console bulk export pending")
            return result
        prop = os.environ.get("SANSO_SC_PROPERTY", "https://sansoadvisory.it/")
        if prop not in PROPERTIES:
            raise ValueError(
                "SC_PROPERTY_INCOMPATIBLE: unsupported configured property"
            )
        result["property"] = prop
        result["schema"] = {
            k: {
                "table": t,
                "fields": tables[t]["schema"]["fields"],
                "partitioning": tables[t].get("timePartitioning"),
            }
            for k, t in TABLES.items()
        }
        result["search_types"] = {}
        ranges = {}
        schemas = {}
        web_values = {}
        for kind, table in TABLES.items():
            schemas[kind] = validate_schema(
                tables[table],
                {
                    "data_date": "DATE",
                    "site_url": "STRING",
                    "search_type": "STRING",
                    kind: "STRING",
                    "impressions": "INTEGER",
                    "clicks": "INTEGER",
                    POSITION[kind]: "INTEGER",
                },
            )
            scopes = client.query(
                f"""SELECT site_url, search_type,
MIN(data_date) first_date, MAX(data_date) last_date, COUNT(*) raw_rows,
COUNT(DISTINCT data_date) available_days, {sum_sql("impressions")} impressions,
{sum_sql("clicks")} clicks FROM `{PROJECT}.{SC}.{table}` GROUP BY site_url, search_type""",
                location,
            )
            result["search_types"][kind] = scopes
            candidates = [
                r
                for r in scopes
                if r["site_url"] == prop
                and isinstance(r["search_type"], str)
                and r["search_type"].upper() == "WEB"
            ]
            # Do not merge properties or case variants silently.
            if len(candidates) > 1:
                raise ValueError("SC_SEARCH_TYPE_INCOMPATIBLE: ambiguous WEB values")
            if candidates:
                ranges[kind] = candidates[0]
                web_values[kind] = candidates[0]["search_type"]
            elif scopes and prop not in {r["site_url"] for r in scopes}:
                raise ValueError(
                    "SC_PROPERTY_INCOMPATIBLE: configured property absent from export"
                )
        result["data_range"] = ranges
        last_dates = [r["last_date"] for r in ranges.values() if r["last_date"]]
        if len(last_dates) != 2:
            result["warnings"].append(
                "SC_WEB_DATA_MISSING: empty or incomplete WEB export"
            )
            return result
        # Latest date present in both grains avoids comparing partially published exports.
        available_end = min(last_dates)
        stop = dt.date.fromisoformat(end or available_end)
        start = stop - dt.timedelta(days=days - 1)
        previous_start = start - dt.timedelta(days=days)
        previous_end = start - dt.timedelta(days=1)
        result["period"] = {
            "start": str(start),
            "end": str(stop),
            "previous_start": str(previous_start),
            "previous_end": str(previous_end),
        }
        result["last_available_date"] = available_end
        result["web_filter"] = web_values
        for dim, kind in [
            ("query", "query"),
            ("url", "url"),
            ("country", "query"),
            ("device", "query"),
        ]:
            if dim not in schemas[kind]:
                result["warnings"].append("SC_OPTIONAL_DIMENSION_UNAVAILABLE: " + dim)
                continue
            if schemas[kind][dim] != "STRING":
                raise ValueError("SC_SCHEMA_INCOMPATIBLE: " + dim)
            rows = client.query(
                daily_sql(
                    TABLES[kind],
                    dim,
                    POSITION[kind],
                    prop,
                    web_values[kind],
                    previous_start,
                    stop,
                    dim == "query"
                    and schemas[kind].get("is_anonymized_query") == "BOOLEAN",
                ),
                location,
            )
            check_grain(rows, ["data_date", "dimension"])
            current = aggregate(rows, start, stop, dim == "url")
            result[dim] = {
                "current": current,
                "previous": aggregate(rows, previous_start, previous_end, dim == "url"),
                "daily": rows,
            }
            if dim in TABLES:
                result[dim]["summary"] = summary(rows, start, stop)
                result[dim]["aggregate_dimensions"] = sum(
                    r["dimension"] != "(anonymous/invalid)" for r in current
                )
                result[dim]["anonymous_or_invalid"] = [
                    r for r in current if r["dimension"] == "(anonymous/invalid)"
                ]
                result[dim]["raw_rows_all_search_types"] = sum(
                    r["raw_rows"]
                    for r in result["search_types"][dim]
                    if r["site_url"] == prop
                )
                available = {
                    r["data_date"]
                    for r in rows
                    if r.get("data_date") and str(start) <= r["data_date"] <= str(stop)
                }
                result[dim]["missing_dates"] = [
                    str(start + dt.timedelta(days=i))
                    for i in range(days)
                    if str(start + dt.timedelta(days=i)) not in available
                ]
                if result[dim]["missing_dates"]:
                    result["warnings"].append("SC_INCOMPLETE_WINDOW: " + dim)
                if any(
                    r.get(k) is None
                    for r in rows
                    for k in ("impressions", "clicks", "position_sum")
                ):
                    result["warnings"].append(
                        "SC_NULL_METRICS: unknown values retained, not converted to zero"
                    )
                if dim == "url" and any(
                    normalize_url(r["dimension"]) is None for r in rows
                ):
                    result["warnings"].append(
                        "SC_INVALID_URL: excluded from opportunities, retained in totals"
                    )
        queries = result["query"]["current"]
        result["position_bands"] = position_bands(queries)
        result["queries_with_impressions_zero_clicks"] = [
            r
            for r in queries
            if r["dimension"] != "(anonymous/invalid)"
            and (r["impressions"] or 0) > 0
            and r["clicks"] == 0
        ]
        sufficient = all(
            result[k]["summary"]["observed_days"] >= THRESHOLDS["minimum_observed_days"]
            and (result[k]["summary"]["impressions"] or 0)
            >= THRESHOLDS["minimum_web_impressions"]
            and result[k]["summary"]["clicks"] is not None
            and not result[k]["missing_dates"]
            for k in TABLES
        )
        result["report_status"] = "READY" if sufficient else "INSUFFICIENT_DATA"
        if sufficient:
            for kind in TABLES:
                for row in result[kind]["current"]:
                    if (
                        row["dimension"] == "(anonymous/invalid)"
                        or (row["impressions"] or 0)
                        < THRESHOLDS["minimum_dimension_impressions"]
                    ):
                        continue
                    tags = []
                    if row["ctr"] is not None and row["ctr"] < THRESHOLDS["low_ctr"]:
                        tags.append("high_impressions_low_ctr")
                    if row["position"] is not None and 3 < row["position"] <= 20:
                        tags.append(
                            "near_top_3" if row["position"] <= 10 else "near_first_page"
                        )
                    if tags:
                        result["opportunities"].append(
                            dict(
                                row,
                                kind=kind,
                                opportunities=tags,
                                interpretation="Candidate for manual review; not an editorial recommendation",
                            )
                        )
        result["warnings"].extend(
            [
                "Search Console WEB only; site/query and URL totals have different grains and must not be added.",
                "Search Console Pacific-time dates are separate from GA4 property dates; no conversion join.",
                "Position = SUM(zero-based position)/SUM(impressions)+1; CTR = clicks/impressions; zero denominator yields NULL.",
                "Position bands are descriptive: <=3, (3,10], (10,20], >20. Anonymous queries cannot generate opportunities.",
                "INSUFFICIENT_DATA suppresses all SEO opportunities; missing dates are not interpreted as zero traffic.",
            ]
        )
    except (DataError, ValueError, KeyError, TypeError) as error:
        result.update(state="ERROR", report_status="ERROR", opportunities=[])
        result["warnings"].append("Search Console: " + str(error))
    return result
