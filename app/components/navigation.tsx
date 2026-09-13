"use client";

import { useCallback, useRef } from "react";
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
   Animation constants — single source of truth for all timing
   --------------------------------------------------------------------------- */

const ENTRANCE = { duration: 0.8, ease: "power3.out" as const, delay: 0.1 };
const INDICATOR = { duration: 0.3, ease: "power2.out" as const };
const HOVER_TEXT = { duration: 0.2, ease: "power2.out" as const };
const SCROLL = { upY: -6, upOpacity: 0.8, duration: 0.35, ease: "power2.out" as const };

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

export default function Navigation({
  items = DEFAULT_ITEMS,
  brand = "Mahin",
  brandHref = "/",
}: NavigationProps) {
  const navRef = useRef<HTMLElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const itemRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());

  /* ---- indicator: slide to target ---- */
  const moveIndicator = useCallback((href: string) => {
    const list = listRef.current;
    const indicator = indicatorRef.current;
    const target = itemRefs.current.get(href);
    if (!list || !indicator || !target) return;

    const listRect = list.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    gsap.to(indicator, {
      x: targetRect.left - listRect.left,
      width: targetRect.width,
      opacity: 1,
      duration: INDICATOR.duration,
      ease: INDICATOR.ease,
    });
  }, []);

  /* ---- entrance ---- */
  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        gsap.set(navRef.current, { opacity: 1, y: 0, scale: 1 });
        return;
      }
      gsap.fromTo(
        navRef.current,
        { opacity: 0, y: -12, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, ...ENTRANCE },
      );
    },
    { scope: navRef },
  );

  /* ---- hover: indicator + text micro-interaction ---- */
  useGSAP(
    () => {
      const links = Array.from(itemRefs.current.values());
      if (!links.length) return;

      const cleanups: Array<() => void> = [];

      links.forEach((linkEl) => {
        const href = linkEl.getAttribute("data-nav-href") ?? "";

        const onEnter = () => {
          moveIndicator(href);
          gsap.to(linkEl, { y: -1, ...HOVER_TEXT });
        };
        const onLeave = () => {
          gsap.to(linkEl, { y: 0, ...HOVER_TEXT });
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
    { scope: pillRef },
  );

  /* ---- scroll: hide on scroll down, reveal on scroll up ---- */
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      let lastScroll = 0;

      const onScroll = () => {
        const el = navRef.current;
        if (!el) return;

        const scrollY = window.scrollY;
        const delta = scrollY - lastScroll;
        lastScroll = scrollY;

        // At top of page: always fully visible
        if (scrollY < 20) {
          gsap.to(el, { y: 0, opacity: 1, duration: 0.3, ease: SCROLL.ease });
          return;
        }

        if (delta > 2) {
          // Scrolling down
          gsap.to(el, { y: SCROLL.upY, opacity: SCROLL.upOpacity, duration: SCROLL.duration, ease: SCROLL.ease });
        } else if (delta < -2) {
          // Scrolling up
          gsap.to(el, { y: 0, opacity: 1, duration: SCROLL.duration, ease: SCROLL.ease });
        }
      };

      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    },
    { scope: navRef },
  );

  /* ---- render ---- */
  return (
    <nav
      ref={navRef}
      aria-label="Main navigation"
      className="fixed top-6 left-1/2 z-50 -translate-x-1/2"
    >
      <div
        ref={pillRef}
        className="relative flex items-center rounded-full border border-[rgba(0,0,0,0.08)] bg-white px-1 py-[3px]"
        style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}
      >
        {/* indicator */}
        <span
          ref={indicatorRef}
          aria-hidden="true"
          className="pointer-events-none absolute top-[3px] bottom-[3px] left-0 z-0 rounded-full bg-[#f4f4f5] opacity-0"
        />

        {/* brand */}
        <Link
          href={brandHref}
          data-nav-href={brandHref}
          ref={(el) => {
            if (el) itemRefs.current.set(brandHref, el);
            else itemRefs.current.delete(brandHref);
          }}
          className="relative z-10 flex items-center px-3 text-[12px] font-medium tracking-[-0.01em] text-[#18181b] transition-colors hover:text-[#111118]"
        >
          {brand}
        </Link>

        {/* desktop items */}
        <div ref={listRef} className="relative z-10 hidden items-center gap-0.5 sm:flex">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              data-nav-href={item.href}
              ref={(el) => {
                if (el) itemRefs.current.set(item.href, el);
                else itemRefs.current.delete(item.href);
              }}
              className="relative z-10 flex items-center rounded-full px-3 py-1.5 text-[12px] font-medium tracking-[-0.01em] text-[#71717a] transition-colors hover:text-[#18181b]"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* mobile items */}
        <div className="relative z-10 flex items-center gap-0.5 sm:hidden">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              data-nav-href={item.href}
              ref={(el) => {
                if (el) itemRefs.current.set(item.href, el);
                else itemRefs.current.delete(item.href);
              }}
              className="relative z-10 flex items-center rounded-full px-2.5 py-1.5 text-[11px] font-medium tracking-[-0.01em] text-[#71717a] transition-colors hover:text-[#18181b]"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
