import { BlogCard } from "@/components/blog-card";
import { PageHero } from "@/components/page-hero";
import { articles } from "@/lib/site-data";
import { createMetadata } from "@/lib/seo";
export const metadata = createMetadata({ title: "Insights", description: "Approfondimenti su organizzazione, pianificazione e crescita d’impresa.", path: "/blog" });
export default function BlogPage() { return <><PageHero eyebrow="Insights" title="Idee pratiche per decisioni più solide." description="Aggiornamenti e spunti di lavoro su gestione, finanza, strategia e project management." /><section className="container py-20 sm:py-28"><div className="grid gap-5 md:grid-cols-3">{articles.map((article) => <BlogCard article={article} key={article.slug} />)}</div></section></>; }
