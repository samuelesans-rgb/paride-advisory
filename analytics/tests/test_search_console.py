"""Actual schema with synthetic, non-personal export rows; no cloud writes."""

import copy
import datetime as dt
import json
from pathlib import Path
import re
import unittest
from typing import Any

from analytics.core import GA, ratio
from analytics.search_console import (
    read,
    aggregate,
    TABLES,
    POSITION,
    daily_sql,
    position_bands,
)

SCHEMA = json.loads(
    (Path(__file__).parent / "fixtures/search_console_schema.json").read_text()
)
PROPERTY = "https://sansoadvisory.it/"


class ExportClient:
    def __init__(self):
        self.audit = []
        self.sql = []
        self.schema = copy.deepcopy(SCHEMA)
        self.rows: dict[str, list[dict[str, Any]]] = {}
        for kind, table in TABLES.items():
            self.rows[table] = [
                dict(
                    data_date="2026-10-03",
                    site_url=PROPERTY,
                    search_type="WEB",
                    query="example query",
                    url="https://www.sansoadvisory.it/example/?test=1",
                    is_anonymized_query=False,
                    country="ita",
                    device="MOBILE",
                    impressions=2,
                    clicks=0,
                    **{POSITION[kind]: 8},
                ),
                dict(
                    data_date="2026-10-02",
                    site_url=PROPERTY,
                    search_type="WEB",
                    query="example query",
                    url="https://sansoadvisory.it/example",
                    is_anonymized_query=False,
                    country="ita",
                    device="DESKTOP",
                    impressions=3,
                    clicks=0,
                    **{POSITION[kind]: 6},
                ),
                dict(
                    data_date="2026-10-03",
                    site_url=PROPERTY,
                    search_type="IMAGE",
                    query="image query",
                    url="https://sansoadvisory.it/image",
                    is_anonymized_query=False,
                    country="ita",
                    device="MOBILE",
                    impressions=100,
                    clicks=10,
                    **{POSITION[kind]: 100},
                ),
            ]

    def inventory(self, dataset):
        return {"location": "EU", "tables": []} if dataset == GA else self.schema

    def query(self, sql, location):
        self.sql.append(sql)
        if ".ExportLog`" in sql:
            return [
                dict(
                    agenda="SEARCHDATA",
                    namespace="SEARCHDATA_SITE_IMPRESSION",
                    data_date="2026-10-03",
                    epoch_version=0,
                    publish_time="2026-10-05 05:00:00+00",
                )
            ]
        kind = "url" if "searchdata_url_impression" in sql else "query"
        source = self.rows[TABLES[kind]]
        if "GROUP BY site_url, search_type" in sql:
            scopes: dict[tuple[str, str], list[dict[str, Any]]] = {}
            for row in source:
                group = scopes.setdefault((row["site_url"], row["search_type"]), [])
                group.append(row)
            return [
                dict(
                    site_url=prop,
                    search_type=typ,
                    first_date=min(r["data_date"] for r in rows),
                    last_date=max(r["data_date"] for r in rows),
                    raw_rows=len(rows),
                    available_days=len({r["data_date"] for r in rows}),
                    impressions=None
                    if any(r["impressions"] is None for r in rows)
                    else sum(r["impressions"] for r in rows),
                    clicks=None
                    if any(r["clicks"] is None for r in rows)
                    else sum(r["clicks"] for r in rows),
                )
                for (prop, typ), rows in scopes.items()
            ]
        match = re.search(r"BETWEEN DATE '([^']+)' AND DATE '([^']+)'", sql)
        assert match is not None
        start, stop = match.groups()
        prop_match = re.search(r"site_url='([^']+)'", sql)
        assert prop_match is not None
        prop = prop_match[1]
        type_match = re.search(r"search_type='([^']+)'", sql)
        assert type_match is not None
        typ = type_match[1]
        dim_match = re.search(r"SELECT data_date, (.*?) dimension,", sql)
        assert dim_match is not None
        dim = dim_match[1]
        dim = "query" if "is_anonymized_query" in dim else dim
        groups: dict[tuple[str, str | None], list[dict[str, Any]]] = {}
        for row in source:
            if (
                not start <= row["data_date"] <= stop
                or row["site_url"] != prop
                or row["search_type"] != typ
            ):
                continue
            value = None if dim == "query" and row["is_anonymized_query"] else row[dim]
            groups.setdefault((row["data_date"], value), []).append(row)
        out = []
        for (date, dimension), rows in groups.items():
            item = dict(data_date=date, dimension=dimension, export_rows=len(rows))
            for metric, source_key in [
                ("impressions", "impressions"),
                ("clicks", "clicks"),
                ("position_sum", POSITION[kind]),
            ]:
                values = [r[source_key] for r in rows]
                item[metric] = None if None in values else sum(values)
            out.append(item)
        return out


