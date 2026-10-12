# SEO sprint Sansò Advisory — 12–18 ottobre 2026

STATUS: VALIDATED / DEPLOY_PENDING

## Baseline e perimetro

Audit eseguito il 12 ottobre 2026. Repository main a 69961fb (analytics: integrate search console reporting). Working tree iniziale senza modifiche tracked; public/orizzonte/ untracked preesistente preservato. Produzione Compose paride-advisory, container eec9134dd303, immagine sha256:af091dabfcfe497cdf13137dab927cdae957d78ff574a6d4b6fac18b0764f40d. Baseline routing PASS. Altri container, Codex, analytics e credenziali inventariati; nessuna modifica infrastrutturale.

## Anomalia confermata e modifica minima

curl senza JavaScript e DOM con JavaScript disabilitato mostrano nella homepage 0 Aree di competenza, 0+ Professionisti qualificati e 0 Referente dedicato. AnimatedCounter inizializzava lo stato a zero, aggiornandolo soltanto dopo hydration/IntersectionObserver. Sono placeholder animati, non valori commerciali reali: senza JS restavano zero e contraddicevano i valori configurati in premium-home.

Unico file runtime modificato: components/animated-counter.tsx. Stato iniziale impostato al target già fornito dal contenuto, identico tra SSR e primo render client. Testo sr-only stabile con valore finale; testo animato aria-hidden per evitare annunci ripetuti. Animazione e prefers-reduced-motion preservati; nessuna soppressione degli errori di hydration.

I valori 5, 10+, 1 erano già definiti nel sorgente e visibili dopo animazione in produzione. Non sono nuovi dati commerciali: 5 corrisponde alle cinque aree servizi; 1 al modello di unico referente già descritto. La consistenza tecnica di 10+ col contenuto pubblicato è verificata, ma non è stata svolta una verifica indipendente della consistenza numerica della rete professionale. Nessun numero commerciale introdotto o aumentato.

Backup timestampato di animated-counter.tsx e manifest produzione in /home/ubuntu/seo-sprint-20261012/backups/. Nessun backup precedente eliminato.

## Metadata, indicizzazione e internal linking

42 URL sitemap e 42 destinazioni interne controllate: HTTP 200, un solo H1, title/description presenti, canonical assoluto https://sansoadvisory.it coerente col path, nessun noindex involontario, nessun link interno rotto o pagina orfana nel grafo delle pagine pubblicate. Sitemap/robots HTTP 200, robots Allow / e sitemap canonica. www redirige 308 al dominio canonico. OpenGraph coerente con canonical e contenuti; sito italiano senza versioni linguistiche alternative, quindi nessun hreflang necessario.

Confronto baseline/candidato su tutte le 42 pagine: title, description, H1, canonical, OpenGraph, robots, JSON-LD e link identici. Cluster Processi/PMI interamente congelato. Collegamenti contestuali già presenti: PMI → processi/controllo di gestione; processi → PMI/articolo; articolo processi → PMI/processi; amministrativa → processi/controllo/costi; controllo → costi/budget/articolo ristorazione. Link ripetuti già esistenti tra testo e card non duplicati ulteriormente.

Pagine strategiche controllate:

| URL | Title | Canonical |
|---|---|---|
| / | Paride Sansò Advisory | https://sansoadvisory.it/ |
| /settori/pmi | Consulenza aziendale per PMI | Paride Sansò Advisory | https://sansoadvisory.it/settori/pmi |
| /competenze/ottimizzazione-dei-processi | Ottimizzazione dei processi | Paride Sansò Advisory | https://sansoadvisory.it/competenze/ottimizzazione-dei-processi |
| /blog/ottimizzazione-processi-aziendali | Ottimizzazione dei processi aziendali: metodo e KPI | Paride Sansò Advisory | https://sansoadvisory.it/blog/ottimizzazione-processi-aziendali |
| /servizi/amministrativa | Consulenza amministrativa | Paride Sansò Advisory | https://sansoadvisory.it/servizi/amministrativa |
| /contatti | Contatti | Paride Sansò Advisory | https://sansoadvisory.it/contatti |

## Structured data

JSON-LD parseabile in tutte le pagine. Organization/ProfessionalService globale coerente con identità, contatti e area di servizio visibili; nessun nuovo indirizzo, certificazione o numero. Service nelle pagine specialistica/settore/servizio; Article esclusivamente nei sette articoli; BreadcrumbList con nomi/percorso coerenti col breadcrumb visibile. Nessun duplicato top-level dello stesso tipo per pagina. FAQPage solo in pagine con FAQ reali; in home risposte disponibili espandendo i pannelli, verificate nel browser contro le quattro risposte nello schema. Non è stata svolta una convalida esterna Google Rich Results: si tratta di validazione locale del markup e coerenza col contenuto.

## Search Console — sola lettura

