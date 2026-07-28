# SEO Audit — Paride Sansò Advisory

**Data audit:** 28 luglio 2026
**Ambito:** codice Next.js 16.2.12, build di produzione e crawl del runtime locale
**Dominio configurato:** `https://sansoadvisory.it`
**Pagine HTML analizzate:** 18
**Modalità:** audit read-only; nessuna modifica al codice applicativo

---

## 1. Executive summary

Il sito presenta una base tecnica SEO complessivamente solida: tutte le pagine pubbliche sono prerenderizzate, restituiscono `200`, hanno un solo H1, title, meta description, canonical assoluto, Open Graph, Twitter Card e sono incluse nella sitemap. `robots.txt` consente correttamente il crawl e indica la sitemap. La build di produzione e ESLint terminano senza errori.

Le criticità principali riguardano la qualità e differenziazione dei tre articoli, che condividono integralmente struttura e testo del corpo; l’assenza di schema `Article`/`BlogPosting`; l’assenza di breadcrumb visibili; una home interamente trasformata in Client Component; il caricamento `beforeInteractive` di uno script terzo; e alcuni problemi di accessibilità, fra cui lo skip link privo di destinazione.

### Valutazione sintetica

| Area | Valutazione | Nota |
|---|---:|---|
| Crawlability e indicizzazione | Buona | Route statiche, robots e sitemap corretti |
| Metadata e canonical | Buona | Copertura completa, ma diversi elementi poco ottimizzati |
| Contenuti e keyword | Critica | Articoli quasi duplicati e molto sottili |
| Dati strutturati | Sufficiente | Organization, FAQ e breadcrumb presenti; mancano Article e Service |
| Internal linking | Sufficiente | Architettura raggiungibile, ma scarsi link contestuali |
| Immagini | Buona | `next/image`, dimensioni dichiarate tramite `fill`, alt coerenti |
| Performance/CWV | Da migliorare | Buona risposta locale; rischi da JS client, script terzi e immagine LCP |
| Accessibilità | Da migliorare | Skip link rotto e semantica/form da rafforzare |

### Distribuzione dei rilievi

| Gravità | Numero |
|---|---:|
| Critica | 1 |
| Alta | 4 |
| Media | 11 |
| Bassa | 7 |

### Priorità operative

1. Riscrivere e differenziare integralmente i tre articoli.
2. Correggere lo skip link e verificare l’accessibilità della navigazione e del form.
3. Ridurre il perimetro client-side della home e rivedere gli script `beforeInteractive`.
4. Aggiungere dati strutturati specifici per articoli e servizi.
5. Rendere visibili i breadcrumb e ampliare il linking contestuale.
6. Ottimizzare title, descrizioni e immagini social per intent e pagina.
7. Correggere la semantica di `lastModified` nella sitemap.

---

## 2. Metodo e limiti

Sono stati eseguiti:

- inventario di tutte le route App Router e dei parametri statici;
- lettura di layout, pagine, componenti, dati, configurazione SEO, robots e sitemap;
- build Next.js di produzione;
- ESLint;
- crawl HTTP locale di tutte le 18 URL pubbliche e di una URL inesistente;
- estrazione dall’HTML finale di title, description, canonical, robots, OG, Twitter, H1–H3, link, immagini e JSON-LD;
- verifica di status code, dimensione HTML e TTFB locale;
- controllo dei pesi degli asset originali e dell’ottimizzazione immagini Next.js.

### Limite Lighthouse e Core Web Vitals

Non sono disponibili Chrome/Chromium, Lighthouse, Puppeteer o Playwright nell’ambiente. Il tentativo di ottenere Lighthouse temporaneamente è stato bloccato dalle policy di sicurezza dell’ambiente. Di conseguenza:

- **non vengono riportati punteggi Lighthouse simulati o inventati**;
- LCP, INP e CLS non sono dichiarati come “superati” o “falliti”;
- le osservazioni CWV sono rischi tecnici fondati sul codice e sul runtime, non misure RUM;
- TTFB locale e peso trasferito non rappresentano utenti reali, CDN, rete mobile o dispositivo mobile.

Per chiudere il gap di misurazione occorre eseguire Lighthouse mobile sulla build in produzione e affiancarlo ai dati field di Google Search Console/CrUX, idealmente su almeno 28 giorni.

---

## 3. Inventario completo delle pagine