class SearchConsoleTests(unittest.TestCase):
    def run_reader(self, client=None, **kwargs):
        client = client or ExportClient()
        return read(client, client.schema, **kwargs)

    def test_ready_query_url_aggregate_zero_click_ctr_position(self):
        result = self.run_reader()
        self.assertEqual(result["state"], "READY")
        self.assertEqual(result["last_available_date"], "2026-10-03")
        for dim in ["query", "url"]:
            row = result[dim]["current"][0]
            self.assertEqual(row["impressions"], 5)
            self.assertEqual(row["clicks"], 0)
            self.assertEqual(row["ctr"], 0)
            self.assertAlmostEqual(row["position"], 14 / 5 + 1)
            self.assertEqual(result[dim]["summary"]["export_rows"], 2)
        self.assertEqual(
            result["url"]["current"][0]["dimension"], "https://sansoadvisory.it/example"
        )
        self.assertEqual(result["report_status"], "INSUFFICIENT_DATA")
        self.assertEqual(result["opportunities"], [])
        self.assertEqual(len(result["queries_with_impressions_zero_clicks"]), 1)

    def test_web_filter_uses_observed_case_and_single_property(self):
        c = ExportClient()
        result = self.run_reader(c)
        self.assertEqual(result["web_filter"], {"query": "WEB", "url": "WEB"})
        self.assertEqual(result["query"]["summary"]["impressions"], 5)
        self.assertEqual(len(result["search_types"]["query"]), 2)
        self.assertTrue(
            all(
                "search_type='WEB'" in sql and f"site_url='{PROPERTY}'" in sql
                for sql in c.sql
                if "GROUP BY data_date" in sql
            )
        )
        self.assertEqual(result["device"]["current"][0]["dimension"], "DESKTOP")
        self.assertEqual(result["country"]["current"][0]["dimension"], "ita")

    def test_lowercase_web_only_when_observed(self):
        c = ExportClient()
        for rows in c.rows.values():
            for row in rows:
                row["search_type"] = row["search_type"].lower()
        self.assertEqual(self.run_reader(c)["web_filter"]["query"], "web")

    def test_pending_missing_tables_export_log(self):
        c = ExportClient()
        c.schema["tables"] = [
            t
            for t in c.schema["tables"]
            if t["tableReference"]["tableId"] == "ExportLog"
        ]
        result = self.run_reader(c)
        self.assertEqual(result["state"], "PENDING")
        self.assertEqual(len(result["export_log"]), 1)
        self.assertEqual(len(c.sql), 1)
        c.schema["tables"] = []
        self.assertEqual(self.run_reader(c)["state"], "PENDING")

    def test_missing_one_table_is_pending(self):
        c = ExportClient()
        c.schema["tables"] = [
            t
            for t in c.schema["tables"]
            if t["tableReference"]["tableId"] != TABLES["url"]
        ]
        self.assertEqual(self.run_reader(c)["state"], "PENDING")

    def test_empty_and_non_web_tables(self):
        for empty in [True, False]:
            c = ExportClient()
            for table in c.rows:
                c.rows[table] = (
                    []
                    if empty
                    else [r for r in c.rows[table] if r["search_type"] == "IMAGE"]
                )
            result = self.run_reader(c)
            self.assertEqual(result["state"], "READY")
            self.assertEqual(result["report_status"], "INSUFFICIENT_DATA")
            self.assertEqual(result["opportunities"], [])

    def test_schema_missing_and_wrong_types(self):
        for field, kind in [
            ("clicks", None),
            ("data_date", "STRING"),
            ("sum_top_position", "STRING"),
        ]:
            c = ExportClient()
            table = next(
                t
                for t in c.schema["tables"]
                if t["tableReference"]["tableId"] == TABLES["query"]
            )
            table["schema"]["fields"] = [
                f for f in table["schema"]["fields"] if f["name"] != field
            ] + ([] if kind is None else [{"name": field, "type": kind}])
            result = self.run_reader(c)
            self.assertEqual(result["state"], "ERROR")
            self.assertIn("SC_SCHEMA_INCOMPATIBLE", " ".join(result["warnings"]))

    def test_export_log_schema_and_missing(self):
        c = ExportClient()
        log = next(
            t
            for t in c.schema["tables"]
            if t["tableReference"]["tableId"] == "ExportLog"
        )
        log["schema"]["fields"] = []
        self.assertEqual(self.run_reader(c)["state"], "ERROR")
        c = ExportClient()
        c.schema["tables"] = [
            t
            for t in c.schema["tables"]
            if t["tableReference"]["tableId"] != "ExportLog"
        ]
        result = self.run_reader(c)
        self.assertEqual(result["state"], "READY")
        self.assertIn("SC_EXPORT_LOG_MISSING", " ".join(result["warnings"]))

    def test_null_position_preserves_counts_and_null_clicks_not_zero(self):
        c = ExportClient()
        c.rows[TABLES["query"]][0]["sum_top_position"] = None
        result = self.run_reader(c)
        row = result["query"]["current"][0]
        self.assertEqual(row["impressions"], 5)
        self.assertEqual(row["ctr"], 0)
        self.assertIsNone(row["position"])
        c.rows[TABLES["query"]][0]["clicks"] = None
        result = self.run_reader(c)
        row = result["query"]["current"][0]
        self.assertIsNone(row["clicks"])
        self.assertIsNone(row["ctr"])
        self.assertIn("SC_NULL_METRICS", " ".join(result["warnings"]))

    def test_null_impressions_not_partial_or_zero(self):
        c = ExportClient()
        c.rows[TABLES["query"]][0]["impressions"] = None
        result = self.run_reader(c)
        self.assertIsNone(result["query"]["summary"]["impressions"])
        self.assertEqual(result["query"]["summary"]["clicks"], 0)
        self.assertIsNone(result["query"]["summary"]["ctr"])
        self.assertIsNone(result["query"]["summary"]["position"])
        self.assertEqual(result["opportunities"], [])

    def test_zero_impressions_ctr_position_unavailable(self):
        c = ExportClient()
        for rows in c.rows.values():
            for row in rows:
                row["impressions"] = 0
        row = self.run_reader(c)["query"]["current"][0]
        self.assertEqual(row["clicks"], 0)
        self.assertIsNone(row["ctr"])
        self.assertIsNone(row["position"])

    def test_date_boundaries_and_previous(self):
        result = self.run_reader(end="2026-10-02", days=1)
        self.assertEqual(result["query"]["summary"]["impressions"], 3)
        self.assertEqual(result["query"]["summary"]["observed_days"], 1)
        self.assertEqual(result["period"]["start"], "2026-10-02")
        result = self.run_reader(end="2026-10-03", days=1)
        self.assertEqual(result["query"]["current"][0]["impressions"], 2)
        self.assertEqual(result["query"]["previous"][0]["impressions"], 3)
        result = self.run_reader(end="2026-10-04", days=1)
        self.assertEqual(result["query"]["current"], [])
        self.assertEqual(result["query"]["missing_dates"], ["2026-10-04"])

    def test_anonymized_queries_retained_without_opportunities(self):
        c = ExportClient()
        c.rows[TABLES["query"]][0]["is_anonymized_query"] = True
        result = self.run_reader(c)
        self.assertEqual(result["query"]["summary"]["impressions"], 5)
        self.assertTrue(
            any(
                r["dimension"] == "(anonymous/invalid)"
                for r in result["query"]["current"]
            )
        )
        self.assertEqual(len(result["queries_with_impressions_zero_clicks"]), 1)

    def test_incompatible_property_and_ambiguous_web(self):
        c = ExportClient()
        for row in c.rows[TABLES["query"]]:
            row["site_url"] = "https://example.org/"
        self.assertEqual(self.run_reader(c)["state"], "ERROR")
        c = ExportClient()
        row = dict(c.rows[TABLES["query"]][0], search_type="web")
        c.rows[TABLES["query"]].append(row)
        self.assertEqual(self.run_reader(c)["state"], "ERROR")

    def test_conservative_global_and_dimension_thresholds(self):
        c = ExportClient()
        for kind, table in TABLES.items():
            base = c.rows[table][0]
            c.rows[table] = [
                dict(
                    base,
                    data_date=str(dt.date(2026, 10, 3) - dt.timedelta(days=i)),
                    impressions=50,
                    **{POSITION[kind]: 250},
                )
                for i in range(28)
            ]
            c.rows[table].append(
                dict(
                    base,
                    query="tiny query",
                    url="https://sansoadvisory.it/tiny",
                    impressions=2,
                )
            )
        result = self.run_reader(c)
        self.assertEqual(result["report_status"], "READY")
        self.assertEqual(len(result["opportunities"]), 2)
        self.assertFalse(
            any(r["dimension"] == "tiny query" for r in result["opportunities"])
        )
        c.rows[TABLES["url"]].pop(1)
        self.assertEqual(self.run_reader(c)["opportunities"], [])

    def test_optional_dimensions_and_missing_date_values(self):
        c = ExportClient()
        for table in c.schema["tables"]:
            table["schema"]["fields"] = [
                f
                for f in table["schema"]["fields"]
                if f["name"] not in ["country", "device"]
            ]
        result = self.run_reader(c)
        self.assertEqual(result["state"], "READY")
        self.assertNotIn("device", result)
        self.assertIn("SC_OPTIONAL_DIMENSION_UNAVAILABLE", " ".join(result["warnings"]))
        rows = [
            dict(
                data_date=None,
                dimension="query",
                export_rows=1,
                impressions=2,
                clicks=0,
                position_sum=2,
            )
        ]
        self.assertEqual(
            aggregate(rows, dt.date(2026, 10, 1), dt.date(2026, 10, 3)), []
        )

    def test_sql_null_safe_and_date_partition_filter(self):
        sql = daily_sql(
            TABLES["query"],
            "query",
            "sum_top_position",
            PROPERTY,
            "WEB",
            "2026-10-01",
            "2026-10-03",
            True,
        )
        self.assertIn("COUNTIF(clicks IS NULL)", sql)
        self.assertIn("IF(is_anonymized_query, NULL, query)", sql)
        self.assertIn("data_date BETWEEN DATE '2026-10-01' AND DATE '2026-10-03'", sql)
        self.assertNotIn("SELECT *", sql)
        self.assertIsNone(ratio(0, 0))

    def test_position_band_boundaries(self):
        rows = [
            dict(dimension=str(p), position=p) for p in [1, 3, 3.5, 10, 10.5, 20, 20.1]
        ]
        bands = position_bands(rows)
        self.assertEqual(
            [len(bands[k]) for k in ["1–3", "4–10", "11–20", ">20"]], [2, 2, 2, 1]
        )


if __name__ == "__main__":
    unittest.main()