Fonte: dataset live sanso-advisory-analytics.searchconsole, schema rilevato tramite reader BigQuery esistente/ADC. Tabelle ExportLog, searchdata_site_impression e searchdata_url_impression. Filtro osservato site_url=https://sansoadvisory.it/, search_type=WEB. Position site/query usa sum_top_position; URL usa sum_position. Posizione media = SUM(posizione zero-based)/SUM(impressions)+1. CTR = SUM(clicks)/SUM(impressions).

READY; stato decisionale INSUFFICIENT_DATA. Report automatico generato 12/10/2026 09:10 UTC, ultima data 10/10/2026, ExportLog pubblicato 12/10. Query live indipendenti confermano i totali del report al medesimo intervallo disponibile.

| Aggregato WEB | Intervallo | Giorni osservati | Righe raw | Impression | Clic | CTR | Posizione media |
|---|---|---:|---:|---:|---:|---:|---:|
| query | 2026-09-30–2026-10-10 | 11 | 288 | 418 | 1 | 0.239% | 32.33 |
| url | 2026-09-30–2026-10-10 | 11 | 342 | 456 | 1 | 0.219% | 33.30 |

Gli aggregati query e URL hanno grana differente: non sommati né considerati intercambiabili. Le query anonime sono incluse nei totali; il clic nella tabella query è attribuito al gruppo anonimo, non a una query nominativa. Copertura: 11 giorni consecutivi di export, non 28 giorni completi. Soglie richieste: almeno 28 giorni completi, 1000 impression WEB complessive e 200 per query/pagina; non raggiunte. La query nominativa principale ha 45 impression; la pagina principale ne ha 184. Nessuna modifica a keyword, title o contenuti e nessuna conclusione di crescita/calo SEO.

| Query descrittive principali | Impression | Clic | CTR | Posizione |
|---|---:|---:|---:|---:|
| ottimizzazione processi aziendali | 45 | 0 | 0.00% | 21.69 |
| (anonima) | 41 | 1 | 2.44% | 16.61 |
| ottimizzazione dei processi aziendali | 30 | 0 | 0.00% | 27.20 |
| ottimizzazione processi | 19 | 0 | 0.00% | 23.11 |
| consulenza per pmi | 18 | 0 | 0.00% | 46.33 |

| URL principali | Impression | Clic | CTR | Posizione |
|---|---:|---:|---:|---:|
| https://sansoadvisory.it/blog/ottimizzazione-processi-aziendali | 184 | 1 | 0.54% | 20.73 |
| https://sansoadvisory.it/settori/pmi | 124 | 0 | 0.00% | 48.98 |
| https://sansoadvisory.it/competenze/ottimizzazione-dei-processi | 103 | 0 | 0.00% | 38.22 |
| https://sansoadvisory.it/servizi/finanziaria | 21 | 0 | 0.00% | 37.38 |
| https://sansoadvisory.it/blog/controllo-di-gestione-pmi-redditivita | 3 | 0 | 0.00% | 8.00 |

GA4 non usato per inferire performance SEO. Conservati avvisi su consent modelling, identificatori NULL, shard incompleti, timezone non verificata e key events non configurati. Nessuna modifica analytics/report/Google.

## Lighthouse e Core Web Vitals

LAB: Lighthouse 13.0.0, Chromium headless 153, VPS Linux, Chrome --headless --no-sandbox --disable-dev-shm-usage, profili standard mobile simulato (CPU 4x, RTT 150ms) e desktop. Tre run sequenziali per pagina/profilo, mediana. Browser/profilo pulito e consenso non selezionato in ogni run. JSON grezzi e script riproducibile salvati negli artifact privati. Eventuali run iniziali durante build sono ripetuti a build terminata prima di utilizzare la mediana.

FIELD: NOT AVAILABLE; nessun CrUX/INP verificato. TBT è un proxy LAB e non è INP.

| Profilo / URL | Run | Performance prima | LCP s | CLS | TBT ms | Performance dopo | LCP s dopo | CLS dopo | TBT ms dopo |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| mobile / | 3 | 82 | 2.04 | 0.00003 | 673 | non rimisurata | — | — | — |
| mobile /servizi/amministrativa | 3 | 82 | 1.96 | 0.00000 | 690 | non rimisurata | — | — | — |
| mobile /competenze/controllo-di-gestione | 3 | 82 | 1.88 | 0.00000 | 701 | non rimisurata | — | — | — |
| mobile /settori | 3 | 83 | 1.96 | 0.00000 | 661 | non rimisurata | — | — | — |
| mobile /blog/consulenza-aziendale-ristoranti-costi-margini | 3 | 81 | 2.64 | 0.00000 | 674 | non rimisurata | — | — | — |
| desktop / | 3 | 100 | 0.69 | 0.00008 | 42 | non rimisurata | — | — | — |
| desktop /servizi/amministrativa | 3 | 100 | 0.63 | 0.00000 | 32 | non rimisurata | — | — | — |
| desktop /competenze/controllo-di-gestione | 3 | 100 | 0.60 | 0.00000 | 23 | non rimisurata | — | — | — |
| desktop /settori | 3 | 100 | 0.59 | 0.00000 | 28 | non rimisurata | — | — | — |
| desktop /blog/consulenza-aziendale-ristoranti-costi-margini | 3 | 100 | 0.57 | 0.00000 | 29 | non rimisurata | — | — | — |