| URL | Status | Rendering | Title | H1 | Canonical | Esito |
|---|---:|---|---|---|---|---|
| `/` | 200 | Statico | Paride Sansò Advisory | Crescita, con una sola regia. | `/` | Da ottimizzare |
| `/chi-siamo` | 200 | Statico | Chi siamo \| Paride Sansò Advisory | Un partner strategico che tiene insieme le competenze. | Autoreferenziale | OK |
| `/servizi` | 200 | Statico | Servizi \| Paride Sansò Advisory | La consulenza giusta, collegata ai tuoi obiettivi. | Autoreferenziale | Da ottimizzare |
| `/servizi/amministrativa` | 200 | SSG | Consulenza amministrativa \| Paride Sansò Advisory | Consulenza amministrativa | Autoreferenziale | OK |
| `/servizi/finanziaria` | 200 | SSG | Consulenza finanziaria \| Paride Sansò Advisory | Consulenza finanziaria | Autoreferenziale | OK |
| `/servizi/strategica` | 200 | SSG | Consulenza strategica \| Paride Sansò Advisory | Consulenza strategica | Autoreferenziale | OK |
| `/servizi/tecnici` | 200 | SSG | Servizi tecnici \| Paride Sansò Advisory | Servizi tecnici | Autoreferenziale | OK |
| `/servizi/project-management` | 200 | SSG | Project management \| Paride Sansò Advisory | Project management | Autoreferenziale | OK |
| `/settori` | 200 | Statico | Settori \| Paride Sansò Advisory | Soluzioni che parlano il linguaggio della tua realtà. | Autoreferenziale | Da ottimizzare |
| `/network` | 200 | Statico | Network professionisti \| Paride Sansò Advisory | Una rete qualificata, coordinata intorno alle tue esigenze. | Autoreferenziale | Da ottimizzare |
| `/contatti` | 200 | Statico | Contatti \| Paride Sansò Advisory | Parliamo della tua prossima priorità. | Autoreferenziale | OK |
| `/blog` | 200 | Statico | Insights \| Paride Sansò Advisory | Idee pratiche per decisioni più solide. | Autoreferenziale | Da ottimizzare |
| `/blog/pianificazione-finanziaria-pmi` | 200 | SSG | 80 caratteri | Pianificazione finanziaria: una guida pratica per le PMI | Autoreferenziale | Critico |
| `/blog/controllo-gestione-crescita` | 200 | SSG | 74 caratteri | Il controllo di gestione come leva per la crescita | Autoreferenziale | Critico |
| `/blog/project-management-riqualificazione` | 200 | SSG | 94 caratteri | Riqualificazione immobiliare: perché il coordinamento fa la differenza | Autoreferenziale | Critico |
| `/privacy-policy` | 200 | Statico | Privacy Policy \| Paride Sansò Advisory | Privacy Policy | Autoreferenziale | OK |
| `/cookie-policy` | 200 | Statico | Cookie Policy \| Paride Sansò Advisory | Cookie Policy | Autoreferenziale | OK |
| `/note-legali` | 200 | Statico | Note Legali \| Paride Sansò Advisory | Note Legali | Autoreferenziale | OK |

La route 404 personalizzata restituisce correttamente `404`.

---

## 4. Registro dei problemi

### SEO-01 — I tre articoli hanno corpo e heading duplicati

- **Gravità:** Critica
- **Priorità:** P0 — immediata
- **Pagine:** tutti i tre URL `/blog/[slug]`
- **Evidenza:** ogni articolo usa gli stessi tre H2 e lo stesso identico paragrafo sotto ciascun H2. Cambiano soltanto title, excerpt, categoria e data.
- **Impatto:** contenuto thin, duplicazione interna, bassa capacità di soddisfare intent differenti, rischio di cannibalizzazione e scarsa autorevolezza tematica. I motori possono scegliere una sola URL, ridurre la frequenza di crawl o non considerare le pagine sufficientemente utili.
- **Soluzione:** creare contenuti originali e sostanziali per ogni articolo, con outline, esempi, dati, FAQ e CTA coerenti con il rispettivo intento. Mantenere un solo URL per ogni intent e consolidare eventuali contenuti sovrapposti.

### SEO-02 — Articoli privi di schema `Article` o `BlogPosting`

- **Gravità:** Alta
- **Priorità:** P1
- **Pagine:** tutti i tre URL `/blog/[slug]`
- **Evidenza:** il JSON-LD contiene soltanto `BreadcrumbList` e lo schema globale dell’organizzazione.
- **Impatto:** minore comprensione di autore, data, headline, immagine, editore e natura editoriale della pagina.
- **Soluzione:** aggiungere `BlogPosting` con almeno `headline`, `description`, `datePublished`, `dateModified`, `author`, `publisher`, `mainEntityOfPage` e immagine assoluta. Usare date ISO 8601 e collegare publisher/organization con `@id`.

### SEO-03 — Home interamente Client Component

