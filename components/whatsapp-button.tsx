import { MessageCircle } from "lucide-react";
import { siteConfig } from "@/lib/site-data";

export function WhatsAppButton() { return <a href={siteConfig.whatsapp} target="_blank" rel="noreferrer" aria-label="Contattaci su WhatsApp" className="fixed bottom-5 right-5 z-50 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl transition hover:scale-105"><MessageCircle className="size-6" /></a>; }
