"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";

/* Navbar links shared by the desktop notch and the mobile menu. */
const NAV_LINKS = [
  { id: "about", label: "About", href: "#about" },
  { id: "projects", label: "Projects", href: "#projects" },
  { id: "experience", label: "Experience", href: "#experience" },
] as const;

/* Dhaka's timezone */
const LOCATION_TIME_ZONE = "Asia/Dhaka";
const LOCATION_LABEL = "Dhaka, Bangladesh";

function Avatar({ className = "size-8" }: { className?: string }) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full bg-accent font-semibold text-ink-on-accent ${className}`}
    >
      M
    </span>
  );
}

export default function Nav() {
  const notchAvatarRef = useRef<HTMLDivElement>(null);
  const notchTimeRef = useRef<HTMLDivElement>(null);
  const notchLinksRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLElement>(null);
  
  const desktopTl = useRef<gsap.core.Timeline | null>(null);
  const mobileTl = useRef<gsap.core.Timeline | null>(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const now = new Date();
  const today = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: LOCATION_TIME_ZONE,
  }).format(now);
  const todayISO = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: LOCATION_TIME_ZONE,
  }).format(now);

  /* Build the timelines ONCE on mount to prevent mid-hover breaking */
  useEffect(() => {
    // 1. Desktop Timeline
    if (notchLinksRef.current && notchAvatarRef.current && notchTimeRef.current) {
      const DURATION = 0.55;
      const MORPH_EASE = "power4.inOut"; 
      const FADE_EASE = "power2.inOut";

      desktopTl.current = gsap.timeline({ paused: true })
        .to(notchAvatarRef.current, { width: 0, duration: DURATION, ease: MORPH_EASE }, 0)
        .to(notchTimeRef.current, { width: 0, duration: DURATION, ease: MORPH_EASE }, 0)
        .to(notchLinksRef.current, { width: "auto", autoAlpha: 1, duration: DURATION, ease: MORPH_EASE }, 0)
        
        .to(notchAvatarRef.current.children, { autoAlpha: 0, scale: 0.85, x: -8, duration: 0.35, ease: FADE_EASE }, 0)
        .to(notchTimeRef.current.children, { autoAlpha: 0, scale: 0.85, x: 8, duration: 0.35, ease: FADE_EASE }, 0)
        
        .fromTo(
          notchLinksRef.current.querySelectorAll("a"),
          { autoAlpha: 0, y: 8, scale: 0.95 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.35, stagger: 0.03, ease: "power2.out" },
          0.15
        );
    }

    // 2. Mobile Timeline
    if (menuRef.current) {
      gsap.set(menuRef.current, { autoAlpha: 0, y: -16, scale: 0.95 });
      
      mobileTl.current = gsap.timeline({ paused: true })
        .fromTo(
          menuRef.current,
          { autoAlpha: 0, y: -16, scale: 0.95, transformOrigin: "top right" },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.4, ease: "power4.out" }
        )
        .fromTo(
          menuRef.current.querySelectorAll("a"),
          { autoAlpha: 0, y: -4 },
          { autoAlpha: 1, y: 0, duration: 0.25, stagger: 0.04, ease: "power2.out" },
          0.1
        );
    }

    return () => {
      desktopTl.current?.kill();
      mobileTl.current?.kill();
    };
  }, []);

  /* Simple play/reverse prevents GSAP from getting stuck on fast hovers */
  const expandNotch = useCallback(() => desktopTl.current?.play(), []);
  const collapseNotch = useCallback(() => desktopTl.current?.reverse(), []);

  const toggleMenu = useCallback(() => {
    if (isMenuOpen) mobileTl.current?.reverse();
    else mobileTl.current?.play();
    setIsMenuOpen((open) => !open);
  }, [isMenuOpen]);

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
      {/* ── Desktop: centered notch ──── */}
      <div className="pointer-events-none relative hidden md:block">
        {/* Fixed height (h-[40px]) prevents the pill from jittering vertically */}
        <div
          className="pointer-events-auto absolute left-1/2 top-4 flex h-[40px] -translate-x-1/2 items-center rounded-full bg-ink p-1 shadow-lg"
          onMouseEnter={expandNotch}
          onMouseLeave={collapseNotch}
          aria-label="Site navigation"
        >
          {/* Avatar Side */}
          <div ref={notchAvatarRef} className="flex overflow-hidden">
            <div className="flex w-max shrink-0 items-center justify-center pl-1 pr-2">
              <Avatar className="size-7 text-caption-1" />
            </div>
          </div>

          {/* Links Middle (whitespace-nowrap prevents text stacking) */}
          <nav
            ref={notchLinksRef}
            aria-label="Primary"
            className="w-0 overflow-hidden whitespace-nowrap opacity-0"
          >
            <div className="flex w-max items-center px-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  className="px-3 py-1 text-caption-2 font-medium uppercase tracking-widest text-ink-on-accent/70 transition-colors duration-200 hover:text-ink-on-accent"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </nav>

          {/* Time Side */}
          <div ref={notchTimeRef} className="flex overflow-hidden">
            <div className="flex w-max shrink-0 flex-col items-end pl-3 pr-2 leading-tight">
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
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" className="size-5">
                <path d="m6 6 12 12M18 6 6 18" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" className="size-5">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>

        <nav
          id="mobile-nav-menu"
          ref={menuRef}
          aria-label="Primary"
          className="absolute inset-x-4 top-full mt-2 overflow-hidden rounded-2xl border border-border bg-surface/90 opacity-0 shadow-lg backdrop-blur-xl"
        >
          <div className="divide-y divide-border">
            {NAV_LINKS.map((link) => (
              <a key={link.id} href={link.href} className="block px-5 py-3 text-body font-medium text-ink transition-colors hover:text-accent hover:bg-surface-sunken/50">
                {link.label}
              </a>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
