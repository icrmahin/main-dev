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
  return resolveScrollTargetForId(id);
}

export type LenisLike = {
  scrollTo(target: number, options?: object): void;
};

/** Default Lenis easing — a restrained cubic-out. */
export const DEFAULT_EASING = (t: number): number => 1 - Math.pow(1 - t, 3);

/**
 * Smoothly scroll to an absolute position using the shared Lenis instance
 * when available. Falls back to native scrolling (honoring reduced motion).
 */
export function smoothScrollToPosition(
  target: number,
  lenis?: LenisLike | null,
  duration = 1.1,
): void {
  const clamped = Math.max(0, target);
  if (lenis) {
    lenis.scrollTo(clamped, { duration, easing: DEFAULT_EASING });
    return;
  }
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: clamped, behavior: reduced ? "auto" : "smooth" });
}

/**
 * Smoothly scroll to an anchor using the shared Lenis instance when available.
 * Falls back to native smooth scrolling (reduced motion / no Lenis).
 */
export function smoothScrollTo(href: string, lenis?: LenisLike | null): void {
  const target = resolveScrollTarget(href);
  if (target == null) return;
  smoothScrollToPosition(target, lenis);
}

/**
 * Resolve a plain section/route id (no leading "#") to an absolute scroll
 * position. "work" or "hero-work" → the Hero → Work transition end.
 */
export function resolveScrollTargetForId(
  id: string,
  offset = 80,
): number | null {
  if (typeof window === "undefined") return null;
  if (id === "work" || id === "hero-work") {
    const target = getWorkTarget();
    if (target != null) return target;
  }
  const el = document.getElementById(id);
  if (!el) return null;
  return Math.max(0, el.getBoundingClientRect().top + window.scrollY - offset);
}

/** Wait for the Hero → Work ScrollTrigger to be registered. Used after a
 * cross-route navigation back to "/" so we can land on the exact flight end. */
export function waitForWorkTrigger(
  timeoutMs = 4000,
): Promise<number | null> {
  if (typeof window === "undefined") return Promise.resolve(null);
  const start = performance.now();
  return new Promise((resolve) => {
    const check = () => {
      const target = getWorkTarget();
      if (target != null) {
        resolve(target);
        return;
      }
      if (performance.now() - start > timeoutMs) {
        resolve(null);
        return;
      }
      requestAnimationFrame(check);
    };
    requestAnimationFrame(check);
  });
}

/**
 * Smoothly return to /#work from a case-study page. The portfolio mounts at the
 * top after navigation; this waits for its Hero → Work transition to register,
 * then eases to the exact settled state, so the transition is never broken.
 */
export async function scrollToWorkFromExternal(
  lenis?: LenisLike | null,
): Promise<void> {
  const target = await waitForWorkTrigger();
  if (target != null) {
    smoothScrollToPosition(target, lenis, 1.2);
    return;
  }
  if (lenis) {
    lenis.scrollTo(0, { duration: 1.2, easing: DEFAULT_EASING });
  }
}