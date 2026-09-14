"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight } from "lucide-react";
import { CASE_STUDIES } from "../lib/case-study";

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

export default function CaseStudies() {
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
      const cards = gridRef.current
        ? Array.from(gridRef.current.querySelectorAll("[data-case-study]"))
        : [];
      const all = [...headerEls, ...cards];

      gsap.set(all, { opacity: 0, y: 14 });

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting || revealed) return;
          revealed = true;

          const tl = gsap.timeline();
          headerEls.forEach((el, i) => {
            tl.to(el, { opacity: 1, y: 0, duration: 0.5, ease: EASE }, i * 0.08);
          });
          cards.forEach((el, i) => {
            tl.to(
              el,
              { opacity: 1, y: 0, duration: 0.5, ease: EASE },
              headerEls.length * 0.08 + i * 0.08,
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

  /* ---- card hover ---- */
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const grid = gridRef.current;
      if (!grid) return;

      const cleanups: Array<() => void> = [];
      const cards = grid.querySelectorAll("[data-case-study]");

      cards.forEach((card) => {
        const img = card.querySelector("[data-cs-image]");
        const content = card.querySelector("[data-cs-content]");
        const arrow = card.querySelector("[data-cs-arrow]");

        const onEnter = () => {
          if (img) gsap.to(img, { scale: 1.02, duration: 0.4, ease: EASE });
          if (content) gsap.to(content, { y: -2, duration: 0.3, ease: EASE });
          if (arrow) gsap.to(arrow, { x: 3, duration: 0.25, ease: EASE });
        };
        const onLeave = () => {
          if (img) gsap.to(img, { scale: 1, duration: 0.4, ease: EASE });
          if (content) gsap.to(content, { y: 0, duration: 0.3, ease: EASE });
          if (arrow) gsap.to(arrow, { x: 0, duration: 0.25, ease: EASE });
        };

        card.addEventListener("mouseenter", onEnter);
        card.addEventListener("mouseleave", onLeave);
        cleanups.push(() => {
          card.removeEventListener("mouseenter", onEnter);
          card.removeEventListener("mouseleave", onLeave);
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
      id="case-studies"
      aria-label="Case studies"
      className="container-center section-space"
    >
      {/* ---- header ---- */}
      <div ref={headerRef} className="mb-10 max-md:mb-7">
        <span className="section-label">
          Case Studies
        </span>
        <h2 className="section-heading mb-3">
          Deep product work
        </h2>
        <p className="max-w-[420px] text-[14px] leading-[1.6] text-[var(--color-ink-secondary)]">
          Selected case studies showing the full product journey — from problem framing through interface design and engineering.
        </p>
      </div>

      {/* ---- grid ---- */}
      <div
        ref={gridRef}
        className="grid grid-cols-2 gap-4 max-md:grid-cols-1"
      >
        {CASE_STUDIES.map((study) => (
          <Link
            key={study.slug}
            href={`/work/${study.slug}`}
            data-case-study
            className="group flex flex-col rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-3 transition-colors duration-200 hover:border-[var(--color-border)]"
            aria-label={study.title}
          >
            {/* image area */}
            <div
              data-cs-image
              className="relative mb-3 aspect-[4/3] w-full overflow-hidden rounded-xl bg-[var(--color-background-subtle)]"
              style={{ willChange: "transform" }}
            >
              {study.image ? (
                <img
                  src={study.image}
                  alt={study.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <span className="text-[13px] font-medium text-[var(--color-ink-muted)]">
                    {study.title}
                  </span>
                </div>
              )}
            </div>

            {/* content */}
            <div data-cs-content className="flex flex-1 flex-col px-1 pb-1" style={{ willChange: "transform" }}>
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-[15px] font-medium leading-[1.3] tracking-[-0.01em] text-[var(--color-ink)]">
                  {study.title}
                </h3>
                <span
                  data-cs-arrow
                  className="mt-0.5 shrink-0 text-[var(--color-ink-muted)] transition-colors duration-200 group-hover:text-[var(--color-ink-secondary)]"
                >
                  <ArrowUpRight size={14} strokeWidth={2} />
                </span>
              </div>

              <p className="mt-1 text-[12px] leading-[1.5] text-[var(--color-ink-secondary)]">
                {study.description}
              </p>

              {/* metadata */}
              <div className="mt-auto flex items-center gap-2 pt-3">
                {study.role && (
                  <span className="text-[11px] font-medium text-[var(--color-ink-tertiary)]">
                    {study.role}
                  </span>
                )}
                {study.role && study.year && (
                  <span className="text-[var(--color-ink-muted)]">·</span>
                )}
                {study.year && (
                  <span className="text-[11px] font-medium text-[var(--color-ink-muted)]">
                    {study.year}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
