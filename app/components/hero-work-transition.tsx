"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { DECK_STATES } from "../lib/deck";

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

function measure(el: Element): Layout {
  const rect = el.getBoundingClientRect();
  return {
    left: rect.left + window.scrollX,
    top: rect.top + window.scrollY,
    width: rect.width,
    height: rect.height,
  };
}

/* ---------------------------------------------------------------------------
   Component
   ---------------------------------------------------------------------------
   Animates the hero deck cards into their real Work grid cells.

   Cards are the actual hero markup (`[data-hero-card]` wrappers). They are
   translated/scaled/rotated from their deck offsets to the measured Work cell
   geometry, scrubbed against scroll. At the end of the range the hero cards are
   exactly covering the grid cells, at which point visibility flips: Work cards
   (rendered underneath, identical layout) appear and hero cards disappear.
   Reversal flips back so the state is always reversible and glue-like.
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

    const resetVisibility = () => {
      gsap.set(workCards, { autoAlpha: 1 });
      gsap.set(deckCards, { autoAlpha: 1 });
    };

    const build = () => {
      if (st) {
        st.kill();
        st = null;
      }

      /* deck starts visible; grid cards wait underneath */
      gsap.set(deckCards, { autoAlpha: 1 });
      gsap.set(workCards, { autoAlpha: 0 });

      /* geometry in page space at build time */
      const origin = measure(deckCards[0]);
      const cells = workCards.map(measure);

      const landingY = Math.min(window.innerHeight * 0.36, 400);

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: hero,
          start: () => measure(hero).top,
          end: () => measure(workCards[0]).top - landingY,
          scrub: 1,
          onUpdate: (self) => {
            const settled = self.progress >= 1;
            gsap.set(workCards, { autoAlpha: settled ? 1 : 0 });
            gsap.set(deckCards, { autoAlpha: settled ? 0 : 1 });
          },
        },
      });

      deckCards.forEach((card, i) => {
        const deckState = DECK_STATES[i];
        const cell = cells[i];

        tl.fromTo(
          card,
          {
            x: deckState.x,
            y: deckState.y,
            scaleX: deckState.scale,
            scaleY: deckState.scale,
            rotation: deckState.rotation,
          },
          {
            x: cell.left - origin.left,
            y: cell.top - origin.top,
            scaleX: cell.width / (card.offsetWidth || cell.width),
            scaleY: cell.height / (card.offsetHeight || cell.height),
            rotation: 0,
            duration: 1,
          },
          0,
        );
      });

      st = tl.scrollTrigger as ScrollTrigger | null;
    };

    build();

    /* re-measure on any layout change that could shift deck or grid */
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(build);
    });
    ro.observe(grid);
    ro.observe(deck);

    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(build);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      ro.disconnect();
      cancelAnimationFrame(raf);
      if (st) st.kill();
      resetVisibility();
    };
  });

  return null;
}