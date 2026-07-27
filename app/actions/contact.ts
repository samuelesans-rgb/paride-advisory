"use server";

import { headers } from "next/headers";
import nodemailer from "nodemailer";
import { contactSchema } from "@/lib/contact-schema";
import { siteConfig } from "@/lib/site-data";
import { escapeHtml } from "@/lib/utils";

type ActionResult = {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
};

type RateLimitEntry = { count: number; resetAt: number };
const attempts = new Map<string, RateLimitEntry>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_ATTEMPTS = 5;

function canSubmit(identifier: string) {
  const now = Date.now();
  const current = attempts.get(identifier);
  if (!current || current.resetAt < now) {
    attempts.set(identifier, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (current.count >= RATE_LIMIT_MAX_ATTEMPTS) return false;
  current.count += 1;
  return true;
}

function getRequestIdentifier(requestHeaders: Headers) {
  return requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim()
    || requestHeaders.get("x-real-ip")
    || "anonymous";
}

export async function sendContactEmail(input: unknown): Promise<ActionResult> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: "Controlla i campi indicati.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }
  if (parsed.data.website) {
    return { success: true, message: "Grazie, la richiesta è stata inviata." };
  }

  const requestHeaders = await headers();
  if (!canSubmit(getRequestIdentifier(requestHeaders))) {
    return { success: false, message: "Hai inviato troppe richieste. Riprova tra qualche minuto." };
  }

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM } = process.env;
  const smtpPort = Number(SMTP_PORT);
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASSWORD || !SMTP_FROM || !Number.isInteger(smtpPort) || smtpPort < 1 || smtpPort > 65535) {
    console.error("Missing or invalid SMTP configuration");
    return { success: false, message: "Il servizio email non è momentaneamente disponibile. Contattaci telefonicamente." };
  }

  const transport = nodemailer.createTransport({
    host: SMTP_HOST,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
  });
  const fields = [
    ["Nome", parsed.data.name],
    ["Azienda", parsed.data.company || "Non indicata"],
    ["Email", parsed.data.email],
    ["Telefono", parsed.data.phone],
    ["Servizio", parsed.data.service],
    ["Messaggio", parsed.data.message],
  ] as const;

  try {
    await transport.sendMail({
      from: SMTP_FROM,
      to: siteConfig.email,
      replyTo: parsed.data.email,
      subject: `Nuova richiesta di consulenza — ${parsed.data.name}`,
      text: fields.map(([label, value]) => `${label}: ${value}`).join("\n\n"),
      html: `<div style="font-family:Arial,sans-serif;background:#f5f7fa;padding:32px;color:#0B1F3A"><div style="max-width:680px;margin:auto;background:#fff;padding:32px;border-top:4px solid #C9A227"><p style="color:#C9A227;text-transform:uppercase;font-size:12px;font-weight:700;letter-spacing:1px">Paride Sansò Advisory</p><h1 style="font-size:24px">Nuova richiesta di consulenza</h1><table style="width:100%;border-collapse:collapse">${fields.map(([label, value]) => `<tr><td style="padding:12px 0;border-bottom:1px solid #e5e7eb;font-weight:700;width:150px">${escapeHtml(label)}</td><td style="padding:12px 0;border-bottom:1px solid #e5e7eb;white-space:pre-line">${escapeHtml(value)}</td></tr>`).join("")}</table></div></div>`,
    });
    return { success: true, message: "Grazie. La tua richiesta è stata inviata con successo." };
  } catch (error) {
    console.error("Contact email error", error);
    return { success: false, message: "Non è stato possibile inviare la richiesta. Riprova o contattaci direttamente." };
  }
}
