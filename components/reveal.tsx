"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    element.dataset.revealPending = "";
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      delete element.dataset.revealPending;
      element.animate(
        [{ opacity: 0, transform: "translateY(20px)" }, { opacity: 1, transform: "translateY(0)" }],
        { duration: 550, delay: delay * 1000, easing: "cubic-bezier(.22,1,.36,1)", fill: "backwards" },
      );
    }, { rootMargin: "-60px" });
    observer.observe(element);
    return () => {
      observer.disconnect();
      delete element.dataset.revealPending;
    };
  }, [delay]);

  return <div ref={ref} className={`reveal ${className ?? ""}`}>{children}</div>;
}
