"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { DECK_STATES } from "../lib/deck";
import { HERO_WORK_TRIGGER_ID } from "../lib/scroll-to";

gsap.registerPlugin(ScrollTrigger);

/* ---------------------------------------------------------------------------
   Helpers
   --------------------------------------------------------------------------- */

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

interface Layout {
  readonly left: number;
  readonly top: number;
  readonly width: number;
  readonly height: number;
}

/**
 * Measure an element's page-space geometry.
 *
 * Position comes from getBoundingClientRect (+ scroll). Size comes from
 * offsetWidth/offsetHeight (the pure layout size) rather than the visual
 * rect, so a rolling rebuild can never measure a scale-contaminated size and
 * compound a growth error.
 */
function measure(el: Element): Layout {
  const rect = el.getBoundingClientRect();
  return {
    left: rect.left + window.scrollX,
    top: rect.top + window.scrollY,
    width: (el as HTMLElement).offsetWidth || rect.width,
    height: (el as HTMLElement).offsetHeight || rect.height,
  };
}

/* ---------------------------------------------------------------------------
   Motion tuning
   ---------------------------------------------------------------------------

   Scroll-controlled, reversible, physical:

   - scrub: 0.6 gives the flight a restrained catch-up lag so cards feel like
     they carry mass, while still tracking scroll directly — stoppable and
     reversible at any instant, and Lenis-synced (Lenis drives the window
     scroll; ScrollTrigger follows it frame to frame).
   - Each card tween uses an ease instead of "none" (which stays reserved for
     the infinite marquee). power3.inOut produces slight acceleration,
     controlled travel, gentle deceleration and a clean landing — in both
     directions.
   --------------------------------------------------------------------------- */

const SCRUB = 0.6;
const CARD_EASE = "power3.inOut" as const;

/* ---------------------------------------------------------------------------
   Component
   ---------------------------------------------------------------------------

   The four hero deck cards fly to the measured Work grid cells.

   The flight is transform-only: x / y / scale / rotation. scale is a single
   uniform value so the card's aspect ratio never distorts — there is no
   width/height interpolation and no independent scaleX/scaleY.

   Card content is width-driven: the 16/10 image and the text block both derive
   from the card's layout width, so a uniform scale keeps the card internally
   proportional at every size. The card's fixed padding (p-3 + border) does not
   scale with the card, so the scale is derived from the *content* width (the
   card image), and per-card x/y are computed so the hero image's top-left
   locks exactly onto the destination image's top-left. The fly-to-slot is
   therefore image-accurate; only the lower text region readjusts.

   Because the scaled copy is taller than the destination cell, the tail of the
   flight clips the copy to the cell rectangle (clip-path inset) while the real
   grid card fades in at scale 1 (stationary — nothing moves at the hand-off).
   At progress 1 the hero copy is fully released (autoAlpha 0) and the
   identical-layout work card is revealed.

   Reversal is implicit: scrubbing back eases the cards home and restores the
   hero deck.
   --------------------------------------------------------------------------- */

