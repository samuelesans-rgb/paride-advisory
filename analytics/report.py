"""Run with python -m analytics.report. Private JSON + Markdown, atomic publication."""

import argparse
import collections
import datetime as dt
import fcntl
import json
from typing import Any
from pathlib import Path
from analytics.core import (
    PROJECT,
    GA,
    SC,
    periods,
    field_paths,
    ga_query,
    ga_summary_query,
    normalize_url,
    check_grain,
)
from analytics.bigquery import BigQuery, DataError
from analytics.search_console import read as read_search_console


def write_atomic(path, text):
    temp = path.with_suffix(path.suffix + ".tmp")
    temp.write_text(text)
    temp.chmod(0o600)
    temp.replace(path)


def generate(client, end=None, days=28):
    requested_end = end
    start, end, prior_start, prior_end = periods(end, days)
    r: dict[str, Any] = {
        "project": PROJECT,
        "generated_at": dt.datetime.now(dt.timezone.utc).isoformat(),
        "period": {
            "start": str(start),
            "end": str(end),
            "previous_start": str(prior_start),
            "previous_end": str(prior_end),
        },
        "warnings": [],
        "inventory": {},
        "ga4": {},
        "search_console": {"state": "ERROR", "report_status": "ERROR"},
        "report_status": "ERROR",
        "opportunities": [],
    }
    if client is None:
        r["warnings"].append(
            "GOOGLE_AUTH_UNAVAILABLE: BigQuery access and export state cannot be verified"
        )
        return r
    for dataset in [GA, SC]:
        try:
            r["inventory"][dataset] = client.inventory(dataset)
        except DataError as e:
            r["warnings"].append(dataset + ": " + str(e))
    ga = r["inventory"].get(GA)
    if ga:
        tables = {t["tableReference"]["tableId"]: t for t in ga["tables"]}
        dates = sorted(
            n[7:]
            for n in tables
            if len(n) == 15 and n.startswith("events_") and n[7:].isdigit()
        )
        r["ga4"]["data_range"] = {
            "first": dates[0] if dates else None,
            "last": dates[-1] if dates else None,
            "daily_tables": len(dates),
            "intraday_tables": sum(n.startswith("events_intraday_") for n in tables),
        }
        expected = {
            (prior_start + dt.timedelta(days=i)).strftime("%Y%m%d")
            for i in range(days * 2)
        }
        missing = sorted(expected - set(dates))
        if missing:
            r["warnings"].append("GA4 missing daily shards: " + ",".join(missing))
        if not dates:
            r["warnings"].append("GA4_DATA_MISSING: no daily events tables")
        else:
            selected = [
                d
                for d in dates
                if prior_start.strftime("%Y%m%d") <= d <= end.strftime("%Y%m%d")
            ]
            paths = (
                set.intersection(
                    *(
                        field_paths(tables["events_" + d]["schema"]["fields"])
                        for d in selected
                    )
                )
                if selected
                else set()
            )
            r["ga4"]["available_fields"] = sorted(paths)
            r["warnings"].extend(
                [
                    "GA4 users/sessions are observed identifiers, exclude NULL and may differ from UI consent modelling.",
                    "GA4 grouped users/sessions are non-additive; only period summary has exact distinct counts.",
                    "GA4 event_date uses property timezone (not verified); report boundaries use UTC with 3-day lag.",
                    "GA4 landing is first observed URL in bounded export window; sessions crossing its start may be incomplete.",
                    "Key events unavailable: no authoritative key-event configuration was supplied. No conversions inferred.",
                    "GA4 property scope is not assumed to contain only sansoadvisory.it; inspect hostname rows before attribution.",
                ]
            )
            if not any(
                p.startswith("session_traffic_source_last_click.") for p in paths
            ):
                r["warnings"].append(
                    "Session source/medium/channel unavailable; traffic_source is first-user acquisition only."
                )
            try:
                rows = client.query(ga_query(paths, prior_start, end), ga["location"])
                check_grain(
                    rows,
                    [
                        "event_date",
                        "event_name",
                        "page",
                        "title",
                        "landing",
                        "source",
                        "medium",
                        "channel",
                        "first_user_source",
                        "first_user_medium",
                    ],
                )
                r["ga4"]["dimension_rows"] = rows
                for key, a, b in [
                    ("current", start, end),
                    ("previous", prior_start, prior_end),
                ]:
                    result = client.query(ga_summary_query(paths, a, b), ga["location"])
                    r["ga4"][key] = result[0] if result else None
                daily: collections.Counter[str] = collections.Counter()
                events: collections.Counter[str] = collections.Counter()
                pages: collections.Counter[str] = collections.Counter()
                landings: collections.Counter[str] = collections.Counter()
                sources: collections.Counter[str] = collections.Counter()
                hosts: collections.Counter[str] = collections.Counter()
                invalid = 0
                organic = 0
                for row in rows:
                    if (
                        not start.strftime("%Y%m%d")
                        <= row["event_date"]
                        <= end.strftime("%Y%m%d")
                    ):
                        continue
                    events[row["event_name"]] += row["events"]
                    if row["event_name"] == "page_view":
                        daily[row["event_date"]] += row["events"]
                        page = normalize_url(row["page"])
                        if page:
                            pages[page] += row["events"]
                        else:
                            invalid += row["events"]
                        from urllib.parse import urlsplit

                        try:
                            hosts[
                                urlsplit(row["page"] or "").hostname or "(missing)"
                            ] += row["events"]
                        except ValueError:
                            hosts["(invalid)"] += row["events"]
                        landing = normalize_url(row["landing"])
                        if landing:
                            landings[landing] += row["events"]
                        sources[
                            (row["source"] or "(unknown)")
                            + " / "
                            + (row["medium"] or "(unknown)")
                            + " / "
                            + (row["channel"] or "(unknown)")
                        ] += row["events"]
                        if row["medium"] == "organic":
                            organic += row["events"]
                r["ga4"].update(
                    daily_page_views=dict(daily),
                    events=dict(events),
                    pages=dict(pages.most_common()),
                    landing_page_views=dict(landings.most_common()),
                    session_attributed_page_views=dict(sources),
                    hostnames=dict(hosts),
                    organic_page_views=organic
                    if any(x["medium"] for x in rows)
                    else None,
                )
                if invalid:
                    r["warnings"].append(
                        f"GA4 invalid, missing or external page URLs: {invalid} page views excluded from canonical page list"
                    )
                if any(x.get("missing_user") or x.get("missing_session") for x in rows):
                    r["warnings"].append(
                        "GA4 NULL user/session identifiers present; counts are partial"
                    )
            except (DataError, ValueError) as e:
                r["warnings"].append("GA4: " + str(e))
    r["search_console"] = read_search_console(
        client, r["inventory"].get(SC), requested_end, days
    )
    r["report_status"] = r["search_console"]["report_status"]
    r["warnings"].extend(r["search_console"]["warnings"])
    r["opportunities"] = r["search_console"]["opportunities"]
    r["query_audit"] = client.audit
    return r


