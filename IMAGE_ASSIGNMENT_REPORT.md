# Image Assignment Report

## Inventario originale

Tutti i file rilevati in `public/images/home/` sono PNG RGB non interlacciati, misurano **1672 × 941 px** e hanno rapporto **1,777:1 (circa 16:9)**.

| File originale | Estensione | Dimensioni | Rapporto | Peso | Contenuto visivo approssimativo |
|---|---:|---:|---:|---:|---|
| `00D1422F-E4DE-44B4-802B-40DCCC91F88C.png` | PNG | 1672 × 941 px | 1,777:1 | 1.733.962 B | Due professionisti al tavolo; uno compila o firma un documento |
| `0A36E3E3-1970-4CAF-AE2B-781EC3D0592C.png` | PNG | 1672 × 941 px | 1,777:1 | 2.017.601 B | Riunione di tre professionisti con laptop, documenti e grafici |
| `0AC0B09F-8BF4-45DF-A0F1-3DA4F201D87D.png` | PNG | 1672 × 941 px | 1,777:1 | 2.078.287 B | Ufficio direzionale contemporaneo con scrivania e skyline |
| `1A1F6AC5-4875-46A0-9689-57F857B936AA.png` | PNG | 1672 × 941 px | 1,777:1 | 1.884.771 B | Area lounge di un ufficio moderno, con quaderno e penna in primo piano |
| `24A7EF0E-5C07-41CC-893F-95EB9BC58D85.png` | PNG | 1672 × 941 px | 1,777:1 | 1.878.820 B | Analisi di dashboard e grafici con calcolatrice, laptop e report |
| `2508E4AA-05CA-40B3-962C-235261FB67B4.png` | PNG | 1672 × 941 px | 1,777:1 | 1.866.083 B | Primo piano di report finanziari, grafici e annotazioni a penna |
| `2D2D5B4B-1287-4C54-A9EA-734F5613A3A7.png` | PNG | 1672 × 941 px | 1,777:1 | 1.968.943 B | Sala riunioni attrezzata, luminosa e ordinata |
| `2FEBDAB9-F014-4649-9820-573CF258416A.png` | PNG | 1672 × 941 px | 1,777:1 | 1.807.810 B | Professionista che esamina documenti, tabelle e grafici al laptop |
| `53875A7F-240F-4D7F-B986-714497F9A403.png` | PNG | 1672 × 941 px | 1,777:1 | 1.815.626 B | Colloquio professionale tra due consulenti al tavolo |
| `7337A932-B006-4B31-B813-344C7984EBE8.png` | PNG | 1672 × 941 px | 1,777:1 | 1.782.700 B | Professionista al lavoro su quaderno e laptop |
| `A2B50B10-96CF-4E05-ADA7-1311397C7F12.png` | PNG | 1672 × 941 px | 1,777:1 | 1.719.047 B | Professionista in piedi davanti alle vetrate e allo skyline urbano |
| `E59751F4-E78B-42D3-98B4-912D12F9C83C.png` | PNG | 1672 × 941 px | 1,777:1 | 1.719.706 B | Stretta di mano al termine di un incontro professionale |

**Peso originale complessivo:** 22.273.356 B (circa 21,24 MiB).

## Assegnazione ragionata

