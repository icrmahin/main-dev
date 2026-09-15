"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type { ProjectSection } from "../../lib/projects";
import { CaseStudyGallery } from "./CaseStudyGallery";
import { CaseStudyMedia } from "./CaseStudyMedia";
import { EngineeringViz } from "./EngineeringViz";

/* ---------------------------------------------------------------------------
   Helpers
   --------------------------------------------------------------------------- */

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/* ---------------------------------------------------------------------------
   Types
   --------------------------------------------------------------------------- */

interface CaseStudySectionProps {
  readonly section: ProjectSection;
}

/* ---------------------------------------------------------------------------
   Component
   --------------------------------------------------------------------------- */

export function CaseStudySection({ section }: CaseStudySectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const revealed = useRef(false);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !sectionRef.current) return;
      const el = sectionRef.current;
      const targets = el.querySelectorAll("[data-reveal]");

      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting && !revealed.current) {
              revealed.current = true;
              gsap.fromTo(
                targets,
                { opacity: 0, y: 14 },
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.55,
                  ease: "power3.out",
                  stagger: 0.07,
                },
              );
              observer.disconnect();
            }
          }
        },
        { threshold: 0.12 },
      );

      observer.observe(el);
      return () => observer.disconnect();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id={section.id}
      data-nav-section={section.label}
      className="scroll-mt-28"
    >
      <div data-reveal className="mb-3 flex items-center gap-3 opacity-0">
        <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--color-ink-tertiary)]">
          {section.kicker}
        </span>
        <span
          className="h-px w-10 bg-[var(--color-border)]"
          aria-hidden="true"
        />
      </div>

      <h2
        data-reveal
        className="text-[21px] font-[600] leading-[1.25] tracking-[-0.018em] text-[var(--color-ink)] opacity-0 max-md:text-[19px]"
      >
        {section.label}
      </h2>

      <div
        data-reveal
        className="mt-3 max-w-[640px] space-y-3.5 text-[14px] leading-[1.7] text-[var(--color-ink-secondary)] opacity-0"
      >
        {section.intro.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>

      {section.bullets && section.bullets.length > 0 && (
        <ul data-reveal className="mt-5 max-w-[640px] space-y-2 opacity-0">
          {section.bullets.map((bullet, index) => (
            <li
              key={index}
              className="flex items-start gap-3 text-[13.5px] leading-[1.6] text-[var(--color-ink-secondary)]"
            >
              <span
                className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-[var(--color-ink-muted)]"
                aria-hidden="true"
              />
              {bullet}
            </li>
          ))}
        </ul>
      )}

      {section.media && (
        <div data-reveal className="opacity-0">
          <CaseStudyMedia media={section.media} />
        </div>
      )}

      {section.gallery && section.gallery.length > 0 && (
        <div data-reveal className="opacity-0">
          <CaseStudyGallery gallery={section.gallery} />
        </div>
      )}

      {section.diagram && (
        <div data-reveal className="opacity-0">
          <EngineeringViz flow={section.diagram} />
        </div>
      )}
    </section>
  );
}