export default function HeroWorkTransition() {
  useGSAP(() => {
    if (prefersReducedMotion()) return;

    const hero = document.querySelector<HTMLElement>("[data-hero-section]");
    const deck = document.querySelector<HTMLElement>("[data-hero-deck]");
    const grid = document.querySelector<HTMLElement>("[data-work-grid]");
    if (!hero || !deck || !grid) return;

    const deckCards = Array.from(
      deck.querySelectorAll<HTMLElement>("[data-hero-card]"),
    );
    const workCards = Array.from(
      grid.querySelectorAll<HTMLElement>("[data-project-card]"),
    );
    if (deckCards.length === 0 || deckCards.length !== workCards.length) return;

    let st: ScrollTrigger | null = null;
    let raf = 0;
    let lastSignature = "";

    const resetVisibility = () => {
      gsap.set(workCards, { autoAlpha: 1, scale: 1, clearProps: "clipPath" });
      gsap.set(deckCards, { autoAlpha: 1, clearProps: "clipPath" });
    };

    const build = () => {
      /* skip no-op rebuilds (repeated ResizeObserver + resize calls) */
      const signature = [grid, deck]
        .map(
          (el) =>
            `${measure(el).width}x${measure(el).height}@${window.innerWidth}`,
        )
        .join("|");
      if (signature === lastSignature && st) return;
      lastSignature = signature;

      if (st) {
        st.kill();
        st = null;
      }

      /* return any stale transforms/visibility to a known state first so the
         measurements below are never contaminated */
      gsap.set(deckCards, { autoAlpha: 1, clipPath: "inset(0px 0px 0px 0px)" });
      gsap.set(workCards, { autoAlpha: 0 });

      /* geometry in page space at build time */
      const origin = measure(deckCards[0]);
      const cells = workCards.map(measure);
      const deckImgs = deckCards.map((c) =>
        measure(c.querySelector("[data-card-image]")!),
      );
      const workImgs = workCards.map((c) =>
        measure(c.querySelector("[data-card-image]")!),
      );

      const landingY = Math.min(window.innerHeight * 0.36, 400);

      const tl = gsap.timeline({
        defaults: { ease: CARD_EASE },
        scrollTrigger: {
          trigger: hero,
          id: HERO_WORK_TRIGGER_ID,
          start: () => measure(hero).top,
          end: () => measure(workCards[0]).top - landingY,
          scrub: SCRUB,
        },
      });

      deckCards.forEach((card, i) => {
        const deckState = DECK_STATES[i];
        const cell = cells[i];

        const cardBox = measure(card);
        const heroImg = deckImgs[i];
        const workImg = workImgs[i];

        /* uniform scale from the content (image) width so the scaled image
           exactly matches the destination image width */
        const s = workImg.width / heroImg.width;

        /* transform about the card's top-left (transform-origin 0 0):
           a point p maps to p * s + t. Solve t so the hero image's top-left
           maps exactly onto the destination image's top-left. */
        const dx = workImg.left - cardBox.left - (heroImg.left - cardBox.left) * s;
        const dy = workImg.top - cardBox.top - (heroImg.top - cardBox.top) * s;

        /* how far the scaled copy overhangs the destination cell, in the
           copy's own (scaled) coordinate space — these become the clip insets */
        const overLeft = cell.left - (cardBox.left + dx);
        const overRight =
          cardBox.left + cardBox.width * s + dx - (cell.left + cell.width);
        const overBottom =
          cardBox.top + cardBox.height * s + dy - (cell.top + cell.height);
        const overTop = cell.top - (cardBox.top + dy);

        const clipEnd = `inset(${Math.max(0, overTop)}px ${Math.max(
          0,
          overRight,
        )}px ${Math.max(0, overBottom)}px ${Math.max(0, overLeft)}px)`;

        tl.fromTo(
          card,
          {
            x: deckState.x,
            y: deckState.y,
            scale: deckState.scale,
            rotation: deckState.rotation,
            transformOrigin: "0 0",
            clipPath: "inset(0px 0px 0px 0px)",
          },
          {
            x: dx,
            y: dy,
            scale: s,
            rotation: 0,
            duration: 1,
          },
          0,
        );

        /* tail: clip the oversized copy to the cell rectangle so the
           "settling" hand-off looks slot-precise, then release it */
        tl.to(
          card,
          { clipPath: clipEnd, duration: 0.1, ease: "power2.inOut" },
          0.9,
        );
      });

      /* the real grid cards fade in at scale 1 — stationary, so the
         image-locked hand-off never moves underneath */
      tl.fromTo(
        workCards,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.1, ease: "power2.inOut" },
        0.9,
      );
      tl.to(deckCards, { autoAlpha: 0, duration: 0.1, ease: "power2.inOut" }, 0.9);

      st = tl.scrollTrigger as ScrollTrigger | null;
    };

    build();

    /* re-measure on any layout change that could shift deck or grid */
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(build);
    };
    const ro = new ResizeObserver(schedule);
    ro.observe(grid);
    ro.observe(deck);
    window.addEventListener("resize", schedule);

    return () => {
      window.removeEventListener("resize", schedule);
      ro.disconnect();
      cancelAnimationFrame(raf);
      if (st) st.kill();
      resetVisibility();
    };
  });

  return null;
}