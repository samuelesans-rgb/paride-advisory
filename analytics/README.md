# Sansò Advisory private Analytics / SEO

Python reporting is independent from Next.js and the web container. It only reads BigQuery metadata and executes SELECT jobs. It never changes Google configuration, credentials, exports or source data. JSON/Markdown stay outside the web root in `/var/lib/sanso-analytics` (directory 0700, files 0600). No web deployment is required.

## Sources and actual schema

Project: `sanso-advisory-analytics`. GA4 dataset: `analytics_547339586`. Search Console dataset: `searchconsole`, currently EU. Each run discovers locations, definitive tables, column names/types and partitioning. Complete inspected schema is retained in the private report inventory; the test schema fixture contains metadata only, with synthetic test rows.

Verified on 2026-10-05:

| Table | Required columns | Partitioning |
|---|---|---|
| searchdata_site_impression | data_date DATE; site_url, query, search_type STRING; impressions, clicks, sum_top_position INTEGER | DAY / data_date |
| searchdata_url_impression | data_date DATE; site_url, url, search_type STRING; impressions, clicks, sum_position INTEGER | DAY / data_date |
| ExportLog | agenda, namespace STRING; data_date DATE; epoch_version INTEGER; publish_time TIMESTAMP | None |

Both impression tables also contain country/device STRING and is_anonymized_query BOOLEAN. The URL table contains query, is_anonymized_discover and BOOLEAN search-appearance flags. These appearance flags are not invented dimensions or summed as extra impressions. `site_url` is `https://sansoadvisory.it/`; observed search types are **WEB** and **IMAGE**, despite lower-case examples in Google's documentation. The runtime discovers the actual WEB spelling and rejects ambiguous variants. One property is selected, never overlapping properties together. `SANSO_SC_PROPERTY` can explicitly select one of the supported Sansò properties; a populated export without that property is ERROR, not silently empty.

Search Console position is `SUM(sum_top_position)/SUM(impressions)+1` for site/query data and `SUM(sum_position)/SUM(impressions)+1` for URLs. The exported sums are zero-based. CTR is `SUM(clicks)/SUM(impressions)`. A zero denominator returns null; zero clicks with positive impressions produce CTR 0. NULL metrics remain unknown, including partially NULL aggregates. Repeated raw keys are SUM-aggregated, never arbitrarily deduplicated. Query and URL tables have different grains: their totals must not be added.

The default Search Console window ends at the latest date present in both WEB tables, independently of GA4's lag. The current window is 28 days, plus the preceding 28 for inspection (`--days` supports 1–90, `--end` overrides both sources). Actual first/last dates, observed days, missing dates, all-type raw row counts, WEB export rows, aggregate dimensions, daily rows, query position bands, zero-click queries, URL, country/device and search-type breakdowns are included. Empty tables are READY at the export/table level but INSUFFICIENT_DATA at report level. Missing definitive tables are PENDING. Incompatible schemas, access/auth errors and ambiguous scopes are ERROR. ExportLog records dates, namespaces, publication timestamps and revision epochs; its absence is explicitly warned, not inferred to mean failed exports. Failed exports are not recorded by Google in ExportLog.

Anonymized queries contribute to totals through a separate bucket and cannot produce named-query opportunities. In the verified initial export, 47 named queries plus the anonymous bucket sum to 118 WEB impressions; 10 normalized URLs sum to 125. There are 98 site raw rows (91 WEB) and 111 URL raw rows (104 WEB), dates 2026-09-30–2026-10-03, zero clicks. These are a baseline, not constants used by the reader.

URL normalization unifies http/https and www, removes query/fragment and trailing slash, and preserves path casing/encoding. Invalid/external URLs remain in an explicit unknown bucket for totals but are excluded from opportunities. This is reporting aggregation, not proof of identical source content. Search Console dates are Pacific-time dates; GA4 property timezone is unconfirmed. No cross-source conversion join is attempted.

## Conservative opportunity gate

