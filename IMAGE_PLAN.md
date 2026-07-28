# Image Plan

## Inventario attuale

| Pagina/sezione | File e percorso | Dimensione | Rapporto | Alt attuale/previsto | Soggetto e stile | Priorità | Stato |
|---|---|---:|---:|---|---|---|---|
| Home hero, articoli finanza | `public/images/hero-advisory.jpg` | 2400×1800, 1.15 MB | 4:3 | Professionisti durante un incontro di consulenza strategica | Ufficio contemporaneo, luce naturale | Alta | Presente, temporanea |
| Home servizi, card, articoli gestione | `public/images/service-advisory.jpg` | 1800×1200, 309 KB | 3:2 | Analisi di progetto, costi o indicatori | Documenti e laptop, toni sobri | Alta | Presente, temporanea |

## Asset da produrre

| Percorso proposto | Utilizzo | Dimensione/rapporto | Soggetto | Priorità | Stato |
|---|---|---|---|---|---|
| `public/images/hero/home-advisory.webp` | LCP home | 1920×1080, 16:9 | Incontro consulenziale credibile in Italia | P0 | Da produrre |
| `public/images/about/metodo.webp` | Chi siamo | 1600×1067, 3:2 | Tavolo di lavoro, nessun ritratto attribuito | P1 | Da produrre |
| `public/images/services/management.webp` | Gestione/finanza | 1600×1067 | Analisi di dati realistica | P1 | Da produrre |
| `public/images/sectors/hospitality.webp` | Hospitality | 1600×1067 | Back office ristorante/hotel, niente pose stock | P1 | Da produrre |
| `public/images/sectors/pmi.webp` | PMI | 1600×1067 | Riunione operativa business casual | P1 | Da produrre |
| `public/images/blog/*.webp` | Sei articoli | 1600×900, 16:9 | Soggetto specifico per tema | P2 | Da produrre |
| `public/images/social/default-og.webp` | OG default | 1200×630 | Brand navy/oro senza testo generato | P1 | Da produrre |

## Specifiche

Fotografie realistiche ambientate in Italia, luce naturale, persone non identificabili come Paride, abbigliamento business casual, laptop e documenti credibili, nessun logo o testo artificiale. Esportare WebP/AVIF; usare `next/image`, `sizes`, dimensioni o contenitore con aspect ratio, `priority` solo per LCP e lazy loading altrove. Verificare crop a 320 px e assenza CLS.
