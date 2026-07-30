import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { services } from "@/lib/site-data";
import { Reveal } from "@/components/reveal";

const serviceImages: Record<string, string> = {
  amministrativa: "/images/home/consulenza-amministrativa-documenti.webp",
  finanziaria: "/images/home/consulenza-finanziaria-grafici.webp",
  strategica: "/images/home/consulenza-strategica-riunione.webp",
  tecnici: "/images/home/metodologia-consulenza-ufficio.webp",
  "project-management": "/images/home/project-management-sala-riunioni.webp",
};

export function ServicesGrid() { return <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{services.map((service, index) => { const Icon = service.icon; return <Reveal delay={index * .05} key={service.slug}><Link href={`/servizi/${service.slug}`} className="group relative flex min-h-[410px] overflow-hidden bg-navy p-7 text-white shadow-sm transition duration-500 hover:-translate-y-1 hover:shadow-2xl"><Image src={serviceImages[service.slug]} alt="" width={1672} height={941} sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw" loading="lazy" className="absolute inset-0 h-full w-full object-cover object-center opacity-35 transition duration-700 group-hover:scale-110 group-hover:opacity-45" /><div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,31,58,.05),rgba(11,31,58,.96))]" /><div className="relative flex w-full flex-col"><div className="flex items-start justify-between"><span className="flex size-11 items-center justify-center border border-white/25 bg-white/10 backdrop-blur"><Icon className="size-5 text-gold" strokeWidth={1.5} /></span><ArrowUpRight className="size-5 text-gold transition group-hover:translate-x-1 group-hover:-translate-y-1" /></div><div className="mt-auto"><p className="text-xs font-bold uppercase tracking-[.16em] text-gold">{service.eyebrow}</p><h3 className="mt-3 text-2xl font-semibold tracking-[-.04em]">{service.title}</h3><p className="mt-3 max-w-sm text-sm leading-6 text-white/70">{service.summary}</p><span className="mt-6 block h-px w-10 bg-gold transition-all duration-500 group-hover:w-20" /></div></div></Link></Reveal>; })}</div>; }
