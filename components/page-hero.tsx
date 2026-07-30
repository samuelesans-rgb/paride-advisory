import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  image?: { src: string; alt: string; position: string };
};

export function PageHero({ eyebrow, title, description, image }: PageHeroProps) {
  return <section className="relative overflow-hidden bg-slate-50 py-24 sm:py-32">
    <div className="absolute right-0 top-0 size-[32rem] -translate-y-1/2 translate-x-1/3 rounded-full bg-gold/10 blur-3xl" />
    <div className={image ? "container relative grid items-center gap-12 lg:grid-cols-[1.05fr_.95fr]" : "container relative grid max-w-5xl items-center gap-12"}>
      <div><p className="eyebrow">{eyebrow}</p><h1 className="mt-6 max-w-4xl text-5xl font-semibold leading-[1.02] tracking-[-.06em] text-navy sm:text-7xl">{title}</h1><p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600">{description}</p><Link className="button-primary mt-9 px-6 py-4" href="/contatti">Richiedi una consulenza <ArrowUpRight className="size-4" /></Link></div>
      {image && <div className="relative aspect-[16/9] min-h-64 overflow-hidden bg-navy"><Image src={image.src} alt={image.alt} width={1672} height={941} sizes="(min-width: 1280px) 560px, (min-width: 1024px) 45vw, 100vw" loading="lazy" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: image.position }} /></div>}
    </div>
  </section>;
}
