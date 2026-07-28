# Release Report — v1.2

Data: 28 luglio 2026. Branch: `develop`. Stato: release candidate non distribuita.

## Riepilogo modifiche

La v1.2 consolida l’architettura editoriale e SEO realizzata nel Master Sprint: 14 pagine competenza, 6 pagine settore, 6 articoli completi, internal linking bidirezionale, breadcrumb visibili, dati strutturati, sitemap ampliata, LinkedIn centralizzato, accessibilità di base e redirect permanenti. Analytics, consenso, form, SMTP, Docker e rete proxy sono preservati.

Questo commit di release aggiunge esclusivamente documentazione operativa: `RELEASE_CHECKLIST.md` e `RELEASE_REPORT.md`. Non introduce funzionalità, pagine pubbliche, modifiche a design, SEO, testi o architettura.

## Risultati QA

- Working tree pulito prima della documentazione di release.
- Branch `develop`; commit applicativo `245acd0cc793fab7c3e1fe8b9897d3697b973101`.
- `git diff --check`: superato.
- ESLint: superato senza errori.
- TypeScript: superato senza errori.
- Build Next.js: superata, 46 pagine generate.
- Docker Compose config: valida.
- Docker build senza cache: superata durante il Master Sprint sul medesimo commit applicativo.
- Crawl release candidate isolata: 41/41 URL HTTP 200.
- Link interni: 42/42 destinazioni valide.
- 404: HTTP 404.
- Vecchi slug e host www: redirect HTTP 308 nell’immagine della release candidate.
- Sito pubblico attuale, sitemap e robots: HTTP 200.
- Nessun HTTP 500 o 502 rilevato.
- GA4, Consent Mode v2, Iubenda, recapiti, LinkedIn, JSON-LD e breadcrumb presenti.

## Problemi rimasti

1. La release candidate non è ancora distribuita: la sitemap pubblica contiene 18 URL, quella candidata 41.
2. Le fotografie attuali sono locali ma temporanee e riutilizzate; le immagini definitive non bloccano il funzionamento.
3. Le informative legali richiedono validazione professionale con i dati completi del titolare.
4. `npm audit --omit=dev` segnala tre vulnerabilità alte transitive in PostCSS/Sharp tramite Next.js. Il fix automatico propone un downgrade breaking e non è stato applicato.
5. Non sono disponibili misure Lighthouse/CrUX né dati Search Console e GA4 dal pannello.
6. Il precedente errore isolato `Server Reference ID did not match the expected format` non è stato riprodotto e non compare nei log recenti.

## Rischio residuo

Rischio operativo basso per build, routing, collegamenti e container. Rischio medio per il primo deploy a causa dell’aumento delle URL, dei redirect host/path e della necessità di verificare integrazioni consent/analytics in un browser reale. Rischio separato sulle dipendenze transitive, da gestire con un aggiornamento ufficiale compatibile e testato, senza `npm audit fix --force`.

## Monitoraggio dopo il deploy

- HTTP 200/404/308 e assenza 500/502 nei primi 30–60 minuti.
- Log applicativi e Nginx Proxy Manager.
- Redirect `www` → non-www e vecchi slug.
- Sitemap da 41 URL e robots sul dominio pubblico.
- Indicizzazione e canonical in Search Console.
- GA4 page view iniziale e navigazioni client-side.
- Comportamento Iubenda e aggiornamento Consent Mode per accetta/rifiuta/personalizza.
- Invio form concordato, ricezione SMTP e rate limit.
- WhatsApp, telefono, email e LinkedIn da desktop/mobile.
- LCP, CLS e INP con Lighthouse mobile e dati field quando disponibili.

## Attività previste da lunedì

1. Revisione editoriale e legale finale.
2. Approvazione esplicita del deploy.
3. Deploy controllato e smoke test immediato.
4. Invio sitemap e ispezione URL prioritarie in Search Console.
5. Controllo eventi GA4/Iubenda e test form concordato.
6. Pianificazione aggiornamento sicuro delle dipendenze segnalate.
7. Avvio del piano immagini e del piano SEO settimanale già documentati.

## Decisione di rilascio

Release candidate pronta per revisione. Nessun deploy, merge su `main` o tag deve essere eseguito prima dell’approvazione esplicita.