Dopo: tre run mobile e desktop sulla homepage, unica pagina runtime modificata. Le altre pagine restano invariate; non vengono riportate misure post inesistenti. Non si dichiara una riduzione TBT attribuibile alla correzione semantica dei contatori. Intervalli e dettaglio CPU/JS sono nel JSON performance-summary.

Baseline pubblicata 5 ottobre: disponibile in /tmp/sanso-tech-20261005/performance-after-summary.json (Lighthouse 13.5.0, Chromium 151). Profili simili ma versioni differenti, quindi confronto orientativo e non prova causale di regressione. TBT mobile già elevato; costi first-party, Iubenda e gtag ancora presenti. Nessuna regressione sufficientemente isolata per autorizzare refactoring o variazioni del consenso.

Hero usa next/image, priority e sizes=100vw; immagini sotto la fold lazy. Manrope via next/font, display=swap; font-display audit senza problema. Segnalazione immagini circa 10 KiB con risparmio LCP stimato 0: nessun intervento speculativo. Animazioni/reduced motion preservati.

## Test, build e consenso

PASS: git diff --check; npm run lint; npx tsc --noEmit; 38 test analytics unittest; npm run build. Nessuno script npm test presente; eseguita suite esistente più smoke pertinenti nel browser. PASS viewport 320/375/390/430/1440 con movimento normale e ridotto, valori visibili e accessibili corretti, nessun hydration mismatch, overflow o overlap.

Consent Mode v2/Iubenda/GA4 invariati. Test browser nessuna scelta/rifiuto/accettazione: un caricamento gtag per sessione; analytics_storage denied prima della scelta e dopo rifiuto, nessun cookie _ga; update granted e cookie GA solo dopo accettazione. Ping cookieless già esistenti in modalità denied preservati; nessun cambio di metodologia/compliance. Configurazione doppio default (app e widget) già presente, entrambi denied per analytics; nessuna regressione oggettiva dimostrata.

## Commit, push, deploy e rollback

Diff applicativo: solo animated-counter.tsx; questo report è documentazione dello sprint. Workflow produzione verificato tramite label del container e audit precedente: docker compose progetto paride-advisory, servizio paride-advisory. Build da archivio Git pulito con override build.context, senza incorporare public/orizzonte/ o analytics privati. Solo container app da ricreare; nessun down/prune/riavvio altri servizi.

Commit/push/deploy: pianificati dopo controlli verdi; aggiornamento finale del report successivo alla verifica produzione.

Rollback: immagine produzione iniziale preservata con tag paride-advisory:rollback-seo-20261012; override e script nello stesso audit. Non ripristinare il rollback infrastrutturale del 5 ottobre: lo sprint corrente riguarda esclusivamente app. Backup e credenziali non spostati.

## Health check e regressioni

Baseline routing PASS; candidato locale PASS. Verifiche finali pubblico/container/analytics da completare dopo deploy.

## Prossime azioni

Attendere almeno 28 giorni completi e soglie impression richieste prima di valutare interventi editoriali. Continuare misure TBT ripetute con versione Lighthouse/Chrome fissa ed eventuali dati FIELD reali; non assimilare TBT a INP. Verifica commerciale indipendente del numero di professionisti se desiderata, senza cambiarlo in questo sprint tecnico. Nessuna nuova pagina o articolo.

Evidenze private: /home/ubuntu/seo-sprint-20261012/ (audit JSON/HTML SSR, SQL/schema/job audit read-only, browser/consent smoke, Lighthouse, log lint/typecheck/test/build, manifest container/Codex, backup e rollback).

## Confronto orientativo con produzione 5 ottobre

| URL | Performance 5/10 | TBT 5/10 ms | Performance 12/10 prima | TBT 12/10 prima ms |
|---|---:|---:|---:|---:|
| / | 82 | 714 | 82 | 673 |
| /servizi/amministrativa | 84 | 518 | 82 | 690 |
| /competenze/controllo-di-gestione | 83 | 562 | 82 | 701 |
| /settori | 81 | 758 | 83 | 661 |
| /blog/consulenza-aziendale-ristoranti-costi-margini | 80 | 694 | 81 | 674 |

CPU/payload homepage prima (mediane LAB):

| Provenienza JS | CPU ms | Transfer byte |
|---|---:|---:|
| first_party | 1322 | 165874 |
| iubenda | 746 | 132150 |
| ga | 315 | 180695 |
| other | 392 | 0 |
