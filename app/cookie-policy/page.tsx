import { LegalPage } from "@/components/legal-page";
import { createMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-data";

export const metadata = createMetadata({ title: "Cookie Policy", description: "Informazioni sui cookie e sulle tecnologie di tracciamento utilizzate dal sito.", path: "/cookie-policy" });

export default function CookiePolicyPage() {
  return <LegalPage eyebrow="Informativa" title="Cookie Policy" description="Informazioni sulle tecnologie utilizzate dal sito e su come gestire le preferenze.">
    <section><h2>Cosa sono i cookie</h2><p>I cookie sono piccoli file memorizzati dal browser. Possono essere necessari al funzionamento del sito oppure, con il consenso dell’utente, impiegati per analisi e altre finalità facoltative.</p></section>
    <section><h2>Cookie tecnici</h2><p>Il sito può utilizzare tecnologie strettamente necessarie per sicurezza, erogazione delle pagine e memorizzazione delle preferenze sul consenso. Queste tecnologie non richiedono il consenso preventivo.</p></section>
    <section><h2>Google Analytics 4</h2><p>Se configurato, il sito utilizza Google Analytics 4 per ottenere statistiche aggregate sull’utilizzo delle pagine. Google Consent Mode v2 mantiene negati per impostazione predefinita i consensi relativi ad analisi e pubblicità e li aggiorna soltanto in base alle scelte espresse dall’utente.</p></section>
    <section><h2>Gestione del consenso</h2><p>La piattaforma di gestione del consenso è predisposta per Iubenda. Quando il servizio è attivo, il banner permette di accettare, rifiutare o personalizzare le finalità e di modificare successivamente le preferenze. In assenza di una piattaforma configurata, i consensi facoltativi rimangono negati.</p></section>
    <section><h2>Impostazioni del browser</h2><p>È inoltre possibile eliminare o bloccare i cookie dalle impostazioni del browser. Il blocco delle tecnologie necessarie può compromettere alcune funzionalità del sito.</p></section>
    <section><h2>Contatti e aggiornamenti</h2><p>Per informazioni scrivere a <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>. Ultimo aggiornamento: 28 luglio 2026.</p></section>
  </LegalPage>;
}