- **Gravità:** Alta
- **Priorità:** P1
- **Pagina:** `/`
- **Evidenza:** `PremiumHome` dichiara `"use client"` e comprende l’intera home, incluse grandi sezioni statiche. Importa inoltre Framer Motion e componenti interattivi.
- **Impatto:** maggiore JavaScript da scaricare, analizzare e idratare; rischio su INP e Total Blocking Time, soprattutto su dispositivi mobili.
- **Soluzione:** mantenere la pagina e le sezioni statiche come Server Components. Isolare in piccoli Client Components soltanto animazioni, FAQ e contatori. Valutare animazioni CSS per gli effetti non essenziali.

### SEO-04 — Script Iubenda caricato `beforeInteractive`

- **Gravità:** Alta
- **Priorità:** P1
- **Pagine:** tutte
- **Evidenza:** lo script remoto Iubenda è inserito nel root layout con strategia `beforeInteractive`.
- **Impatto:** dipendenza terza anticipata su ogni pagina, potenziale contesa di rete/CPU con risorse critiche e peggioramento di LCP/INP. L’effetto reale va misurato in Lighthouse e RUM.
- **Soluzione:** verificare se il CMP richieda davvero il caricamento completo prima dell’interattività. Mantenere inline soltanto i default di consenso strettamente necessari e differire il widget quando compatibile con gli obblighi legali.

### SEO-05 — Skip link non funzionante

- **Gravità:** Alta
- **Priorità:** P1
- **Pagine:** tutte
- **Evidenza:** il link “Vai al contenuto principale” punta a `#main-content`, ma l’elemento `<main>` non possiede tale `id`.
- **Impatto:** gli utenti da tastiera e screen reader non possono saltare la navigazione ripetitiva; problema WCAG e segnale di qualità tecnica.
- **Soluzione:** assegnare `id="main-content"` al contenuto principale e verificare focus, scroll e visibilità su tutte le route.

### SEO-06 — Breadcrumb presenti solo nel JSON-LD

- **Gravità:** Media
- **Priorità:** P1
- **Pagine:** servizi e articoli dinamici
- **Evidenza:** esiste `BreadcrumbList`, ma non una navigazione breadcrumb visibile. Le altre pagine non hanno breadcrumb.
- **Impatto:** minore orientamento dell’utente e minori collegamenti gerarchici contestuali; il dato strutturato non riflette un elemento visibile della pagina.
- **Soluzione:** aggiungere breadcrumb HTML accessibili con `<nav aria-label="Breadcrumb">`, link intermedi e `aria-current="page"`. Allineare esattamente markup visibile e JSON-LD.

### SEO-07 — Mancano dati strutturati specifici per i servizi

- **Gravità:** Media
- **Priorità:** P1
- **Pagine:** `/servizi/[slug]`
- **Evidenza:** ogni pagina servizio espone solo `BreadcrumbList` e lo schema globale.
- **Impatto:** l’entità servizio, il provider, l’area servita e la relazione con l’organizzazione non sono esplicitati.
- **Soluzione:** aggiungere schema `Service` con `name`, `description`, `url`, `provider`, `areaServed` e, se realmente disponibile, `serviceType`. Collegare il provider tramite `@id`.

### SEO-08 — Schema globale Organization/ProfessionalService incompleto

- **Gravità:** Media
- **Priorità:** P2
- **Pagine:** tutte
- **Evidenza:** contiene nome, URL, email, telefono, descrizione e `areaServed`, ma non `@id`, logo, immagini, fondatore/persona, `sameAs` o dati aziendali verificabili. Il tipo `ProfessionalService` non è supportato da indirizzo o altre proprietà locali.
- **Impatto:** Knowledge Graph ed entity reconciliation più deboli; possibile ambiguità fra brand e persona.
- **Soluzione:** modellare entità reali e verificabili. Aggiungere `@id`, `logo`, `image`, `founder`/`employee` e profili ufficiali. Usare `ProfessionalService` solo se i relativi dati sono corretti; non inventare indirizzi o recensioni.

### SEO-09 — Title degli articoli troppo lunghi

- **Gravità:** Media
- **Priorità:** P1
- **Pagine:** tre articoli
- **Evidenza:** title finali di 80, 74 e 94 caratteri.
- **Impatto:** elevata probabilità di troncamento o riscrittura in SERP; il brand occupa spazio dopo headline già lunghe.
- **Soluzione:** puntare a title concisi e distintivi, in genere circa 50–60 caratteri utili, mettendo keyword e valore informativo all’inizio. Valutare un template senza brand per headline già lunghe.

### SEO-10 — Title della home poco descrittivo

