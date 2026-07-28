import Link from "next/link";
import { Mail, MessageCircle, Network, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { PageHero } from "@/components/page-hero";
import { createMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-data";

export const metadata = createMetadata({ title: "Contatti", description: "Contatta Paride Sansò Advisory per una consulenza aziendale a Milano o da remoto in tutta Italia.", path: "/contatti" });
const contactLinks = [
  { icon: Phone, label: "Telefono", value: siteConfig.phone, href: siteConfig.phoneHref },
  { icon: Mail, label: "Email", value: siteConfig.email, href: `mailto:${siteConfig.email}` },
  { icon: MessageCircle, label: "WhatsApp", value: "Scrivici su WhatsApp", href: siteConfig.whatsapp, external: true },
  { icon: Network, label: "LinkedIn", value: "Paride Sansò Advisory", href: siteConfig.linkedin, external: true },
];
export default function ContactPage() { return <><PageHero eyebrow="Contatti" title="Parliamo della tua prossima priorità." description="Inviaci la tua richiesta: operiamo a Milano e, anche da remoto, su tutto il territorio nazionale." /><section className="container grid gap-14 py-20 sm:py-28 lg:grid-cols-[.8fr_1.2fr]"><aside><p className="eyebrow">Contatti diretti</p><h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-navy">Scegli il canale che preferisci.</h2><div className="mt-9 space-y-5">{contactLinks.map(({ icon: Icon, label, value, href, external }) => <a className="flex items-center gap-4 rounded-sm text-sm text-navy transition hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold" href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} aria-label={external ? `${label} di Paride Sansò Advisory, apre una nuova scheda` : `${label}: ${value}`} key={label}><span className="flex size-10 items-center justify-center bg-slate-100"><Icon className="size-5 text-gold" /></span><span><strong className="block">{label}</strong><span className="text-slate-600">{value}</span></span></a>)}</div><Link className="mt-9 inline-block text-sm font-semibold text-navy underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold" href="/privacy-policy">Come trattiamo i dati del modulo</Link></aside><div className="border border-slate-200 bg-slate-50 p-6 sm:p-9"><h2 className="text-2xl font-semibold tracking-[-0.03em] text-navy">Richiedi una consulenza</h2><p className="mt-2 text-sm text-slate-600">I campi contrassegnati sono necessari per gestire la tua richiesta.</p><div className="mt-8"><ContactForm /></div></div></section></>; }