| File originale | Nuova destinazione | Pagina | Sezione | Alt text | Object position | Crop previsto | Motivazione |
|---|---|---|---|---|---|---|---|
| `A2B50B10-96CF-4E05-ADA7-1311397C7F12.png` | `public/images/home/consulenza-aziendale-visione-strategica.webp` | Home | Hero | `Professionista osserva la città da un ufficio direzionale` | `68% center` | Cover 16:9; taglio verticale controllato sui viewport stretti | È la composizione più ampia, autorevole e aspirazionale; il soggetto resta a destra e lascia spazio leggibile al titolo |
| `7337A932-B006-4B31-B813-344C7984EBE8.png` | `public/images/home/servizi-consulenza-aziendale.webp` | Home | Servizi / punto di contatto | `Consulente al lavoro tra appunti, documenti e computer` | `center center` | Cover 16:9; lieve rifilo laterale | Comunica operatività e presidio quotidiano senza sovrapporsi ai soggetti delle pagine specialistiche |
| `1A1F6AC5-4875-46A0-9689-57F857B936AA.png` | `public/images/home/metodologia-consulenza-ufficio.webp` | Home | Metodologia | `Ambiente di lavoro preparato per un percorso di consulenza` | `center center` | Cover 16:9 | L’ufficio ordinato e il quaderno suggeriscono metodo, preparazione e continuità |
| `0AC0B09F-8BF4-45DF-A0F1-3DA4F201D87D.png` | `public/images/home/chi-siamo-ufficio-direzionale.webp` | Chi siamo | Hero | `Ufficio direzionale di Paride Sansò Advisory` | `58% center` | Cover 16:9; protezione della scrivania centrale | L’ambiente direzionale identifica il posizionamento dello studio senza introdurre persone non nominate |
| `53875A7F-240F-4D7F-B986-714497F9A403.png` | `public/images/home/network-professionisti-riunione.webp` | Network | Hero | `Professionisti a confronto durante una riunione di consulenza` | `center center` | Cover 16:9; lieve rifilo ai bordi | Il confronto tra due interlocutori rappresenta una rete coordinata e una relazione professionale concreta |
| `00D1422F-E4DE-44B4-802B-40DCCC91F88C.png` | `public/images/home/consulenza-amministrativa-documenti.webp` | Consulenza amministrativa | Hero servizio | `Consulenti verificano e compilano documenti amministrativi` | `44% center` | Cover 16:9 | La gestione diretta di un documento è coerente con procedure, flussi e pianificazione amministrativa |
| `2508E4AA-05CA-40B3-962C-235261FB67B4.png` | `public/images/home/consulenza-finanziaria-grafici.webp` | Consulenza finanziaria | Hero servizio | `Analisi di report e grafici per la pianificazione finanziaria` | `58% center` | Cover 16:9 | Grafici, report e annotazioni rendono immediatamente riconoscibile l’ambito finanziario |
| `0A36E3E3-1970-4CAF-AE2B-781EC3D0592C.png` | `public/images/home/consulenza-strategica-riunione.webp` | Consulenza strategica | Hero servizio | `Gruppo di professionisti discute dati e priorità strategiche` | `center center` | Cover 16:9 | La riunione a tre con dati condivisi esprime allineamento, decisione e direzione |
| `24A7EF0E-5C07-41CC-893F-95EB9BC58D85.png` | `public/images/home/controllo-gestione-analisi-dati.webp` | Controllo di gestione | Hero competenza | `Analisi di indicatori economici con dashboard e calcolatrice` | `56% center` | Cover 16:9 | È l’immagine più esplicitamente legata a KPI, calcoli e controllo delle performance |
| `2FEBDAB9-F014-4649-9820-573CF258416A.png` | `public/images/home/business-plan-documenti-finanziari.webp` | Business plan | Hero competenza | `Professionista esamina documenti e proiezioni di un business plan` | `center center` | Cover 16:9 | L’esame congiunto di documenti e grafici comunica costruzione e verifica del piano |
| `2D2D5B4B-1287-4C54-A9EA-734F5613A3A7.png` | `public/images/home/project-management-sala-riunioni.webp` | Project management | Hero servizio e competenza collegata | `Sala riunioni organizzata per il coordinamento di un progetto` | `center center` | Cover 16:9 | La sala attrezzata richiama coordinamento, pianificazione e gestione di più interlocutori |
| `E59751F4-E78B-42D3-98B4-912D12F9C83C.png` | `public/images/home/contatti-incontro-professionale.webp` | Contatti | Hero | `Stretta di mano al termine di un incontro professionale` | `center center` | Cover 16:9 | La stretta di mano è usata soltanto nel punto in cui il visitatore avvia una relazione diretta |

## Note di implementazione

- Conversione prevista in WebP con qualità visiva alta, senza ridimensionare gli originali: dimensioni intrinseche finali **1672 × 941 px**.
- Le immagini responsive useranno `next/image`, rapporto riservato dal contenitore, `object-cover`, `sizes` specifici e caricamento lazy predefinito.
- Solo la fotografia della Home hero avrà priorità/preload.
- L’immagine Open Graph usa il logo aziendale esistente, così le condivisioni WhatsApp mostrano il marchio; favicon e file del logo non vengono modificati.
- Le fotografie nelle card puramente decorative avranno alt vuoto; le fotografie informative avranno gli alt naturali indicati sopra.
