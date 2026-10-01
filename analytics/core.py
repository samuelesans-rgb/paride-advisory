"""Deterministic analytics helpers; no network or frontend dependencies."""

import datetime as dt
import os
from typing import Any
from urllib.parse import urlsplit, urlunsplit

PROJECT = "sanso-advisory-analytics"
GA = "analytics_547339586"
SC = "searchconsole"
CANONICAL = "https://sansoadvisory.it"
SC_PROPERTY = os.environ.get("SANSO_SC_PROPERTY", "sc-domain:sansoadvisory.it")
if SC_PROPERTY not in (
    "sc-domain:sansoadvisory.it",
    "https://sansoadvisory.it/",
    "https://www.sansoadvisory.it/",
):
    raise ValueError("Unsupported SANSO_SC_PROPERTY")


def normalize_url(value):
    if not isinstance(value, str) or not value.strip():
        return None
    value = value.strip()
    if any(c.isspace() for c in value) or "\\" in value:
        return None
    if value.startswith("/") and not value.startswith("//"):
        value = CANONICAL + value
    try:
        p = urlsplit(value)
        if (
            p.scheme not in ("http", "https")
            or p.hostname not in ("sansoadvisory.it", "www.sansoadvisory.it")
            or p.username
            or p.password
            or p.port not in (None, 80, 443)
        ):
            return None
        path = p.path.rstrip("/") or "/"
        return urlunsplit(("https", "sansoadvisory.it", path, "", ""))
    except ValueError:
        return None


def ratio(numerator, denominator):
    return (
        numerator / denominator
        if numerator is not None and denominator is not None and denominator > 0
        else None
    )


def periods(end=None, days=28):
    end = (
        dt.date.fromisoformat(end)
        if end
        else dt.datetime.now(dt.timezone.utc).date() - dt.timedelta(days=3)
    )
    if not 1 <= days <= 90:
        raise ValueError("days must be 1..90")
    start = end - dt.timedelta(days=days - 1)
    return start, end, start - dt.timedelta(days=days), start - dt.timedelta(days=1)


def sc_state(table_names):
    if table_names is None:
        return "ERROR"
    return (
        "READY"
        if {"searchdata_site_impression", "searchdata_url_impression"}
        <= set(table_names)
        else "PENDING"
    )


def opportunities(rows, previous):
    old = {r["dimension"]: r for r in previous}
    out = []
    for r in rows:
        n, c, p = r.get("impressions"), r.get("clicks"), r.get("position")
        ctr = ratio(c, n)
        tags = []
        if n and n >= 100:
            if ctr is not None and ctr < 0.02:
                tags.append("high_impressions_low_ctr")
            if p is not None and 4 <= p <= 10:
                tags.append("near_top_3")
            if p is not None and 10 < p <= 20:
                tags.append("near_first_page")
            if c is not None and c <= 5:
                tags.append("impressions_few_clicks")
        o = old.get(r["dimension"])
        if o and o.get("impressions", 0) >= 100 and n is not None:
            delta = ratio(n - o["impressions"], o["impressions"])
            if delta >= 0.2:
                tags.append("impressions_growing")
            if delta <= -0.2:
                tags.append("impressions_declining")
        if o and o.get("clicks", 0) >= 10 and c is not None and c <= o["clicks"] * 0.8:
            tags.append("clicks_declining")
        if tags:
            out.append(dict(r, opportunities=tags))
    return sorted(out, key=lambda r: (-(r.get("impressions") or 0), r["dimension"]))


def field_paths(fields, prefix=""):
    out = set()
    for f in fields:
        name = prefix + f["name"]
        out.add(name)
        out.update(field_paths(f.get("fields", []), name + "."))
    return out


