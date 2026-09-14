"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type { Project } from "../../lib/projects";

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

export function ReflectionSection({
  reflection,
}: {
  readonly reflection: Project["reflection"];
}) {
  const ref = useRef<HTMLElement>(null);
  const revealed = useRef(false);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !ref.current || !reflection) return;
      const el = ref.current;
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
    { scope: ref, dependencies: [reflection] },
  );

  if (!reflection) return null;

  const columns = [
    reflection.whatILearned.length > 0 && {
      title: "What I learned",
      items: reflection.whatILearned,
    },
    reflection.whatIdChange.length > 0 && {
      title: "What I would change",
      items: reflection.whatIdChange,
    },
    reflection.keyDecision.length > 0 && {
      title: "Key decision",
      items: reflection.keyDecision,
    },
  ].filter(Boolean) as Array<{ title: string; items: readonly string[] }>;

  return (
    <section
      ref={ref}
      id="reflection"
      data-nav-section="Reflection"
      aria-label="Reflection"
      className="scroll-mt-28"
    >
      <div data-reveal className="mb-3 flex items-center gap-3 opacity-0">
        <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--color-ink-tertiary)]">
          Looking back
        </span>
        <span
          className="h-px w-10 bg-[var(--color-border)]"
          aria-hidden="true"
        />
      </div>

      <h2
        data-reveal
        className="text-[24px] font-semibold leading-[1.2] tracking-[-0.01em] text-[var(--color-ink)] opacity-0 max-md:text-[21px]"
      >
        Reflection
      </h2>

      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
        {columns.map((col) => (
          <div key={col.title} data-reveal className="opacity-0">
            <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-muted)]">
              {col.title}
            </h3>
            <ul className="flex flex-col gap-3">
              {col.items.map((item, i) => (
                <li
                  key={i}
                  className="text-[14px] leading-[1.65] text-[var(--color-ink-secondary)]"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
