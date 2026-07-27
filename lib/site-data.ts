import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  BriefcaseBusiness,
  Building2,
  ChartNoAxesCombined,
  ClipboardCheck,
  Compass,
  Factory,
  Handshake,
  Landmark,
  LineChart,
  Settings2,
  Wrench,
} from "lucide-react";

export const siteConfig = {
  name: "Paride Sansò Advisory",
  shortName: "Sansò Advisory",
  description:
    "Consulenza amministrativa, finanziaria, strategica e tecnica per imprese e professionisti.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.sansoadvisory.it",
  email: "info@sansoadvisory.it",
  phone: "+39 328 931 4424",
  phoneHref: "tel:+393289314424",
  whatsapp:
    "https://wa.me/393289314424?text=Buongiorno,%20vorrei%20richiedere%20una%20consulenza.",
} as const;

export type Service = {
  slug: string;
  title: string;
  eyebrow: string;
  summary: string;
  description: string;
  icon: LucideIcon;
  features: string[];
  note?: string;
};

export const services: Service[] = [
  {
    slug: "amministrativa",
    title: "Consulenza amministrativa",
    eyebrow: "Organizzazione e controllo",
    summary: "Processi più chiari, dati affidabili e una gestione più consapevole.",
    description:
      "Affianchiamo l’impresa nell’organizzazione dei flussi amministrativi e nel controllo delle leve che incidono sulle performance quotidiane.",
    icon: ClipboardCheck,
    features: ["Organizzazione aziendale", "Procedure amministrative", "Controllo di gestione", "Analisi dei costi", "Ottimizzazione dei processi", "Pianificazione amministrativa"],
  },
  {
    slug: "finanziaria",
    title: "Consulenza finanziaria",
    eyebrow: "Visione e sostenibilità",
    summary: "Strumenti concreti per pianificare risorse, investimenti e crescita.",
    description:
      "Costruiamo analisi e documentazione solide per aiutare l’impresa a dialogare con il mercato finanziario e prendere decisioni informate.",
    icon: Landmark,
    features: ["Business Plan", "Pianificazione finanziaria", "Analisi flussi di cassa", "Budget aziendale", "Documentazione per richieste di finanziamento", "Rapporti con banche, leasing e partner finanziari", "Ricerca incentivi e bandi"],
    note: "Le attività soggette ad autorizzazione sono svolte esclusivamente dai professionisti abilitati.",
  },
  {
    slug: "strategica",
    title: "Consulenza strategica",
    eyebrow: "Direzione e crescita",
    summary: "Dalla nuova iniziativa alla riorganizzazione: una rotta costruita sui tuoi obiettivi.",
    description:
      "Trasformiamo obiettivi e complessità in un piano d’azione concreto, coordinando competenze diverse attorno alla crescita dell’azienda.",
    icon: Compass,
    features: ["Apertura nuove attività", "Start-up", "Riorganizzazione aziendale", "Sviluppo del business", "Ottimizzazione dei costi", "Pianificazione della crescita"],
  },
  {
    slug: "tecnici",
    title: "Servizi tecnici",
    eyebrow: "Spazi e operatività",
    summary: "Gestione coordinata di immobili, fornitori e interventi tecnici.",
    description:
      "Diamo continuità alla gestione degli immobili e degli interventi, con un presidio operativo attento a tempi, qualità e interlocutori.",
    icon: Wrench,
    features: ["Coordinamento lavori", "Facility Management", "Gestione manutenzioni", "Piccole opere murarie", "Coordinamento fornitori", "Riqualificazione immobili"],
  },
  {
    slug: "project-management",
    title: "Project management",
    eyebrow: "Metodo e controllo",
    summary: "Progetti governati con precisione, dall’avvio alla consegna.",
    description:
      "Uniamo pianificazione, monitoraggio e coordinamento per mantenere progetti complessi sotto controllo e creare risultati misurabili.",
    icon: ChartNoAxesCombined,
    features: ["Gestione progetti", "Controllo costi", "Pianificazione", "Coordinamento professionisti", "Controllo tempi", "Supervisione lavori"],
  },
];

export const sectors = [
  { title: "PMI", icon: Factory },
  { title: "Ristorazione", icon: Building2 },
  { title: "Bar", icon: BriefcaseBusiness },
  { title: "Hotel & Hospitality", icon: Handshake },
  { title: "Attività commerciali", icon: Settings2 },
  { title: "Studi professionali", icon: BarChart3 },
  { title: "Condomini", icon: Building2 },
  { title: "Privati", icon: LineChart },
];

export const advantages = [
  "Un unico referente",
  "Rete di professionisti qualificati",
  "Soluzioni personalizzate",
  "Riduzione dei costi",
  "Rapidità operativa",
  "Esperienza multidisciplinare",
  "Supporto continuo",
];

export const faqs = [
  { question: "A chi si rivolge Paride Sansò Advisory?", answer: "A PMI, imprenditori, professionisti, attività commerciali, realtà dell’hospitality, condomini e privati che cercano un partner di coordinamento affidabile." },
  { question: "Posso richiedere un supporto per un singolo progetto?", answer: "Sì. Definiamo insieme perimetro, priorità e modalità di affiancamento, sia per esigenze puntuali sia per percorsi continuativi." },
  { question: "Come collaborate con i professionisti abilitati?", answer: "Coordiniamo una rete qualificata. Le attività che richiedono specifiche abilitazioni sono svolte esclusivamente dai professionisti competenti e regolarmente abilitati." },
  { question: "Come posso prenotare un appuntamento?", answer: "Puoi inviare il modulo, chiamarci, scriverci via email o WhatsApp. Ti ricontatteremo per concordare il confronto iniziale." },
];

export const networkProfessionals = ["Commercialisti", "Consulenti del lavoro", "Avvocati", "Architetti", "Ingegneri", "Geometri", "Mediatori creditizi e broker del credito", "Imprese artigiane", "Tecnici specializzati", "Esperti sicurezza"];

export const articles = [
  { slug: "pianificazione-finanziaria-pmi", category: "Finanza", title: "Pianificazione finanziaria: una guida pratica per le PMI", excerpt: "Budget, flussi di cassa e scenari: le basi per decidere con maggiore consapevolezza.", date: "12 giugno 2026", readingTime: "5 min" },
  { slug: "controllo-gestione-crescita", category: "Gestione", title: "Il controllo di gestione come leva per la crescita", excerpt: "Dai dati alla decisione: gli indicatori che aiutano a leggere davvero l’andamento dell’impresa.", date: "28 maggio 2026", readingTime: "6 min" },
  { slug: "project-management-riqualificazione", category: "Project management", title: "Riqualificazione immobiliare: perché il coordinamento fa la differenza", excerpt: "Tempi, costi e fornitori: come dare struttura a un progetto tecnico complesso.", date: "6 maggio 2026", readingTime: "4 min" },
];