def ga_query(paths, start, end):
    # Sessions are identified by user + ga_session_id, never by id alone.
    required = {
        "event_date",
        "event_name",
        "event_timestamp",
        "event_params",
        "user_pseudo_id",
    }
    if not required <= paths:
        raise ValueError("GA4 required schema fields unavailable")

    def optional(path):
        return path if path in paths else "CAST(NULL AS STRING)"

    source = optional("session_traffic_source_last_click.cross_channel_campaign.source")
    medium = optional("session_traffic_source_last_click.cross_channel_campaign.medium")
    channel = optional(
        "session_traffic_source_last_click.cross_channel_campaign.default_channel_group"
    )
    if source == "CAST(NULL AS STRING)":
        source = optional("session_traffic_source_last_click.manual_campaign.source")
    if medium == "CAST(NULL AS STRING)":
        medium = optional("session_traffic_source_last_click.manual_campaign.medium")
    return f"""WITH e AS (
SELECT event_date, event_name, event_timestamp, user_pseudo_id,
 (SELECT value.int_value FROM UNNEST(event_params) WHERE key='ga_session_id' LIMIT 1) sid,
 (SELECT value.string_value FROM UNNEST(event_params) WHERE key='page_location' LIMIT 1) page,
 (SELECT value.string_value FROM UNNEST(event_params) WHERE key='page_title' LIMIT 1) title,
 {source} source, {medium} medium, {channel} channel,
 {optional("traffic_source.source")} first_user_source,
 {optional("traffic_source.medium")} first_user_medium
FROM `{PROJECT}.{GA}.events_*`
WHERE _TABLE_SUFFIX BETWEEN '{start:%Y%m%d}' AND '{end:%Y%m%d}'
AND REGEXP_CONTAINS(_TABLE_SUFFIX, r'^\\d{{8}}$')
), enriched AS (
SELECT event_date, event_name, user_pseudo_id, sid, page, title, source, medium, channel,
first_user_source, first_user_medium,
IF(sid IS NULL OR user_pseudo_id IS NULL, NULL, TO_JSON_STRING(STRUCT(user_pseudo_id, sid))) session_key,
IF(sid IS NULL OR user_pseudo_id IS NULL, NULL,
 FIRST_VALUE(page IGNORE NULLS) OVER(PARTITION BY user_pseudo_id,sid ORDER BY event_timestamp ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING)) landing
FROM e)
SELECT event_date, event_name, page, title, landing, source, medium, channel, first_user_source, first_user_medium,
COUNT(*) events, COUNT(DISTINCT user_pseudo_id) users, COUNT(DISTINCT session_key) sessions,
COUNTIF(user_pseudo_id IS NULL) missing_user, COUNTIF(session_key IS NULL) missing_session
FROM enriched
GROUP BY event_date,event_name,page,title,landing,source,medium,channel,first_user_source,first_user_medium"""


def ga_summary_query(paths, start, end):
    q = ga_query(paths, start, end)
    return (
        q[
            : q.index(
                "\nSELECT event_date, event_name, page, title, landing, source, medium, channel, first_user_source, first_user_medium,\nCOUNT(*)"
            )
        ]
        + """
SELECT COUNT(DISTINCT user_pseudo_id) users, COUNT(DISTINCT session_key) sessions,
COUNTIF(event_name='page_view') page_views, COUNT(*) events,
COUNTIF(user_pseudo_id IS NULL) missing_user, COUNTIF(session_key IS NULL) missing_session
FROM enriched"""
    )


def sc_query(table, paths, start, end, dimension):
    allowed = {
        "searchdata_site_impression": {"query", "country", "device"},
        "searchdata_url_impression": {"url"},
    }
    if dimension not in allowed.get(table, set()):
        raise ValueError("Invalid SC query dimension")
    position = (
        "sum_top_position" if table == "searchdata_site_impression" else "sum_position"
    )
    required = {
        "data_date",
        "site_url",
        "search_type",
        "impressions",
        "clicks",
        position,
        dimension,
    }
    if not required <= paths:
        raise ValueError("Search Console required schema fields unavailable")
    return f"""SELECT data_date, {dimension} dimension, SUM(impressions) impressions, SUM(clicks) clicks, COUNT(*) export_rows,
SAFE_DIVIDE(SUM(clicks),SUM(impressions)) ctr,
SAFE_DIVIDE(SUM({position}),SUM(impressions))+1 position
FROM `{PROJECT}.{SC}.{table}`
WHERE data_date BETWEEN DATE '{start}' AND DATE '{end}'
AND site_url='{SC_PROPERTY}'
AND search_type='web'
GROUP BY data_date, {dimension}"""


def aggregate_sc(rows, start, end, urls=False):
    out: dict[str, Any] = {}
    for r in rows:
        if not str(start) <= r["data_date"] <= str(end):
            continue
        key = normalize_url(r["dimension"]) if urls else r["dimension"]
        # Anonymous query remains a separate bucket; it cannot identify a query opportunity.
        key = key if key else "(anonymous/invalid)"
        if any(r.get(k) is None for k in ("impressions", "clicks", "position")):
            continue
        a = out.setdefault(
            key, {"dimension": key, "impressions": 0, "clicks": 0, "_position": 0}
        )
        n = r.get("impressions")
        c = r.get("clicks")
        if n is None or c is None or r.get("position") is None:
            continue
        a["impressions"] += n
        a["clicks"] += c
        a["_position"] += r["position"] * n
    for a in out.values():
        a["position"] = ratio(a.pop("_position"), a["impressions"])
        a["ctr"] = ratio(a["clicks"], a["impressions"])
    return sorted(out.values(), key=lambda r: -r["impressions"])


def check_grain(rows, keys):
    """Check uniqueness only at the returned aggregate grain, never raw bulk grain."""
    seen = set()
    for row in rows:
        key = tuple(row.get(k) for k in keys)
        if key in seen:
            raise ValueError(
                "DUPLICATE_AGGREGATE_GRAIN: refusing potentially inflated metrics"
            )
        seen.add(key)
