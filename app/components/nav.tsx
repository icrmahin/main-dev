"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";

/* Navbar links shared by the desktop notch and the mobile menu. */
const NAV_LINKS = [
  { id: "about", label: "About", href: "#about" },
  { id: "about", label: "About", href: "#about" },
  { id: "projects", label: "Projects", href: "#projects" },
  { id: "experience", label: "Experience", href: "#experience" },
] as const;

/* Dhaka's timezone — Asia/Dhaka is UTC+06:00, no daylight saving. */
const LOCATION_TIME_ZONE = "Asia/Dhaka";
const LOCATION_LABEL = "Dhaka, Bangladesh";

/* Filled-circle avatar, sized per slot via className. */
function Avatar({ className = "size-8" }: { className?: string }) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full bg-accent font-semibold text-ink-on-accent ${className}`}
    >
      M
    </span>
  );
}

/* Apple-notch style navigation.
   Desktop: a centered "Dynamic Island" holds the avatar on the left and the
   Dhaka date + location on the right; hovering reveals the nav links between.
   Mobile:  a pill bar shows avatar + name + hamburger that opens a menu. */
export default function Nav() {
  const notchLinksRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLElement>(null);
  const desktopTl = useRef<gsap.core.Timeline | null>(null);
  const mobileTl = useRef<gsap.core.Timeline | null>(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  /* Volatile time data is fine to render directly — suppressHydrationWarning
     tolerates a midnight-crossing mismatch between prerender and hydrate
     instead of forcing a cascading re-render. */
  const now = new Date();
  const today = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: LOCATION_TIME_ZONE,
  }).format(now);
  /* en-CA prints an ISO date (2026-09-14), still in the Dhaka timezone. */
  const todayISO = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: LOCATION_TIME_ZONE,
  }).format(now);

  /* Start both navs collapsed so they animate open on first interaction. */
  useEffect(() => {
    if (notchLinksRef.current) {
      gsap.set(notchLinksRef.current, { width: 0, autoAlpha: 0 });
      gsap.set(notchLinksRef.current.querySelectorAll("a"), { autoAlpha: 0, x: 16 });
    }
    if (menuRef.current) {
      gsap.set(menuRef.current, { autoAlpha: 0, y: -8, scale: 0.98 });
    }
  }, []);

  /* Desktop — expand the links out of the notch on hover. */
  const expandNotch = useCallback(() => {
    if (!notchLinksRef.current) return;

    desktopTl.current?.kill();
    desktopTl.current = gsap
      .timeline()
      .to(notchLinksRef.current, {
        width: "auto",
        autoAlpha: 1,
        duration: 0.45,
        ease: "power3.out",
      })
      .fromTo(
        notchLinksRef.current.querySelectorAll("a"),
        { autoAlpha: 0, x: 16 },
        { autoAlpha: 1, x: 0, duration: 0.25, stagger: 0.05, ease: "power2.out" },
        "<",
      );
  }, []);

  const collapseNotch = useCallback(() => {
    desktopTl.current?.reverse();
  }, []);

  /* Mobile — hamburger toggles the dropdown menu. */
  const openMenu = useCallback(() => {
    if (!menuRef.current) return;

    mobileTl.current?.kill();
    mobileTl.current = gsap
      .timeline()
      .fromTo(
        menuRef.current,
        { autoAlpha: 0, y: -8, scale: 0.98 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.3, ease: "power2.out" },
      )
      .fromTo(
        menuRef.current.querySelectorAll("a"),
        { autoAlpha: 0, y: -6 },
        { autoAlpha: 1, y: 0, duration: 0.22, stagger: 0.05, ease: "power2.out" },
        "<",
      );
  }, []);

  const closeMenu = useCallback(() => {
    mobileTl.current?.reverse();
  }, []);

  const toggleMenu = useCallback(() => {
    if (isMenuOpen) closeMenu();
    else openMenu();
    setIsMenuOpen((open) => !open);
  }, [isMenuOpen, openMenu, closeMenu]);

  /* Close the mobile menu with the Escape key. */
  useEffect(() => {
    if (!isMenuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") toggleMenu();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isMenuOpen, toggleMenu]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* ── Desktop: centered notch, avatar ↔ date/location in balance ──── */}
      <div className="pointer-events-none relative hidden md:block">
        {/* Notch — the avatar on its left and the Dhaka time on its right;
            hovering reveals the nav links in the middle. */}
        <div
          className="pointer-events-auto absolute left-1/2 top-4 flex -translate-x-1/2 items-center rounded-full bg-ink py-1 pl-1 pr-2 shadow-lg"
          onMouseEnter={expandNotch}
          onMouseLeave={collapseNotch}
          aria-label="Site navigation"
        >
          <Avatar className="size-7 text-caption-1" />

          {/* Hover-revealed links, framed with white space on both sides. */}
          <div className="mx-3">
            <nav
              ref={notchLinksRef}
              aria-label="Primary"
              className="w-0 overflow-hidden whitespace-nowrap opacity-0"
            >
              <div className="flex items-center">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.id}
                    href={link.href}
                    className="px-3 text-caption-2 font-medium uppercase tracking-widest text-ink-on-accent/70 transition-colors hover:text-ink-on-accent"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </nav>
          </div>

          {/* Date + location — mirrors the macOS menu-bar clock, in Dhaka time. */}
          <div className="ml-3 flex flex-col items-end leading-tight">
            <time
              dateTime={todayISO}
              suppressHydrationWarning
              className="text-caption-1 font-semibold tracking-wide text-ink-on-accent"
            >
              {today}
            </time>
            <span className="text-caption-2 font-medium text-ink-on-accent/60">
              {LOCATION_LABEL}
            </span>
          </div>
        </div>
      </div>

      {/* ── Mobile: avatar + name + hamburger with dropdown menu ────────── */}
      <div className="relative px-4 pt-4 md:hidden">
        <div className="flex items-center justify-between rounded-full border border-border bg-surface/80 px-3 py-2 shadow-sm backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <Avatar className="size-8 text-body" />
            <span className="text-subheadline font-semibold text-ink">Mahin</span>
          </div>

          <button
            type="button"
            onClick={toggleMenu}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-nav-menu"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="flex size-9 items-center justify-center rounded-full text-ink transition-colors hover:bg-surface-sunken"
          >
            {isMenuOpen ? (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
                className="size-5"
              >
                <path d="m6 6 12 12M18 6 6 18" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
                className="size-5"
              >
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Dropdown menu, animated with GSAP. */}
        <nav
          id="mobile-nav-menu"
          ref={menuRef}
          aria-label="Primary"
          className="absolute inset-x-4 top-full mt-2 overflow-hidden rounded-2xl border border-border bg-surface opacity-0 shadow-lg"
        >
          <div className="divide-y divide-border">
            {NAV_LINKS.map((link) => (
              <a
                key={link.id}
                href={link.href}
                className="block px-5 py-3 text-body font-medium text-ink transition-colors hover:text-accent"
              >
                {link.label}
              </a>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}