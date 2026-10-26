import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { createRequire } from "node:module";
import { randomUUID, webcrypto } from "node:crypto";
import ts from "typescript";

const requireModule = createRequire(import.meta.url);
const root = process.cwd();
const valid = { name: "Synthetic Test", company: "", email: "test@example.invalid", phone: "00000000", service: "Test", message: "Synthetic message for controlled tests only.", website: "" };
function load(file, mocks = {}, globals = {}) {
  const commonJsModule = { exports: {} };
  const source = ts.transpileModule(fs.readFileSync(path.join(root, file), "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
  const context = vm.createContext({ module: commonJsModule, exports: commonJsModule.exports, console: { error() {} }, process: { env: { SMTP_HOST: "mock.invalid", SMTP_PORT: "587", SMTP_USER: "mock", SMTP_PASSWORD: "mock", SMTP_FROM: "test@example.invalid", NEXT_PUBLIC_GA_MEASUREMENT_ID: "G-TEST123" } }, crypto: webcrypto, ...globals,
    require: (id) => id in mocks ? mocks[id] : id.startsWith("@/") ? load(id.slice(2) + ".ts", mocks, globals) : requireModule(id) });
  new vm.Script(source, { filename: file }).runInContext(context);
  return commonJsModule.exports;
}
function server(send) {
  let calls = 0;
  const mocks = { "next/headers": { headers: async () => new Headers({ "x-forwarded-for": "192.0.2.1" }) }, "@/lib/site-data": { siteConfig: { email: "destination@example.invalid" } }, "@/lib/utils": { escapeHtml: (s) => String(s) }, nodemailer: { createTransport: () => ({ sendMail: async (mail) => { calls++; return send(mail, calls); } }) } };
  return { api: load("app/actions/contact.ts", mocks), calls: () => calls };
}
const accepted = () => ({ accepted: ["destination@example.invalid"] });
test("SMTP accepted: receipt only after acceptance, no PII in receipt", async () => {
  let release; const s = server(() => new Promise(r => { release = r; })); const pending = s.api.sendContactEmail(valid, randomUUID());
  await new Promise(r => setImmediate(r)); assert.equal(s.calls(), 1); release(accepted()); const r = await pending;
  assert.equal(r.success, true); assert.match(r.leadReceipt, /^[0-9a-f-]{36}$/); assert(!r.leadReceipt.includes("Synthetic"));
});
test("server validation and honeypot never send SMTP or return receipt", async () => {
  const s = server(accepted); for (const data of [{ ...valid, email: "invalid" }, { ...valid, website: "bot.example" }]) { const r = await s.api.sendContactEmail(data, randomUUID()); assert.equal(r.leadReceipt, undefined); }
  assert.equal(s.calls(), 0);
});
test("SMTP throw, rejected/empty/wrong recipient do not produce receipt", async () => {
  for (const send of [() => { throw Error("mock failure"); }, () => ({ accepted: [] }), () => ({ accepted: ["other@example.invalid"] })]) { const s = server(send); const r = await s.api.sendContactEmail(valid, randomUUID()); assert.equal(r.success, false); assert.equal(r.leadReceipt, undefined); }
});
test("concurrent double click, refresh and new-ID duplicate: one SMTP and receipt", async () => {
  const s = server(accepted), id = randomUUID(); const results = await Promise.all([s.api.sendContactEmail(valid, id), s.api.sendContactEmail(valid, id), s.api.sendContactEmail(valid, randomUUID())]);
  results.push(await s.api.sendContactEmail(valid, id)); assert.equal(s.calls(), 1); assert.equal(results.filter(r => r.leadReceipt).length, 1); assert(results.every(r => r.success));
});
test("retry after SMTP failure can succeed with same request ID", async () => {
  const s = server((mail, n) => { if (n === 1) throw Error("mock failure"); return accepted(); }); const id = randomUUID(); assert.equal((await s.api.sendContactEmail(valid, id)).success, false); assert((await s.api.sendContactEmail(valid, id)).leadReceipt); assert.equal(s.calls(), 2);
});
test("invalid request ID and changed payload replay rejected", async () => {
  const s = server(accepted); assert.equal((await s.api.sendContactEmail(valid, "not-uuid")).success, false); const id = randomUUID(); await s.api.sendContactEmail(valid, id); assert.equal((await s.api.sendContactEmail({ ...valid, message: "A different synthetic request for controlled tests." }, id)).success, false); assert.equal(s.calls(), 1);
});
function browser(storage = new Map()) {
  const events = []; let expressed = false, measurement = false;
  const window = { location: { pathname: "/contatti", search: "?email=test@example.invalid" }, dataLayer: [], _iub: { cs: { api: { isPreferenceExpressed: () => expressed, getPreferences: () => ({ purposes: { 4: measurement } }) } } }, gtag: (...args) => events.push(args) };
  const sessionStorage = { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value), removeItem: key => storage.delete(key) };
  const api = load("lib/conversion-events.ts", {}, { window, sessionStorage });
  return { api, events, window, storage, consent: value => { expressed = true; measurement = value; window.dataLayer.push(["consent", "update", { analytics_storage: value ? "granted" : "denied" }]); } };
}
test("no consent, denied, late consent, revocation: no events and no later replay", () => {
  for (const mode of ["none", "denied", "late", "revoked", "regranted"]) {
    const b = browser(); if (["revoked", "regranted"].includes(mode)) b.consent(true); if (mode === "denied") b.consent(false); const snapshot = b.api.analyticsConsentSnapshot();
    if (mode === "late") b.consent(true); if (["revoked", "regranted"].includes(mode)) b.consent(false); if (mode === "regranted") b.consent(true);
    const receipt = randomUUID(), id = randomUUID(); b.api.trackAcceptedLead(receipt, id, snapshot); b.consent(true); b.api.trackAcceptedLead(receipt, id, b.api.analyticsConsentSnapshot()); assert.equal(b.events.length, 0);
  }
});
test("granted lead once; refresh/retry cannot replay; no receipt/request ID or PII sent", () => {
  const b = browser(); b.consent(true); const id = randomUUID(), receipt = randomUUID(), snapshot = b.api.analyticsConsentSnapshot(); b.api.trackAcceptedLead(receipt, id, snapshot); b.api.trackAcceptedLead(receipt, id, snapshot);
  assert.equal(b.events.length, 1); assert.equal(b.events[0][1], "generate_lead"); const params = b.events[0][2]; assert.equal(params.form_id, "consultation"); assert.equal(params.page_path, "/contatti"); assert.equal(params.page_location, "https://sansoadvisory.it/contatti");
  assert.deepEqual(Object.keys(params).sort(), ["send_to", "form_id", "page_location", "page_path", "page_referrer", "transport_type"].sort()); const serialized = JSON.stringify(params); for (const pii of [valid.name, valid.email, valid.phone, valid.message, id, receipt, "?"]) assert(!serialized.includes(pii));
  const refreshed = browser(b.storage); refreshed.consent(true); refreshed.api.trackAcceptedLead(receipt, id, refreshed.api.analyticsConsentSnapshot()); assert.equal(refreshed.events.length, 0);
});
test("email/phone are separate consent-gated events; consent mismatch fails closed", () => {
  const b = browser(); b.api.trackContactClick("email"); assert.equal(b.events.length, 0); b.consent(true); b.api.trackContactClick("email"); b.api.trackContactClick("phone"); assert.deepEqual(b.events.map(x => x[1]), ["click_email", "click_phone"]); b.consent(false); b.api.trackContactClick("email"); assert.equal(b.events.length, 2); b.window.dataLayer.push(["consent", "update", { analytics_storage: "granted" }]); assert.equal(b.api.analyticsConsentSnapshot(), null);
});
test("idempotency token survives pending refresh but is cleared after completion", () => {
  const b = browser(), id = b.api.contactRequestId(); assert.equal(b.api.contactRequestId(), id); assert.equal(browser(b.storage).api.contactRequestId(), id); b.api.finishContactRequest(); assert.notEqual(b.api.contactRequestId(), id);
});
