import { BlogCard } from "@/components/blog-card";
import { PageHero } from "@/components/page-hero";
import { articles } from "@/lib/articles";
import { createMetadata } from "@/lib/seo";
export const metadata = createMetadata({ title: "Insights", description: "Guide pratiche su controllo di gestione, finanza, organizzazione, hospitality e project management.", path: "/blog" });
export default function BlogPage() { return <><PageHero eyebrow="Insights" title="Idee pratiche per decisioni più solide." description="Approfondimenti originali su gestione, finanza, organizzazione e progetti, collegati ai servizi e ai contesti in cui operiamo." /><section className="container py-20 sm:py-28"><div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{articles.map((article) => <BlogCard article={article} key={article.slug} />)}</div></section></>; }
