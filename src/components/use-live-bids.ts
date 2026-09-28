"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

// Runs `tick` on an interval only while `target` is on screen, the tab is
// visible and the visitor has not asked for reduced motion.
export function useLiveTicker<T extends Element>(tick: () => void, everyMs: number, enabled = true) {
  const ref = useRef<T | null>(null);
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const tickRef = useRef(tick);
  tickRef.current = tick;

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!enabled || reduce || !visible) return;
    const id = window.setInterval(() => {
      if (!document.hidden) tickRef.current();
    }, everyMs);
    return () => window.clearInterval(id);
  }, [enabled, reduce, visible, everyMs]);

  return { ref, running: enabled && !reduce && visible, reduce: !!reduce };
}
