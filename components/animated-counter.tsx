"use client";

import { useEffect, useRef, useState } from "react";

export function AnimatedCounter({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const target = Number.parseInt(value, 10);
  // Keep the authored value available in SSR and on the first hydration render.
  const [display, setDisplay] = useState(target);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let start: number | undefined;
    const tick = (timestamp: number) => {
      start ??= timestamp;
      const progress = Math.min((timestamp - start) / 1200, 1);
      setDisplay(Math.round(target * (1 - (1 - progress) ** 3)));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      frame = requestAnimationFrame(tick);
    });
    const onPreferenceChange = () => {
      if (!reducedMotion.matches) return;
      observer.disconnect();
      cancelAnimationFrame(frame);
      setDisplay(target);
    };
    if (reducedMotion.matches) frame = requestAnimationFrame(() => setDisplay(target));
    else observer.observe(element);
    reducedMotion.addEventListener("change", onPreferenceChange);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      reducedMotion.removeEventListener("change", onPreferenceChange);
    };
  }, [target]);

  return <span ref={ref}><span className="sr-only">{value}</span><span aria-hidden="true">{display}{value.includes("+") ? "+" : ""}</span></span>;
}