- **Gravità:** Media
- **Priorità:** P1
- **Pagina:** `/`
- **Evidenza:** il title è soltanto “Paride Sansò Advisory”.
- **Impatto:** non comunica il servizio principale né l’intento commerciale; limita rilevanza e CTR sulle query non branded.
- **Soluzione:** includere proposta di valore e keyword primaria senza keyword stuffing, ad esempio brand + consulenza aziendale/multidisciplinare, coerentemente con il posizionamento reale.

### SEO-11 — Open Graph generico e formato immagine non ottimale

- **Gravità:** Media
- **Priorità:** P2
- **Pagine:** tutte
- **Evidenza:** tutte le route usano la stessa foto `2400×1800` (rapporto 4:3), inclusi articoli e pagine legali; il file originale pesa circa 1,1 MB.
- **Impatto:** anteprime poco distintive, possibili crop sfavorevoli sulle piattaforme che privilegiano circa 1.91:1, trasferimento social più pesante.
- **Soluzione:** creare immagini OG dedicate `1200×630`, compresse e con safe area. Generare immagini dinamiche per gli articoli con titolo e brand. Mantenere alt social specifici della pagina.

### SEO-12 — Tipologia Open Graph non specifica per gli articoli

- **Gravità:** Media
- **Priorità:** P2
- **Pagine:** `/blog/[slug]`
- **Evidenza:** `og:type` rimane `website` per tutti gli URL.
- **Impatto:** le piattaforme non ricevono semantica editoriale e proprietà articolo.
- **Soluzione:** usare Open Graph `article` nelle pagine editoriali e valorizzare date, autore e sezione quando supportato.

### SEO-13 — Internal linking contestuale debole

- **Gravità:** Media
- **Priorità:** P1
- **Pagine:** articoli, servizi, settori
- **Evidenza:** gli articoli sono raggiungibili dal listing, ma non collegano servizi, altri approfondimenti o pagine settoriali. Le pagine servizio hanno essenzialmente CTA verso contatti. Le card settori rimandano tutte alla stessa pagina generica.
- **Impatto:** distribuzione meno efficace di PageRank interno, cluster tematici deboli e percorsi utente poco profondi.
- **Soluzione:** aggiungere link editoriali pertinenti tra articoli e servizi, sezioni “servizi correlati” e “approfondimenti correlati”, anchor descrittive e link dalle pagine settore verso la soluzione effettivamente rilevante.

### SEO-14 — Sitemap con `lastModified` artificiale

- **Gravità:** Media
- **Priorità:** P1
- **Pagine:** tutte
- **Evidenza:** ogni URL riceve `new Date()` durante la build, quindi tutte risultano modificate nello stesso momento a ogni deploy. Anche `changeFrequency` e priorità sono quasi uniformi.
- **Impatto:** segnale di freschezza non affidabile; i crawler possono ignorare `lastmod`.
- **Soluzione:** usare la data reale dell’ultima modifica per contenuti e pagine. Omettere `lastModified` quando il dato non è disponibile. Differenziare o omettere `changeFrequency`/`priority`; non assegnare alle pagine legali la stessa priorità delle landing commerciali.

### SEO-15 — Semantica heading incoerente nel listing servizi

- **Gravità:** Bassa
- **Priorità:** P2
- **Pagine:** `/servizi` e home
- **Evidenza:** i titoli delle card sono H3. Su `/servizi` non esiste un H2 che introduca gerarchicamente la griglia, quindi si passa da H1 a H3.
- **Impatto:** outline meno chiaro per tecnologie assistive e parser.
- **Soluzione:** introdurre un H2 descrittivo per la sezione oppure parametrizzare le card affinché usino H2 nel listing e H3 quando realmente annidate sotto un H2.

### SEO-16 — Heading principali di alcune landing poco orientati alla query

- **Gravità:** Bassa
- **Priorità:** P2
- **Pagine:** `/servizi`, `/settori`, `/network`, `/blog`
- **Evidenza:** gli H1 sono prevalentemente payoff (“La consulenza giusta…”, “Soluzioni che parlano…”), mentre la keyword esplicita è relegata a eyebrow o title.
- **Impatto:** minore immediatezza semantica, pur senza violazioni tecniche.
- **Soluzione:** integrare naturalmente il tema principale nell’H1, conservando il tono di brand; ad esempio “Servizi di consulenza…” o “Consulenza per PMI e hospitality”.

### SEO-17 — Errori form non collegati semanticamente ai campi

