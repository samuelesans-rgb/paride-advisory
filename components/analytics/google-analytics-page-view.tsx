"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

export function GoogleAnalyticsPageView({ measurementId }: { measurementId: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isInitialPageView = useRef(true);

  useEffect(() => {
    if (!window.gtag) return;
    const query = searchParams.toString();
    const pagePath = query ? `${pathname}?${query}` : pathname;

    if (isInitialPageView.current) {
      window.gtag("config", measurementId, { page_path: pagePath });
      isInitialPageView.current = false;
      return;
    }

    window.gtag("event", "page_view", {
      page_path: pagePath,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [measurementId, pathname, searchParams]);

  return null;
}
