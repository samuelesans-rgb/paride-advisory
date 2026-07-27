"use client";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { faqs } from "@/lib/site-data";

export function Faq() { const [active, setActive] = useState<number | null>(0); return <div className="divide-y divide-slate-200 border-y border-slate-200">{faqs.map((faq, index) => <div key={faq.question}><button className="flex w-full items-center justify-between gap-6 py-5 text-left font-semibold text-navy" onClick={() => setActive(active === index ? null : index)} aria-expanded={active === index}>{faq.question}<ChevronDown className={`size-5 shrink-0 transition ${active === index ? "rotate-180" : ""}`} /></button>{active === index && <p className="max-w-2xl pb-6 text-sm leading-7 text-slate-600">{faq.answer}</p>}</div>)}</div>; }
