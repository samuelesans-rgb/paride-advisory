import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type BreadcrumbItem = { label: string; href?: string };

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return <nav aria-label="Breadcrumb" className="container py-5"><ol className="flex flex-wrap items-center gap-2 text-xs text-slate-500">{items.map((item, index) => <li className="flex items-center gap-2" key={`${item.label}-${index}`}>{index > 0 && <ChevronRight aria-hidden="true" className="size-3" />}{item.href ? <Link className="rounded-sm transition hover:text-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold" href={item.href}>{item.label}</Link> : <span aria-current="page" className="text-navy">{item.label}</span>}</li>)}</ol></nav>;
}
