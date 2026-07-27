"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, LoaderCircle } from "lucide-react";
import { sendContactEmail } from "@/app/actions/contact";
import { contactSchema, type ContactInput } from "@/lib/contact-schema";
import { services } from "@/lib/site-data";

function ErrorText({ text }: { text?: string }) { return text ? <p className="mt-1 text-xs text-red-700">{text}</p> : null; }

export function ContactForm() {
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [pending, startTransition] = useTransition();
  const { register, handleSubmit, reset, setError, formState: { errors } } = useForm<ContactInput>({ resolver: zodResolver(contactSchema), defaultValues: { name: "", company: "", email: "", phone: "", service: "", message: "", website: "" } });
  const submit = (data: ContactInput) => { setStatus(null); startTransition(async () => { const result = await sendContactEmail(data); if (!result.success) { Object.entries(result.fieldErrors || {}).forEach(([name, messages]) => setError(name as keyof ContactInput, { message: messages?.[0] })); setStatus({ type: "error", message: result.message }); return; } setStatus({ type: "success", message: result.message }); reset(); }); };
  const fieldClass = "mt-2 w-full border border-slate-300 bg-white px-4 py-3 text-sm text-navy outline-none transition placeholder:text-slate-400 focus:border-gold focus:ring-2 focus:ring-gold/20";
    return <form onSubmit={handleSubmit(submit)} noValidate className="space-y-5"><div className="grid gap-5 sm:grid-cols-2"><label className="text-sm font-semibold text-navy">Nome e cognome<input className={fieldClass} {...register("name")} autoComplete="name" /><ErrorText text={errors.name?.message} /></label><label className="text-sm font-semibold text-navy">Azienda<input className={fieldClass} {...register("company")} autoComplete="organization" /><ErrorText text={errors.company?.message} /></label><label className="text-sm font-semibold text-navy">Email<input className={fieldClass} type="email" {...register("email")} autoComplete="email" /><ErrorText text={errors.email?.message} /></label><label className="text-sm font-semibold text-navy">Telefono<input className={fieldClass} type="tel" {...register("phone")} autoComplete="tel" /><ErrorText text={errors.phone?.message} /></label></div><label className="block text-sm font-semibold text-navy">Servizio richiesto<select className={fieldClass} {...register("service")}><option value="">Seleziona un servizio</option>{services.map((service) => <option key={service.slug} value={service.title}>{service.title}</option>)}</select><ErrorText text={errors.service?.message} /></label><label className="block text-sm font-semibold text-navy">Come possiamo aiutarti?<textarea className={fieldClass} rows={5} {...register("message")} /><ErrorText text={errors.message?.message} /></label><label className="hidden" aria-hidden="true">Sito web<input tabIndex={-1} autoComplete="off" {...register("website")} /></label>{status && <div role="status" className={`flex gap-2 border p-4 text-sm ${status.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-red-200 bg-red-50 text-red-800"}`}>{status.type === "success" && <CheckCircle2 className="size-5 shrink-0" />}{status.message}</div>}<button type="submit" disabled={pending} className="button-primary w-full sm:w-auto">{pending && <LoaderCircle className="size-4 animate-spin" />}{pending ? "Invio in corso…" : "Invia richiesta"}</button><p className="text-xs leading-5 text-slate-500">Inviando il modulo accetti di essere ricontattato in merito alla tua richiesta.</p></form>;
}
