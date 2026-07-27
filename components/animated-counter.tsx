"use client";

import { animate, useInView, useMotionValue, useMotionValueEvent, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export function AnimatedCounter({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduceMotion = useReducedMotion();
  const target = Number.parseInt(value, 10);
  const count = useMotionValue(0);
  const [display, setDisplay] = useState(reduceMotion ? target : 0);
  useMotionValueEvent(count, "change", (latest) => setDisplay(Math.round(latest)));
  useEffect(() => {
    if (!inView || reduceMotion) return;
    const controls = animate(count, target, { duration: 1.2, ease: "easeOut" });
    return () => controls.stop();
  }, [count, inView, reduceMotion, target]);
  return <span ref={ref}>{display}{value.includes("+") ? "+" : ""}</span>;
}
