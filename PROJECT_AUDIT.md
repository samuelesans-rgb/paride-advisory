# Project Audit — Master Sprint v1.2

Data: 28 luglio 2026. Branch analizzato: `develop`. Stack: Next.js 16.2.12 App Router, React 19, TypeScript, Tailwind CSS v4, Docker Compose.

## Stato di partenza

- Build, TypeScript, ESLint e configurazione Compose validi.
- Container applicativo attivo sulle reti `paride-advisory_default` e `proxy`.
- Dominio canonico non-www raggiungibile; home, pagine principali, sitemap e robots rispondono 200; 404 corretta.
- `.env` ignorato da Git e dal contesto Docker; nessun segreto tracciato.
- GA4, Consent Mode v2 e widget Iubenda presenti; SMTP configurato.

## Registro problemi

| Gravità | Pagina/file | Problema e impatto | Correzione proposta | Priorità |
|---|---|---|---|---|
| Critica | `app/blog/[slug]`, `lib/site-data.ts` | I tre articoli condividono integralmente corpo e heading: contenuto thin e duplicato. | Pubblicare articoli originali con indice, FAQ, autore, date, linking e Article JSON-LD. | P0 |
| Alta | Architettura | Mancano pagine dedicate per competenze e settori; le query informative non hanno destinazioni utili. | Creare pagine data-driven sostanziali, evitando doorway e duplicazioni. | P0 |
| Alta | `app/layout.tsx`, navbar | Lo skip link punta a un ID assente. | Aggiungere `id="main-content"` e focus coerente. | P0 |
| Alta | `www.sansoadvisory.it` | La variante www risponde 200 invece di reindirizzare al canonico non-www, con rischio duplicazione. | Configurare e verificare un redirect permanente dopo approvazione deploy. | P1 |
| Alta | Articoli | Mancano `Article`/`BlogPosting`, autore e date ISO. | Aggiungere dati strutturati e metadati editoriali. | P1 |
| Media | Servizi/articoli | Breadcrumb presenti solo nel JSON-LD e linking contestuale debole. | Introdurre breadcrumb visibili e link bidirezionali. | P1 |
| Media | `app/sitemap.ts` | `lastModified` artificiale uguale alla build per tutte le URL. | Usare date contenuto reali o omettere il campo. | P1 |
| Media | `components/premium-home.tsx` | Intera home è Client Component: più JS e idratazione del necessario. | Isolare le sole animazioni interattive in una fase dedicata. | P2 |
| Media | Immagini | Solo due fotografie, entrambe riutilizzate; hero 1,15 MB e formato JPEG. | Piano immagini locali WebP/AVIF con dimensioni e soggetti dedicati. | P1 |
| Media | Settori | Card tutte generiche e senza destinazioni dedicate. | Creare pagine settore aggregate, senza duplicare Bar/Hotel/Hospitality. | P1 |
| Media | CTA | Percorsi quasi sempre diretti solo a Contatti, con poca progressione informativa. | Collegare servizi, competenze, settori e articoli prima della CTA. | P1 |
| Bassa | Log applicativi | Precedente errore isolato `Server Reference ID did not match the expected format`, non riprodotto. | Monitorare; nessun workaround senza riproduzione. | P3 |

## Note di sicurezza e compliance

Le attività riservate restano attribuite esclusivamente a professionisti competenti e abilitati. Le pagine legali sono informative e devono essere sottoposte a verifica legale con i dati completi del titolare. Non sono stati inventati clienti, sedi, risultati, recensioni, partnership o qualifiche.
