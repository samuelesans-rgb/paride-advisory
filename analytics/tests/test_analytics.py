import datetime as dt
import unittest
from analytics.core import (
    GA,
    periods,
    normalize_url,
    ratio,
    opportunities,
    sc_state,
    ga_query,
    ga_summary_query,
    sc_query,
    aggregate_sc,
    check_grain,
)
from analytics.report import generate, markdown
from analytics.bigquery import DataError, BigQuery


class FakeClient:
    audit: list[dict] = []

    def __init__(self, missing=False, pending=True):
        self.missing, self.pending = missing, pending

    def inventory(self, dataset):
        if self.missing:
            raise DataError("DATASET_OR_TABLE_ABSENT: HTTP 404")
        names = (
            ["temp_5ac970cc"]
            if self.pending
            else ["searchdata_site_impression", "searchdata_url_impression"]
        )
        return {
            "location": "EU",
            "tables": []
            if dataset == GA
            else [
                {"tableReference": {"tableId": n}, "schema": {"fields": []}}
                for n in names
            ],
        }


class PaginatedClient(BigQuery):
    """Exercise result paging without credentials or network requests."""

    def __init__(self, page_sizes):
        self.remaining = 10_000_000_000
        self.audit = []
        self.page_sizes = page_sizes
        self.pages_read = 0

    def request(self, path, body=None):
        if path == "jobs":
            return {"statistics": {"query": {"totalBytesProcessed": "1"}}}
        size = self.page_sizes[self.pages_read]
        self.pages_read += 1
        result = {
            "jobComplete": True,
            "schema": {"fields": [{"name": "n", "type": "INTEGER"}]},
            "rows": [{"f": [{"v": "1"}]}] * size,
        }
        if self.pages_read < len(self.page_sizes):
            result["pageToken"] = str(self.pages_read)
        return result


