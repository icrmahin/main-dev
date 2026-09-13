"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
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

const PREVIEW = {
  width: 320,
  height: 210,
  offsetX: 20,
  offsetY: 20,
  followDuration: 0.4,
  enterDuration: 0.35,
  leaveDuration: 0.25,
};

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
  const listRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const previewImgRef = useRef<HTMLImageElement>(null);

  const rowRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());
  const [activePreview, setActivePreview] = useState<{
    src: string;
    alt: string;
  } | null>(null);

  /* ---- floating preview positioning ---- */
  const positionPreview = useCallback((e: MouseEvent) => {
    const preview = previewRef.current;
    if (!preview) return;

    const { width, height, offsetX, offsetY } = PREVIEW;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let x = e.clientX + offsetX;
    let y = e.clientY + offsetY;

    if (x + width > vw - 16) x = e.clientX - width - offsetX;
    if (y + height > vh - 16) y = e.clientY - height - offsetY;
    if (x < 16) x = 16;
    if (y < 16) y = 16;

    gsap.quickTo(preview, "x", { duration: PREVIEW.followDuration, ease: EASE })(x);
    gsap.quickTo(preview, "y", { duration: PREVIEW.followDuration, ease: EASE })(y);
  }, []);

  /* ---- entrance animation ---- */
  useGSAP(
    () => {
      const reduced = prefersReducedMotion();

      /* header */
      const headerEls = headerRef.current
        ? Array.from(headerRef.current.children)
        : [];

      /* project rows */
      const rows = listRef.current
        ? Array.from(listRef.current.querySelectorAll("[data-project-row]"))
        : [];

      const all = [...headerEls, ...rows];

      if (reduced) {
        gsap.set(all, { opacity: 1, y: 0 });
        return;
      }

      gsap.set(all, { opacity: 0, y: 16 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
        },
      });

      headerEls.forEach((el, i) => {
        tl.to(el, { opacity: 1, y: 0, duration: 0.5, ease: EASE }, i * 0.08);
      });

      rows.forEach((el, i) => {
        tl.to(
          el,
          { opacity: 1, y: 0, duration: 0.45, ease: EASE },
          headerEls.length * 0.08 + i * 0.06,
        );
      });
    },
    { scope: sectionRef },
  );

  /* ---- scroll reveal via IntersectionObserver (no ScrollTrigger dependency) ---- */
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      const section = sectionRef.current;
      if (!section) return;

      let revealed = false;

      const headerEls = headerRef.current
        ? Array.from(headerRef.current.children)
        : [];
      const rows = listRef.current
        ? Array.from(listRef.current.querySelectorAll("[data-project-row]"))
        : [];
      const all = [...headerEls, ...rows];

      /* set initial hidden state */
      gsap.set(all, { opacity: 0, y: 16 });

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting || revealed) return;
          revealed = true;

          const tl = gsap.timeline();
          headerEls.forEach((el, i) => {
            tl.to(el, { opacity: 1, y: 0, duration: 0.5, ease: EASE }, i * 0.08);
          });
          rows.forEach((el, i) => {
            tl.to(
              el,
              { opacity: 1, y: 0, duration: 0.45, ease: EASE },
              headerEls.length * 0.08 + i * 0.06,
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

  /* ---- project row hover ---- */
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      const cleanups: Array<() => void> = [];

      PROJECTS.forEach((project) => {
        const row = rowRefs.current.get(project.id);
        if (!row) return;

        const number = row.querySelector("[data-project-number]");
        const title = row.querySelector("[data-project-title]");
        const desc = row.querySelector("[data-project-desc]");

        const onEnter = (e: MouseEvent) => {
          if (number) gsap.to(number, { x: 3, duration: 0.25, ease: EASE });
          if (title) gsap.to(title, { y: -1, duration: 0.2, ease: EASE });
          if (desc) gsap.to(desc, { opacity: 0.8, duration: 0.2, ease: EASE });

          if (project.image) {
            setActivePreview({ src: project.image, alt: project.title });
            const preview = previewRef.current;
            if (preview) {
              gsap.fromTo(
                preview,
                { opacity: 0, scale: 0.96 },
                { opacity: 1, scale: 1, duration: PREVIEW.enterDuration, ease: EASE },
              );
            }
            positionPreview(e);
          }
        };

        const onLeave = () => {
          if (number) gsap.to(number, { x: 0, duration: 0.2, ease: EASE });
          if (title) gsap.to(title, { y: 0, duration: 0.2, ease: EASE });
          if (desc) gsap.to(desc, { opacity: 1, duration: 0.2, ease: EASE });

          const preview = previewRef.current;
          if (preview) {
            gsap.to(preview, {
              opacity: 0,
              scale: 0.98,
              duration: PREVIEW.leaveDuration,
              ease: EASE,
              onComplete: () => setActivePreview(null),
            });
          }
        };

        const onMove = (e: MouseEvent) => positionPreview(e);

        const onFocus = () => {
          if (number) gsap.to(number, { x: 3, duration: 0.25, ease: EASE });
          if (title) gsap.to(title, { y: -1, duration: 0.2, ease: EASE });
        };

        const onBlur = () => {
          if (number) gsap.to(number, { x: 0, duration: 0.2, ease: EASE });
          if (title) gsap.to(title, { y: 0, duration: 0.2, ease: EASE });
        };

        row.addEventListener("mouseenter", onEnter);
        row.addEventListener("mouseleave", onLeave);
        row.addEventListener("mousemove", onMove);
        row.addEventListener("focus", onFocus);
        row.addEventListener("blur", onBlur);

        cleanups.push(() => {
          row.removeEventListener("mouseenter", onEnter);
          row.removeEventListener("mouseleave", onLeave);
          row.removeEventListener("mousemove", onMove);
          row.removeEventListener("focus", onFocus);
          row.removeEventListener("blur", onBlur);
        });
      });

      return () => cleanups.forEach((fn) => fn());
    },
    { scope: listRef },
  );

  /* ---- render ---- */
  return (
    <section
      ref={sectionRef}
      id="work"
      aria-label="Selected work"
      className="mx-auto w-full max-w-[1060px] px-6 pb-[160px] pt-[140px] max-md:pb-[100px] max-md:pt-[80px]"
    >
      {/* ---- header ---- */}
      <div ref={headerRef} className="mb-16 max-md:mb-10">
        <span className="mb-4 block text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--color-ink-muted)]">
          Selected Work
        </span>
        <h2 className="mb-4 text-[clamp(28px,4vw,42px)] font-medium leading-[1.1] tracking-[-0.035em] text-[var(--color-ink)]">
          Products I&apos;ve designed
          <br className="max-md:hidden" />{" "}
          <span className="text-[var(--color-ink-tertiary)]">and engineered.</span>
        </h2>
        <p className="max-w-[460px] text-[15px] leading-[1.6] text-[var(--color-ink-secondary)]">
          A selection of projects spanning product engineering, interface design,
          frontend systems, and AI — built from concept through production.
        </p>
      </div>

      {/* ---- project list ---- */}
      <div ref={listRef} className="flex flex-col">
        {PROJECTS.map((project) => (
          <Link
            key={project.id}
            href={project.href}
            data-project-row
            ref={(el) => {
              if (el) rowRefs.current.set(project.id, el);
              else rowRefs.current.delete(project.id);
            }}
            className="group flex items-start gap-6 border-t border-[var(--color-border-subtle)] py-7 text-left transition-colors duration-200 hover:bg-[var(--color-surface-hover)] max-md:flex-col max-md:gap-4 max-md:py-6"
            aria-label={`${project.title} — ${project.category}`}
          >
            {/* number */}
            <span
              data-project-number
              className="mt-0.5 w-10 shrink-0 text-[12px] font-medium tabular-nums text-[var(--color-ink-muted)] max-md:w-auto max-md:text-[11px]"
            >
              {project.number}
            </span>

            {/* content */}
            <div className="flex flex-1 flex-col gap-1.5">
              <h3
                data-project-title
                className="text-[22px] font-medium leading-[1.2] tracking-[-0.02em] text-[var(--color-ink)] transition-colors duration-200 group-hover:text-[var(--color-primary)] max-md:text-[18px]"
              >
                {project.title}
              </h3>
              <p
                data-project-desc
                className="max-w-[480px] text-[14px] leading-[1.55] text-[var(--color-ink-secondary)] max-md:text-[13px]"
              >
                {project.description}
              </p>
              <span className="mt-1 text-[12px] font-medium text-[var(--color-ink-tertiary)]">
                {project.category}
              </span>
            </div>

            {/* year + arrow */}
            <div className="flex shrink-0 items-center gap-3 max-md:mt-1">
              <span className="text-[12px] font-medium text-[var(--color-ink-muted)]">
                {project.year}
              </span>
              <ArrowUpRight
                size={14}
                strokeWidth={2}
                className="text-[var(--color-ink-muted)] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--color-ink-secondary)]"
              />
            </div>

            {/* mobile inline image */}
            {project.image && (
              <div className="mt-2 block w-full overflow-hidden rounded-2xl md:hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  width={640}
                  height={400}
                  className="h-auto w-full object-cover"
                />
              </div>
            )}
          </Link>
        ))}

        {/* bottom border */}
        <div className="border-t border-[var(--color-border-subtle)]" />
      </div>

      {/* ---- concluding link ---- */}
      <div className="mt-10 max-md:mt-8">
        <Link
          href="#"
          className="group inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--color-ink-tertiary)] transition-colors duration-200 hover:text-[var(--color-ink)]"
        >
          View all work
          <ArrowUpRight
            size={13}
            strokeWidth={2}
            className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </Link>
      </div>

      {/* ---- floating preview (desktop only) ---- */}
      <div
        ref={previewRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-40 hidden overflow-hidden rounded-2xl opacity-0 shadow-[var(--shadow-float)] md:block"
        style={{
          width: PREVIEW.width,
          height: PREVIEW.height,
          willChange: "transform",
        }}
      >
        {activePreview && (
          <img
            ref={previewImgRef}
            src={activePreview.src}
            alt={activePreview.alt}
            className="h-full w-full object-cover"
          />
        )}
      </div>
    </section>
  );
}
