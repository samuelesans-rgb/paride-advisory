"use client";

import { useId, useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, LoaderCircle } from "lucide-react";
import { sendContactEmail } from "@/app/actions/contact";
import { contactSchema, type ContactInput } from "@/lib/contact-schema";
import { analyticsConsentSnapshot, contactRequestId, finishContactRequest, trackAcceptedLead } from "@/lib/conversion-events";
import { services } from "@/lib/site-data";

function ErrorText({ id, text }: { id: string; text?: string }) { return text ? <p id={id} className="mt-1 text-xs text-red-700">{text}</p> : null; }

export function ContactForm() {
  const formId = useId();
  const inFlight = useRef(false);
  const requestId = useRef<string | null>(null);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [pending, startTransition] = useTransition();
  const { register, handleSubmit, reset, setError, formState: { errors } } = useForm<ContactInput>({ resolver: zodResolver(contactSchema), defaultValues: { name: "", company: "", email: "", phone: "", service: "", message: "", website: "" } });
  const errorId = (name: keyof ContactInput) => `${formId}-${name}-error`;
  const accessibilityProps = (name: keyof ContactInput) => ({
    "aria-invalid": Boolean(errors[name]),
    "aria-describedby": errors[name] ? errorId(name) : undefined,
    "aria-required": name !== "company" && name !== "website",
  });
  const submit = (data: ContactInput) => {
    if (inFlight.current) return;
    inFlight.current = true;
    requestId.current ??= contactRequestId();
    const id = requestId.current;
    const consent = analyticsConsentSnapshot();
    setStatus(null);
    startTransition(async () => {
      try {
        const result = await sendContactEmail(data, id);
        if (!result.success) {
          Object.entries(result.fieldErrors || {}).forEach(([name, messages]) => setError(name as keyof ContactInput, { message: messages?.[0] }));
          setStatus({ type: "error", message: result.message });
          return;
        }
        if (result.leadReceipt) trackAcceptedLead(result.leadReceipt, id, consent);
        finishContactRequest();
        requestId.current = null;
        setStatus({ type: "success", message: result.message });
        reset();
      } catch {
        setStatus({ type: "error", message: "Non è stato possibile inviare la richiesta. Riprova o contattaci direttamente." });
      } finally { inFlight.current = false; }
    });
  };
  const fieldClass = "mt-2 w-full border border-slate-300 bg-white px-4 py-3 text-sm text-navy outline-none transition placeholder:text-slate-400 focus:border-gold focus:ring-2 focus:ring-gold/20";
    return <form onSubmit={(event) => { void handleSubmit(submit)(event); }} noValidate className="space-y-5"><div className="grid gap-5 sm:grid-cols-2"><label className="text-sm font-semibold text-navy">Nome e cognome <span aria-hidden="true">*</span><input className={fieldClass} {...register("name")} {...accessibilityProps("name")} autoComplete="name" /><ErrorText id={errorId("name")} text={errors.name?.message} /></label><label className="text-sm font-semibold text-navy">Azienda<input className={fieldClass} {...register("company")} {...accessibilityProps("company")} autoComplete="organization" /><ErrorText id={errorId("company")} text={errors.company?.message} /></label><label className="text-sm font-semibold text-navy">Email <span aria-hidden="true">*</span><input className={fieldClass} type="email" {...register("email")} {...accessibilityProps("email")} autoComplete="email" /><ErrorText id={errorId("email")} text={errors.email?.message} /></label><label className="text-sm font-semibold text-navy">Telefono <span aria-hidden="true">*</span><input className={fieldClass} type="tel" {...register("phone")} {...accessibilityProps("phone")} autoComplete="tel" /><ErrorText id={errorId("phone")} text={errors.phone?.message} /></label></div><label className="block text-sm font-semibold text-navy">Servizio richiesto <span aria-hidden="true">*</span><select className={fieldClass} {...register("service")} {...accessibilityProps("service")}><option value="">Seleziona un servizio</option>{services.map((service) => <option key={service.slug} value={service.title}>{service.title}</option>)}</select><ErrorText id={errorId("service")} text={errors.service?.message} /></label><label className="block text-sm font-semibold text-navy">Come possiamo aiutarti? <span aria-hidden="true">*</span><textarea className={fieldClass} rows={5} {...register("message")} {...accessibilityProps("message")} /><ErrorText id={errorId("message")} text={errors.message?.message} /></label><label className="hidden" aria-hidden="true">Sito web<input tabIndex={-1} autoComplete="off" {...register("website")} /></label>{status && <div role="status" className={`flex gap-2 border p-4 text-sm ${status.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-red-200 bg-red-50 text-red-800"}`}>{status.type === "success" && <CheckCircle2 className="size-5 shrink-0" />}{status.message}</div>}<button type="submit" disabled={pending} className="button-primary w-full sm:w-auto">{pending && <LoaderCircle className="size-4 animate-spin" />}{pending ? "Invio in corso…" : "Invia richiesta"}</button><p className="text-xs leading-5 text-slate-500">Inviando il modulo accetti di essere ricontattato in merito alla tua richiesta.</p></form>;
}
