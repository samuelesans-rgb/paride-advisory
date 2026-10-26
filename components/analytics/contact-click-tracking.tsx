"use client";

import { useEffect } from "react";
import { trackContactClick } from "@/lib/conversion-events";

export function ContactClickTracking() {
  useEffect(() => {
    const lastClick = new WeakMap<HTMLAnchorElement, number>();
    const onClick = (event: MouseEvent) => {
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
      const href = link?.getAttribute("href") || "";
      const kind = /^mailto:/i.test(href) ? "email" : /^tel:/i.test(href) ? "phone" : null;
      if (!link || !kind || event.defaultPrevented) return;
      const now = Date.now();
      if (now - (lastClick.get(link) ?? 0) < 750) return;
      lastClick.set(link, now);
      trackContactClick(kind);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}
