"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

/* ---------------------------------------------------------------------------
   Content
   --------------------------------------------------------------------------- */

const COMPANIES = [
  "Pathao",
  "klikit",
  "ACS Future School",
  "Panorama",
  "Better Aid BD",
] as const;

const LABEL = "Worked with";

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

export default function CompanyMarquee() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  /* ---- marquee animation ---- */
  useGSAP(
    () => {
      const track = trackRef.current;
      const section = sectionRef.current;
      if (!track || !section || prefersReducedMotion()) return;

      let tween: gsap.core.Tween | null = null;

      const setup = () => {
        const fullSet = track.querySelector("[data-marquee-set]");
        if (!fullSet) return;

        const setWidth = fullSet.getBoundingClientRect().width;

        gsap.set(track, { x: 0 });

        tween = gsap.to(track, {
          x: -setWidth,
          duration: setWidth / 30,
          ease: "none",
          repeat: -1,
        });
      };

      /* wait a tick for layout to settle */
      const raf = requestAnimationFrame(setup);

      /* hover: slow down */
      const onEnter = () => {
        if (tween) gsap.to(tween, { timeScale: 0.15, duration: 0.6, ease: "power2.out" });
      };
      const onLeave = () => {
        if (tween) gsap.to(tween, { timeScale: 1, duration: 0.6, ease: "power2.out" });
      };

      section.addEventListener("pointerenter", onEnter);
      section.addEventListener("pointerleave", onLeave);

      return () => {
        cancelAnimationFrame(raf);
        section.removeEventListener("pointerenter", onEnter);
        section.removeEventListener("pointerleave", onLeave);
        if (tween) {
          tween.kill();
        }
      };
    },
    { scope: sectionRef },
  );

  /* ---- render ---- */
  return (
    <section
      ref={sectionRef}
      aria-label="Companies"
      className="border-t border-b border-[var(--color-border-subtle)]"
    >
      <div className="container-center">
        {/* label */}
        <div className="pt-5 pb-3">
          <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-[var(--color-ink-muted)]">
            {LABEL}
          </span>
        </div>

        {/* marquee viewport */}
        <div
          className="relative overflow-hidden pb-5"
          style={{
            maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
            WebkitMaskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          }}
        >
          <div ref={trackRef} className="flex items-center gap-10 will-change-transform">
            {/* set 1 */}
            <div data-marquee-set className="flex items-center gap-10 shrink-0">
              {COMPANIES.map((name) => (
                <span
                  key={name}
                  className="whitespace-nowrap text-[13px] font-medium tracking-[0.01em] text-[var(--color-ink-muted)] select-none"
                >
                  {name}
                </span>
              ))}
            </div>
            {/* set 2 (duplicate for seamless loop) */}
            <div className="flex items-center gap-10 shrink-0" aria-hidden="true">
              {COMPANIES.map((name) => (
                <span
                  key={`dup-${name}`}
                  className="whitespace-nowrap text-[13px] font-medium tracking-[0.01em] text-[var(--color-ink-muted)] select-none"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
