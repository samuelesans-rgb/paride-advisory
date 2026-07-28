# SEO Audit v1.2

Data: 28 luglio 2026. Dominio: `https://sansoadvisory.it`.

## Sintesi

La base tecnica è indicizzabile e stabile: rendering statico/SSG, canonical assoluti, metadataBase, Open Graph, Twitter Card, sitemap, robots e status corretti. L’opportunità maggiore è editoriale e architetturale: contenuti sottili, cluster assenti e collegamenti interni insufficienti.

## Audit per area

| Gravità | Area | Evidenza | Impatto | Azione | Priorità |
|---|---|---|---|---|---|
| Critica | Contenuti blog | Corpi identici su tre slug | Bassa utilità, cannibalizzazione e scarsa autorevolezza | Cinque articoli originali e roadmap editoriale | P0 |
| Alta | Intenti servizio | Solo cinque landing ampie | Query come controllo di gestione, business plan e cash flow non hanno pagina primaria | Pagine competenza distinte e collegate | P0 |
| Alta | SEO locale | Nessuna pagina affronta Milano in modo contestuale | Opportunità locale non coperta | Inserire Milano solo in pagine pertinenti, chiarendo operatività nazionale/remota | P1 |
| Alta | Dati strutturati | Organization/ProfessionalService e FAQ home presenti; Article assente | Minore comprensione delle pagine editoriali | Article, BreadcrumbList e FAQPage coerenti col visibile | P1 |
| Alta | Duplicazione host | www risponde 200 | Possibile duplicazione del dominio | Redirect 301 lato proxy | P1 |
| Media | Sitemap | lastmod uguale a ogni build | Segnale di freschezza inaffidabile | Date reali per articoli, omissione altrove | P1 |
| Media | Internal linking | Servizi e articoli quasi isolati | Cluster semantici deboli | Link bidirezionali e mappa verificabile | P1 |
| Media | Social | Un’unica immagine 4:3 per tutte le pagine | Anteprime non differenziate | Asset social 1200×630 pianificati | P2 |
| Media | CWV | Home client e immagini JPEG grandi | Rischio LCP/INP su mobile | Ridurre JS e produrre asset ottimizzati; misurare Lighthouse/CrUX | P2 |
| Media | Accessibilità | Skip link rotto; focus disomogeneo su alcuni link | Navigazione da tastiera penalizzata | Landmark, focus e label coerenti | P0 |

## Cannibalizzazione e cluster

- “Consulenza amministrativa” deve restare la landing di servizio; “controllo di gestione”, “analisi costi” e “procedure” rispondono a intenti specifici e la collegano.
- “Consulenza finanziaria” coordina business plan, budget, pianificazione e cash flow.
- “Consulenza strategica” coordina organizzazione, riorganizzazione, nuove attività e digitalizzazione.
- Hospitality è una pagina settore unica; gli approfondimenti food cost/margini evitano pagine locali duplicate.

## Limiti di misurazione

Non sono disponibili dati field Search Console, GA4 o CrUX né un browser Lighthouse. Le valutazioni CWV sono rischi tecnici, non punteggi. Le configurazioni Search Console e Iubenda esterne non sono state modificate.
