# Consent-gated consultation events

`G-01KZ0LKWPV` is the existing public GA4 measurement ID; configuration, CMP scripts and Consent Mode defaults are unchanged.

- `generate_lead`: server validation passed, no honeypot, and Nodemailer `accepted` contains the configured recipient. The original attempt receives a random UUID receipt. SMTP acceptance is not final delivery, a qualified lead or a customer.
- `click_email` / `click_phone`: actual mailto/tel interactions, not leads. A document listener also handles SPA navigation and keyboard-generated clicks, without blocking navigation; rapid repeated clicks on one anchor are suppressed for 750 ms.
- Every event requires Iubenda `isPreferenceExpressed()`, purpose 4 true and the latest `analytics_storage` command granted. Lead submission and response must have the same consent revision. Missing, inconsistent, changed or revoked consent fails closed. No later consent callback replays an excluded event.
- New event parameters are allowlisted: destination measurement ID, fixed form ID for leads, canonical page location without query/fragment, empty referrer and beacon transport. No form values, contact hrefs, IP parameters, receipt, request ID or SMTP ID are sent to GA4. Existing Google network processing and page-view behavior are unchanged.

## Idempotency and privacy

A functional, random request UUID survives a pending refresh in per-tab sessionStorage for ten minutes. The server deduplicates both this ID and a keyed HMAC of validated content for ten minutes, with a bounded in-memory map (single current app process). It never caches raw contact fields; the HMAC key is ephemeral and never sent to the browser. The SMTP Promise is shared for concurrent duplicates. Failures can be explicitly retried; a successful receipt is returned only to the original attempt, never a replay. Client in-flight locking handles rapid submits before React disables the button.

Consumed request UUIDs (at most 100 persisted per tab) prevent client replay after refresh/retry; they are consumed even when tracking is denied. This is a functional deduplication record, not an analytics event queue or an identifier sent to GA4. No cookies or new trackers are added. Storage restrictions retain the in-memory guard and server one-use receipt. New tracking failures never change the form's SMTP outcome.

This is **not globally durable exactly-once delivery**: server deduplication resets on restart and expires after ten minutes; it must be revisited before multi-instance scaling. A lost/unloaded original response is deliberately not repaired by returning another event receipt: conservative undercount is possible. Network/ad blockers, consent, closed tabs and tag failures also limit observed events. The browser can still retry the original request to obtain the user-facing outcome without another receipt during the server window.

## Verification and operation

`npm run test:conversions` exercises actual server-action/helper modules via TypeScript transpilation and deterministic mocks, with synthetic example.invalid data. It covers SMTP acceptance, rejection/empty recipients, validation, honeypot, concurrency, request/content deduplication, retry, one-use receipts, consent states/revocation, reload storage and privacy.

Production-build browser integration was run separately against a loopback-only SMTP protocol mock, never real mailboxes. See the private release report for end-to-end evidence and scripts; no production testing flag or mock SMTP server is included in the app. Existing analytics regression tests remain independent.

GA4 Admin key-event/Enhanced Measurement settings are not altered or inferred. Verify `generate_lead` in Realtime/DebugView with an explicitly authorized test before marking it as a key event if required. A gtag dispatch/intercepted request is not proof of GA4 ingestion, real consultations or email delivery. Report contact clicks separately from SMTP-accepted forms and confirmed enquiries.

API references: [Iubenda preferences API](https://www.iubenda.com/en/help/1205-how-to-configure-your-cookie-solution-advanced-guide-2/) and [Google tag event/consent API](https://developers.google.com/tag-platform/gtagjs/reference).