- **Gravità:** Media
- **Priorità:** P1
- **Pagina:** `/contatti`
- **Evidenza:** i messaggi di errore sono paragrafi visivi senza `id`; gli input non espongono `aria-invalid` o `aria-describedby`. I campi obbligatori non hanno `required`/`aria-required`. Gli errori generali usano `role="status"` anche in caso di fallimento.
- **Impatto:** utenti con screen reader possono non associare errore e controllo; esperienza e conversione peggiori.
- **Soluzione:** aggiungere associazioni esplicite, stati invalidi, indicazione accessibile dei campi richiesti e `role="alert"` per errori bloccanti. Spostare il focus sul riepilogo o sul primo errore.

### SEO-18 — Accordion FAQ senza relazione esplicita controllo/pannello

- **Gravità:** Bassa
- **Priorità:** P2
- **Pagina:** `/`
- **Evidenza:** i pulsanti hanno `aria-expanded`, ma non `aria-controls`; i pannelli non hanno `id`, `role="region"` o `aria-labelledby`.
- **Impatto:** il componente resta utilizzabile, ma la relazione semantica è incompleta.
- **Soluzione:** assegnare ID stabili a pulsanti e pannelli e collegarli con `aria-controls`/`aria-labelledby`.

### SEO-19 — Gestione focus del menu mobile incompleta

- **Gravità:** Bassa
- **Priorità:** P2
- **Pagine:** tutte
- **Evidenza:** il menu viene inserito/rimosso, ma non risulta gestione del focus, chiusura con Escape o ritorno del focus al trigger.
- **Impatto:** navigazione meno prevedibile per tastiera e screen reader.
- **Soluzione:** gestire focus iniziale, Escape e restituzione del focus; verificare ordine di tab e annunci del menu.

### SEO-20 — URL e naming non completamente coerenti con la lingua

- **Gravità:** Bassa
- **Priorità:** P3
- **Pagine:** `/network`, `/blog`
- **Evidenza:** il sito è italiano, ma usa `/network`; la sezione è chiamata “Insights” nell’interfaccia e `/blog` nell’URL.
- **Impatto:** lieve incoerenza semantica e di aspettativa, non un problema tecnico grave.
- **Soluzione:** scegliere una tassonomia stabile e comprensibile. Se si cambia URL, predisporre redirect permanenti, canonical aggiornati, link interni e sitemap; non cambiare URL solo per ragioni cosmetiche.

### SEO-21 — Monitoraggio Web Vitals non implementato

- **Gravità:** Media
- **Priorità:** P1
- **Pagine:** tutte
- **Evidenza:** è presente il page tracking GA4, ma non `useReportWebVitals` o una pipeline equivalente per LCP, INP e CLS.
- **Impatto:** assenza di diagnostica field per route, dispositivo e release; regressioni prestazionali possono passare inosservate.
- **Soluzione:** inviare Web Vitals a un endpoint analytics con attributi di route e release, rispettando il consenso. Usare Search Console/CrUX come riferimento primario per l’esito CWV.

### SEO-22 — Header `X-Powered-By` esposto

- **Gravità:** Bassa
- **Priorità:** P3
- **Pagine:** tutte
- **Evidenza:** il runtime restituisce `X-Powered-By: Next.js`.
- **Impatto:** nessun impatto SEO diretto; lieve information disclosure.
- **Soluzione:** disabilitare `poweredByHeader` in configurazione. Intervento di hardening, non prioritario per ranking.

### SEO-23 — Meta description corte e poco differenziate

- **Gravità:** Bassa
- **Priorità:** P2
- **Pagine:** soprattutto contatti e servizi
- **Evidenza:** le description sono uniche ma comprese fra 59 e 95 caratteri; molte descrivono genericamente il servizio senza beneficio, destinatario o differenziante.
- **Impatto:** opportunità CTR non sfruttata; Google può riscrivere lo snippet. Non esiste una lunghezza obbligatoria.
- **Soluzione:** scrivere snippet unici orientati a intent e valore, generalmente entro lo spazio utile della SERP, senza forzare una soglia rigida.

---

## 5. Metadata, Open Graph, Twitter e canonical

### Copertura

Tutte le 18 pagine:

- hanno un title;
- hanno una meta description;
- hanno canonical assoluto e autoreferenziale;
- espongono `robots: index, follow`;
- hanno `og:title`, `og:description`, `og:url`, `og:image`, locale e site name;
- hanno Twitter Card `summary_large_image`, title, description e immagine;
- dichiarano `lang="it"`;
- ereditano correttamente `metadataBase`.

Non sono state rilevate duplicazioni esatte di title, description o canonical fra le 18 pagine.

### Lunghezze title articoli

| URL | Caratteri title | Valutazione |
|---|---:|---|
| `/blog/pianificazione-finanziaria-pmi` | 80 | Troppo lungo |
| `/blog/controllo-gestione-crescita` | 74 | Troppo lungo |
| `/blog/project-management-riqualificazione` | 94 | Troppo lungo |

