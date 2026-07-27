import { CtaBanner } from "@/components/cta-banner";
import { PageHero } from "@/components/page-hero";
import { ServicesGrid } from "@/components/services-grid";
import { createMetadata } from "@/lib/seo";
export const metadata = createMetadata({ title: "Servizi", description: "Consulenza amministrativa, finanziaria, strategica, tecnica e project management.", path: "/servizi" });
export default function ServicesPage() { return <><PageHero eyebrow="Servizi" title="La consulenza giusta, collegata ai tuoi obiettivi." description="Cinque aree di competenza complementari per dare struttura alle decisioni e continuità alla crescita." /><section className="container py-20 sm:py-28"><ServicesGrid /></section><CtaBanner title="Hai un’esigenza specifica?" description="Partiamo da una conversazione per definire il supporto più utile." /></>; }
