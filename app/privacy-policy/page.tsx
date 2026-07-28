import { LegalPage } from "@/components/legal-page";
import { createMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-data";

export const metadata = createMetadata({ title: "Privacy Policy", description: "Informativa sul trattamento dei dati personali di Paride Sansò Advisory.", path: "/privacy-policy" });

export default function PrivacyPolicyPage() {
  return <LegalPage eyebrow="Informativa" title="Privacy Policy" description="Informazioni sul trattamento dei dati personali effettuato attraverso questo sito.">
    <section><h2>Titolare del trattamento</h2><p>Il titolare del trattamento è {siteConfig.name}. Per richieste relative alla privacy è possibile scrivere a <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.</p></section>
    <section><h2>Dati trattati e finalità</h2><p>Il sito può trattare dati di navigazione e i dati forniti volontariamente tramite il modulo di contatto, email, telefono o WhatsApp. I dati sono utilizzati per rispondere alle richieste, fornire informazioni sui servizi, garantire sicurezza e funzionamento del sito e, previo consenso ove richiesto, misurare l’utilizzo delle pagine.</p></section>
    <section><h2>Base giuridica</h2><p>Il trattamento si basa sull’esecuzione di misure precontrattuali richieste dall’interessato, sull’adempimento di obblighi di legge, sul legittimo interesse alla sicurezza del sito e sul consenso per i trattamenti facoltativi.</p></section>
    <section><h2>Conservazione e destinatari</h2><p>I dati sono conservati per il tempo necessario a gestire la richiesta e adempiere agli obblighi applicabili. Possono essere trattati da fornitori tecnici e professionisti autorizzati, limitatamente alle rispettive funzioni, e non sono diffusi.</p></section>
    <section><h2>Trasferimenti fuori dallo SEE</h2><p>Alcuni fornitori tecnologici possono trattare dati in Paesi esterni allo Spazio Economico Europeo. In tali casi il trasferimento avviene mediante gli strumenti e le garanzie previsti dalla normativa applicabile.</p></section>
    <section><h2>Diritti dell’interessato</h2><p>È possibile chiedere accesso, rettifica, cancellazione, limitazione, portabilità e opposizione al trattamento, nonché revocare il consenso senza pregiudicare i trattamenti già effettuati. È inoltre possibile proporre reclamo al Garante per la protezione dei dati personali.</p></section>
    <section><h2>Aggiornamenti</h2><p>Ultimo aggiornamento: 28 luglio 2026.</p></section>
  </LegalPage>;
}
