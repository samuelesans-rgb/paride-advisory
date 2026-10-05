import type { FaqItem } from "@/lib/authority-data";

export type ArticleSection = { id: string; title: string; paragraphs: string[]; points?: string[]; link?: { before: string; label: string; href: string; after: string } };
export type Article = {
  slug: string; category: string; title: string; h1?: string; introduction?: string[]; excerpt: string; published: string; updated: string; date: string; readingTime: string;
  image: string; imageAlt: string; pillar: string; service: string; related: string; sections: ArticleSection[]; faqs: FaqItem[];
};

export const articleAuthor = "Paride Sansò Advisory";

export const articles: Article[] = [
  {
    slug: "ottimizzazione-processi-aziendali",
    category: "Processi aziendali",
    title: "Ottimizzazione dei processi aziendali: metodo e KPI",
    "h1": "Ottimizzazione dei processi aziendali",
    excerpt: "Come analizzare i flussi, individuare inefficienze, eliminare attività ridondanti, chiarire responsabilità e misurare tempi e risultati dei processi aziendali.",
    published: "2026-09-30",
    updated: "2026-09-30",
    date: "30 settembre 2026",
    readingTime: "10 min",
    image: "/images/home/metodologia-consulenza-ufficio.webp",
    imageAlt: "Ufficio con area riunioni, sedute e un quaderno di lavoro",
    pillar: "ottimizzazione-dei-processi",
    service: "amministrativa",
    related: "controllo-di-gestione-pmi-redditivita",
    sections: [
      {
        id: "significato",
        title: "Cosa significa ottimizzare un processo aziendale",
        paragraphs: [
          "Ottimizzare significa rendere il flusso più affidabile rispetto al risultato richiesto: una consegna corretta, una fattura completa o una richiesta gestita nei tempi concordati. Si osserva il lavoro dall’inizio alla fine, anche quando attraversa più reparti. Il punto di partenza è una domanda concreta: dove si interrompe il flusso e quali conseguenze produce?",
          "Tagliare un costo non equivale necessariamente a migliorare il processo: eliminare un controllo può aumentare gli errori a valle. Automatizzare accelera un’attività, ma può anche riprodurre una duplicazione. Riorganizzare cambia ruoli e assetti; ottimizzare verifica invece sequenze, passaggi e risultati. Le azioni possono combinarsi, purché rispondano a una criticità osservata e siano verificabili."
        ]
      },
      {
        id: "mappatura",
        title: "Come mappare un processo",
        paragraphs: [
          "Scegli un processo delimitato, con un evento iniziale e un risultato finale riconoscibili. Per esempio, dalla ricezione dell’ordine alla fattura emessa. Raccogli alcuni casi effettivi e confrontali con chi esegue le attività: la procedura dichiarata può essere diversa dal percorso seguito, soprattutto quando mancano informazioni o arrivano urgenze.",
          "Per ogni passaggio annota input, attività, responsabile, output, tempi, dipendenze e controlli. L’input è ciò che permette di iniziare; l’output è ciò che il passaggio successivo deve ricevere. Specifica anche dove si trova l’informazione e come viene trasferita. Una semplice tabella può bastare, se rende leggibili le relazioni tra le attività.",
          "Distingui il tempo di lavorazione dal tempo trascorso in attesa. Registra chi può autorizzare una decisione, quali condizioni bloccano il passaggio e cosa accade nelle eccezioni. Valida la mappa con le persone coinvolte, evitando di trasformarla in una descrizione ideale. Se un dato non è disponibile, segnala la lacuna e organizza una rilevazione circoscritta."
        ]
      },
      {
        id: "inefficienze",
        title: "Come individuare le inefficienze",
        paragraphs: [
          "Le inefficienze emergono confrontando i casi, senza attribuire subito la causa a una persona. Un ordine fermo può dipendere da dati mancanti, priorità incoerenti o un’autorizzazione non disponibile. Per ogni problema chiedi quanto ricorre, dove nasce, chi ne subisce gli effetti e quale evidenza permette di ricostruirlo.",
          "Cerca attività ripetitive senza valore aggiunto, dati inseriti due volte, attese tra funzioni, passaggi inutili e rilavorazioni. Un controllo duplicato non è automaticamente superfluo: verifica quale rischio copre prima di eliminarlo. Gli errori vanno classificati per causa, perché correggere la fattura non risolve necessariamente il problema nell’ordine di partenza.",
          "Un collo di bottiglia limita il flusso complessivo: davanti a quel passaggio si accumulano pratiche, anche se gli altri lavorano velocemente. Responsabilità non definite e dipendenza da una singola persona possono creare blocchi simili. Ordina le criticità per impatto, frequenza e possibilità di intervento; conserva le evidenze che sostengono la priorità scelta."
        ]
      },
      {
        id: "pmi",
        title: "Ottimizzazione dei processi nelle PMI",
        paragraphs: [
          "Nelle PMI molte procedure sono implicite: chi lavora da anni conosce i passaggi, sa a chi chiedere e risolve le eccezioni senza formalizzarle. Questa flessibilità può essere utile, ma rende difficile trasferire il lavoro a un nuovo collega o garantire continuità durante un’assenza. La conoscenza concentrata sulle persone diventa un vincolo quando l’attività cresce.",
          "Un metodo efficace con pochi clienti può perdere affidabilità con più ordini, prodotti o sedi operative. Il titolare non riesce più a verificare ogni dettaglio e le urgenze assorbono il tempo destinato alle decisioni. Controllo e organizzazione diventano progressivamente necessari: poche regole condivise, informazioni reperibili e responsabilità esplicite aiutano a gestire la complessità.",
          "Conviene partire da un flusso con problemi osservabili, coinvolgendo chi lo gestisce. Evita di documentare tutto prima di intervenire: una mappa essenziale, una regola per le eccezioni e pochi indicatori aggiornabili possono essere sufficienti per il primo ciclo di miglioramento. Il sistema va proporzionato alle risorse disponibili e al carico operativo."
        ],
        link: {
          before: "Quando le criticità dei flussi si intrecciano con decisioni economiche e organizzative, la ",
          label: "consulenza per PMI",
          href: "/settori/pmi",
          after: " aiuta a collocare l’intervento sulle priorità complessive dell’impresa."
        }
      },
      {
        id: "responsabilita",
        title: "Procedure e responsabilità",
        paragraphs: [
          "Il processo descrive come un risultato viene prodotto attraverso attività collegate. La procedura indica come svolgere un’attività o gestire un passaggio. Il ruolo identifica una funzione; la responsabilità chiarisce chi risponde dell’esecuzione o della decisione. Il controllo verifica che una condizione sia rispettata. Confondere questi livelli genera documenti lunghi che non spiegano chi deve agire.",
          "Per ciascun passaggio chiarisci chi esegue, chi approva quando necessario, chi riceve l’output e chi gestisce le anomalie. Definisci informazioni minime, scadenze e modalità di escalation. Se una consegna è incompleta, il destinatario deve sapere come segnalarla e a chi rivolgersi, senza avviare una catena informale di messaggi.",
          "Le procedure devono restare accessibili e aggiornabili. Assegna un referente per la manutenzione e verifica il loro uso su casi reali. Il controllo va collocato dove può prevenire o intercettare un errore, senza aggiungere approvazioni a ogni attività. Una regola utile riduce l’incertezza; una regola che nessuno riesce a seguire richiede una revisione."
        ]
      },
      {
        id: "kpi",
        title: "KPI per misurare un processo",
        paragraphs: [
          "Scegli gli indicatori in base al problema e al risultato atteso. Ogni KPI deve avere formula, fonte, frequenza e responsabile della rilevazione. Definisci prima cosa entra nel conteggio: un ordine modificato, una pratica sospesa e una consegna parziale possono alterare il dato se vengono trattati in modo diverso tra periodi.",
          "Non esistono benchmark universali adatti a ogni impresa. Leggi gli indicatori per tipologia di lavoro e complessità, affiancando velocità e qualità. Una media può nascondere casi molto lenti: osserva anche la distribuzione dei tempi e le pratiche oltre scadenza. Evita indicatori che premiano il singolo reparto mentre trasferiscono il problema a quello successivo."
        ],
        points: [
          "Lead time: tempo trascorso dall’avvio alla conclusione del processo, comprese le attese.",
          "Tempo di ciclo: tempo necessario per completare un’attività o un ciclo definito; esplicita gli eventi misurati.",
          "Errori: numero e tipologia di anomalie, rapportati anche ai casi gestiti.",
          "Rilavorazioni: pratiche che richiedono una correzione e ore dedicate a rifarle.",
          "Costo per attività: risorse assorbite per unità, con criteri di attribuzione documentati.",
          "Rispetto delle scadenze: casi conclusi entro il termine concordato sul totale dei casi dovuti.",
          "Produttività: output conforme rispetto alle risorse impiegate, distinguendo lavori di complessità diversa.",
          "Backlog: pratiche aperte, età delle richieste e accumulo nei singoli passaggi."
        ]
      },
      {
        id: "misurazione",
        title: "Prima e dopo: come misurare il miglioramento",
        paragraphs: [
          "La baseline descrive il processo prima dell’intervento. Raccogli dati per un periodo rappresentativo, documentando volumi, mix di lavoro, disponibilità delle persone ed eventuali anomalie. Se usi un campione, spiega come è stato scelto. Senza questo quadro, un calo dei tempi potrebbe dipendere da meno ordini anziché da un flusso migliore.",
          "Collega ogni intervento a un’ipotesi verificabile: un controllo iniziale di completezza dovrebbe ridurre le richieste di integrazione a valle. Indica chi attua il cambiamento, da quando e quali dati saranno raccolti. Sperimenta su un perimetro gestibile e verifica che il nuovo passaggio sia comprensibile a chi lo usa.",
          "Confronta prima e dopo usando le stesse definizioni. Controlla anche errori, carico e scadenze per evitare un miglioramento apparente. Se i risultati non confermano l’ipotesi, ricostruisci la causa e correggi l’intervento. La misurazione serve a decidere cosa mantenere, adattare o interrompere, senza attribuire automaticamente ogni variazione al cambiamento introdotto."
        ]
      },
      {
        id: "esempio",
        title: "Esempio pratico: dall’ordine alla fatturazione",
        paragraphs: [
          "Questo è un esempio generico e dichiaratamente esemplificativo di una PMI commerciale, non un caso cliente. L’azienda riceve ordini via email, verifica la disponibilità, acquista i prodotti mancanti, organizza la consegna e prepara la fattura. Vendite, acquisti e amministrazione conservano parti delle informazioni in strumenti separati.",
          "Nella situazione iniziale alcuni ordini arrivano senza dati completi; gli acquisti chiedono chiarimenti, la consegna viene confermata con messaggi informali e l’amministrazione deve ricostruire quantità e condizioni. La mappa distingue ricezione, verifica, acquisto, consegna e fatturazione, indicando per ciascuna fase input, referente, output e attese. Si esaminano anche annullamenti e consegne parziali.",
          "Gli interventi possibili sono una scheda ordine condivisa, un controllo dei dati prima dell’acquisto, uno stato visibile della pratica e una conferma di consegna reperibile dall’amministrazione. Si definisce chi aggiorna lo stato e chi risolve le discrepanze. Un eventuale automatismo viene valutato dopo aver chiarito regole e dati necessari.",
          "Gli indicatori possono comprendere lead time ordine–fattura, richieste di integrazione, ordini aperti per fase, errori di fatturazione e rispetto delle date concordate. Il confronto con la baseline verifica gli effetti senza ipotizzare percentuali di successo. Se le attese si spostano agli acquisti, il problema va analizzato nuovamente anziché dichiarare concluso il miglioramento."
        ]
      },
      {
        id: "supporto",
        title: "Quando serve un supporto esterno",
        paragraphs: [
          "Un supporto esterno può essere utile quando i problemi attraversano più funzioni, mancano dati condivisi o le persone coinvolte non riescono a concordare cause e priorità. Può aiutare anche quando il titolare concentra le decisioni e il lavoro quotidiano lascia poco spazio all’analisi. Il perimetro deve partire da criticità concrete, non dall’acquisto di uno strumento.",
          "Prima di avviare il percorso, chiarisci quale processo esaminare, quali informazioni sono disponibili e chi potrà attuare le decisioni. Il risultato atteso dell’analisi è una base operativa: mappa verificata, priorità motivate, responsabilità, interventi e indicatori. La continuità dipende poi dalla capacità dell’impresa di usare e aggiornare questi elementi."
        ],
        link: {
          before: "Per valutare un intervento consulenziale di ",
          label: "ottimizzazione dei processi",
          href: "/competenze/ottimizzazione-dei-processi",
          after: ", il primo confronto permette di definire obiettivi, vincoli e modalità di verifica sul flusso scelto."
        }
      }
    ],
    faqs: [
      {
        question: "Che cosa si intende per ottimizzazione dei processi aziendali?",
        answer: "L’analisi e il miglioramento di attività e passaggi collegati per ottenere un risultato più affidabile. Si interviene su attese, duplicazioni, errori e responsabilità, verificando gli effetti con indicatori coerenti."
      },
      {
        question: "Come si individuano i colli di bottiglia in un processo?",
        answer: "Si mappano attività e attese, osservando dove si accumulano pratiche e quali passaggi limitano il flusso. Il confronto tra casi permette di distinguere un vincolo ricorrente da un ritardo occasionale."
      },
      {
        question: "Quali KPI usare per misurare un processo?",
        answer: "Dipende dal problema: lead time, tempo di ciclo, errori, rilavorazioni, costo per attività, scadenze, produttività e backlog sono esempi utili. Per ciascuno occorre definire formula, fonte e perimetro."
      },
      {
        question: "Qual è la differenza tra processo e procedura?",
        answer: "Il processo collega attività per produrre un risultato. La procedura descrive come eseguire un’attività o un passaggio. Un processo può coinvolgere più procedure e più funzioni aziendali."
      },
      {
        question: "Quando una PMI dovrebbe rivedere i propri processi?",
        answer: "Quando crescita, attese, errori ricorrenti o dipendenza da singole persone rendono il lavoro meno prevedibile. È utile partire da un flusso circoscritto con problemi osservabili e dati confrontabili."
      }
    ],
    introduction: [
      "Un’impresa può crescere mantenendo processi costruiti nel tempo, senza una progettazione precisa. Un foglio aggiunto per gestire un’urgenza, una verifica affidata sempre alla stessa persona e una conferma scambiata per telefono possono funzionare con pochi ordini. Quando aumentano volumi e interlocutori, quelle soluzioni diventano fonti di attese, errori e informazioni difficili da ricostruire."
    ]
  },
  {
    slug: "controllo-di-gestione-pmi-redditivita", category: "Controllo di gestione", title: "Controllo di gestione per PMI: come capire se l’azienda è davvero redditizia", excerpt: "Indicatori, margini e scostamenti per andare oltre il fatturato e leggere la redditività reale dell’impresa.", published: "2026-07-28", updated: "2026-07-28", date: "28 luglio 2026", readingTime: "8 min", image: "/images/home/controllo-gestione-analisi-dati.webp", imageAlt: "Analisi di indicatori economici con dashboard e calcolatrice",
    pillar: "controllo-di-gestione", service: "amministrativa", related: "analisi-dei-costi-sprechi-margini",
    sections: [
      { id: "fatturato-margine", title: "Fatturato e redditività non sono la stessa cosa", paragraphs: ["Una PMI può aumentare le vendite e, nello stesso periodo, ridurre la propria redditività. Succede quando il mix cambia, gli sconti crescono, i costi variabili aumentano o la struttura assorbe più risorse del previsto.", "Il controllo di gestione serve a collegare il risultato complessivo ai fattori che lo hanno generato. Non sostituisce la contabilità: la rende leggibile per le decisioni operative."], points: ["ricavi per linea, cliente o canale", "margine di contribuzione", "costi fissi e capacità utilizzata", "scostamenti rispetto a budget e periodo precedente"] },
      { id: "kpi", title: "Scegliere pochi KPI che portano a una decisione", paragraphs: ["Un indicatore è utile quando ha una fonte affidabile, una frequenza definita e un responsabile che sa cosa fare in caso di scostamento. Un cruscotto pieno di numeri senza azioni collegate produce soltanto rumore.", "Per una realtà su commessa, per esempio, avanzamento, ore e marginalità prevista possono essere più importanti del solo fatturato mensile. In un’attività commerciale contano invece rotazione, margine per categoria e valore medio della vendita."], points: ["partire dalle decisioni ricorrenti", "definire formula e fonte", "assegnare una soglia di attenzione", "rivedere periodicamente l’utilità del KPI"] },
      { id: "esempio", title: "Un esempio generico: crescita che assorbe margine", paragraphs: ["Immaginiamo un’impresa che acquisisca più ordini grazie a una nuova linea. Il fatturato cresce, ma la linea richiede lavorazioni esterne, urgenze logistiche e più assistenza. Se questi costi non sono attribuiti, la crescita appare positiva mentre il margine unitario si riduce.", "Separare ricavi e costi incrementali permette di verificare se intervenire sul prezzo, sul processo, sui fornitori o sul posizionamento dell’offerta." ] },
      { id: "ritmo", title: "Dal report al ritmo di gestione", paragraphs: ["Il valore nasce dalla continuità: chiusura dei dati, confronto sintetico, decisioni assegnate e verifica. Per molte PMI è preferibile un ciclo mensile stabile a un sistema sofisticato che nessuno riesce ad aggiornare.", "Il primo passo è una diagnosi delle informazioni già disponibili e delle decisioni che oggi vengono prese con maggiore incertezza."] },
    ],
    faqs: [{ question: "Quali dati servono per iniziare?", answer: "Contabilità, vendite, acquisti e dati operativi già disponibili. La qualità viene verificata prima di costruire gli indicatori." }, { question: "Quanto spesso vanno letti i KPI?", answer: "Dipende dalla velocità del fenomeno: cassa e vendite possono richiedere frequenze ravvicinate, mentre altri indicatori sono significativi su base mensile." }],
  },
  {
    slug: "business-plan-cosa-contiene-quando-serve", category: "Pianificazione", title: "Business plan: cosa deve contenere e quando serve davvero", excerpt: "Struttura, ipotesi e scenari di un business plan utile a decidere, non soltanto a presentare un progetto.", published: "2026-07-28", updated: "2026-07-28", date: "28 luglio 2026", readingTime: "9 min", image: "/images/home/business-plan-documenti-finanziari.webp", imageAlt: "Professionista esamina documenti e proiezioni di un business plan",
    pillar: "business-plan", service: "finanziaria", related: "cash-flow-aziendale-monitorare-liquidita",
    sections: [
      { id: "quando-serve", title: "Quando il business plan è uno strumento utile", paragraphs: ["Serve quando una decisione modifica in modo rilevante risorse, organizzazione o rischio: nuova attività, investimento, sviluppo di una linea, ingresso di soci o confronto con finanziatori.", "È utile anche senza un destinatario esterno, perché costringe a rendere esplicite ipotesi che altrimenti resterebbero scollegate." ] },
      { id: "contenuti", title: "Le parti che devono essere coerenti tra loro", paragraphs: ["La parte descrittiva chiarisce proposta, clienti, canali, organizzazione e piano di attuazione. La parte numerica traduce queste scelte in ricavi, costi, investimenti, capitale circolante e fonti.", "Il documento è credibile quando ogni numero importante può essere ricondotto a un driver comprensibile."], points: ["sintesi del progetto e obiettivi", "mercato e modello di ricavo", "organizzazione e piano operativo", "conto economico, stato patrimoniale e cash flow", "fabbisogno, fonti e scenari"] },
      { id: "ipotesi", title: "Ipotesi, sensibilità e scenari", paragraphs: ["Una singola previsione può creare falsa precisione. Conviene distinguere scenario base, condizioni meno favorevoli e leve di risposta.", "Un esempio generico è la nuova apertura che raggiunge il volume obiettivo più lentamente del previsto: lo scenario deve mostrare l’effetto sulla cassa e quali costi o investimenti possono essere rimodulati." ] },
      { id: "errori", title: "Gli errori che rendono fragile il piano", paragraphs: ["Previsioni di vendita senza driver, costi sottostimati, IVA e capitale circolante ignorati, investimenti non collegati ai tempi e assenza di responsabilità operative sono errori frequenti.", "Il business plan va infine aggiornato quando cambiano ipotesi sostanziali: non per riscrivere il passato, ma per mantenere utile il confronto tra piano e realtà." ] },
    ],
    faqs: [{ question: "Quanti anni deve coprire?", answer: "L’orizzonte dipende dal progetto e dalla durata degli investimenti. Deve essere abbastanza lungo da mostrare l’equilibrio atteso, senza fingere precisione eccessiva." }, { question: "Chi approva il business plan?", answer: "Il documento supporta decisioni interne o valutazioni esterne, ma non garantisce approvazioni, finanziamenti o risultati." }],
  },
  {
    slug: "consulenza-aziendale-ristoranti-costi-margini", category: "Hospitality", title: "Consulenza aziendale per ristoranti: costi, margini e organizzazione", excerpt: "Come collegare food cost, acquisti, personale, menu e processi per rendere più leggibile la gestione di un ristorante.", published: "2026-07-28", updated: "2026-07-28", date: "28 luglio 2026", readingTime: "9 min", image: "/images/home/servizi-consulenza-aziendale.webp", imageAlt: "Consulente analizza costi e margini tra documenti e computer",
    pillar: "analisi-dei-costi", service: "amministrativa", related: "controllo-di-gestione-pmi-redditivita",
    sections: [
      { id: "economia", title: "Leggere l’economia del locale oltre l’incasso", paragraphs: ["L’incasso giornaliero è immediato, ma non descrive da solo il risultato. Materie prime, scarti, personale, commissioni, energia e mix delle vendite incidono in tempi e modi differenti.", "La consulenza aziendale aiuta a costruire una lettura periodica che resti collegata al lavoro di cucina, sala, acquisti e amministrazione. Food cost, budget e controllo di gestione permettono così di leggere insieme costi e margini del ristorante." ], link: { before: "Per monitorare periodicamente margini e scostamenti, il ", label: "controllo di gestione", href: "/competenze/controllo-di-gestione", after: " collega i numeri alle decisioni operative del locale." } },
      { id: "food-cost", title: "Food cost e margine: dal calcolo alla gestione", paragraphs: ["Il food cost teorico parte da ricette e quantità standard; quello effettivo riflette acquisti, variazioni di prezzo, scarti e inventari. La differenza tra i due segnala dove approfondire.", "Non esiste una percentuale universale valida per ogni format. Prezzo, proposta, servizio e struttura dei costi vanno letti insieme."], points: ["schede ricetta aggiornate", "prezzi di acquisto e rese", "vendite per prodotto", "scarti e consumi interni", "margine di contribuzione"] },
      { id: "organizzazione", title: "Acquisti, personale e procedure", paragraphs: ["Ordini non pianificati e responsabilità confuse generano urgenze, scorte e rilavorazioni. Calendari, livelli di autorizzazione e controlli semplici migliorano la continuità.", "Anche il costo del personale va collegato ai volumi e ai turni, senza ridurlo a un taglio lineare: l’obiettivo è allineare capacità e qualità del servizio." ], link: { before: "Un ", label: "budget operativo aziendale", href: "/competenze/budget-aziendale", after: " rende esplicite le ipotesi su acquisti, personale e volumi, così da confrontarle con i risultati." } },
      { id: "esempio", title: "Un esempio generico: menu molto venduto, margine debole", paragraphs: ["Un piatto popolare può assorbire margine per ingredienti aumentati, porzioni non uniformi o tempi di preparazione elevati. Il dato suggerisce alternative: rivedere ricetta e porzione, negoziare acquisti, modificare prezzo o promuovere un mix diverso.", "La scelta finale deve considerare anche identità del locale ed esperienza del cliente, non soltanto il foglio di calcolo." ], link: { before: "Per valutare un affiancamento su questi temi, consulta la pagina di ", label: "consulenza per ristoranti e hospitality", href: "/settori/ristorazione-hospitality", after: " e il relativo perimetro di intervento." } },
    ],
    faqs: [{ question: "La consulenza vale anche per bar e hotel?", answer: "Sì, ma indicatori e processi vengono adattati al modello specifico; bar, ristoranti e hotel non sono trattati come attività identiche." }, { question: "È necessario cambiare menu o gestionale?", answer: "Non in automatico. Prima si analizzano dati e processi; gli interventi vengono scelti in base alle evidenze." }],
  },
  {
    slug: "cash-flow-aziendale-monitorare-liquidita", category: "Finanza", title: "Cash flow aziendale: come monitorare la liquidità e prevenire squilibri", excerpt: "Un metodo pratico per costruire previsioni di cassa, individuare picchi di fabbisogno e aggiornare gli scenari.", published: "2026-07-28", updated: "2026-07-28", date: "28 luglio 2026", readingTime: "8 min", image: "/images/home/consulenza-finanziaria-grafici.webp", imageAlt: "Analisi di report e grafici per la pianificazione finanziaria",
    pillar: "cash-flow", service: "finanziaria", related: "business-plan-cosa-contiene-quando-serve",
    sections: [
      { id: "utile-cassa", title: "Perché utile e cassa seguono tempi diversi", paragraphs: ["Ricavi e costi vengono rilevati secondo criteri economici, mentre la liquidità dipende dal momento effettivo di incassi e pagamenti. Crediti, scorte, imposte e investimenti possono assorbire cassa anche quando il risultato è positivo.", "Per questo il saldo del conto è una fotografia, non una previsione." ] },
      { id: "costruzione", title: "Come costruire una previsione di cassa", paragraphs: ["Si parte dal saldo disponibile e si ordinano entrate e uscite per data attesa. Le voci certe restano separate da quelle stimate, così è possibile capire quale parte del quadro dipende da ipotesi.", "L’orizzonte breve richiede dettaglio; quello medio può aggregare per categorie e scenari."], points: ["incassi da clienti e altri flussi", "fornitori, personale e costi ricorrenti", "imposte e contributi", "investimenti e finanziamenti", "saldo minimo e margine di sicurezza"] },
      { id: "circolante", title: "Capitale circolante: le leve operative", paragraphs: ["Tempi di incasso, condizioni di pagamento e livello delle scorte trasformano vendite e acquisti in fabbisogno. Migliorare il cash flow non significa soltanto cercare nuova finanza: spesso richiede intervenire sui processi.", "Un esempio generico è una crescita sostenuta da ordini importanti che richiedono acquisti anticipati e pagamenti del cliente molto successivi. Il margine può essere positivo, ma il picco di cassa va coperto." ] },
      { id: "routine", title: "Aggiornare il forecast e decidere", paragraphs: ["La previsione deve essere confrontata con i movimenti effettivi, correggendo tempi e ipotesi. Le differenze ricorrenti indicano un processo da migliorare, non solo una cella da aggiornare.", "Soglie di attenzione e responsabilità chiare permettono di agire su incassi, acquisti, investimenti o fonti con tempo sufficiente." ] },
    ],
    faqs: [{ question: "Qual è la frequenza migliore?", answer: "Per la tesoreria operativa può essere settimanale; per una visione più ampia mensile. La frequenza deve seguire volatilità e rischio." }, { question: "Il cash flow sostituisce il budget?", answer: "No. Il budget economico e il cash flow rispondono a domande diverse e devono essere coerenti tra loro." }],
  },
  {
    slug: "analisi-dei-costi-sprechi-margini", category: "Gestione", title: "Analisi dei costi: come individuare sprechi e proteggere i margini", excerpt: "Classificare costi e driver per distinguere risorse necessarie, inefficienze e opportunità di miglioramento.", published: "2026-07-28", updated: "2026-07-28", date: "28 luglio 2026", readingTime: "8 min", image: "/images/home/consulenza-amministrativa-documenti.webp", imageAlt: "Analisi operativa dei costi su documenti amministrativi",
    pillar: "analisi-dei-costi", service: "amministrativa", related: "controllo-di-gestione-pmi-redditivita",
    sections: [
      { id: "classificare", title: "Classificare i costi in base alla decisione", paragraphs: ["La stessa spesa può essere letta in modi diversi. Distinguere fisso e variabile aiuta a valutare i volumi; distinguere diretto e indiretto aiuta ad attribuire il costo a prodotti o servizi.", "La classificazione non è un esercizio teorico: va scelta in funzione della domanda a cui si vuole rispondere." ] },
      { id: "driver", title: "Cercare i driver, non soltanto le voci contabili", paragraphs: ["Una voce aggregata indica quanto è stato speso, ma non sempre perché. Ordini urgenti, errori, rilavorazioni, bassa saturazione e complessità del catalogo possono essere driver più utili della categoria contabile.", "Collegare il costo al processo rende possibile un intervento concreto."], points: ["volumi e mix", "tempi e capacità", "qualità e rilavorazioni", "condizioni di acquisto", "complessità operativa"] },
      { id: "margine", title: "Margine di contribuzione e punto di pareggio", paragraphs: ["Il margine di contribuzione mostra quanto resta dopo i costi variabili per coprire la struttura. Il punto di pareggio traduce questa relazione in un volume indicativo.", "Sono strumenti di scenario, non certezze: se prezzo, mix o costi cambiano, anche il risultato va aggiornato." ] },
      { id: "azioni", title: "Dall’analisi al piano di miglioramento", paragraphs: ["Le azioni possono riguardare prezzo, offerta, processo, fornitori, capacità o eliminazione di attività prive di valore. Vanno ordinate per impatto, fattibilità e rischio.", "Un controllo successivo verifica se il risparmio previsto è reale e se non ha prodotto effetti negativi su qualità, vendite o continuità." ] },
    ],
    faqs: [{ question: "Qual è il primo costo da analizzare?", answer: "Quello più rilevante o più variabile rispetto al risultato, purché sia collegabile a un processo e a una decisione." }, { question: "Come si attribuiscono i costi indiretti?", answer: "Con criteri ragionevoli e documentati. L’obiettivo è sostenere decisioni, evitando precisione apparente o ripartizioni arbitrarie." }],
  },
  {
    slug: "project-management-riqualificazione", category: "Project management", title: "Riqualificazione immobiliare: perché il coordinamento fa la differenza", excerpt: "Tempi, decisioni, costi e fornitori: una regia operativa rende più leggibile un progetto complesso.", published: "2026-05-06", updated: "2026-07-28", date: "Aggiornato il 28 luglio 2026", readingTime: "7 min", image: "/images/home/project-management-sala-riunioni.webp", imageAlt: "Sala riunioni organizzata per il coordinamento di un progetto tecnico",
    pillar: "project-management", service: "project-management", related: "analisi-dei-costi-sprechi-margini",
    sections: [
      { id: "complessita", title: "La complessità nasce dalle dipendenze", paragraphs: ["Una riqualificazione coinvolge decisioni tecniche, autorizzazioni, forniture, accessi e vincoli operativi. Anche attività semplici possono bloccarsi se una dipendenza emerge troppo tardi.", "Il coordinamento rende visibili sequenza, responsabili e informazioni necessarie, senza sostituire progettisti, direttori lavori o imprese." ] },
      { id: "piano", title: "Un piano condiviso e aggiornabile", paragraphs: ["Il piano deve distinguere milestone, decisioni del committente, attività dei professionisti e consegne dei fornitori. Aggiornarlo significa esplicitare conseguenze e alternative, non nascondere i ritardi."], points: ["perimetro e obiettivi", "responsabilità", "dipendenze e milestone", "rischi e decisioni aperte", "modalità di reporting"] },
      { id: "costi", title: "Controllare costi e varianti", paragraphs: ["Il budget iniziale va collegato a preventivi, impegni, pagamenti e varianti. Una modifica può avere effetti su più attività e deve essere valutata prima dell’approvazione.", "Un registro decisioni aiuta a ricostruire motivazioni, responsabilità e impatti." ] },
      { id: "comunicazione", title: "Comunicazione proporzionata al progetto", paragraphs: ["Riunioni frequenti senza informazioni aggiornate non migliorano il controllo. È preferibile un reporting sintetico: avanzamento, criticità, decisioni richieste e prossimi passi.", "Le attività professionali riservate restano in capo ai soggetti competenti e regolarmente abilitati." ] },
    ],
    faqs: [{ question: "Il coordinamento sostituisce la direzione lavori?", answer: "No. Sono ruoli distinti; le attività tecniche riservate restano ai professionisti abilitati." }, { question: "Quando conviene introdurre una regia?", answer: "Prima dell’avvio operativo, quando è ancora possibile chiarire perimetro, dipendenze e responsabilità." }],
  },
];