### Note positive

- URL canonical coerenti, HTTPS e senza trailing slash.
- OG URL allineati ai canonical.
- L’immagine social ha URL assoluto, dimensioni e alt.
- Google verification è presente.

---

## 6. H1, H2 e H3

### Risultato

- Un solo H1 su ogni pagina.
- Nessun H1 mancante o duplicato.
- Gli articoli hanno una struttura H1 → H2 formalmente corretta.
- Le pagine legali hanno struttura H1 → H2 corretta.
- Non sono stati rilevati H3 orfani, eccetto la scelta delle card servizio descritta in SEO-15.

### Criticità semantiche

- gli H2 degli articoli sono identici su tutte le pagine;
- molti H2 dei servizi sono boilerplate ripetuto;
- alcuni H1 commerciali sono eleganti ma poco espliciti rispetto alla query target;
- il titolo “Il progetto è tuo…” nella home è un paragrafo visivamente importante, non un heading: scelta accettabile solo se non introduce una sezione autonoma.

---

## 7. Sitemap e robots

### Sitemap

`/sitemap.xml` restituisce `200` e include tutte le 18 URL pubbliche:

- home;
- pagine istituzionali;
- listing servizi e blog;
- cinque servizi;
- tre articoli;
- contatti e pagine legali.

Non contiene la 404 né URL tecniche. Le URL usano HTTPS e host coerente.

Problema principale: `lastModified` è impostato al momento della build per tutte le pagine, non alla reale data di modifica.

### Robots

`/robots.txt` restituisce:

```text
User-Agent: *
Allow: /

Sitemap: https://sansoadvisory.it/sitemap.xml
```

La configurazione è valida per un sito pubblico. Non sono rilevate aree private o parametri che richiedano `Disallow`. Prima del go-live va verificato che ambienti staging o preview non usino la stessa policy indicizzabile.

---

## 8. JSON-LD e Schema.org

### Schema rilevati

| Schema | Dove | Valutazione |
|---|---|---|
| `Organization` + `ProfessionalService` | Tutte le pagine | Valido come base, incompleto |
| `FAQPage` | Home | Contenuto allineato alla FAQ visibile |
| `BreadcrumbList` | Servizi dinamici | Corretto ma breadcrumb non visibile |
| `BreadcrumbList` | Articoli | Corretto ma breadcrumb non visibile |
| `BlogPosting`/`Article` | Assente | Da aggiungere |
| `Service` | Assente | Da aggiungere |

Gli script JSON-LD rilevati sono JSON sintatticamente parsabile. I valori correnti provengono da dati statici controllati; per futuri contenuti esterni/CMS va mantenuta la sanitizzazione del carattere `<` indicata dalla documentazione Next.js.

Il markup FAQ aiuta la comprensione della pagina, ma non va assunto che generi un rich result: l’idoneità e la visualizzazione dipendono dalle policy correnti di Google.

---

## 9. Internal linking e breadcrumb

### Aspetti positivi

- tutte le pagine sono raggiungibili tramite navbar, footer, listing o card;
- i cinque servizi sono linkati da home, `/servizi` e footer;
- i tre articoli sono linkati dal listing blog;
- anchor principali sono descrittive;
- i link interni usano `next/link`;
- non sono emersi link interni verso route inesistenti nell’inventario.

### Aspetti da migliorare

- assenza di breadcrumb visibili;
- articoli senza link contestuali verso servizi o contenuti correlati;
- servizi senza link verso articoli/settori correlati;
- card di otto settori tutte dirette a `/settori`, senza destinazioni verticali;
- nessuna sezione “articoli correlati” o “servizi correlati”.

---

## 10. Immagini e alt text

### Immagini di contenuto

| Immagine | Uso | Alt | Esito |
|---|---|---|---|
| `hero-advisory.jpg` | Hero home | “Professionisti durante un incontro di consulenza strategica” | Adeguato |
| `service-advisory.jpg` | Sezione editoriale home | “Consulenza strategica e analisi di progetto” | Adeguato |
| Immagini card servizi | Sfondo decorativo con testo sovrapposto | `alt=""` | Corretto |
| Immagini card settori | Sfondo decorativo con testo sovrapposto | `alt=""` | Corretto |

`next/image` è usato per le immagini della UI, con `fill` e `sizes`. La hero usa `priority`, utile per il potenziale elemento LCP. Le immagini originali sono progressive JPEG:

- hero: `2400×1800`, circa **1,1 MB**;
- service: `1800×1200`, circa **303 KB**.

