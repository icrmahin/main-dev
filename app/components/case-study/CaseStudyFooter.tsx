"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowLeft } from "lucide-react";
import type { Project } from "../../lib/projects";

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

interface CaseStudyFooterProps {
  readonly nextProject: Project;
}

/* ---------------------------------------------------------------------------
   Component
   --------------------------------------------------------------------------- */

export function CaseStudyFooter({ nextProject }: CaseStudyFooterProps) {
  const footerRef = useRef<HTMLElement>(null);
  const revealed = useRef(false);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !footerRef.current) return;
      const el = footerRef.current;

      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting && !revealed.current) {
              revealed.current = true;
              gsap.fromTo(
                el.querySelectorAll("[data-footer-reveal]"),
                { opacity: 0, y: 16 },
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.6,
                  ease: "power3.out",
                  stagger: 0.08,
                },
              );
              observer.disconnect();
            }
          }
        },
        { threshold: 0.1 },
      );

      observer.observe(el);
      return () => observer.disconnect();
    },
    { scope: footerRef },
  );

  return (
    <footer ref={footerRef} className="border-t border-[var(--color-border-subtle)]">
      <div className="container-center pb-24 pt-10 max-md:pb-16">
        <div data-footer-reveal className="opacity-0">
          <Link
            href="/#work"
            className="group inline-flex items-center gap-1.5 text-[12px] font-medium text-[var(--color-ink-tertiary)] transition-colors duration-200 hover:text-[var(--color-ink)]"
          >
            <ArrowLeft
              size={12}
              strokeWidth={2}
              className="transition-transform duration-200 group-hover:-translate-x-0.5"
            />
            Back to all work
          </Link>
        </div>

        <div className="mt-10" data-footer-reveal>
          <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
            Next project
          </span>
        </div>

        <Link
          href={`/work/${nextProject.slug}`}
          className="group mt-4 block"
        >
          <div data-footer-reveal className="flex items-baseline justify-between gap-4 opacity-0 max-md:flex-col max-md:items-start">
            <h2 className="text-[32px] font-semibold leading-[1.1] tracking-[-0.02em] text-[var(--color-ink)] transition-colors duration-200 group-hover:text-[var(--color-ink-secondary)] max-md:text-[24px]">
              {nextProject.title}
            </h2>
            <span className="text-[13px] font-medium text-[var(--color-ink-tertiary)] max-md:text-[12px]">
              {nextProject.category} · {nextProject.year}
            </span>
          </div>

          <div
            data-footer-reveal
            className="relative mt-6 aspect-[16/7] w-full overflow-hidden rounded-[var(--radius-xl)] bg-[var(--color-background-subtle)] transition-transform duration-500 ease-[var(--ease-soft)] group-hover:scale-[1.008] md:rounded-[var(--radius-2xl)]"
          >
            <Image
              src={nextProject.hero.src}
              alt={nextProject.hero.alt}
              fill
              sizes="(min-width: 768px) 1200px, 100vw"
              className="object-cover"
            />
          </div>
        </Link>
      </div>
    </footer>
  );
}
