"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, Phone, X } from "lucide-react";
import { useId, useState } from "react";
import { siteConfig } from "@/lib/site-data";

const links = [
  { href: "/chi-siamo", label: "Chi siamo" },
  { href: "/servizi", label: "Servizi" },
  { href: "/network", label: "Network" },
  { href: "/settori", label: "Settori" },
  { href: "/blog", label: "Insights" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const mobileMenuId = useId();
  return <header className="sticky top-0 z-50 border-b border-navy/10 bg-white/95 backdrop-blur"><a className="sr-only absolute left-4 top-4 z-[60] bg-navy px-4 py-3 text-sm font-semibold text-white focus:not-sr-only" href="#main-content">Vai al contenuto principale</a><div className="container flex h-20 items-center justify-between"><Link href="/" className="group flex items-center gap-3 rounded-sm text-navy focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold" aria-label="Paride Sansò Advisory, home"><Image src="/images/brand/logo.png" alt="Paride Sansò Advisory" width={1254} height={1254} sizes="(min-width: 1024px) 42px, 34px" className="size-[34px] shrink-0 object-contain lg:size-[42px]" priority /><span><span className="block text-lg font-bold tracking-[-0.04em]">Paride Sansò</span><span className="block -mt-1 text-[10px] font-bold tracking-[0.22em] text-gold">ADVISORY</span></span></Link><nav className="hidden items-center gap-6 lg:flex" aria-label="Navigazione principale">{links.map((link) => <Link className="text-sm font-medium text-slate-600 transition hover:text-navy focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold" href={link.href} key={link.href}>{link.label}</Link>)}</nav><div className="hidden items-center gap-3 sm:flex"><a href={siteConfig.phoneHref} className="rounded-sm p-2 text-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold" aria-label="Chiama Paride Sansò Advisory"><Phone className="size-4" /></a><Link href="/contatti" className="button-primary">Richiedi consulenza</Link></div><button className="rounded-sm p-2 text-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold lg:hidden" aria-label={open ? "Chiudi menu" : "Apri menu"} aria-expanded={open} aria-controls={mobileMenuId} onClick={() => setOpen((value) => !value)}>{open ? <X /> : <Menu />}</button></div>{open && <nav id={mobileMenuId} className="border-t border-navy/10 bg-white px-5 py-5 lg:hidden" aria-label="Navigazione mobile">{links.map((link) => <Link className="block border-b border-slate-100 py-3 font-medium text-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold" href={link.href} onClick={() => setOpen(false)} key={link.href}>{link.label}</Link>)}<Link className="button-primary mt-5 w-full" href="/contatti" onClick={() => setOpen(false)}>Richiedi consulenza</Link></nav>}</header>;
}
