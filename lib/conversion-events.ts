// Consent is read at the interaction; no listener queues excluded events.
const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
const requestKey = "sanso-contact-request";
const consumedKey = "sanso-contact-consumed";
const consumed = new Set<string>();
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type ConsentWindow = Window & {
  _iub?: { cs?: { api?: {
    isPreferenceExpressed?: () => boolean;
    getPreferences?: () => { purposes?: Record<string, boolean> };
  } } };
};

export function analyticsConsentSnapshot(): number | null {
  if (typeof window === "undefined") return null;
  try {
    const api = (window as ConsentWindow)._iub?.cs?.api;
    if (api?.isPreferenceExpressed?.() !== true || api.getPreferences?.().purposes?.["4"] !== true) return null;
    let state: unknown = "denied";
    let revision = -1;
    for (const [index, item] of (window.dataLayer || []).entries()) {
      if (!item || typeof item !== "object") continue;
      const command = item as { [key: number]: unknown };
      const values = command[2] as { analytics_storage?: unknown } | undefined;
      if (command[0] === "consent" && (command[1] === "default" || command[1] === "update") && values?.analytics_storage !== undefined) {
        state = values.analytics_storage;
        revision = index;
      }
    }
    return state === "granted" ? revision : null;
  } catch { return null; }
}

function emit(name: "generate_lead" | "click_email" | "click_phone") {
  if (!measurementId || typeof window.gtag !== "function" || analyticsConsentSnapshot() === null) return;
  // Override URL-derived defaults: never forward a query string, fragment or contact href.
  const path = /^\/(?:[a-z0-9-]+\/?)*$/.test(window.location.pathname) ? window.location.pathname : "/";
  window.gtag("event", name, {
    send_to: measurementId,
    ...(name === "generate_lead" ? { form_id: "consultation" } : {}),
    page_location: `https://sansoadvisory.it${path}`,
    page_path: path,
    page_referrer: "",
    transport_type: "beacon",
  });
}

export function contactRequestId(): string {
  try {
    const saved = JSON.parse(sessionStorage.getItem(requestKey) || "null");
    if (uuid.test(saved?.id) && saved.expires > Date.now()) return saved.id;
  } catch { /* Storage restrictions must not prevent sending a request. */ }
  const id = crypto.randomUUID();
  try { sessionStorage.setItem(requestKey, JSON.stringify({ id, expires: Date.now() + 10 * 60_000 })); } catch { /* In-memory form ref remains available. */ }
  return id;
}

export function finishContactRequest() {
  try { sessionStorage.removeItem(requestKey); } catch { /* No tracking fallback. */ }
}

export function trackAcceptedLead(receipt: string, requestId: string, consentAtSubmit: number | null) {
  if (!uuid.test(receipt) || !uuid.test(requestId)) return;
  try {
    const saved: unknown = JSON.parse(sessionStorage.getItem(consumedKey) || "[]");
    if (Array.isArray(saved)) for (const id of saved) if (typeof id === "string" && uuid.test(id)) consumed.add(id);
  } catch { /* Still deduplicated in memory and by the server receipt. */ }
  if (consumed.has(requestId)) return;
  consumed.add(requestId);
  try { sessionStorage.setItem(consumedKey, JSON.stringify([...consumed].slice(-100))); } catch { /* Never queue an event. */ }
  // Consume even when denied: a later consent choice must not replay this success.
  if (consentAtSubmit === null || analyticsConsentSnapshot() !== consentAtSubmit) return;
  try { emit("generate_lead"); } catch { /* Analytics cannot change the form outcome. */ }
}

export function trackContactClick(kind: "email" | "phone") {
  try { emit(kind === "email" ? "click_email" : "click_phone"); } catch { /* Never block navigation. */ }
}
