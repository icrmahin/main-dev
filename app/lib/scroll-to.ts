"use client";

import { ScrollTrigger } from "gsap/ScrollTrigger";

/* ---------------------------------------------------------------------------
   Shared scroll-destination helpers
   ---------------------------------------------------------------------------
   The Hero → Work transition is scroll-controlled. "Work" must land on the
   transition's exact completion point (the scroll position where the flight
   timeline reaches progress 1) so that clicking Work and manually scrolling
   end in the identical settled state.
   --------------------------------------------------------------------------- */

export const HERO_WORK_TRIGGER_ID = "hero-work";

/** Absolute scroll position where the Hero → Work flight fully completes. */
export function getWorkTarget(): number | null {
  if (typeof window === "undefined") return null;
  const trigger = ScrollTrigger.getAll().find(
    (t) => (t.vars as { id?: string }).id === HERO_WORK_TRIGGER_ID,
  );
  if (trigger) return trigger.end;
  return null;
}

/**
 * Resolve an anchor href to an absolute scroll position.
 *
 * #work → the Hero → Work transition end (settled cards + visible Work grid).
 * #about / #contact → section top minus a small breathing offset.
 * "/" → top of the page.
 */
export function resolveScrollTarget(href: string): number | null {
  if (typeof window === "undefined") return null;

  if (href === "/" || href === "#") return 0;

  if (!href.startsWith("#")) return null;

  const id = href.slice(1);
  if (!id) return null;

  if (id === "work") {
    const target = getWorkTarget();
    if (target != null) return target;
  }

  const el = document.getElementById(id);
  if (!el) return null;

  const top = el.getBoundingClientRect().top + window.scrollY;
  return Math.max(0, top - 80);
}

export type LenisLike = {
  scrollTo(target: number, options?: object): void;
};

/**
 * Smoothly scroll to an anchor using the shared Lenis instance when available.
 * Falls back to native smooth scrolling (reduced motion / no Lenis).
 */
export function smoothScrollTo(href: string, lenis?: LenisLike | null): void {
  const target = resolveScrollTarget(href);
  if (target == null) return;

  if (lenis) {
    lenis.scrollTo(target, {
      duration: 1.2,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
    });
    return;
  }

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: target, behavior: reduced ? "auto" : "smooth" });
}