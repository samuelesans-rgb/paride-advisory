import { LegalPage } from "@/components/legal-page";
import { createMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-data";

export const metadata = createMetadata({ title: "Note Legali", description: "Condizioni e informazioni legali relative al sito Paride Sansò Advisory.", path: "/note-legali" });

export default function LegalNoticePage() {
  return <LegalPage eyebrow="Informazioni" title="Note Legali" description="Condizioni di utilizzo e responsabilità relative ai contenuti di questo sito.">
    <section><h2>Titolare del sito</h2><p>Il sito è gestito da {siteConfig.name}. Contatti: <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a> e <a href={siteConfig.phoneHref}>{siteConfig.phone}</a>.</p></section>
    <section><h2>Contenuti e finalità</h2><p>I contenuti hanno carattere informativo e non costituiscono consulenza professionale, offerta al pubblico o sollecitazione alla conclusione di contratti. Ogni incarico è definito separatamente in base alle esigenze del cliente.</p></section>
    <section><h2>Attività riservate</h2><p>Le attività soggette per legge a iscrizioni, autorizzazioni o abilitazioni sono svolte esclusivamente dai professionisti competenti e regolarmente abilitati.</p></section>
    <section><h2>Responsabilità e collegamenti esterni</h2><p>Pur curando l’accuratezza e l’aggiornamento delle informazioni, non è garantita l’assenza di errori o interruzioni. Gli eventuali collegamenti a siti di terzi sono forniti per comodità e i relativi contenuti restano sotto la responsabilità dei rispettivi gestori.</p></section>
    <section><h2>Proprietà intellettuale</h2><p>Testi, elementi grafici, marchi e materiali presenti nel sito sono protetti dalla normativa applicabile. La riproduzione o il riutilizzo non autorizzato sono vietati, salvo gli usi consentiti dalla legge.</p></section>
    <section><h2>Legge applicabile</h2><p>Le presenti note sono regolate dalla legge italiana. Ultimo aggiornamento: 28 luglio 2026.</p></section>
  </LegalPage>;
}
