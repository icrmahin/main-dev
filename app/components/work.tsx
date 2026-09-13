"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight } from "lucide-react";

/* ---------------------------------------------------------------------------
   Types
   --------------------------------------------------------------------------- */

interface Project {
  readonly id: string;
  readonly number: string;
  readonly title: string;
  readonly description: string;
  readonly category: string;
  readonly year: string;
  readonly href: string;
  readonly image?: string;
}

/* ---------------------------------------------------------------------------
   Project data
   --------------------------------------------------------------------------- */

const PROJECTS: readonly Project[] = [
  {
    id: "project-01",
    number: "01",
    title: "Nova Dashboard",
    description:
      "A real-time analytics platform for monitoring product performance, user engagement, and system health across multiple services.",
    category: "Product Engineering",
    year: "2026",
    href: "#",
  },
  {
    id: "project-02",
    number: "02",
    title: "Relay",
    description:
      "A collaborative design tool that bridges the gap between design intent and engineering implementation with live component preview.",
    category: "Design + Engineering",
    year: "2025",
    href: "#",
  },
  {
    id: "project-03",
    number: "03",
    title: "Arclight AI",
    description:
      "An AI-powered content pipeline that generates, edits, and publishes structured product documentation from natural language.",
    category: "AI + Product",
    year: "2025",
    href: "#",
  },
  {
    id: "project-04",
    number: "04",
    title: "Verdant",
    description:
      "A sustainability tracking dashboard for teams to measure, report, and reduce their environmental footprint.",
    category: "Brand + Frontend",
    year: "2024",
    href: "#",
  },
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

export default function Work() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  /* ---- scroll reveal via IntersectionObserver ---- */
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
        ? Array.from(gridRef.current.querySelectorAll("[data-project-card]"))
        : [];
      const all = [...headerEls, ...cards];

      gsap.set(all, { opacity: 0, y: 16 });

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
              { opacity: 1, y: 0, duration: 0.6, ease: EASE },
              headerEls.length * 0.08 + i * 0.08,
            );
          });

          observer.disconnect();
        },
        { threshold: 0.1 },
      );

      observer.observe(section);
      return () => observer.disconnect();
    },
    { scope: sectionRef },
  );

  /* ---- card hover interactions ---- */
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const grid = gridRef.current;
      if (!grid) return;

      const cleanups: Array<() => void> = [];
      const cards = grid.querySelectorAll("[data-project-card]");

      cards.forEach((card) => {
        const img = card.querySelector("[data-card-image]");
        const arrow = card.querySelector("[data-card-arrow]");
        const title = card.querySelector("[data-card-title]");

        const onEnter = () => {
          /* image scale */
          if (img) gsap.to(img, { scale: 1.018, duration: 0.6, ease: EASE });
          /* card rise */
          gsap.to(card, { y: -2, duration: 0.35, ease: EASE });
          /* arrow move */
          if (arrow) gsap.to(arrow, { x: 4, duration: 0.3, ease: EASE });
          /* title shift */
          if (title) gsap.to(title, { x: 1, duration: 0.3, ease: EASE });
          /* dim siblings */
          cards.forEach((sibling) => {
            if (sibling !== card) {
              gsap.to(sibling, { opacity: 0.7, duration: 0.3, ease: EASE });
            }
          });
        };

        const onLeave = () => {
          if (img) gsap.to(img, { scale: 1, duration: 0.5, ease: EASE });
          gsap.to(card, { y: 0, duration: 0.35, ease: EASE });
          if (arrow) gsap.to(arrow, { x: 0, duration: 0.25, ease: EASE });
          if (title) gsap.to(title, { x: 0, duration: 0.25, ease: EASE });
          cards.forEach((sibling) => {
            if (sibling !== card) {
              gsap.to(sibling, { opacity: 1, duration: 0.3, ease: EASE });
            }
          });
        };

        /* keyboard focus */
        const onFocus = () => {
          if (img) gsap.to(img, { scale: 1.018, duration: 0.6, ease: EASE });
          gsap.to(card, { y: -2, duration: 0.35, ease: EASE });
          if (arrow) gsap.to(arrow, { x: 4, duration: 0.3, ease: EASE });
          if (title) gsap.to(title, { x: 1, duration: 0.3, ease: EASE });
        };

        const onBlur = () => {
          if (img) gsap.to(img, { scale: 1, duration: 0.5, ease: EASE });
          gsap.to(card, { y: 0, duration: 0.35, ease: EASE });
          if (arrow) gsap.to(arrow, { x: 0, duration: 0.25, ease: EASE });
          if (title) gsap.to(title, { x: 0, duration: 0.25, ease: EASE });
        };

        card.addEventListener("mouseenter", onEnter);
        card.addEventListener("mouseleave", onLeave);
        card.addEventListener("focus", onFocus);
        card.addEventListener("blur", onBlur);

        cleanups.push(() => {
          card.removeEventListener("mouseenter", onEnter);
          card.removeEventListener("mouseleave", onLeave);
          card.removeEventListener("focus", onFocus);
          card.removeEventListener("blur", onBlur);
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
      id="work"
      aria-label="Selected work"
      className="container-center section-space"
    >
      {/* ---- header ---- */}
      <div ref={headerRef} className="mb-10 max-md:mb-7">
        <span className="section-label">Selected Work</span>
        <h2 className="section-heading mb-3">
          Products I&apos;ve designed
          <br className="max-md:hidden" />{" "}
          <span className="text-[var(--color-ink-tertiary)]">and engineered.</span>
        </h2>
        <p className="max-w-[440px] text-[14px] leading-[1.6] text-[var(--color-ink-secondary)]">
          A selection of projects spanning product engineering, interface design,
          frontend systems, and AI — built from concept through production.
        </p>
      </div>

      {/* ---- project grid ---- */}
      <div
        ref={gridRef}
        className="grid grid-cols-2 gap-4 max-md:grid-cols-1"
      >
        {PROJECTS.map((project) => (
          <Link
            key={project.id}
            href={project.href}
            data-project-card
            className="group flex flex-col rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-3 text-left transition-[border-color,box-shadow] duration-300 ease-[var(--ease-soft)] hover:border-[var(--color-border)] hover:shadow-[var(--shadow-md)]"
            style={{ willChange: "transform" }}
            aria-label={`${project.title} — ${project.category}`}
          >
            {/* image area */}
            <div
              data-card-image
              className="relative mb-3 aspect-[16/10] w-full overflow-hidden rounded-xl bg-[var(--color-background-subtle)]"
              style={{ willChange: "transform" }}
            >
              {project.image ? (
                <img
                  src={project.image}
                  alt={project.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <span className="text-[13px] font-medium text-[var(--color-ink-muted)]">
                    {project.title}
                  </span>
                </div>
              )}

              {/* hover affordance */}
              <div
                data-card-arrow
                className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-surface)] text-[var(--color-ink-muted)] opacity-0 shadow-[var(--shadow-sm)] transition-[opacity] duration-300 group-hover:opacity-100"
              >
                <ArrowUpRight size={14} strokeWidth={2} />
              </div>
            </div>

            {/* content */}
            <div className="flex flex-1 flex-col px-1 pb-1">
              <div className="flex items-start justify-between gap-3">
                <h3
                  data-card-title
                  className="text-[16px] font-medium leading-[1.3] tracking-[-0.01em] text-[var(--color-ink)] max-md:text-[15px]"
                  style={{ willChange: "transform" }}
                >
                  {project.title}
                </h3>
                <span className="mt-0.5 shrink-0 text-[11px] font-medium tabular-nums text-[var(--color-ink-muted)]">
                  {project.number}
                </span>
              </div>

              <p className="mt-1 text-[12px] leading-[1.5] text-[var(--color-ink-secondary)]">
                {project.description}
              </p>

              {/* metadata */}
              <div className="mt-auto flex items-center gap-2 pt-3">
                <span className="text-[11px] font-medium text-[var(--color-ink-tertiary)]">
                  {project.category}
                </span>
                <span className="text-[var(--color-ink-muted)]">·</span>
                <span className="text-[11px] font-medium text-[var(--color-ink-muted)]">
                  {project.year}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* ---- concluding link ---- */}
      <div className="mt-8 max-md:mt-6">
        <Link
          href="#"
          className="group inline-flex items-center gap-1.5 text-[12px] font-medium text-[var(--color-ink-tertiary)] transition-colors duration-200 hover:text-[var(--color-ink)]"
        >
          View all work
          <ArrowUpRight
            size={12}
            strokeWidth={2}
            className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </Link>
      </div>
    </section>
  );
}