class AnalyticsTests(unittest.TestCase):
    def test_result_limit_allows_exactly_200000_rows(self):
        client = PaginatedClient([10000] * 20)
        self.assertEqual(len(client.query("SELECT 1", "EU")), 200000)
        self.assertEqual(client.pages_read, 20)

    def test_result_limit_rejects_200001_before_next_page(self):
        client = PaginatedClient([10000] * 20 + [1, 1])
        with self.assertRaisesRegex(DataError, "BIGQUERY_RESULT_LIMIT"):
            client.query("SELECT 1", "EU")
        self.assertEqual(client.pages_read, 21)

    def test_result_limit_rejects_overflow_on_last_page(self):
        client = PaginatedClient([10000] * 20 + [1])
        with self.assertRaisesRegex(DataError, "BIGQUERY_RESULT_LIMIT"):
            client.query("SELECT 1", "EU")
        self.assertEqual(client.pages_read, 21)

    def test_urls(self):
        for v in [
            "http://www.sansoadvisory.it/blog/?utm_source=x#f",
            "https://sansoadvisory.it/blog",
            "/blog/?x=2",
        ]:
            self.assertEqual(normalize_url(v), "https://sansoadvisory.it/blog")
        self.assertEqual(normalize_url("/"), "https://sansoadvisory.it/")
        for bad in [
            None,
            "",
            "javascript:alert(1)",
            "https://evil.it/a",
            "//evil.it/a",
            "https://sansoadvisory.it:8080",
            "https://user@sansoadvisory.it",
            "/bad path",
        ]:
            self.assertIsNone(normalize_url(bad))

    def test_ctr(self):
        self.assertEqual(ratio(2, 100), 0.02)
        self.assertIsNone(ratio(2, 0))
        self.assertIsNone(ratio(None, 2))
        self.assertIsNone(ratio(2, None))

    def test_opportunities(self):
        old = [{"dimension": "x", "impressions": 100, "clicks": 20}]
        rows = [{"dimension": "x", "impressions": 200, "clicks": 2, "position": 11}]
        tags = opportunities(rows, old)[0]["opportunities"]
        self.assertIn("near_first_page", tags)
        self.assertIn("high_impressions_low_ctr", tags)
        self.assertIn("clicks_declining", tags)
        self.assertIn("impressions_growing", tags)
        self.assertEqual(
            opportunities(
                [{"dimension": "x", "impressions": 0, "clicks": 0, "position": None}],
                [],
            ),
            [],
        )
        for position, tag in [
            (4, "near_top_3"),
            (10, "near_top_3"),
            (20, "near_first_page"),
        ]:
            self.assertIn(
                tag,
                opportunities([dict(rows[0], position=position)], [])[0][
                    "opportunities"
                ],
            )

    def test_pending(self):
        self.assertEqual(sc_state(["temp_123"]), "PENDING")
        self.assertEqual(
            sc_state(["searchdata_site_impression", "searchdata_url_impression"]),
            "READY",
        )
        self.assertEqual(sc_state(None), "ERROR")
        r = generate(FakeClient(), "2026-09-28")
        self.assertEqual(r["search_console"]["state"], "PENDING")
        self.assertIn("Search Console bulk export pending", markdown(r))

    def test_ready_auto_enables_data(self):
        class ReadyClient(FakeClient):
            def inventory(self, dataset):
                if dataset == GA:
                    return {"location": "EU", "tables": []}
                fields = [
                    {"name": n}
                    for n in [
                        "data_date",
                        "site_url",
                        "search_type",
                        "impressions",
                        "clicks",
                        "sum_top_position",
                        "sum_position",
                        "query",
                        "url",
                        "country",
                        "device",
                    ]
                ]
                return {
                    "location": "EU",
                    "tables": [
                        {"tableReference": {"tableId": n}, "schema": {"fields": fields}}
                        for n in [
                            "searchdata_site_impression",
                            "searchdata_url_impression",
                        ]
                    ],
                }

            def query(self, sql, location):
                dimension = (
                    "https://sansoadvisory.it/blog/"
                    if "searchdata_url_impression" in sql
                    else "test-query"
                )
                return [
                    {
                        "data_date": "2026-09-28",
                        "dimension": dimension,
                        "impressions": 200,
                        "clicks": 2,
                        "position": 7,
                        "export_rows": 2,
                    }
                ]

        r = generate(ReadyClient(), "2026-09-28")
        self.assertEqual(r["search_console"]["state"], "READY")
        self.assertEqual(
            r["search_console"]["url"]["current"][0]["dimension"],
            "https://sansoadvisory.it/blog",
        )
        self.assertTrue(r["opportunities"])

    def test_dataset_unavailable(self):
        r = generate(FakeClient(missing=True), "2026-09-28")
        self.assertEqual(r["inventory"], {})
        self.assertEqual(r["search_console"]["state"], "ERROR")
        self.assertEqual(len(r["warnings"]), 2)

    def test_dataset_available(self):
        r = generate(FakeClient(), "2026-09-28")
        self.assertIn(GA, r["inventory"])

    def test_auth_unavailable(self):
        self.assertIn("GOOGLE_AUTH_UNAVAILABLE", generate(None)["warnings"][0])

    def test_dates(self):
        self.assertEqual(
            periods("2024-03-01", 2),
            (
                dt.date(2024, 2, 29),
                dt.date(2024, 3, 1),
                dt.date(2024, 2, 27),
                dt.date(2024, 2, 28),
            ),
        )
        with self.assertRaises(ValueError):
            periods("2026-01-01", 91)

    def test_ga_query(self):
        paths = {
            "event_date",
            "event_name",
            "event_timestamp",
            "event_params",
            "user_pseudo_id",
        }
        q = ga_query(paths, dt.date(2026, 9, 1), dt.date(2026, 9, 28))
        self.assertIn("_TABLE_SUFFIX BETWEEN '20260901' AND '20260928'", q)
        self.assertNotIn("SELECT *", q)
        self.assertIn("STRUCT(user_pseudo_id, sid)", q)
        self.assertIn(
            "COUNT(DISTINCT session_key)",
            ga_summary_query(paths, dt.date(2026, 9, 1), dt.date(2026, 9, 28)),
        )
        with self.assertRaises(ValueError):
            ga_query(set(), dt.date.today(), dt.date.today())

    def test_sc_query(self):
        paths = {
            "data_date",
            "site_url",
            "search_type",
            "impressions",
            "clicks",
            "sum_top_position",
            "query",
        }
        q = sc_query(
            "searchdata_site_impression",
            paths,
            dt.date(2026, 9, 1),
            dt.date(2026, 9, 28),
            "query",
        )
        self.assertIn("SAFE_DIVIDE", q)
        self.assertIn("SUM(sum_top_position)", q)
        self.assertIn("data_date BETWEEN DATE '2026-09-01'", q)
        self.assertNotIn("SELECT *", q)
        paths = {
            "data_date",
            "site_url",
            "search_type",
            "impressions",
            "clicks",
            "sum_position",
            "url",
        }
        self.assertIn(
            "SUM(sum_position)",
            sc_query(
                "searchdata_url_impression",
                paths,
                dt.date.today(),
                dt.date.today(),
                "url",
            ),
        )
        with self.assertRaises(ValueError):
            sc_query("bad", paths, dt.date.today(), dt.date.today(), "url")

    def test_duplicate_aggregate_grain(self):
        with self.assertRaises(ValueError):
            check_grain(
                [{"date": "2026-09-01", "dimension": "x"}] * 2, ["date", "dimension"]
            )
        check_grain(
            [
                {"date": "2026-09-01", "dimension": "x"},
                {"date": "2026-09-02", "dimension": "x"},
            ],
            ["date", "dimension"],
        )

    def test_cost_budget(self):
        class BudgetClient(BigQuery):
            def __init__(self):
                self.remaining = 10_000_000_000
                self.audit = []
                self.calls = []

            def request(self, path, body=None):
                self.calls.append(body)
                return {"statistics": {"query": {"totalBytesProcessed": "1000000001"}}}

        c = BudgetClient()
        with self.assertRaises(DataError):
            c.query("SELECT 1", "EU")
        self.assertEqual(len(c.calls), 1)
        self.assertTrue(c.calls[0]["configuration"]["dryRun"])
        self.assertEqual(
            c.calls[0]["configuration"]["query"]["maximumBytesBilled"], "1000000000"
        )

    def test_sc_property_not_double_counted(self):
        paths = {
            "data_date",
            "site_url",
            "search_type",
            "impressions",
            "clicks",
            "sum_top_position",
            "query",
        }
        q = sc_query(
            "searchdata_site_impression",
            paths,
            dt.date.today(),
            dt.date.today(),
            "query",
        )
        self.assertIn("search_type='web'", q)
        self.assertIn("site_url='sc-domain:sansoadvisory.it'", q)
        self.assertNotIn("site_url IN", q)

    def test_anonymous_queries(self):
        rows = [
            {
                "data_date": "2026-09-01",
                "dimension": "",
                "impressions": 100,
                "clicks": 0,
                "position": 5,
            }
        ]
        a = aggregate_sc(rows, dt.date(2026, 9, 1), dt.date(2026, 9, 1))[0]
        self.assertEqual(a["dimension"], "(anonymous/invalid)")

    def test_null_metrics_not_zero(self):
        rows = [
            {
                "data_date": "2026-09-01",
                "dimension": "q",
                "impressions": None,
                "clicks": None,
                "position": None,
            }
        ]
        self.assertEqual(
            aggregate_sc(rows, dt.date(2026, 9, 1), dt.date(2026, 9, 1)), []
        )

    def test_grain_weighting(self):
        rows = [
            {
                "data_date": "2026-09-01",
                "dimension": "/blog/",
                "impressions": 100,
                "clicks": 2,
                "position": 5,
            },
            {
                "data_date": "2026-09-01",
                "dimension": "https://www.sansoadvisory.it/blog?x=2",
                "impressions": 300,
                "clicks": 6,
                "position": 9,
            },
        ]
        a = aggregate_sc(rows, dt.date(2026, 9, 1), dt.date(2026, 9, 1), True)[0]
        self.assertEqual(a["position"], 8)
        self.assertEqual(a["ctr"], 0.02)
        self.assertEqual(a["impressions"], 400)


if __name__ == "__main__":
    unittest.main()
