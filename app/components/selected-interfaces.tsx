"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

/* ---------------------------------------------------------------------------
   Types
   --------------------------------------------------------------------------- */

interface InterfaceItem {
  readonly id: string;
  readonly label: string;
  readonly image?: string;
  readonly aspect?: string;
}

/* ---------------------------------------------------------------------------
   Data — use placeholders where real images are unavailable
   --------------------------------------------------------------------------- */

const INTERFACES: readonly InterfaceItem[] = [
  { id: "if-01", label: "Dashboard", aspect: "4/3" },
  { id: "if-02", label: "Mobile App", aspect: "3/4" },
  { id: "if-03", label: "Analytics", aspect: "4/3" },
  { id: "if-04", label: "E-commerce", aspect: "4/3" },
  { id: "if-05", label: "Onboarding", aspect: "3/4" },
  { id: "if-06", label: "Settings", aspect: "4/3" },
] as const;

/* ---------------------------------------------------------------------------
   Animation constants
   --------------------------------------------------------------------------- */

const EASE = "power3.out" as const;

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

export default function SelectedInterfaces() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  /* ---- scroll reveal ---- */
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      const section = sectionRef.current;
      if (!section) return;

      let revealed = false;

      const headerEls = headerRef.current
        ? Array.from(headerRef.current.children)
        : [];
      const tiles = gridRef.current
        ? Array.from(gridRef.current.querySelectorAll("[data-interface-tile]"))
        : [];
      const all = [...headerEls, ...tiles];

      gsap.set(all, { opacity: 0, y: 12 });

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting || revealed) return;
          revealed = true;

          const tl = gsap.timeline();
          headerEls.forEach((el, i) => {
            tl.to(el, { opacity: 1, y: 0, duration: 0.45, ease: EASE }, i * 0.06);
          });
          tiles.forEach((el, i) => {
            tl.to(
              el,
              { opacity: 1, y: 0, duration: 0.4, ease: EASE },
              headerEls.length * 0.06 + i * 0.05,
            );
          });

          observer.disconnect();
        },
        { threshold: 0.08 },
      );

      observer.observe(section);
      return () => observer.disconnect();
    },
    { scope: sectionRef },
  );

  /* ---- tile hover ---- */
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const grid = gridRef.current;
      if (!grid) return;

      const cleanups: Array<() => void> = [];
      const tiles = grid.querySelectorAll("[data-interface-tile]");

      tiles.forEach((tile) => {
        const img = tile.querySelector("[data-tile-image]");

        const onEnter = () => {
          if (img) gsap.to(img, { scale: 1.03, duration: 0.35, ease: EASE });
        };
        const onLeave = () => {
          if (img) gsap.to(img, { scale: 1, duration: 0.35, ease: EASE });
        };

        tile.addEventListener("mouseenter", onEnter);
        tile.addEventListener("mouseleave", onLeave);
        cleanups.push(() => {
          tile.removeEventListener("mouseenter", onEnter);
          tile.removeEventListener("mouseleave", onLeave);
        });
      });

      return () => cleanups.forEach((fn) => fn());
    },
    { scope: sectionRef },
  );

  /* ---- render ---- */
  return (
    <section
      ref={sectionRef}
      id="interfaces"
      aria-label="Selected interfaces"
      className="container-center section-space"
    >
      {/* ---- header ---- */}
      <div ref={headerRef} className="mb-8 max-md:mb-6">
        <span className="section-label">
          Selected Interfaces
        </span>
        <h2 className="section-heading mb-3">
          Interface snapshots
        </h2>
        <p className="max-w-[400px] text-[14px] leading-[1.6] text-[var(--color-ink-secondary)]">
          A visual collection of interface work across different products and contexts.
        </p>
      </div>

      {/* ---- grid ---- */}
      <div
        ref={gridRef}
        className="grid grid-cols-3 gap-3 max-md:grid-cols-2"
      >
        {INTERFACES.map((item) => (
          <div
            key={item.id}
            data-interface-tile
            className="group relative overflow-hidden rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] transition-colors duration-200 hover:border-[var(--color-border)]"
          >
            {/* image area */}
            <div
              data-tile-image
              className="relative w-full overflow-hidden bg-[var(--color-background-subtle)]"
              style={{
                aspectRatio: item.aspect || "4/3",
                willChange: "transform",
              }}
            >
              {item.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.image}
                  alt={item.label}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <span className="text-[12px] font-medium text-[var(--color-ink-muted)]">
                    {item.label}
                  </span>
                </div>
              )}
            </div>

            {/* label */}
            <div className="px-3 py-2.5">
              <span className="text-[11px] font-medium text-[var(--color-ink-secondary)]">
                {item.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
