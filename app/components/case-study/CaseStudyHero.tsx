"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type { Project } from "../../lib/projects";
import { TechnologyIcon } from "../technology-icon";

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

interface CaseStudyHeroProps {
  readonly project: Project;
}

const META_FIELDS: Array<{
  key: "role" | "category" | "year" | "client" | "status" | "duration";
  label: string;
}> = [
  { key: "role", label: "Role" },
  { key: "category", label: "Category" },
  { key: "year", label: "Year" },
  { key: "client", label: "Client" },
  { key: "duration", label: "Duration" },
  { key: "status", label: "Status" },
];

/* ---------------------------------------------------------------------------
   Component
   --------------------------------------------------------------------------- */

export function CaseStudyHero({ project }: CaseStudyHeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        ".cs-hero-eyebrow",
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.5 },
      )
        .fromTo(
          ".cs-hero-title",
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.3",
        )
        .fromTo(
          ".cs-hero-desc",
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.5 },
          "-=0.35",
        )
        .fromTo(
          ".cs-hero-meta-row",
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.4 },
          "-=0.25",
        )
        .fromTo(
          ".cs-hero-stack",
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.4 },
          "-=0.2",
        );

      if (visualRef.current) {
        tl.fromTo(
          visualRef.current,
          { opacity: 0, y: 28, scale: 0.985 },
          { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power2.out" },
          "-=0.35",
        );
      }
    },
    { scope: heroRef },
  );

  return (
    <header ref={heroRef} className="pt-32 max-md:pt-24">
      <div className="container-center">
        <div className="max-w-3xl">
          <div className="cs-hero-eyebrow flex flex-wrap items-center gap-2 opacity-0">
            <span className="section-label !mb-0">{project.category}</span>
            <span aria-hidden="true" className="text-[var(--color-ink-muted)]">·</span>
            <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--color-ink-tertiary)]">
              {project.status}
            </span>
          </div>

          <h1
            data-case-study-title
            className="cs-hero-title mt-5 text-[40px] font-semibold leading-[1.05] tracking-[-0.02em] text-[var(--color-ink)] opacity-0 max-md:text-[32px]"
          >
            {project.title}
          </h1>

          <p className="cs-hero-desc mt-5 max-w-2xl text-[15px] leading-[1.7] text-[var(--color-ink-secondary)] opacity-0">
            {project.description}
          </p>

          <dl className="cs-hero-meta-row mt-9 grid grid-cols-2 gap-x-6 gap-y-5 border-y border-[var(--color-border-subtle)] py-6 opacity-0 max-md:grid-cols-2">
            {META_FIELDS.filter((field) => project[field.key]).map((field) => (
              <div key={field.key}>
                <dt className="text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--color-ink-muted)]">
                  {field.label}
                </dt>
                <dd className="mt-1 text-[14px] font-medium text-[var(--color-ink)]">
                  {project[field.key]}
                </dd>
              </div>
            ))}
          </dl>

          <div className="cs-hero-stack mt-6 opacity-0">
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--color-ink-muted)]">
              Stack
            </p>
            <ul className="mt-2.5 flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <li
                  key={tech.id}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-3 py-1.5 text-[12px] font-medium text-[var(--color-ink-secondary)]"
                >
                  <TechnologyIcon id={tech.id} className="h-3.5 w-3.5" />
                  {tech.label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Hero visual — full-width, exceeds reading column */}
      <div
        ref={visualRef}
        className="mt-12 w-full opacity-0"
      >
        <div className="relative mx-auto aspect-[16/8] w-full max-w-[1400px] overflow-hidden bg-[var(--color-background-subtle)] max-md:aspect-[16/10] md:rounded-[var(--radius-2xl)]">
          <Image
            src={project.hero.src}
            alt={project.hero.alt}
            fill
            priority
            sizes="(min-width: 1280px) 1400px, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </header>
  );
}
