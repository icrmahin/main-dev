"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

/* ---------------------------------------------------------------------------
   Types
   --------------------------------------------------------------------------- */

interface NavItem {
  readonly label: string;
  readonly href: string;
}

interface NavigationProps {
  readonly items?: readonly NavItem[];
  readonly brand?: string;
  readonly brandHref?: string;
}

/* ---------------------------------------------------------------------------
   Defaults
   --------------------------------------------------------------------------- */

const DEFAULT_ITEMS: readonly NavItem[] = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
] as const;

/* ---------------------------------------------------------------------------
   Animation constants
   --------------------------------------------------------------------------- */

const ENTRANCE = { duration: 0.6, ease: "power3.out" as const, delay: 0.1 };
const INDICATOR = { duration: 0.3, ease: "power2.out" as const };
const SCROLL = { hideY: -4, hideOpacity: 0.92, duration: 0.3, ease: "power2.out" as const };

/* ---------------------------------------------------------------------------
   Helpers
   --------------------------------------------------------------------------- */

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getSectionId(href: string): string | null {
  if (href.startsWith("#")) return href.slice(1);
  return null;
}

/* ---------------------------------------------------------------------------
   Component
   --------------------------------------------------------------------------- */

export default function Navigation({
  items = DEFAULT_ITEMS,
  brand = "Mahin",
  brandHref = "/",
}: NavigationProps) {
  const navRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const itemRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());
  const [activeHref, setActiveHref] = useState<string>(items[0].href);
  const [isHoveringNav, setIsHoveringNav] = useState(false);

  /* ---- indicator: slide to target relative to shared track ---- */
  const moveIndicator = useCallback(
    (href: string, animate = true) => {
      const track = trackRef.current;
      const indicator = indicatorRef.current;
      const target = itemRefs.current.get(href);
      if (!track || !indicator || !target) return;

      const trackRect = track.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();

      const x = targetRect.left - trackRect.left;
      const width = targetRect.width;

      if (!animate || prefersReducedMotion()) {
        gsap.set(indicator, { x, width, opacity: 1 });
        return;
      }

      gsap.to(indicator, {
        x,
        width,
        opacity: 1,
        duration: INDICATOR.duration,
        ease: INDICATOR.ease,
      });
    },
    [],
  );

  /* ---- IntersectionObserver: detect active section ---- */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const sectionIds = items
      .map((item) => getSectionId(item.href))
      .filter((id): id is string => id !== null);

    if (!sectionIds.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            const match = items.find((item) => item.href === `#${id}`);
            if (match) {
              setActiveHref(match.href);
              if (!isHoveringNav) {
                moveIndicator(match.href, true);
              }
            }
          }
        }
      },
      { rootMargin: "-35% 0px -50% 0px", threshold: 0 },
    );

    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [items, moveIndicator, isHoveringNav]);

  /* ---- entrance ---- */
  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        gsap.set(navRef.current, { opacity: 1, y: 0, scale: 1 });
        moveIndicator(items[0].href, false);
        return;
      }

      gsap.fromTo(
        navRef.current,
        { opacity: 0, y: -8, scale: 0.985 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          ...ENTRANCE,
          onComplete: () => {
            moveIndicator(items[0].href, true);
          },
        },
      );
    },
    { scope: navRef },
  );

  /* ---- hover: indicator slide ---- */
  useGSAP(
    () => {
      const track = trackRef.current;
      if (!track) return;

      const cleanups: Array<() => void> = [];

      const links = Array.from(itemRefs.current.values());
      links.forEach((linkEl) => {
        const href = linkEl.getAttribute("data-nav-href") ?? "";
        const isSectionLink = href.startsWith("#");

        const onEnter = () => {
          if (isSectionLink) {
            moveIndicator(href, true);
          }
          setIsHoveringNav(true);
        };

        const onLeave = () => {
          setIsHoveringNav(false);
          if (isSectionLink) {
            moveIndicator(activeHref, true);
          }
        };

        linkEl.addEventListener("mouseenter", onEnter);
        linkEl.addEventListener("mouseleave", onLeave);
        cleanups.push(() => {
          linkEl.removeEventListener("mouseenter", onEnter);
          linkEl.removeEventListener("mouseleave", onLeave);
        });
      });

      return () => cleanups.forEach((fn) => fn());
    },
    { scope: trackRef, dependencies: [activeHref, moveIndicator] },
  );

  /* ---- scroll: hide on scroll down, reveal on scroll up ---- */
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      const el = navRef.current;
      if (!el) return;

      const quickToY = gsap.quickTo(el, "y", { duration: 0.25, ease: SCROLL.ease });
      const quickToOpacity = gsap.quickTo(el, "opacity", { duration: 0.25, ease: SCROLL.ease });

      let lastScroll = 0;

      const onScroll = () => {
        const scrollY = window.scrollY;
        const delta = scrollY - lastScroll;
        lastScroll = scrollY;

        if (scrollY < 20) {
          quickToY(0);
          quickToOpacity(1);
          return;
        }

        if (delta > 2) {
          quickToY(SCROLL.hideY);
          quickToOpacity(SCROLL.hideOpacity);
        } else if (delta < -2) {
          quickToY(0);
          quickToOpacity(1);
        }
      };

      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    },
    { scope: navRef },
  );

  /* ---- update active indicator when activeHref changes (scroll-driven) ---- */
  useEffect(() => {
    if (!isHoveringNav) {
      moveIndicator(activeHref, true);
    }
  }, [activeHref, moveIndicator, isHoveringNav]);

  /* ---- render ---- */
  return (
    <nav
      ref={navRef}
      aria-label="Main navigation"
      className="fixed top-4 left-1/2 z-50 -translate-x-1/2 opacity-0"
    >
      <div
        className="relative flex items-center rounded-full border border-[var(--color-border-subtle)] bg-white px-1 py-[3px]"
        style={{ boxShadow: "var(--shadow-xs)" }}
        onMouseEnter={() => setIsHoveringNav(true)}
        onMouseLeave={() => setIsHoveringNav(false)}
      >
        {/* track — single coordinate system for indicator + all items */}
        <div ref={trackRef} className="relative flex items-center gap-0.5">
          {/* indicator */}
          <span
            ref={indicatorRef}
            aria-hidden="true"
            className="pointer-events-none absolute top-[3px] bottom-[3px] left-0 z-0 rounded-full bg-[var(--color-background-muted)] opacity-0"
          />

          {/* brand */}
          <Link
            href={brandHref}
            data-nav-href={brandHref}
            ref={(el) => {
              if (el) itemRefs.current.set(brandHref, el);
              else itemRefs.current.delete(brandHref);
            }}
            className="relative z-10 flex items-center px-3 text-[12px] font-semibold tracking-[-0.01em] text-[var(--color-ink)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-violet)] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            {brand}
          </Link>

          {/* items — single tree, responsive via CSS */}
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              data-nav-href={item.href}
              ref={(el) => {
                if (el) itemRefs.current.set(item.href, el);
                else itemRefs.current.delete(item.href);
              }}
              className="relative z-10 flex items-center rounded-full px-3 py-1.5 text-[12px] font-medium tracking-[-0.01em] text-[var(--color-ink-tertiary)] transition-colors hover:text-[var(--color-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-violet)] focus-visible:ring-offset-2 focus-visible:ring-offset-white max-sm:px-2.5 max-sm:text-[11px]"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}