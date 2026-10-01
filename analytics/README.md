# Sansò Advisory Analytics / SEO

Server-side Python module, separate from Next.js, Docker and public endpoints. Only read-only BigQuery metadata and SELECT query jobs are used. No dataset/table updates, no Google configuration changes. Reports contain potentially sensitive URLs/search queries and stay outside the web root, mode 0600. Runtime directory is 0700.

## Sources and definitions

Project `sanso-advisory-analytics`; GA4 `analytics_547339586`; Search Console `searchconsole`, expected location EU. Runtime reads actual dataset locations and table schemas. `latest.json` includes table type, creation/modification epoch milliseconds, row count, schemas, date range and job audit. GA4 daily shards only, no double-counting intraday exports. Default comparison is 28 days versus preceding 28 days, ending UTC today minus 3 days; adjustable 1–90 days.

Users = distinct non-null user_pseudo_id, sessions = distinct pair user_pseudo_id/ga_session_id. Summary distinct counts cannot be summed across grouped dimensions/days. No GA4 UI equivalence, consent modelling, or guessed key events. Landing = first observed non-null page_location within the bounded range; start-boundary sessions may be incomplete. Page location/title, hostname, events, first-user source/medium and available session last-click source/medium/channel are inspectable. Landing counts shown are attributed page views, not sessions. Organic metric uses observed session medium=organic. Property may include additional hosts: hostname breakdown and canonical URL exclusions flag scope, overall GA metrics remain property-level.

SC uses site table for query/country/device and URL table for pages, web only. Exactly one property is selected to avoid double-counting overlapping domain/URL-prefix exports: default `sc-domain:sansoadvisory.it`; set `SANSO_SC_PROPERTY=https://sansoadvisory.it/` if the actual exported property is URL-prefix. The observed property must be verified after authorization. Site/URL totals represent different grains and must not be added. CTR = sum(clicks)/sum(impressions); zero denominator returns null. Position = weighted sum of zero-based positions / impressions + 1. Canonical URLs discard query/fragment, unify http/https and www, trim trailing slash; external/invalid URLs are excluded from named opportunities. Normalization only affects report dimensions, never source data. Query parameters are deliberately removed including potentially meaningful parameters; this is documented aggregation, not proof of identical content. Path casing and encoding are preserved.

SC daily data uses Pacific time; GA4 event_date uses property timezone, which cannot be inferred from export alone. No cross-source join is enabled until timezone, host scope and authoritative conversion definitions allow compatible URL/date aggregation. Never join users or sessions to SC.

## Opportunities and quality

Deterministic heuristics, not forecasts: >=100 impressions with CTR <2%; position 4–10 or >10–20; <=5 clicks; impression movement +/-20% with prior >=100 impressions; click decline >=20% with prior >=10 clicks. Anonymous queries excluded from named opportunities. Exact raw multi-dimensional rows are aggregated, not arbitrarily deduplicated by query/date. Missing datasets, shards, dates, null identifiers, invalid URL, location mismatch, zero CTR denominators and schema failures produce warnings. Multiple metric slices are non-additive. No conversion recommendation if key events are not authoritatively configured.

SC state READY only when both `searchdata_site_impression` and `searchdata_url_impression` are visible. Only temporary tables means PENDING and report prints `Search Console bulk export pending`. Temp tables are only inspected, never renamed/modified/deleted. Authentication/permission failure means ERROR, not PENDING. READY with no rows yields explicit missing-data warnings. Every daily run discovers tables afresh and enables SC automatically once available.

## Authentication

Existing ADC is preferred (`GOOGLE_APPLICATION_CREDENTIALS` or standard ADC location), then gcloud's logged-in account. Tokens never printed; HTTP/provider error bodies suppressed. No new keys created. This VPS initially had no Google CLI, credentials or GCE metadata authentication. Google CLI is installed at `/home/ubuntu/.local/share/sanso/google-cloud-sdk/bin/`; private Python environment `.analytics-venv` supplies google-auth. ADC project may differ: all BigQuery operations explicitly target the project above.

Manual authorization (interactive, as ubuntu):

```bash
/home/ubuntu/.local/share/sanso/google-cloud-sdk/bin/gcloud auth application-default login --no-launch-browser
```

Use an existing Google account that already has `bigquery.datasets.get`, `bigquery.tables.list/get/getData` on both datasets and `bigquery.jobs.create` in the project (typically BigQuery Data Viewer on datasets + BigQuery Job User on project). The Search Console export account is Google's writer and is not a VPS reader credential. If Google policy requires additional access, an administrator must grant these permissions; the module does not change IAM. Do not paste tokens or ADC JSON into chat/logs. After authorization the existing timer retries automatically; no key or site redeploy needed.

## Cost and failure isolation

Explicit columns, date-bounded `_TABLE_SUFFIX` excluding intraday; partition date filters for SC. Metadata does not scan table contents. Every query dry-runs before execution, max 1,000,000,000 billed bytes/query; 10,000,000,000 estimated bytes/run, result cap 200,000 aggregate rows, job timeout 180s, polling timeout 240s. Cached queries allowed. Each dataset uses its own discovered location. No unbounded history reads. One daily timer only. Job budget is an upper guardrail, not free usage; max roughly 10 GB/run. No retry storms.

Report generation continues on independent source failures and writes warnings with null/unavailable metrics. File lock prevents overlap; atomic per-file replacement. Last generated report includes timestamp and warnings; inspect those, not just process exit status. Runtime exit success can mean degraded report. Systemd task failures have no relationship to site/proxy/database services. JSON/Markdown are individually atomic, not a transactional pair.

## Operation

```bash
cd /srv/docker/paride-advisory
.analytics-venv/bin/python -m analytics.report --output /var/lib/sanso-analytics
# Custom period
.analytics-venv/bin/python -m analytics.report --end 2026-09-28 --days 28 --output /var/lib/sanso-analytics
sudo systemctl start sanso-analytics.service
sudo systemctl status sanso-analytics.timer sanso-analytics.service
sudo journalctl -u sanso-analytics.service --no-pager
# Disable automation
sudo systemctl disable --now sanso-analytics.timer
```

Scheduling uses existing systemd, daily 09:10 UTC plus <=10-minute jitter with persistent catch-up. Unit source files are in `analytics/systemd`; installed copies `/etc/systemd/system/sanso-analytics.*`. No new orchestrator, site/container restart, proxy/DNS/firewall/TLS change.

## Development and validation

```bash
python3 -m venv .analytics-venv
.analytics-venv/bin/pip install -r analytics/requirements.lock
.analytics-venv/bin/ruff check analytics
.analytics-venv/bin/mypy analytics --check-untyped-defs --ignore-missing-imports
.analytics-venv/bin/python -m unittest discover -s analytics/tests -v
npm run lint
npx tsc --noEmit
npm run build
```

Tests include canonical URLs, CTR/zero/null, weighted position, opportunity boundaries, missing/available datasets, auth errors, temporary exports, leap-day period boundaries and generated SQL filters. Live dry runs and dataset contents remain unverified until Google authorization is supplied.

Source definitions: [GA4 export schema](https://support.google.com/analytics/answer/7029846), [Search Console bulk table guidelines](https://support.google.com/webmasters/answer/12917991).
