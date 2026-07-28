import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AuthorityPageView } from "@/components/authority-page";
import { authorityPages } from "@/lib/authority-data";
import { createMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-data";

export const dynamicParams = false;
export function generateStaticParams() { return authorityPages.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; const page = authorityPages.find((item) => item.slug === slug); return page ? createMetadata({ title: page.title, description: page.description, path: `/competenze/${slug}` }) : {}; }
export default async function CompetencePage({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const page = authorityPages.find((item) => item.slug === slug); if (!page) notFound(); const url = `${siteConfig.url}/competenze/${slug}`; const jsonLd = [{ "@context": "https://schema.org", "@type": "Service", name: page.title, description: page.description, provider: { "@type": "ProfessionalService", name: siteConfig.name, url: siteConfig.url }, areaServed: ["Milano", "Italia"], url }, { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url }, { "@type": "ListItem", position: 2, name: "Servizi", item: `${siteConfig.url}/servizi` }, { "@type": "ListItem", position: 3, name: page.title, item: url }] }, { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: page.faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) }]; return <><AuthorityPageView page={page} /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /></>; }
