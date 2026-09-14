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

/* Number of identical copies rendered so the viewport never runs out of content. */
const COPIES = 4;

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
        const firstSet = track.querySelector("[data-marquee-set]");
        const secondSet = firstSet ? (firstSet.nextElementSibling as HTMLElement | null) : null;
        if (!firstSet || !secondSet) return;

        /* True period = distance between the first item of two adjacent copies.
           This includes the inter-copy gap, keeping the loop pixel-perfect. */
        const period =
          secondSet.getBoundingClientRect().left - firstSet.getBoundingClientRect().left;

        if (tween) tween.kill();

        gsap.set(track, { x: 0 });

        tween = gsap.to(track, {
          x: -period,
          duration: period / 30,
          ease: "none",
          repeat: -1,
        });
      };

      /* wait a tick for layout to settle */
      const raf = requestAnimationFrame(setup);

      /* re-measure when content/layout shifts (font load, resize) */
      const ro = new ResizeObserver(setup);
      ro.observe(track);

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
        ro.disconnect();
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
            {Array.from({ length: COPIES }).map((_, copy) => (
              <div
                key={copy}
                className="flex shrink-0 items-center gap-10"
                aria-hidden={copy > 0}
                {...(copy === 0 ? { "data-marquee-set": "" } : {})}
              >
                {COMPANIES.map((name) => (
                  <span
                    key={`${copy}-${name}`}
                    className="whitespace-nowrap text-[13px] font-medium tracking-[0.01em] text-[var(--color-ink-muted)] select-none"
                  >
                    {name}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
