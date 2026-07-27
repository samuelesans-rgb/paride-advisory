import { cn } from "@/lib/utils";

export function SectionHeading({ eyebrow, title, description, className }: { eyebrow: string; title: string; description?: string; className?: string }) {
  return <div className={cn("max-w-3xl", className)}><p className="eyebrow">{eyebrow}</p><h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-navy sm:text-4xl lg:text-5xl">{title}</h2>{description && <p className="mt-5 text-lg leading-8 text-slate-600">{description}</p>}</div>;
}