def markdown(r):
    sections = [
        (
            "# Sansò Advisory — SEO / Analytics",
            {"period": r["period"], "generated_at": r["generated_at"]},
        ),
        (
            "Executive summary",
            {
                "GA4": r["ga4"].get("current"),
                "previous": r["ga4"].get("previous"),
                "Search Console": r["search_console"]["state"],
            },
        ),
        (
            "Traffico organico",
            {
                "observed_session_attributed_page_views": r["ga4"].get(
                    "organic_page_views"
                ),
                "sources": r["ga4"].get("session_attributed_page_views"),
            },
        ),
        (
            "Landing page principali (page views, non sessioni additive)",
            r["ga4"].get("landing_page_views"),
        ),
        (
            "Query principali, impression, click, CTR, posizione media",
            r["search_console"].get("query"),
        ),
        (
            "Query vicine alla prima pagina",
            [
                x
                for x in r["opportunities"]
                if x["kind"] == "query" and "near_first_page" in x["opportunities"]
            ],
        ),
        (
            "Query vicine alle prime 3 posizioni",
            [
                x
                for x in r["opportunities"]
                if x["kind"] == "query" and "near_top_3" in x["opportunities"]
            ],
        ),
        (
            "Pagine in crescita",
            [
                x
                for x in r["opportunities"]
                if x["kind"] == "url" and "impressions_growing" in x["opportunities"]
            ],
        ),
        (
            "Pagine in calo",
            [
                x
                for x in r["opportunities"]
                if x["kind"] == "url"
                and any(
                    t in x["opportunities"]
                    for t in ["impressions_declining", "clicks_declining"]
                )
            ],
        ),
        (
            "Search Console — intervallo, totali e stato",
            {
                k: r["search_console"].get(k)
                for k in [
                    "state",
                    "report_status",
                    "property",
                    "data_range",
                    "last_available_date",
                    "period",
                    "web_filter",
                    "thresholds",
                ]
            },
        ),
        ("URL principali", r["search_console"].get("url")),
        (
            "Query per fascia di posizione (descrittivo)",
            r["search_console"].get("position_bands"),
        ),
        (
            "Query con impression e zero click (descrittivo)",
            r["search_console"].get("queries_with_impressions_zero_clicks"),
        ),
        (
            "Device / country / search type",
            {
                k: r["search_console"].get(k)
                for k in ["device", "country", "search_types"]
            },
        ),
        ("ExportLog", r["search_console"].get("export_log")),
        (
            "Opportunità SEO",
            {
                "status": r.get("report_status", "ERROR"),
                "candidates": r["opportunities"],
            },
        ),
        (
            "Andamento giornaliero / eventi",
            {
                "daily": r["ga4"].get("daily_page_views"),
                "events": r["ga4"].get("events"),
            },
        ),
        ("Anomalie dati", r["warnings"]),
        (
            "Raccomandazioni",
            [
                "Candidati quantitativi per sola revisione manuale; nessuna modifica editoriale automatica.",
            ]
            if r["opportunities"]
            else [
                "Nessuna raccomandazione SEO quantitativa: opportunità non dimostrate dai dati disponibili."
            ],
        ),
    ]
    text = "\n\n".join(
        title
        + "\n\n```json\n"
        + json.dumps(value, ensure_ascii=False, indent=2)
        + "\n```"
        for title, value in sections
    )
    if r["search_console"]["state"] == "PENDING":
        text += "\n\nSearch Console bulk export pending\n"
    return text + "\n"


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", default="/var/lib/sanso-analytics")
    parser.add_argument("--end")
    parser.add_argument("--days", type=int, default=28)
    args = parser.parse_args()
    output = Path(args.output)
    output.mkdir(parents=True, exist_ok=True, mode=0o700)
    with (output / ".lock").open("w") as lock:
        try:
            fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError:
            return
        try:
            client = BigQuery()
        except DataError:
            client = None
        report = generate(client, args.end, args.days)
        write_atomic(
            output / "latest.json",
            json.dumps(report, ensure_ascii=False, indent=2) + "\n",
        )
        write_atomic(output / "latest.md", markdown(report))
        print(
            json.dumps(
                {
                    "ga4_available": bool(report["ga4"].get("current")),
                    "search_console": report["search_console"]["state"],
                    "warnings": len(report["warnings"]),
                }
            )
        )

        if report["report_status"] == "ERROR":
            raise SystemExit(1)


if __name__ == "__main__":
    main()
