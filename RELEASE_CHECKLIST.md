# Release Checklist — Paride Sansò Advisory v1.2

Data verifica: 28 luglio 2026. Stato: release candidate pronta per revisione, non distribuita.

## Repository

- [x] Branch: `develop`.
- [x] Ultimo commit applicativo verificato: `245acd0cc793fab7c3e1fe8b9897d3697b973101` — `Paride Sansò Advisory v1.2 SEO Authority Sprint`.
- [x] Working tree pulito prima della generazione dei soli documenti di release.
- [x] Branch locale avanti di un commit rispetto a `origin/develop` prima del commit di release.
- [x] `.env` ignorato, non tracciato e non incluso.
- [x] Nessun merge su `main`, tag o deploy eseguito.

## Pagine

### Pagine principali e legali

- [x] `/`
- [x] `/chi-siamo`
- [x] `/servizi`
- [x] `/network`
- [x] `/settori`
- [x] `/blog`
- [x] `/contatti`
- [x] `/privacy-policy`
- [x] `/cookie-policy`
- [x] `/note-legali`
- [x] `/sitemap.xml`
- [x] `/robots.txt`
- [x] Pagina 404: status HTTP 404 corretto.

### Servizi

- [x] `/servizi/amministrativa` — Consulenza amministrativa
- [x] `/servizi/finanziaria` — Consulenza finanziaria
- [x] `/servizi/strategica` — Consulenza strategica
- [x] `/servizi/tecnici` — Servizi tecnici
- [x] `/servizi/project-management` — Project management

### Competenze

- [x] `/competenze/controllo-di-gestione`
- [x] `/competenze/business-plan`
- [x] `/competenze/budget-aziendale`
- [x] `/competenze/analisi-dei-costi`
- [x] `/competenze/pianificazione-finanziaria`
- [x] `/competenze/cash-flow`
- [x] `/competenze/organizzazione-aziendale`
- [x] `/competenze/ottimizzazione-dei-processi`
- [x] `/competenze/riorganizzazione-aziendale`
- [x] `/competenze/project-management`
- [x] `/competenze/facility-management`
- [x] `/competenze/nuove-attivita-e-startup`
- [x] `/competenze/digitalizzazione-dei-processi`
- [x] `/competenze/procedure-amministrative`

### Settori

- [x] `/settori/pmi` — PMI
- [x] `/settori/ristorazione-hospitality` — Ristorazione, Bar, Hotel e Hospitality
- [x] `/settori/attivita-commerciali` — Attività commerciali
- [x] `/settori/studi-professionali` — Studi professionali
- [x] `/settori/condomini` — Condomini
- [x] `/settori/privati` — Privati

### Articoli

- [x] `/blog/controllo-di-gestione-pmi-redditivita`
- [x] `/blog/business-plan-cosa-contiene-quando-serve`
- [x] `/blog/consulenza-aziendale-ristoranti-costi-margini`
- [x] `/blog/cash-flow-aziendale-monitorare-liquidita`
- [x] `/blog/analisi-dei-costi-sprechi-margini`
- [x] `/blog/project-management-riqualificazione`

## SEO

Verifica automatica eseguita sulle 41 URL della sitemap della release candidate:

- [x] Esattamente un H1 per pagina HTML.
- [x] Title presente.
- [x] Meta description presente.
- [x] Canonical assoluto non-www presente.
- [x] Open Graph presente.
- [x] Twitter Card presente.
- [x] `metadataBase` configurato su `https://sansoadvisory.it`.
- [x] FAQ visibili e `FAQPage` sulle pagine previste.
- [x] `Organization` e `ProfessionalService` globali.
- [x] `Service`, `Article`, `FAQPage` e `BreadcrumbList` sulle pagine pertinenti.
- [x] Breadcrumb visibile e navigabile sulle pagine di dettaglio.
- [x] Sitemap release candidate: 41 URL, tutte HTTP 200 nel container isolato.
- [x] Robots generato e collegato alla sitemap.
- [x] Redirect permanenti dei vecchi articoli e host www verificati HTTP 308 nel container isolato.

## Link

- [x] WhatsApp presente e corretto.
- [x] Telefono `tel:` presente in header, Contatti e footer.
- [x] Email `mailto:` presente in Contatti e footer.
- [x] LinkedIn aziendale presente in Contatti, footer e `sameAs` JSON-LD.
- [x] Link esterni con `noopener noreferrer`.
- [x] Footer: servizi, società, contatti e pagine legali.
- [x] Header: navigazione desktop/mobile, telefono e CTA.
- [x] CTA iniziali, contestuali e finali presenti.
- [x] 42 destinazioni interne uniche verificate; nessun link rotto.
- [x] Skip link collegato a `main-content`.

## Immagini

### Utilizzate

- [x] `public/images/hero-advisory.jpg` — 2400×1800, immagine hero e articoli finanziari.
- [x] `public/images/service-advisory.jpg` — 1800×1200, servizi e articoli gestionali/tecnici.
- [x] `app/favicon.ico` — favicon.

### Ancora mancanti o temporanee

- [ ] Hero definitiva WebP/AVIF.
- [ ] Immagine dedicata Chi siamo/metodo.
- [ ] Immagini dedicate per PMI e Hospitality.
- [ ] Immagini specifiche per i sei articoli.
- [ ] Immagine social predefinita 1200×630.
- [ ] Gli asset e i requisiti sono dettagliati in `IMAGE_PLAN.md`; non bloccano tecnicamente la release.

## Docker

- [x] `docker compose config --quiet` superato.
- [x] `docker compose build --no-cache` superato sul codice della release candidate.
- [x] Immagine standalone Next.js avviata e verificata in un container isolato.
- [x] Container pubblico attuale in esecuzione.
- [x] Rete di progetto `paride-advisory_default` collegata.
- [x] Rete Docker esterna `proxy` collegata.
- [x] Nginx Proxy Manager non modificato.
- [x] Nessun `docker compose up -d` della release candidate: deploy non autorizzato.

## Dominio

- [x] `https://sansoadvisory.it` — HTTP 200.
- [x] `https://sansoadvisory.it/sitemap.xml` — HTTP 200.
- [x] `https://sansoadvisory.it/robots.txt` — HTTP 200.
- [x] Nessun HTTP 500 o 502 nei controlli correnti e nei log recenti.
- [!] Il dominio pubblico serve ancora la versione precedente: sitemap pubblica da 18 URL contro 41 nella release candidate.

## Analytics

- [x] GA4 presente nella release candidate.
- [x] Google Consent Mode v2 con consensi facoltativi negati per impostazione predefinita.
- [x] Iubenda presente con widget configurato.
- [x] Google Search Console verification preservata.
- [ ] Verifica eventi reali in GA4 e scelte nel pannello Iubenda da eseguire dopo deploy con browser e accesso ai servizi esterni.

## Esito

- [x] Release candidate tecnicamente stabile nei test disponibili.
- [x] Pronta per revisione e approvazione al deploy.
- [ ] Push su `origin/develop` da confermare.
- [ ] Deploy produzione da eseguire solo dopo approvazione esplicita.