La risposta ottimizzata locale della hero a 1920 px è risultata circa **357 KB JPEG**. È consigliabile verificare AVIF/WebP, qualità percepita e dimensione effettivamente selezionata su mobile.

---

## 11. Performance, Core Web Vitals e Lighthouse

### Evidenze misurate

- Build produzione: superata.
- TypeScript: superato.
- ESLint: superato.
- 23 output statici generati da Next.js, comprese route metadata e 404.
- Tutte le pagine applicative: statiche o SSG.
- TTFB locale sulle 18 route: circa **2,9–9,0 ms**.
- HTML home: circa **78 KB non compresso**, circa **12 KB trasferiti con compressione**.
- Cache della home nel runtime verificato: `HIT`, `s-maxage=31536000`.

Questi dati confermano un backend locale rapido, ma non misurano CDN, rete, main thread o rendering visivo.

### Valutazione CWV per metrica

| Metrica | Stato | Rischi/elementi positivi |
|---|---|---|
| LCP | Non misurato | Hero `priority` e prerendering positivi; immagine grande e script terzo anticipato sono rischi |
| INP | Non misurato | Home interamente client e Framer Motion aumentano JS/idratazione |
| CLS | Non misurato | `next/image fill` con contenitori dimensionati e font Next riducono il rischio |
| TTFB | Ottimo in locale | Non rappresentativo della produzione reale |

### Piano di verifica Lighthouse

Eseguire almeno:

1. Lighthouse mobile in incognito su `/`, `/servizi/finanziaria`, `/blog/pianificazione-finanziaria-pmi` e `/contatti`;
2. tre run per pagina, usando la mediana;
3. test con cache fredda e consenso non espresso;
4. test separato dopo interazione con il CMP;
5. controllo di Performance, Accessibility, Best Practices e SEO;
6. confronto con PageSpeed Insights e Search Console CWV.

Target di qualità consigliati:

- Lighthouse Performance ≥ 90 come obiettivo lab, non come sostituto dei field data;
- LCP ≤ 2,5 s al 75° percentile;
- INP ≤ 200 ms al 75° percentile;
- CLS ≤ 0,1 al 75° percentile.

---

## 12. Accessibilità

### Aspetti positivi

- documento in italiano con `lang="it"`;
- landmark `header`, `nav`, `main`, `footer`;
- un solo H1 per pagina;
- link logo e icone funzionali con nomi accessibili;
- pulsante menu con `aria-label`, `aria-expanded` e `aria-controls`;
- FAQ con pulsanti reali e `aria-expanded`;
- `prefers-reduced-motion` gestito in CSS e nei componenti Framer Motion;
- immagini decorative con alt vuoto;
- input avvolti da label visibili;
- focus style presente sui principali controlli;
- status del form annunciato.

### Problemi

I problemi principali sono SEO-05, SEO-17, SEO-18 e SEO-19. Occorre inoltre verificare con axe/Lighthouse:

- contrasto delle varianti `text-white/50`, `text-white/60` e testo su immagini;
- focus visibile su tutti i link del footer e sulle card;
- target size e sovrapposizione del pulsante WhatsApp;
- zoom al 200–400%;
- comportamento del CMP con tastiera e screen reader;
- ordine di lettura delle card animate.

---

## 13. URL SEO-friendly

### Esito positivo

- URL brevi, minuscole e con trattini;
- nessun parametro, ID numerico o estensione;
- gerarchia chiara per servizi e articoli;
- canonical e sitemap coerenti;
- nessun trailing slash duplicato rilevato.

### Opportunità

- `/network` non è italiano;
- `/blog` e label “Insights” usano tassonomie diverse;
- `/servizi/tecnici` è comprensibile ma meno descrittivo di un eventuale slug “servizi-tecnici”.

Non è consigliato cambiare URL già pubblicate senza evidenza di beneficio. Qualunque migrazione deve includere redirect `301`, aggiornamento link, canonical e sitemap.

---

## 14. Keyword cannibalization

### Cannibalizzazione confermata/probabile

| Cluster | URL coinvolte | Rischio | Motivo |
|---|---|---:|---|
| Contenuti editoriali generici su crescita/decisioni | Tutti i tre articoli | Alto | Corpo e H2 identici |
| Project management/riqualificazione | Articolo e `/servizi/project-management` | Medio | Temi vicini, ma nessuna chiara relazione hub/spoke |
| Pianificazione finanziaria | Articolo e `/servizi/finanziaria` | Medio | Intent informativo e commerciale distinguibili, ma contenuto articolo insufficiente |
| Consulenza generale | Home, `/servizi`, `/chi-siamo` | Basso | Intent diversi, ma title/H1 possono essere meglio differenziati |

