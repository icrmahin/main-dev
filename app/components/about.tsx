"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight } from "lucide-react";

/* ---------------------------------------------------------------------------
   Types
   --------------------------------------------------------------------------- */

interface StackItem {
  readonly name: string;
  readonly abbr?: string;
}

interface Experience {
  readonly role: string;
  readonly company: string;
  readonly period: string;
  readonly description?: string;
  readonly href?: string;
}

/* ---------------------------------------------------------------------------
   Data — all content in one place, easy to replace with real info
   --------------------------------------------------------------------------- */

const INTRO_LEAD =
  "I design and engineer digital products where thoughtful interfaces meet reliable software.";

const INTRO_BODY =
  "My work sits at the intersection of product design, frontend engineering, and AI. I care about systems that feel intentional — interfaces that are quiet, fast, and build trust through clarity rather than decoration.";

const CURRENTLY =
  "Building at the intersection of product design, frontend engineering and AI.";

const STACK: readonly StackItem[] = [
  { name: "Figma" },
  { name: "Next.js" },
  { name: "React" },
  { name: "TypeScript" },
  { name: "Tailwind" },
  { name: "GSAP" },
  { name: "Python" },
  { name: "AI APIs" },
] as const;

const EXPERIENCE: readonly Experience[] = [
  {
    role: "Product Engineer",
    company: "Independent",
    period: "2024 — Present",
    description:
      "Designing and engineering digital products across interface, systems, and AI — from concept through production.",
    href: "#",
  },
  {
    role: "Frontend Engineer",
    company: "Placeholder Co.",
    period: "2022 — 2024",
    description:
      "Built and maintained frontend systems for web and mobile applications using React, TypeScript, and modern tooling.",
    href: "#",
  },
  {
    role: "UI/UX Designer",
    company: "Placeholder Studio",
    period: "2021 — 2022",
    description:
      "Designed interfaces, design systems, and product experiences for startups and digital products.",
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

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const expHeaderRef = useRef<HTMLDivElement>(null);
  const expListRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  /* ---- portrait hover ---- */
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const el = portraitRef.current;
      if (!el) return;

      const onEnter = () => {
        gsap.to(el, {
          rotation: -1,
          scale: 1.01,
          boxShadow: "0 20px 50px rgb(61 59 92 / 0.12)",
          duration: 0.4,
          ease: EASE,
        });
      };
      const onLeave = () => {
        gsap.to(el, {
          rotation: -2,
          scale: 1,
          boxShadow: "0 8px 24px rgb(61 59 92 / 0.06)",
          duration: 0.5,
          ease: EASE,
        });
      };

      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
      return () => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      };
    },
    { scope: sectionRef },
  );

  /* ---- scroll reveal ---- */
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const section = sectionRef.current;
      if (!section) return;

      let revealed = false;

      const portrait = portraitRef.current;
      const contentEls = contentRef.current
        ? Array.from(contentRef.current.children)
        : [];
      const stack = stackRef.current;
      const expHeader = expHeaderRef.current;
      const expRows = expListRef.current
        ? Array.from(expListRef.current.querySelectorAll("[data-exp-row]"))
        : [];
      const footer = footerRef.current;

      const targets = [
        portrait,
        ...contentEls,
        stack,
        expHeader,
        ...expRows,
        footer,
      ].filter(Boolean) as Element[];

      gsap.set(targets, { opacity: 0, y: 14 });

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting || revealed) return;
          revealed = true;

          const tl = gsap.timeline();

          if (portrait) {
            tl.to(portrait, { opacity: 1, y: 0, duration: 0.6, ease: EASE }, 0);
          }

          contentEls.forEach((el, i) => {
            tl.to(
              el,
              { opacity: 1, y: 0, duration: 0.5, ease: EASE },
              0.1 + i * 0.06,
            );
          });

          if (stack) {
            const stackItems = Array.from(
              stack.querySelectorAll("[data-stack-item]"),
            );
            tl.to(
              stack,
              { opacity: 1, y: 0, duration: 0.4, ease: EASE },
              0.25,
            );
            stackItems.forEach((item, i) => {
              tl.fromTo(
                item,
                { opacity: 0, y: 6, scale: 0.96 },
                {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  duration: 0.3,
                  ease: EASE,
                },
                0.3 + i * 0.03,
              );
            });
          }

          if (expHeader) {
            tl.to(
              expHeader,
              { opacity: 1, y: 0, duration: 0.4, ease: EASE },
              0.4,
            );
          }

          expRows.forEach((row, i) => {
            tl.to(
              row,
              { opacity: 1, y: 0, duration: 0.4, ease: EASE },
              0.45 + i * 0.06,
            );
          });

          if (footer) {
            tl.to(footer, { opacity: 1, y: 0, duration: 0.4, ease: EASE }, 0.6);
          }

          observer.disconnect();
        },
        { threshold: 0.08 },
      );

      observer.observe(section);
      return () => observer.disconnect();
    },
    { scope: sectionRef },
  );

  /* ---- experience row hover ---- */
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const list = expListRef.current;
      if (!list) return;

      const cleanups: Array<() => void> = [];

      const rows = list.querySelectorAll("[data-exp-row]");
      rows.forEach((row) => {
        const arrow = row.querySelector("[data-exp-arrow]");
        const role = row.querySelector("[data-exp-role]");

        const onEnter = () => {
          if (role) gsap.to(role, { x: 2, duration: 0.25, ease: EASE });
          if (arrow) gsap.to(arrow, { x: 3, duration: 0.25, ease: EASE });
        };
        const onLeave = () => {
          if (role) gsap.to(role, { x: 0, duration: 0.2, ease: EASE });
          if (arrow) gsap.to(arrow, { x: 0, duration: 0.2, ease: EASE });
        };

        row.addEventListener("mouseenter", onEnter);
        row.addEventListener("mouseleave", onLeave);
        cleanups.push(() => {
          row.removeEventListener("mouseenter", onEnter);
          row.removeEventListener("mouseleave", onLeave);
        });
      });

      return () => cleanups.forEach((fn) => fn());
    },
    { scope: sectionRef },
  );

  /* ---- stack icon hover ---- */
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const container = stackRef.current;
      if (!container) return;

      const cleanups: Array<() => void> = [];
      const items = container.querySelectorAll("[data-stack-item]");

      items.forEach((item) => {
        const onEnter = () => {
          gsap.to(item, {
            y: -2,
            boxShadow: "0 6px 16px rgb(61 59 92 / 0.08)",
            duration: 0.25,
            ease: EASE,
          });
        };
        const onLeave = () => {
          gsap.to(item, {
            y: 0,
            boxShadow: "0 2px 6px rgb(61 59 92 / 0.03)",
            duration: 0.3,
            ease: EASE,
          });
        };

        item.addEventListener("mouseenter", onEnter);
        item.addEventListener("mouseleave", onLeave);
        cleanups.push(() => {
          item.removeEventListener("mouseenter", onEnter);
          item.removeEventListener("mouseleave", onLeave);
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
      id="about"
      aria-label="About"
      className="container-center section-space"
    >
      <div className="flex gap-[72px] max-lg:flex-col max-lg:gap-10">
        {/* ---- left: portrait ---- */}
        <div className="w-[30%] shrink-0 max-lg:w-full">
          <div
            ref={portraitRef}
            className="sticky top-28 inline-block rotate-[-2deg] rounded-2xl bg-[var(--color-surface)] p-2.5 max-lg:static max-lg:mx-auto max-lg:block max-lg:w-fit"
            style={{ boxShadow: "0 8px 24px rgb(61 59 92 / 0.06)" }}
          >
            <div className="relative h-[260px] w-[220px] overflow-hidden rounded-xl max-md:h-[200px] max-md:w-[170px]">
              <Image
                src="/avater.jpeg"
                alt="Abdulla Al Mahin"
                fill
                sizes="(max-width: 768px) 170px, 220px"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>

        {/* ---- right: content ---- */}
        <div className="flex flex-1 flex-col gap-8 max-lg:w-full max-lg:gap-7">
          {/* intro block */}
          <div ref={contentRef}>
            <span className="section-label">
              About
            </span>

            <p className="mb-4 max-w-[520px] text-[20px] font-medium leading-[1.35] tracking-[-0.02em] text-[var(--color-ink)] max-md:text-[18px]">
              {INTRO_LEAD}
            </p>

            <p className="max-w-[500px] text-[14px] leading-[1.65] text-[var(--color-ink-secondary)]">
              {INTRO_BODY}
            </p>
          </div>

          {/* currently + stack */}
          <div ref={stackRef}>
            <span className="mb-2 block text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--color-ink-muted)]">
              Currently
            </span>
            <p className="mb-6 max-w-[440px] text-[13px] leading-[1.6] text-[var(--color-ink-secondary)]">
              {CURRENTLY}
            </p>

            {/* stack */}
            <span className="mb-2 block text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--color-ink-muted)]">
              My Stack
            </span>
            <div className="flex flex-wrap gap-1.5">
              {STACK.map((item) => (
                <div
                  key={item.name}
                  data-stack-item
                  className="flex h-[32px] items-center rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-2.5 text-[11px] font-medium text-[var(--color-ink-secondary)]"
                  style={{ boxShadow: "0 2px 6px rgb(61 59 92 / 0.03)" }}
                >
                  {item.abbr ?? item.name}
                </div>
              ))}
            </div>
          </div>

          {/* experience */}
          <div>
            <div ref={expHeaderRef} className="mb-1">
              <span className="mb-2 block text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--color-ink-muted)]">
                Experience
              </span>
            </div>

            <div ref={expListRef} className="flex flex-col">
              {EXPERIENCE.map((exp) => (
                <Link
                  key={`${exp.company}-${exp.period}`}
                  href={exp.href ?? "#"}
                  data-exp-row
                  className="group flex items-start justify-between gap-5 border-t border-[var(--color-border-subtle)] py-5 text-left transition-colors duration-200 hover:bg-[var(--color-surface-hover)] max-md:flex-col max-md:gap-1.5 max-md:py-4"
                  aria-label={`${exp.role} at ${exp.company}`}
                >
                  <div className="flex flex-1 flex-col gap-0.5">
                    <span
                      data-exp-role
                      className="text-[14px] font-medium leading-[1.3] tracking-[-0.01em] text-[var(--color-ink)] max-md:text-[13px]"
                    >
                      {exp.role}{" "}
                      <span className="text-[var(--color-ink-tertiary)]">
                        / {exp.company}
                      </span>
                    </span>
                    {exp.description && (
                      <span className="mt-0.5 max-w-[420px] text-[12px] leading-[1.55] text-[var(--color-ink-secondary)]">
                        {exp.description}
                      </span>
                    )}
                  </div>

                  <div className="flex shrink-0 items-center gap-2.5 max-md:mt-0.5">
                    <span className="text-[11px] font-medium text-[var(--color-ink-muted)]">
                      {exp.period}
                    </span>
                    <ArrowUpRight
                      data-exp-arrow
                      size={12}
                      strokeWidth={2}
                      className="text-[var(--color-ink-muted)] transition-colors duration-200 group-hover:text-[var(--color-ink-secondary)]"
                    />
                  </div>
                </Link>
              ))}
              <div className="border-t border-[var(--color-border-subtle)]" />
            </div>
          </div>

          {/* footer */}
          <div ref={footerRef} className="pt-1">
            <p className="mb-3 text-[13px] leading-[1.6] text-[var(--color-ink-tertiary)]">
              Open to thoughtful product work.
            </p>
            <Link
              href="mailto:mahin@example.com"
              className="group inline-flex items-center gap-1.5 text-[12px] font-medium text-[var(--color-ink-secondary)] transition-colors duration-200 hover:text-[var(--color-ink)]"
            >
              Let&apos;s work together
              <ArrowUpRight
                size={12}
                strokeWidth={2}
                className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
