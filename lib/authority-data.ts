export type FaqItem = { question: string; answer: string };

export type AuthorityPage = {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  problem: string;
  activities: string[];
  benefits: string[];
  relatedService: string;
  relatedSector: string;
  relatedArticle: string;
  faqs: FaqItem[];
  disclaimer?: string;
};

export const authorityPages: AuthorityPage[] = [
  {
    slug: "controllo-di-gestione", title: "Controllo di gestione", eyebrow: "Numeri che guidano le decisioni",
    description: "Un sistema di controllo di gestione per PMI che rende leggibili costi, margini, scostamenti e priorità operative.",
    problem: "Fatturato e saldo bancario non bastano a spiegare dove si crea valore. Il controllo di gestione collega dati economici e attività quotidiane, così l’imprenditore può intervenire prima che uno scostamento diventi un problema.",
    activities: ["Definizione di KPI coerenti con il modello di business", "Impostazione di report periodici e centri di analisi", "Confronto tra budget, consuntivo e previsioni", "Lettura di margini, costi fissi e variabili"],
    benefits: ["Decisioni fondate su dati comparabili", "Responsabilità e priorità più chiare", "Individuazione tempestiva degli scostamenti"],
    relatedService: "amministrativa", relatedSector: "pmi", relatedArticle: "controllo-di-gestione-pmi-redditivita",
    faqs: [{ question: "Il controllo di gestione è utile anche a una piccola impresa?", answer: "Sì. Il sistema va proporzionato: pochi indicatori affidabili e una cadenza sostenibile sono spesso più utili di report molto complessi." }, { question: "Serve cambiare il gestionale?", answer: "Non necessariamente. Si parte dai dati disponibili, se ne valuta la qualità e si definiscono solo gli adeguamenti realmente utili." }],
  },
  {
    slug: "business-plan", title: "Business plan", eyebrow: "Scenari e sostenibilità",
    description: "Business plan per nuove iniziative, investimenti e dialogo con partner finanziari, costruito su ipotesi esplicite e verificabili.",
    problem: "Un business plan non è una previsione certa né un documento da compilare una volta. È un modello che collega mercato, organizzazione, investimenti, costi, ricavi e fabbisogno finanziario per valutare la tenuta di un progetto.",
    activities: ["Definizione dell’iniziativa e delle ipotesi", "Piano economico, patrimoniale e finanziario", "Analisi del fabbisogno e delle fonti", "Scenari, rischi e punti di verifica"],
    benefits: ["Ipotesi rese esplicite", "Fabbisogno finanziario più leggibile", "Confronto più solido con soci e finanziatori"],
    relatedService: "finanziaria", relatedSector: "pmi", relatedArticle: "business-plan-cosa-contiene-quando-serve",
    faqs: [{ question: "Quanto deve essere dettagliato un business plan?", answer: "Quanto serve a sostenere la decisione. Il dettaglio dipende da complessità, investimento, destinatari e qualità dei dati disponibili." }, { question: "Il business plan garantisce l’ottenimento di un finanziamento?", answer: "No. Aiuta a presentare il progetto con chiarezza, ma ogni decisione resta in capo al soggetto finanziatore e alle sue valutazioni." }],
    disclaimer: "L’eventuale intermediazione o attività riservata è svolta esclusivamente da soggetti autorizzati e professionisti abilitati.",
  },
  {
    slug: "budget-aziendale", title: "Budget aziendale", eyebrow: "Obiettivi tradotti in numeri",
    description: "Un budget operativo per trasformare priorità commerciali, costi e investimenti in un percorso misurabile.",
    problem: "Senza un riferimento condiviso, ogni scostamento viene letto troppo tardi. Il budget crea una base concreta per coordinare obiettivi, risorse e responsabilità durante l’anno.",
    activities: ["Budget ricavi e volumi", "Budget costi e investimenti", "Piano di cassa collegato", "Aggiornamento rolling e analisi scostamenti"],
    benefits: ["Obiettivi verificabili", "Maggiore coordinamento tra funzioni", "Reazioni più rapide ai cambiamenti"],
    relatedService: "finanziaria", relatedSector: "pmi", relatedArticle: "business-plan-cosa-contiene-quando-serve",
    faqs: [{ question: "Il budget va aggiornato durante l’anno?", answer: "Sì, quando cambiano ipotesi rilevanti. Il consuntivo resta separato, mentre il forecast aggiorna lo scenario atteso." }, { question: "Da dove si comincia?", answer: "Dai driver che incidono davvero: volumi, prezzi, capacità, persone, acquisti e investimenti." }],
  },
  {
    slug: "analisi-dei-costi", title: "Analisi dei costi", eyebrow: "Proteggere i margini",
    description: "Analisi dei costi per distinguere sprechi, inefficienze e risorse necessarie, senza tagli indiscriminati.",
    problem: "Ridurre i costi senza comprenderne la funzione può indebolire il servizio. L’analisi separa costi fissi e variabili, diretti e indiretti, e li collega a prodotti, attività o commesse.",
    activities: ["Mappatura e classificazione dei costi", "Analisi per prodotto, servizio o commessa", "Margine di contribuzione e break-even", "Priorità di efficientamento"],
    benefits: ["Margini più trasparenti", "Interventi selettivi e motivati", "Politiche di prezzo più consapevoli"],
    relatedService: "amministrativa", relatedSector: "ristorazione-hospitality", relatedArticle: "analisi-dei-costi-sprechi-margini",
    faqs: [{ question: "Analizzare i costi significa sempre tagliare?", answer: "No. Significa capire quali costi generano valore, quali sono inefficienti e quali vanno riprogettati." }, { question: "È possibile analizzare una singola linea?", answer: "Sì, se i dati permettono di attribuire in modo ragionevole ricavi e costi alla linea considerata." }],
  },
  {
    slug: "pianificazione-finanziaria", title: "Pianificazione finanziaria", eyebrow: "Liquidità e scelte future",
    description: "Pianificazione finanziaria per PMI: fabbisogni, flussi di cassa e scenari collegati alle decisioni operative.",
    problem: "Un risultato economico positivo non elimina il rischio di tensioni di cassa. La pianificazione finanziaria traduce incassi, pagamenti, investimenti e fonti in una visione temporale coerente.",
    activities: ["Analisi della struttura finanziaria", "Previsione di incassi e pagamenti", "Scenari di investimento e copertura", "Documentazione per il dialogo finanziario"],
    benefits: ["Fabbisogni anticipati", "Scelte di investimento più leggibili", "Dialogo più ordinato con gli interlocutori finanziari"],
    relatedService: "finanziaria", relatedSector: "pmi", relatedArticle: "cash-flow-aziendale-monitorare-liquidita",
    faqs: [{ question: "Qual è l’orizzonte corretto?", answer: "Dipende dalla decisione: il controllo di cassa può essere settimanale, mentre investimenti e struttura finanziaria richiedono orizzonti più lunghi." }, { question: "Pianificazione finanziaria e budget coincidono?", answer: "No. Sono collegati: il budget descrive risultati attesi, il piano finanziario ne traduce gli effetti su liquidità e fabbisogni." }],
    disclaimer: "Le attività riservate sono svolte esclusivamente da professionisti e intermediari competenti e autorizzati.",
  },
  {
    slug: "cash-flow", title: "Analisi dei flussi di cassa", eyebrow: "Prevenire tensioni di liquidità",
    description: "Un cash flow prospettico per leggere entrate, uscite e picchi di fabbisogno prima che diventino urgenze.",
    problem: "La cassa segue tempi diversi dal conto economico. Ritardi negli incassi, scorte, imposte e investimenti possono creare tensioni anche in aziende redditizie.",
    activities: ["Calendario incassi e pagamenti", "Previsione a breve e medio termine", "Analisi capitale circolante", "Scenari e soglie di attenzione"],
    benefits: ["Maggiore visibilità sui picchi di fabbisogno", "Priorità di incasso e pagamento chiare", "Decisioni tempestive"],
    relatedService: "finanziaria", relatedSector: "pmi", relatedArticle: "cash-flow-aziendale-monitorare-liquidita",
    faqs: [{ question: "Con quale frequenza va aggiornato?", answer: "Nelle fasi delicate anche ogni settimana; in condizioni stabili può essere sufficiente una cadenza mensile." }, { question: "Quali dati servono?", answer: "Scadenziari, saldi, ordini, costi ricorrenti, imposte, investimenti e ipotesi attendibili sugli incassi." }],
  },
  {
    slug: "organizzazione-aziendale", title: "Organizzazione aziendale", eyebrow: "Ruoli, priorità e continuità",
    description: "Organizzazione aziendale per chiarire responsabilità, flussi decisionali e modalità operative nelle PMI.",
    problem: "Quando responsabilità e processi restano impliciti, le informazioni si disperdono e le urgenze guidano il lavoro. Un modello organizzativo leggero rende più semplice coordinare persone e decisioni.",
    activities: ["Mappatura di ruoli e responsabilità", "Flussi decisionali e passaggi informativi", "Procedure essenziali", "Riunioni, indicatori e verifiche"],
    benefits: ["Meno dipendenza dalle singole persone", "Passaggi di consegna più chiari", "Responsabilità verificabili"],
    relatedService: "strategica", relatedSector: "pmi", relatedArticle: "controllo-di-gestione-pmi-redditivita",
    faqs: [{ question: "Serve creare molta burocrazia?", answer: "No. Le regole devono essere proporzionate e aiutare il lavoro, non appesantirlo." }, { question: "Si può intervenire durante una fase di crescita?", answer: "Sì. È spesso il momento in cui ruoli e processi vanno resi più espliciti per sostenere il nuovo carico." }],
  },
  {
    slug: "ottimizzazione-dei-processi", title: "Ottimizzazione dei processi", eyebrow: "Lavorare con meno attriti",
    description: "Analisi e ottimizzazione dei processi per eliminare passaggi inutili, ritardi e duplicazioni informative.",
    problem: "Molte inefficienze non dipendono dalle persone ma da passaggi ridondanti, strumenti scollegati e responsabilità non definite. Rendere visibile il processo è il primo passo per migliorarlo.",
    activities: ["Mappatura del processo attuale", "Individuazione di attese e rilavorazioni", "Disegno del flusso futuro", "Indicatori e verifica dell’adozione"],
    benefits: ["Tempi più prevedibili", "Meno errori e duplicazioni", "Esperienza più coerente per clienti e team"],
    relatedService: "strategica", relatedSector: "attivita-commerciali", relatedArticle: "analisi-dei-costi-sprechi-margini",
    faqs: [{ question: "Da quale processo conviene partire?", answer: "Da quello con maggiore impatto su cliente, cassa o carico operativo e con problemi osservabili." }, { question: "La tecnologia è sempre necessaria?", answer: "No. Prima si chiarisce il flusso; solo dopo si valuta se uno strumento digitale genera un vantaggio reale." }],
  },
  {
    slug: "riorganizzazione-aziendale", title: "Riorganizzazione aziendale", eyebrow: "Cambiare con metodo",
    description: "Un percorso di riorganizzazione che collega obiettivi, persone, processi e controllo dell’avanzamento.",
    problem: "Crescita, passaggi generazionali, nuovi mercati o difficoltà operative possono rendere inadatto l’assetto esistente. La riorganizzazione richiede priorità chiare e una transizione governata.",
    activities: ["Diagnosi organizzativa", "Definizione dell’assetto obiettivo", "Piano di transizione e responsabilità", "Monitoraggio degli effetti"],
    benefits: ["Cambiamento governabile", "Minori sovrapposizioni", "Coerenza tra strategia e operatività"],
    relatedService: "strategica", relatedSector: "pmi", relatedArticle: "controllo-di-gestione-pmi-redditivita",
    faqs: [{ question: "Quanto dura una riorganizzazione?", answer: "Dipende dal perimetro. È utile lavorare per fasi, con risultati verificabili e momenti di riallineamento." }, { question: "Come si limita l’impatto sull’operatività?", answer: "Definendo priorità, responsabilità temporanee e un calendario realistico, senza cambiare tutto insieme." }],
  },
  {
    slug: "project-management", title: "Project management", eyebrow: "Governare tempi, costi e responsabilità",
    description: "Project management per iniziative aziendali e tecniche: obiettivi, piano, responsabilità, rischi e avanzamento leggibili.",
    problem: "Un progetto diventa fragile quando decisioni, dipendenze e responsabilità restano distribuite tra molti interlocutori. Una regia unica rende visibili priorità e criticità.",
    activities: ["Definizione di obiettivi e perimetro", "Piano attività, dipendenze e milestone", "Coordinamento di fornitori e professionisti", "Controllo avanzamento, costi e rischi"],
    benefits: ["Responsabilità definite", "Problemi emersi prima", "Comunicazione più ordinata"],
    relatedService: "project-management", relatedSector: "condomini", relatedArticle: "project-management-riqualificazione",
    faqs: [{ question: "Il project manager sostituisce i professionisti tecnici?", answer: "No. Coordina il progetto; le attività tecniche e riservate restano ai professionisti competenti e abilitati." }, { question: "È utile anche per progetti interni?", answer: "Sì, per esempio digitalizzazione, apertura di una sede operativa o revisione di processi complessi." }],
  },
  {
    slug: "facility-management", title: "Facility management", eyebrow: "Continuità per spazi e servizi",
    description: "Coordinamento operativo di manutenzioni, fornitori e attività sugli immobili con priorità e responsabilità chiare.",
    problem: "Interventi frammentati e richieste non tracciate aumentano tempi, costi e disservizi. Il facility management organizza esigenze, fornitori e verifiche senza sostituire le competenze tecniche riservate.",
    activities: ["Raccolta e classificazione delle esigenze", "Pianificazione delle attività ricorrenti", "Coordinamento fornitori", "Tracciamento interventi e verifiche"],
    benefits: ["Maggiore continuità operativa", "Interlocutori coordinati", "Storico degli interventi leggibile"],
    relatedService: "tecnici", relatedSector: "condomini", relatedArticle: "project-management-riqualificazione",
    faqs: [{ question: "Comprende l’esecuzione dei lavori?", answer: "Il perimetro viene definito caso per caso. Le attività tecniche o esecutive sono affidate a soggetti competenti e, quando previsto, abilitati." }, { question: "È adatto a più immobili?", answer: "Sì, impostando priorità, livelli di servizio e un sistema comune di tracciamento." }],
    disclaimer: "Progettazioni, direzione lavori e altre attività riservate sono svolte esclusivamente da professionisti regolarmente abilitati.",
  },
  {
    slug: "nuove-attivita-e-startup", title: "Supporto a nuove attività e start-up", eyebrow: "Dall’idea all’operatività",
    description: "Un coordinamento concreto per valutare e avviare nuove attività, collegando modello, numeri, processi e interlocutori.",
    problem: "Aprire una nuova attività significa prendere decisioni interdipendenti: proposta, costi, spazi, organizzazione, fornitori e liquidità. Una sequenza chiara riduce omissioni e rilavorazioni.",
    activities: ["Definizione del modello operativo", "Business plan e fabbisogno", "Piano di avvio e responsabilità", "Coordinamento dei professionisti necessari"],
    benefits: ["Decisioni ordinate per priorità", "Rischi e dipendenze più visibili", "Avvio operativo più coordinato"],
    relatedService: "strategica", relatedSector: "attivita-commerciali", relatedArticle: "business-plan-cosa-contiene-quando-serve",
    faqs: [{ question: "Fornite autorizzazioni o certificazioni?", answer: "No. Coordiniamo il percorso; autorizzazioni e attività riservate competono agli enti e ai professionisti abilitati." }, { question: "Si può partire dalla sola fattibilità?", answer: "Sì. Una prima fase può servire a verificare ipotesi, fabbisogno e principali vincoli prima dell’avvio." }],
  },
  {
    slug: "digitalizzazione-dei-processi", title: "Digitalizzazione dei processi", eyebrow: "Tecnologia utile, non decorativa",
    description: "Digitalizzare flussi amministrativi e operativi partendo dai processi, dai dati e dalle persone che li utilizzano.",
    problem: "Aggiungere strumenti senza ridisegnare il lavoro sposta soltanto le inefficienze. La digitalizzazione efficace parte da obiettivi e flussi, poi seleziona funzioni e responsabilità.",
    activities: ["Analisi dei flussi e dei dati", "Requisiti funzionali e priorità", "Coordinamento dell’implementazione", "Adozione, procedure e indicatori"],
    benefits: ["Dati più reperibili", "Meno attività manuali ripetitive", "Maggiore tracciabilità"],
    relatedService: "strategica", relatedSector: "studi-professionali", relatedArticle: "controllo-di-gestione-pmi-redditivita",
    faqs: [{ question: "Scegliete il software?", answer: "Possiamo supportare la definizione dei requisiti e il confronto delle soluzioni, mantenendo la scelta legata ai processi reali." }, { question: "Come si gestisce il cambiamento?", answer: "Con coinvolgimento degli utenti, procedure semplici, formazione e verifiche progressive." }],
  },
  {
    slug: "procedure-amministrative", title: "Procedure amministrative", eyebrow: "Informazioni affidabili",
    description: "Procedure amministrative chiare per scadenze, documenti, autorizzazioni interne e passaggi informativi.",
    problem: "Quando le attività amministrative dipendono dalla memoria individuale, aumentano errori, ritardi e difficoltà di controllo. Procedure essenziali rendono il lavoro trasferibile e verificabile.",
    activities: ["Mappatura delle attività ricorrenti", "Ruoli, controlli e scadenze", "Standard documentali", "Revisione periodica delle procedure"],
    benefits: ["Minore rischio di omissioni", "Inserimento più semplice di nuove persone", "Dati più coerenti per il controllo"],
    relatedService: "amministrativa", relatedSector: "studi-professionali", relatedArticle: "analisi-dei-costi-sprechi-margini",
    faqs: [{ question: "Le procedure devono essere molto dettagliate?", answer: "Solo quanto basta per assicurare qualità, responsabilità e continuità. Il livello dipende dal rischio dell’attività." }, { question: "Come restano aggiornate?", answer: "Assegnando un responsabile e prevedendo revisioni quando cambiano strumenti, ruoli o requisiti." }],
  },
];

