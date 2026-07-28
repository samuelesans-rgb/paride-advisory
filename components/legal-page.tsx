import type { ReactNode } from "react";

export function LegalPage({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children: ReactNode }) {
  return (
    <>
      <section className="bg-slate-50 py-20 sm:py-24"><div className="container max-w-4xl"><p className="eyebrow">{eyebrow}</p><h1 className="mt-5 text-4xl font-semibold tracking-[-.05em] text-navy sm:text-6xl">{title}</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">{description}</p></div></section>
      <article className="container max-w-4xl py-16 sm:py-20"><div className="space-y-10 text-base leading-7 text-slate-700 [&_a]:font-medium [&_a]:text-navy [&_a]:underline [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-[-.03em] [&_h2]:text-navy [&_li]:ml-5 [&_li]:list-disc [&_p]:mt-3 [&_ul]:mt-3">{children}</div></article>
    </>
  );
}
