"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight } from "lucide-react";
import { PROJECTS } from "../lib/projects";
import ProjectCard from "./project-card";

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

      gsap.set(headerEls, { opacity: 0, y: 16 });

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting || revealed) return;
          revealed = true;

          const tl = gsap.timeline();

          headerEls.forEach((el, i) => {
            tl.to(el, { opacity: 1, y: 0, duration: 0.5, ease: EASE }, i * 0.08);
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
        data-work-grid
        className="grid grid-cols-2 gap-4 max-md:grid-cols-1"
      >
        {PROJECTS.map((project) => (
          <ProjectCard key={project.id} project={project} />
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