export type SectorPage = { slug: string; title: string; description: string; intro: string; priorities: string[]; relatedCompetences: string[]; article: string; faqs: FaqItem[] };

export const sectorPages: SectorPage[] = [
  { slug: "pmi", title: "Consulenza aziendale per PMI", description: "Consulenza aziendale per PMI a Milano e in tutta Italia, con supporto anche da remoto su gestione, finanza e organizzazione.", intro: "Nelle PMI decisioni commerciali, finanziarie e organizzative si influenzano rapidamente. Il supporto parte dai dati disponibili e costruisce strumenti proporzionati, utili a chi deve decidere e far funzionare l’impresa ogni giorno.", priorities: ["Controllo di gestione e redditività", "Budget, cash flow e pianificazione finanziaria", "Ruoli, processi e responsabilità", "Business plan e progetti di crescita"], relatedCompetences: ["controllo-di-gestione", "pianificazione-finanziaria", "organizzazione-aziendale"], article: "controllo-di-gestione-pmi-redditivita", faqs: [{ question: "Operate solo a Milano?", answer: "No. Seguiamo progetti a Milano e, anche da remoto, su tutto il territorio nazionale." }, { question: "Il percorso è adatto anche a esigenze circoscritte?", answer: "Sì. Il perimetro può riguardare un singolo progetto o un affiancamento continuativo." }] },
  { slug: "ristorazione-hospitality", title: "Consulenza per ristoranti e hospitality", description: "Consulenza per ristoranti, bar e hotel su costi, margini, acquisti, budget e organizzazione operativa.", intro: "Ristorazione, bar, hotel e hospitality uniscono volumi variabili, acquisti frequenti, personale e standard di servizio. Per proteggere i margini serve collegare numeri e operatività, senza perdere di vista l’esperienza dell’ospite.", priorities: ["Food cost e margine di contribuzione", "Controllo acquisti e scorte", "Budget operativo e flussi di cassa", "Organizzazione del personale e procedure"], relatedCompetences: ["analisi-dei-costi", "controllo-di-gestione", "budget-aziendale"], article: "consulenza-aziendale-ristoranti-costi-margini", faqs: [{ question: "Il supporto vale sia per ristoranti sia per hotel?", answer: "Sì, adattando indicatori e processi al modello operativo specifico; non si applica un modello identico a realtà diverse." }, { question: "Potete intervenire su una nuova apertura?", answer: "Sì, coordinando fattibilità, budget, processi e professionisti necessari, senza sostituire le attività riservate." }] },
  { slug: "attivita-commerciali", title: "Consulenza per attività commerciali", description: "Supporto a negozi e attività commerciali per budget, margini, processi e avvio di nuove iniziative.", intro: "Vendite, assortimento, acquisti, personale e liquidità devono essere letti insieme. Un quadro semplice aiuta a capire quali categorie sostengono il margine e dove intervenire sull’operatività.", priorities: ["Margini per categoria", "Rotazione e fabbisogno", "Procedure di vendita e acquisto", "Piano per nuove aperture"], relatedCompetences: ["analisi-dei-costi", "cash-flow", "nuove-attivita-e-startup"], article: "analisi-dei-costi-sprechi-margini", faqs: [{ question: "Serve disporre di dati perfetti?", answer: "No. Si valuta ciò che esiste e si migliora gradualmente la qualità delle informazioni." }, { question: "È possibile analizzare un singolo punto vendita?", answer: "Sì, definendo un perimetro utile e confrontabile." }] },
  { slug: "studi-professionali", title: "Consulenza per studi professionali", description: "Organizzazione, procedure e controllo per studi professionali che vogliono rendere più leggibili capacità e redditività.", intro: "Gli studi professionali devono coordinare scadenze, carichi, competenze e relazione con i clienti. Procedure e indicatori essenziali aiutano a proteggere qualità e continuità.", priorities: ["Flussi di incarico e scadenze", "Carichi e capacità", "Procedure amministrative", "Digitalizzazione dei processi"], relatedCompetences: ["procedure-amministrative", "digitalizzazione-dei-processi", "organizzazione-aziendale"], article: "controllo-di-gestione-pmi-redditivita", faqs: [{ question: "Il supporto riguarda l’attività professionale riservata?", answer: "No. Riguarda organizzazione e gestione; le prestazioni riservate restano ai professionisti abilitati." }, { question: "Si possono rivedere solo i processi amministrativi?", answer: "Sì, delimitando attività, responsabilità e risultati attesi." }] },
  { slug: "condomini", title: "Coordinamento per condomini e immobili", description: "Project e facility management per coordinare interventi, manutenzioni e fornitori su condomini e immobili.", intro: "Interventi tecnici e manutenzioni coinvolgono più soggetti, scadenze e responsabilità. Una regia operativa migliora tracciabilità e comunicazione, nel rispetto delle competenze dell’amministratore e dei tecnici abilitati.", priorities: ["Pianificazione degli interventi", "Coordinamento fornitori", "Controllo tempi e avanzamento", "Raccolta documentale"], relatedCompetences: ["facility-management", "project-management", "ottimizzazione-dei-processi"], article: "project-management-riqualificazione", faqs: [{ question: "Sostituite amministratore o direttore lavori?", answer: "No. Il coordinamento non sostituisce ruoli, responsabilità o attività professionali riservate." }, { question: "È possibile gestire un singolo intervento?", answer: "Sì, con perimetro, interlocutori e modalità di rendicontazione definiti." }] },
  { slug: "privati", title: "Coordinamento di progetti per privati", description: "Supporto organizzativo per privati che devono coordinare progetti, fornitori e professionisti su interventi complessi.", intro: "Un progetto personale può richiedere decisioni, documenti e fornitori difficili da coordinare. Il supporto crea un quadro operativo senza sostituire progettisti, imprese o altri professionisti.", priorities: ["Definizione del perimetro", "Piano di attività e decisioni", "Coordinamento degli interlocutori", "Monitoraggio di tempi e priorità"], relatedCompetences: ["project-management", "facility-management", "ottimizzazione-dei-processi"], article: "project-management-riqualificazione", faqs: [{ question: "Fornite consulenza tecnica riservata?", answer: "No. Le attività tecniche riservate sono svolte esclusivamente da professionisti abilitati." }, { question: "Come viene definito il supporto?", answer: "Con un perimetro scritto che chiarisce obiettivi, responsabilità e interlocutori." }] },
];
