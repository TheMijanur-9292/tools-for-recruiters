"use client";

import { useEffect, useMemo, useState } from "react";
import { MODULES } from "@/lib/modules";

const VISIBLE_CARDS = 4;

function getVisibleModules(startIndex: number) {
  return Array.from({ length: VISIBLE_CARDS }, (_, offset) => {
    return MODULES[(startIndex + offset) % MODULES.length];
  });
}

export function HeroModuleSlider() {
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setStartIndex((prev) => (prev + 1) % MODULES.length);
    }, 2200);

    return () => window.clearInterval(interval);
  }, []);

  const visibleModules = useMemo(() => getVisibleModules(startIndex), [startIndex]);

  return (
    <div className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm">
      <p className="text-xs font-semibold uppercase tracking-widest text-cyan-300">What&apos;s Inside</p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {visibleModules.map((module, idx) => (
          <div
            key={`${module.id}-${startIndex}-${idx}`}
            className="hero-slide-in rounded-xl border border-white/12 bg-white/5 px-3 py-3 text-center"
          >
            <p className="font-display text-2xl font-bold text-white">
              {((startIndex + idx) % MODULES.length) + 1}
            </p>
            <p className="mt-0.5 text-xs text-blue-200">{module.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}