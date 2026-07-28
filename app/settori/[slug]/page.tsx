import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Check } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CtaBanner } from "@/components/cta-banner";
import { authorityPages, sectorPages } from "@/lib/authority-data";
import { articles } from "@/lib/articles";
import { createMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-data";

export const dynamicParams = false;
export function generateStaticParams() { return sectorPages.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; const page = sectorPages.find((item) => item.slug === slug); return page ? createMetadata({ title: page.title, description: page.description, path: `/settori/${slug}` }) : {}; }
export default async function SectorDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const page = sectorPages.find((item) => item.slug === slug); if (!page) notFound();
  const related = page.relatedCompetences.map((item) => authorityPages.find((entry) => entry.slug === item)).filter(Boolean);
  const article = articles.find((item) => item.slug === page.article)!;
  const url = `${siteConfig.url}/settori/${slug}`;
  const jsonLd = [{ "@context": "https://schema.org", "@type": "Service", name: page.title, description: page.description, provider: { "@type": "ProfessionalService", name: siteConfig.name }, areaServed: ["Milano", "Italia"], url }, { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url }, { "@type": "ListItem", position: 2, name: "Settori", item: `${siteConfig.url}/settori` }, { "@type": "ListItem", position: 3, name: page.title, item: url }] }, { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: page.faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) }];
  return <>
    <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Settori", href: "/settori" }, { label: page.title }]} />
    <section className="bg-slate-50 py-16 sm:py-24"><div className="container max-w-5xl"><p className="eyebrow">Consulenza per settore</p><h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-[-.055em] text-navy sm:text-6xl">{page.title}</h1><p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">{page.description}</p><Link className="button-primary mt-8" href="/contatti">Parliamo delle tue priorità <ArrowUpRight className="size-4" /></Link></div></section>
    <section className="container grid gap-12 py-20 sm:py-28 lg:grid-cols-2"><div><p className="eyebrow">Il contesto</p><h2 className="mt-4 text-3xl font-semibold tracking-[-.04em] text-navy">Soluzioni costruite sul modo in cui lavori.</h2><p className="mt-6 text-lg leading-8 text-slate-700">{page.intro}</p></div><div className="bg-navy p-7 text-white sm:p-10"><p className="eyebrow">Priorità frequenti</p><ul className="mt-7 space-y-5">{page.priorities.map((item) => <li className="flex gap-3" key={item}><Check className="size-5 shrink-0 text-gold" />{item}</li>)}</ul></div></section>
    <section className="bg-slate-50 py-20 sm:py-28"><div className="container"><p className="eyebrow">Competenze collegate</p><h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-[-.04em] text-navy">Un percorso che collega gestione, finanza e organizzazione.</h2><div className="mt-10 grid gap-4 md:grid-cols-3">{related.map((item) => item && <Link className="group flex min-h-56 flex-col justify-between border border-slate-200 bg-white p-6 text-navy transition hover:border-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold" href={`/competenze/${item.slug}`} key={item.slug}><span className="eyebrow">Competenza</span><span><strong className="block text-xl">{item.title}</strong><span className="mt-3 block text-sm leading-6 text-slate-600">{item.description}</span></span></Link>)}</div><Link className="button-secondary mt-8" href="/servizi">Esplora tutti i servizi</Link></div></section>
    <section className="container grid gap-10 py-20 sm:py-28 lg:grid-cols-[.7fr_1.3fr]"><div><p className="eyebrow">Metodo</p><h2 className="mt-4 text-3xl font-semibold tracking-[-.04em] text-navy">Dal contesto a un piano verificabile.</h2></div><div className="grid gap-3 sm:grid-cols-2">{["Analisi di obiettivi, numeri e processi", "Priorità e responsabilità condivise", "Attuazione coordinata", "Verifica periodica e adattamento"].map((item, index) => <div className="border-t border-slate-200 py-5 text-navy" key={item}><span className="mr-3 text-xs font-bold text-gold">0{index + 1}</span>{item}</div>)}</div></section>
    <section className="bg-navy py-16 text-white"><div className="container flex flex-col justify-between gap-8 lg:flex-row lg:items-center"><div><p className="eyebrow">Approfondimento</p><h2 className="mt-3 max-w-3xl text-2xl font-semibold">{article.title}</h2></div><Link className="button-gold shrink-0" href={`/blog/${article.slug}`}>Leggi l’articolo <ArrowUpRight className="size-4" /></Link></div></section>
    <section className="container grid gap-10 py-20 sm:py-28 lg:grid-cols-[.7fr_1.3fr]"><div><p className="eyebrow">FAQ</p><h2 className="mt-4 text-3xl font-semibold tracking-[-.04em] text-navy">Domande sul supporto.</h2></div><div className="divide-y divide-slate-200">{page.faqs.map((faq) => <details className="py-5" key={faq.question}><summary className="cursor-pointer font-semibold text-navy focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold">{faq.question}</summary><p className="mt-3 leading-7 text-slate-600">{faq.answer}</p></details>)}</div></section>
    <CtaBanner title="Costruiamo un supporto aderente al tuo contesto." description="Operiamo a Milano e, anche da remoto, su tutto il territorio nazionale." />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
  </>;
}
