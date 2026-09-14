"use client";

import { useLenis } from "lenis/react";
import {
  resolveScrollTargetForId,
  smoothScrollToPosition,
} from "../../lib/scroll-to";

interface CaseStudyNavProps {
  readonly sections: ReadonlyArray<{ id: string; label: string }>;
}

export function CaseStudyNav({ sections }: CaseStudyNavProps) {
  const lenis = useLenis();

  const handleJump = (id: string) => {
    const target = resolveScrollTargetForId(id, 120);
    if (target == null) return;
    if (lenis) {
      smoothScrollToPosition(target, lenis, 0.9);
    } else {
      window.scrollTo({ top: target, behavior: "auto" });
    }
  };

  return (
    <nav
      aria-label="On this page"
      className="sticky top-32 max-h-[calc(100vh-9rem)] overflow-auto"
    >
      <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
        On this page
      </p>
      <ul className="mt-4 space-y-1">
        {sections.map((section) => (
          <li key={section.id}>
            <button
              type="button"
              onClick={() => handleJump(section.id)}
              className="group flex w-full items-center gap-2.5 rounded-md px-3 py-1.5 text-left text-[13px] text-[var(--color-ink-tertiary)] transition-colors duration-200 hover:bg-[var(--color-surface)] hover:text-[var(--color-ink)]"
            >
              <span
                className="h-px w-3 shrink-0 bg-[var(--color-border)] transition-colors duration-200 group-hover:bg-[var(--color-ink-secondary)]"
                aria-hidden="true"
              />
              {section.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}