# Internal Linking Map

## Regole implementate

- Ogni pagina servizio collega `/servizi`, due servizi correlati, un settore, un articolo, le competenze specifiche e `/contatti`.
- Ogni pagina competenza collega servizio padre, settore, articolo e Contatti.
- Ogni settore collega almeno tre competenze, articolo, Servizi e Contatti.
- Ogni articolo collega pillar, servizio, articolo correlato e Contatti.
- Home collega direttamente i sei hub settore; footer collega i cinque servizi e le pagine legali.

## Cluster

| Cluster | Pillar | Contenuti collegati |
|---|---|---|
| Controllo di gestione | `/competenze/controllo-di-gestione` | analisi costi, budget, articolo redditività PMI, PMI, hospitality |
| Pianificazione finanziaria | `/competenze/pianificazione-finanziaria` | cash flow, business plan, budget, articolo liquidità, PMI |
| Organizzazione aziendale | `/competenze/organizzazione-aziendale` | procedure, processi, riorganizzazione, digitalizzazione, studi professionali |
| Hospitality | `/settori/ristorazione-hospitality` | analisi costi, controllo gestione, budget, articolo ristoranti |
| Progetti e immobili | `/competenze/project-management` | facility management, servizi tecnici, condomini, articolo riqualificazione |

## Verifica

Il controllo automatico finale deve estrarre tutti gli `href` interni dall’HTML generato, verificare status 200 e segnalare pagine senza link interni in ingresso.
