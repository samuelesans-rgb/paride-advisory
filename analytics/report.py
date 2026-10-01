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
    sc_state,
    field_paths,
    ga_query,
    ga_summary_query,
    sc_query,
    aggregate_sc,
    normalize_url,
    opportunities,
    check_grain,
)
from analytics.bigquery import BigQuery, DataError


def write_atomic(path, text):
    temp = path.with_suffix(path.suffix + ".tmp")
    temp.write_text(text)
    temp.chmod(0o600)
    temp.replace(path)


def generate(client, end=None, days=28):
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
        "search_console": {"state": "ERROR"},
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
    sc = r["inventory"].get(SC)
    if sc:
        tables = {t["tableReference"]["tableId"]: t for t in sc["tables"]}
        state = sc_state(tables)
        r["search_console"]["state"] = state
        if sc["location"] != "EU":
            r["warnings"].append(
                "Search Console location differs from expected EU: " + sc["location"]
            )
        if state == "PENDING":
            r["warnings"].append("Search Console bulk export pending")
        else:
            for dim, table in [
                ("query", "searchdata_site_impression"),
                ("country", "searchdata_site_impression"),
                ("device", "searchdata_site_impression"),
                ("url", "searchdata_url_impression"),
            ]:
                try:
                    rows = client.query(
                        sc_query(
                            table,
                            field_paths(tables[table]["schema"]["fields"]),
                            prior_start,
                            end,
                            dim,
                        ),
                        sc["location"],
                    )
                    check_grain(rows, ["data_date", "dimension"])
                    if any(x.get("export_rows", 0) > 1 for x in rows):
                        r["warnings"].append(
                            "Search Console "
                            + dim
                            + ": repeated raw dimension keys correctly SUM-aggregated; not deduplicated"
                        )
                    current = aggregate_sc(rows, start, end, dim == "url")
                    previous = aggregate_sc(rows, prior_start, prior_end, dim == "url")
                    r["search_console"][dim] = {
                        "current": current,
                        "previous": previous,
                        "daily": rows,
                    }
                    if not rows:
                        r["warnings"].append(
                            "Search Console no data in requested period: " + dim
                        )
                    available = {x["data_date"] for x in rows}
                    missing = [
                        str(prior_start + dt.timedelta(days=i))
                        for i in range(days * 2)
                        if str(prior_start + dt.timedelta(days=i)) not in available
                    ]
                    if missing:
                        r["warnings"].append(
                            "Search Console dates missing "
                            + dim
                            + ": "
                            + ",".join(missing)
                        )
                    if any(
                        x.get("impressions") in (0, None) or x.get("clicks") is None
                        for x in rows
                    ):
                        r["warnings"].append(
                            "Search Console zero/null metrics: CTR unavailable where denominator is zero"
                        )
                    if dim == "url" and any(
                        normalize_url(x["dimension"]) is None for x in rows
                    ):
                        r["warnings"].append(
                            "Search Console invalid/external URL bucket excluded from opportunities"
                        )
                    if dim in ("query", "url"):
                        r["opportunities"].extend(
                            dict(x, kind=dim)
                            for x in opportunities(current, previous)
                            if x["dimension"] != "(anonymous/invalid)"
                        )
                except (DataError, ValueError) as e:
                    r["warnings"].append("Search Console " + dim + ": " + str(e))
                    r["search_console"]["state"] = "ERROR"
            r["warnings"].extend(
                [
                    "Search Console WEB only; query totals use site table and URL totals use URL table: do not sum them together.",
                    "Search Console Pacific-time dates differ from GA4 property dates. No cross-source conversion join enabled.",
                    "Bulk rows are aggregated across all omitted dimensions, not deduplicated by query/date. Anonymous queries cannot produce named-query opportunities.",
                ]
            )
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
        ("Opportunità SEO", r["opportunities"]),
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
                "Verificare snippet e intento delle dimensioni con high_impressions_low_ctr.",
                "Valutare contenuti e linking interno delle query near_first_page / near_top_3.",
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


if __name__ == "__main__":
    main()
