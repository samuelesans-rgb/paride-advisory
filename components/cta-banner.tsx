import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function CtaBanner({ title = "Costruiamo il prossimo passo della tua impresa.", description = "Raccontaci le tue esigenze: individueremo insieme il percorso più efficace." }: { title?: string; description?: string }) {
  return <section className="px-5 py-16 sm:py-24"><div className="container overflow-hidden bg-navy px-7 py-12 text-white sm:px-12 lg:flex lg:items-center lg:justify-between lg:gap-12 lg:py-16"><div className="max-w-2xl"><p className="eyebrow text-gold">Parliamone insieme</p><h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">{title}</h2><p className="mt-4 text-white/70">{description}</p></div><Link href="/contatti" className="button-gold mt-8 shrink-0 lg:mt-0">Prenota un appuntamento <ArrowUpRight className="size-4" /></Link></div></section>;
}
