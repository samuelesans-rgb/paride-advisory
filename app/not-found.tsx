import Link from "next/link";

export default function NotFound() {
  return <section className="container flex min-h-[60vh] max-w-3xl flex-col justify-center py-20"><p className="eyebrow">Errore 404</p><h1 className="mt-5 text-5xl font-semibold tracking-[-0.06em] text-navy sm:text-7xl">Questa pagina non esiste.</h1><p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">Potrebbe essere stata spostata o l’indirizzo potrebbe non essere corretto.</p><Link className="button-primary mt-9 w-fit" href="/">Torna alla home</Link></section>;
}