`report_status` is READY only with at least **28 observed days**, a complete requested window, **1,000 WEB impressions in each grain** and known click counts. Otherwise it is INSUFFICIENT_DATA and the opportunity list is empty. A candidate additionally needs **200 impressions in its own dimension**; possible descriptive tags are CTR <2% or position (3,10] / (10,20]. Position bands cover <=3, (3,10], (10,20], >20 continuously, including fractional averages. Bands and zero-click lists are descriptive even below the gate. No growth/decline or editorial recommendation is inferred from the small initial export. Qualified candidates still require manual assessment; no automated content changes occur.

## GA4 methodology retained

Daily `events_YYYYMMDD` shards only, excluding intraday. Default 28 days versus preceding 28, ending UTC today minus three days. Users are distinct non-null user_pseudo_id; sessions are distinct user_pseudo_id/ga_session_id pairs. Grouped user/session counts are non-additive: only period summaries have exact distinct counts. Landing is first observed non-null page_location in the bounded window; crossing sessions may be incomplete. Organic page views use observed session medium=organic. Hostname breakdown flags property scope; canonical exclusions do not remove events from property-level totals.

Warnings remain for consent modelling differences from UI, NULL identifiers, incomplete shards, unconfirmed property timezone, unknown key-event configuration, incomplete landing windows and host scope. No modelled users/sessions or inferred conversions are reported. GA4 SQL and aggregation methodology remain unchanged from the analytics branch.

## Authentication, limits and scheduling

The existing `.analytics-venv` supplies locked dependencies. Existing ADC is used as ubuntu; no credentials are moved or created. Tokens/provider bodies are never logged. The existing gcloud fallback remains available. Permissions must already allow dataset/table reads and BigQuery query jobs; the module never changes IAM.

Every query dry-runs with a 1 GB/query and 10 GB/run budget, 180-second job timeout, 240-second polling timeout and a strict **200,000 result-row cap across all pages**. Scope/date inventory and ExportLog read historical metadata summaries; dimension queries use partition date filters. No retry storm or duplicate timer is introduced.

The installed service already runs from `/srv/docker/paride-advisory`:

```
.analytics-venv/bin/python -m analytics.report --output /var/lib/sanso-analytics
```

Unit/timer files are `/etc/systemd/system/sanso-analytics.service` and `.timer`. They remain unchanged: daily **09:10 UTC plus up to 600 seconds jitter**, persistent catch-up. Restoring the module to main removes its former dependency on the analytics branch. A lock prevents concurrent report publication; each JSON/Markdown file is atomically replaced with mode 0600 (the pair is not transactional). Search Console ERROR publishes diagnostics and exits nonzero; PENDING/INSUFFICIENT_DATA are successful runs with an explicit degraded data status. GA4 warnings should always be inspected independently.

## Validation and operation

```bash
cd /srv/docker/paride-advisory
.analytics-venv/bin/pip check
.analytics-venv/bin/ruff check analytics
.analytics-venv/bin/mypy analytics --check-untyped-defs --ignore-missing-imports
.analytics-venv/bin/python -m unittest discover -s analytics/tests -v
sudo systemctl start sanso-analytics.service
systemctl show sanso-analytics.service -p ExecMainStatus
systemctl list-timers sanso-analytics.timer
npm run build
/srv/docker/infra/check-public-routing.sh
```

Tests cover READY/PENDING/missing and empty tables, actual-schema compatibility, ExportLog, observed WEB filters, single-property selection, aggregation, zero/NULL metrics, weighted position, date boundaries, anonymous queries, canonical URL normalization, conservative gates, the 200,000-row pagination limit, costs and GA4 regression. Validate live reports against independent read-only SQL at the same property/search-type/date grain; named-query counts exclude anonymous queries without losing their impressions from totals.

Source definitions: [GA4 export schema](https://support.google.com/analytics/answer/7029846), [Search Console bulk table guidelines](https://support.google.com/webmasters/answer/12917991).

Integration provenance: only analytics module/tests/requirements/docs from `d128e05` and `3c83c806aacece884bcf4b14c57d252dffb49728` were selectively restored on main. Later frontend/SEO/infrastructure commits are preserved; no branch merge or web container deployment occurs.
