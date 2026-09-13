"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

/* ---------------------------------------------------------------------------
   Helpers
   --------------------------------------------------------------------------- */

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/* ---------------------------------------------------------------------------
   Component
   --------------------------------------------------------------------------- */

export default function Loading({ onComplete }: { onComplete?: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  /* ---- animation ---- */
  useGSAP(
    () => {
      const container = containerRef.current;
      const brand = brandRef.current;
      const progress = progressRef.current;
      if (!container || !brand || !progress) return;

      if (prefersReducedMotion()) {
        gsap.set(container, { opacity: 1 });
        gsap.set(brand, { opacity: 1, y: 0 });
        gsap.set(progress, { opacity: 1 });
        /* quick finish for reduced motion */
        const timer = setTimeout(() => {
          gsap.to(container, {
            opacity: 0,
            duration: 0.2,
            onComplete: () => {
              setVisible(false);
              onComplete?.();
            },
          });
        }, 200);
        return () => clearTimeout(timer);
      }

      /* initial states */
      gsap.set(container, { opacity: 1 });
      gsap.set(brand, { opacity: 0, y: 8 });
      gsap.set(progress, { opacity: 0 });

      const tl = gsap.timeline();

      /* brand entrance */
      tl.to(brand, { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" }, 0);

      /* progress bar entrance */
      tl.to(progress, { opacity: 1, duration: 0.3, ease: "power2.out" }, 0.15);

      /* simulate progress */
      const progressObj = { value: 0 };
      tl.to(
        progressObj,
        {
          value: 100,
          duration: 0.8,
          ease: "power2.inOut",
          onUpdate: () => {
            setProgress(Math.round(progressObj.value));
          },
        },
        0.1,
      );

      /* exit */
      tl.to(
        container,
        {
          opacity: 0,
          duration: 0.35,
          ease: "power2.in",
          onComplete: () => {
            setVisible(false);
            onComplete?.();
          },
        },
        ">-0.1",
      );
    },
    { scope: containerRef },
  );

  /* ---- fallback: if GSAP fails, remove loader after 2s ---- */
  useEffect(() => {
    const timer = setTimeout(() => {
      if (visible) {
        setVisible(false);
        onComplete?.();
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [visible, onComplete]);

  if (!visible) return null;

  return (
    <div
      ref={containerRef}
      aria-label="Loading"
      role="status"
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[var(--color-background)]"
      style={{ opacity: 0 }}
    >
      {/* brand mark */}
      <div ref={brandRef} className="flex flex-col items-center gap-4">
        <span className="text-[18px] font-semibold tracking-[-0.02em] text-[var(--color-ink)]">
          MAHIN
        </span>
      </div>

      {/* progress */}
      <div ref={progressRef} className="mt-6 flex items-center gap-2">
        <span className="text-[11px] font-medium tabular-nums text-[var(--color-ink-muted)]">
          {progress}%
        </span>
      </div>
    </div>
  );
}
