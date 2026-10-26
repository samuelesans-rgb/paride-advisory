import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CtaBanner } from "@/components/cta-banner";
import { PageHero } from "@/components/page-hero";
import { sectorPages } from "@/lib/authority-data";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({ title: "Settori", description: "Consulenza per PMI, ristorazione e hospitality, attività commerciali, studi professionali, condomini e privati.", path: "/settori" });
export default function SectorsPage() { return <><PageHero eyebrow="Settori" title="Soluzioni che parlano il linguaggio della tua realtà." description="Ogni settore ha tempi, dinamiche e priorità differenti. Il nostro approccio parte sempre dal contesto in cui operi." /><section className="container py-20 sm:py-28"><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{sectorPages.map((sector) => <article className="group relative flex min-h-72 flex-col border border-slate-200 p-7 transition hover:border-gold hover:shadow-lg" key={sector.slug}><p className="eyebrow">Consulenza per settore</p><h2 className="mt-5 text-2xl font-semibold tracking-[-.03em] text-navy"><Link href={`/settori/${sector.slug}`} className="after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-gold">{sector.title}</Link></h2><p className="mt-4 text-sm leading-6 text-slate-600">{sector.description}</p><span aria-hidden="true" className="mt-auto flex items-center gap-2 pt-8 text-sm font-semibold text-navy">Approfondisci <ArrowUpRight className="size-4 transition group-hover:translate-x-1 group-hover:-translate-y-1" /></span></article>)}</div></section><CtaBanner /></>; }