### Mappa intent consigliata

| URL | Intent primario |
|---|---|
| `/` | Brand + consulenza multidisciplinare/aziendale |
| `/servizi` | Hub dei servizi di consulenza |
| `/servizi/[slug]` | Intent commerciale specifico |
| `/settori` | Consulenza per tipologia di cliente/settore |
| `/chi-siamo` | Brand, metodo, fiducia |
| `/blog/[slug]` | Intent informativo specifico |
| `/contatti` | Navigazionale e conversione |

Gli articoli devono supportare le landing commerciali con link contestuali, non replicarne il contenuto o competere sullo stesso intento transazionale.

---

## 15. Duplicazioni

### Duplicazioni critiche

- tre articoli con lo stesso corpo;
- tre articoli con gli stessi tre H2.

### Boilerplate accettabile ma da monitorare

- CTA finale identica su più pagine;
- due H2 identici su tutte le pagine servizio;
- schema Organization globale;
- navbar e footer;
- descrizione standard ripetuta su tutte le card della pagina settori.

Navbar, footer e CTA sono boilerplate fisiologico. Diventano un problema quando il contenuto unico della pagina è troppo ridotto, come accade soprattutto negli articoli e, in misura minore, nelle landing servizio.

---

## 16. Elementi conformi

Non richiedono interventi urgenti:

- tutte le pagine previste rispondono correttamente;
- 404 restituisce status corretto;
- sito interamente prerenderizzato;
- un solo H1 per pagina;
- title, description, canonical, robots, OG e Twitter presenti ovunque;
- canonical unici e autoreferenziali;
- robots valido e sitemap dichiarata;
- sitemap completa;
- nessuna duplicazione esatta di title o description;
- `next/image` usato correttamente nella UI;
- alt delle immagini di contenuto presenti e immagini decorative escluse;
- favicon presente;
- font gestito tramite `next/font`;
- supporto a reduced motion;
- JSON-LD sintatticamente valido;
- FAQ visibile coerente con FAQPage;
- URL generalmente pulite e stabili;
- build ed ESLint senza errori.

---

## 17. Roadmap consigliata

### P0 — immediata

- Riscrivere i tre articoli con contenuti unici e intent distinti.

### P1 — prima del go-live o nel prossimo sprint

- Correggere lo skip link.
- Aggiungere schema BlogPosting e Service.
- Rendere visibili i breadcrumb.
- Ridurre il perimetro Client Component della home.
- Valutare/differire lo script CMP.
- Correggere accessibilità e gestione errori del form.
- Ampliare internal linking contestuale.
- Usare date reali nella sitemap.
- Accorciare i title degli articoli.
- Rendere il title home descrittivo.
- Implementare monitoraggio Web Vitals.

### P2 — sprint successivo

- Immagini OG dedicate e formato 1200×630.
- Open Graph `article`.
- Arricchire schema Organization.
- Migliorare H1 e description delle landing.
- Correggere gerarchia H2/H3 del listing servizi.
- Rafforzare semantica FAQ e focus del menu mobile.
- Verificare contrasto e accessibilità con Lighthouse/axe.

### P3 — manutenzione

- Uniformare naming `/network`/`Insights` solo se giustificato.
- Disabilitare `X-Powered-By`.

---

## 18. Criteri di accettazione post-intervento

- nessun articolo con paragrafi o outline duplicati;
- ogni articolo con `BlogPosting` validato;
- ogni servizio con schema `Service` validato;
- breadcrumb visibili e coerenti con JSON-LD;
- skip link funzionante su tutte le route;
- form utilizzabile e comprensibile con screen reader;
- title articoli non soggetti a troncamento sistematico;
- sitemap con date reali o senza `lastModified`;
- home con contenuto statico prevalentemente server-rendered e idratazione limitata;
- nessun errore nel Rich Results Test/Schema Markup Validator;
- Lighthouse mobile misurato e archiviato per le route campione;
- CWV field al 75° percentile entro LCP 2,5 s, INP 200 ms e CLS 0,1;
- nessun nuovo link interno rotto;
- canonical, OG URL e sitemap sempre allineati all’host di produzione.

---

## Conclusione

L’implementazione tecnica di base è buona e già superiore a molti siti corporate: crawlability, prerendering, metadata, canonical e asset handling sono corretti. Il limite maggiore non è l’indicizzabilità, ma la qualità semantica ed editoriale. La priorità deve essere trasformare gli articoli da template duplicati a risorse realmente utili, quindi ridurre i rischi performance/accessibilità e arricchire la struttura dei dati e dei link interni. Solo dopo questi interventi ha senso ottimizzare dettagli minori come naming delle URL o hardening degli header.
