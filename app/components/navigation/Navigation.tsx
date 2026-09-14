"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useLenis } from "lenis/react";
import {
  resolveScrollTargetForId,
  scrollToWorkFromExternal,
  smoothScrollTo,
  smoothScrollToPosition,
} from "../../lib/scroll-to";

/* ---------------------------------------------------------------------------
   Types
   --------------------------------------------------------------------------- */

interface NavItem {
  readonly label: string;
  readonly href: string;
}

interface ProjectSection {
  readonly id: string;
  readonly label: string;
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
   Motion / surface constants
   --------------------------------------------------------------------------- */

const ENTRANCE = { duration: 0.6, ease: "power3.out" as const, delay: 0.1 };
const INDICATOR = { duration: 0.3, ease: "power2.out" as const };
const SCROLL = {
  hideY: -4,
  hideOpacity: 0.92,
  duration: 0.3,
  ease: "power2.out" as const,
};
const SECTION_OFFSET = 96;

/* restrained dark material — shared by both modes so the shell stays
   readable over light and dark content */
const PILL_STYLE: React.CSSProperties = {
  backgroundColor: "rgba(10, 10, 10, 0.84)",
  backdropFilter: "blur(18px) saturate(120%)",
  WebkitBackdropFilter: "blur(18px) saturate(120%)",
  border: "1px solid rgba(255, 255, 255, 0.10)",
  boxShadow:
    "0 10px 30px rgba(0, 0, 0, 0.28), 0 1px 0 rgba(255, 255, 255, 0.06) inset",
};

const ITEM_CLS =
  "relative z-10 flex items-center rounded-full px-3 py-1.5 text-[12px] font-medium tracking-[-0.01em] text-white/65 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 max-sm:px-2.5 max-sm:text-[11px]";

const FOCUS_CLS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60";

/* ---------------------------------------------------------------------------
   Helpers
   --------------------------------------------------------------------------- */

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Slide the shared indicator to a target element within the track. */
function slideIndicator(
  track: HTMLElement | null,
  indicator: HTMLElement | null,
  target: HTMLElement | null,
  animate: boolean,
): void {
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
}

/* ---------------------------------------------------------------------------
   NavigationShell — fixed wrapper + dark pill surface + entrance + scroll
   hide-on-scroll-down. The shell is stable: only the contextual content inside
   the pill changes between modes.
   --------------------------------------------------------------------------- */

function NavigationShell({
  label,
  children,
}: {
  readonly label: string;
  readonly children: React.ReactNode;
}) {
  const navRef = useRef<HTMLElement>(null);

  /* entrance */
  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        gsap.set(navRef.current, { opacity: 1, y: 0, scale: 1 });
        return;
      }
      gsap.fromTo(
        navRef.current,
        { opacity: 0, y: -8, scale: 0.985 },
        { opacity: 1, y: 0, scale: 1, ...ENTRANCE },
      );
    },
    { scope: navRef },
  );

  /* hide on scroll down, reveal on scroll up */
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      const el = navRef.current;
      if (!el) return;

      const quickToY = gsap.quickTo(el, "y", {
        duration: SCROLL.duration,
        ease: SCROLL.ease,
      });
      const quickToOpacity = gsap.quickTo(el, "opacity", {
        duration: SCROLL.duration,
        ease: SCROLL.ease,
      });

      let lastScroll = 0;
      const onScroll = () => {
        const y = window.scrollY;
        const delta = y - lastScroll;
        lastScroll = y;

        if (y < 20) {
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

  return (
    <nav
      ref={navRef}
      aria-label={label}
      className="fixed top-4 left-1/2 z-50 -translate-x-1/2 opacity-0"
    >
      <div
        className="relative flex items-center rounded-full px-1 py-[3px]"
        style={PILL_STYLE}
      >
        {children}
      </div>
    </nav>
  );
}

function NavSeparator() {
  return (
    <span
      aria-hidden="true"
      className="mx-1 h-4 w-px shrink-0 bg-white/10"
    />
  );
}

/* ===========================================================================
   MODE 1 — MAIN PORTFOLIO NAVIGATION
   =========================================================================== */

function MainNavigation() {
  const trackRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const itemRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());
  const [activeHref, setActiveHref] = useState<string>(DEFAULT_ITEMS[0].href);
  const [isHoveringNav, setIsHoveringNav] = useState(false);
  const lenis = useLenis();
  const router = useRouter();
  const pathname = usePathname();

  /* ---- anchor navigation: from the homepage, route through Lenis; resolve
         #work to the transition's actual completion position ---- */
  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      const onHome = pathname === "/";
      const isHash = href.startsWith("#") || href === "/";
      if (!isHash) return;

      e.preventDefault();
      if (href === "/") {
        if (onHome) smoothScrollTo("/", lenis ?? null);
        else router.push("/");
        return;
      }
      if (onHome) {
        smoothScrollTo(href, lenis ?? null);
      } else {
        /* #work / #about / #contact live on the homepage — route there first */
        router.push(`/${href}`);
      }
    },
    [lenis, pathname, router],
  );

  const moveIndicator = useCallback(
    (href: string, animate = true) => {
      slideIndicator(
        trackRef.current,
        indicatorRef.current,
        itemRefs.current.get(href) ?? null,
        animate,
      );
    },
    [],
  );

  /* ---- IntersectionObserver: detect active section ---- */
  useEffect(() => {
    const sectionIds = DEFAULT_ITEMS.map((item) => item.href.slice(1));

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const href = `#${entry.target.id}`;
            setActiveHref(href);
            if (!isHoveringNav) moveIndicator(href, true);
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
  }, [moveIndicator, isHoveringNav]);

  /* ---- entrance brings the indicator in on the first item ---- */
  useGSAP(
    () => {
      moveIndicator(DEFAULT_ITEMS[0].href, false);
    },
    { dependencies: [moveIndicator] },
  );

  /* ---- hover: indicator slide with return ---- */
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
          if (isSectionLink) moveIndicator(href, true);
          setIsHoveringNav(true);
        };
        const onLeave = () => {
          setIsHoveringNav(false);
          if (isSectionLink) moveIndicator(activeHref, true);
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

  /* ---- scroll-driven active updates ---- */
  useEffect(() => {
    if (!isHoveringNav) moveIndicator(activeHref, true);
  }, [activeHref, moveIndicator, isHoveringNav]);

  return (
    <NavigationShell label="Main navigation">
      <div ref={trackRef} className="relative flex items-center gap-0.5">
        <span
          ref={indicatorRef}
          aria-hidden="true"
          className="pointer-events-none absolute top-[3px] bottom-[3px] left-0 z-0 rounded-full bg-white/10 opacity-0"
        />

        <Link
          href="/"
          data-nav-href="/"
          onClick={(e) => handleNavClick(e, "/")}
          ref={(el) => {
            if (el) itemRefs.current.set("/", el);
            else itemRefs.current.delete("/");
          }}
          className={`relative z-10 flex items-center px-3 text-[12px] font-semibold tracking-[-0.01em] text-white ${FOCUS_CLS}`}
        >
          Mahin
        </Link>

        <NavSeparator />

        {DEFAULT_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            data-nav-href={item.href}
            onClick={(e) => handleNavClick(e, item.href)}
            ref={(el) => {
              if (el) itemRefs.current.set(item.href, el);
              else itemRefs.current.delete(item.href);
            }}
            aria-current={activeHref === item.href ? "true" : undefined}
            className={`${ITEM_CLS} ${
              activeHref === item.href ? "!text-white" : ""
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </NavigationShell>
  );
}

/* ===========================================================================
   MODE 2 — CASE-STUDY READING NAVIGATION
   =========================================================================== */

function ProjectNavigation({ slug }: { readonly slug: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const lenis = useLenis();

  const trackRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const itemRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());
  const mobileLabelRef = useRef<HTMLAnchorElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressTextRef = useRef<HTMLSpanElement>(null);
  const moreRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const [sections, setSections] = useState<readonly ProjectSection[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [title, setTitle] = useState(slug);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isHoveringNav, setIsHoveringNav] = useState(false);
  const activeIdRef = useRef("");
  const firstSectionId = sections[0]?.id ?? "";

  const moveIndicator = useCallback(
    (id: string, animate = true) => {
      slideIndicator(
        trackRef.current,
        indicatorRef.current,
        itemRefs.current.get(id) ?? null,
        animate,
      );
    },
    [],
  );

  /* ---- read the ACTUAL case-study page structure: section anchors + the
         project title come from the rendered page, never hardcoded here ---- */
  useEffect(() => {
    let cancelled = false;
    let raf = 0;

    const read = (): boolean => {
      const els = Array.from(
        document.querySelectorAll<HTMLElement>("[data-nav-section]"),
      );
      if (els.length === 0) return false;

      const next = els.map((el) => ({
        id: el.id,
        label: el.getAttribute("data-nav-section") ?? el.id,
      }));

      const titleEl = document.querySelector("[data-case-study-title]");
      if (!cancelled) {
        setSections(next);
        setActiveId((current) => {
          if (current && next.some((s) => s.id === current)) return current;
          return next[0]?.id ?? "";
        });
        if (titleEl) {
          setTitle(titleEl.textContent?.trim() || slug);
        }
      }
      return true;
    };

    if (!read()) {
      /* sections may render after the layout nav — poll a few frames */
      const poll = () => {
        if (cancelled) return;
        if (read()) return;
        raf = requestAnimationFrame(poll);
      };
      raf = requestAnimationFrame(poll);
    }

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [pathname, slug]);

  /* ---- IntersectionObserver: active section follows the reading position ---- */
  useEffect(() => {
    if (sections.length === 0) return;

    const els = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            activeIdRef.current = entry.target.id;
            setActiveId(entry.target.id);
            if (!isHoveringNav) moveIndicator(entry.target.id, true);
          }
        }
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: 0 },
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections, moveIndicator, isHoveringNav]);

  /* ---- keep the indicator glued to the active section ---- */
  useEffect(() => {
    activeIdRef.current = activeId;
    if (!isHoveringNav && activeId) moveIndicator(activeId, true);
  }, [activeId, moveIndicator, isHoveringNav]);

  /* ---- initial indicator home (layout settled) ---- */
  useGSAP(
    () => {
      if (sections.length > 0) moveIndicator(firstSectionId, false);
    },
    { dependencies: [sections, firstSectionId, moveIndicator] },
  );

  /* ---- mobile visible-label crossfade when the active section changes ---- */
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const el = mobileLabelRef.current;
    if (!el) return;
    gsap.fromTo(el, { opacity: 0.35 }, { opacity: 1, duration: 0.25, ease: "power2.out" });
  }, [activeId]);

  /* ---- reading progress: thin line + small percentage, scroll-driven ---- */
  useEffect(() => {
    const bar = progressBarRef.current;
    const textEl = progressTextRef.current;
    if (!bar || !textEl) return;

    const reduced = prefersReducedMotion();
    const quickTo = reduced
      ? (pct: number) => gsap.set(bar, { scaleX: pct })
      : gsap.quickTo(bar, "scaleX", {
          duration: 0.25,
          ease: "power2.out",
        });

    let lastPct = -1;
    const onScroll = () => {
      const max =
        document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      quickTo(pct);
      const rounded = Math.round(pct * 100);
      if (rounded !== lastPct) {
        lastPct = rounded;
        textEl.textContent = `${rounded}%`;
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ---- navigate: internal section, back to work, brand ---- */
  const goToSection = useCallback(
    (e: React.MouseEvent, id: string) => {
      e.preventDefault();
      setMenuOpen(false);
      const target = resolveScrollTargetForId(id, SECTION_OFFSET);
      if (target != null) smoothScrollToPosition(target, lenis ?? null, 1.0);
    },
    [lenis],
  );

  const goToWork = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      router.push("/#work");
      void scrollToWorkFromExternal(lenis ?? null);
    },
    [lenis, router],
  );

  const goHome = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      router.push("/");
    },
    [router],
  );

  /* ---- mobile menu: close on outside click / Escape ---- */
  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        moreRef.current &&
        !moreRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const activeSection = useMemo(
    () => sections.find((s) => s.id === activeId) ?? sections[0],
    [sections, activeId],
  );

  return (
    <NavigationShell label="Project navigation">
      <div
        ref={trackRef}
        className="relative flex items-center gap-0.5"
        onMouseEnter={() => setIsHoveringNav(true)}
        onMouseLeave={() => setIsHoveringNav(false)}
      >
        <span
          ref={indicatorRef}
          aria-hidden="true"
          className="pointer-events-none absolute top-[3px] bottom-[3px] left-0 z-0 rounded-full bg-white/10 opacity-0"
        />

        {/* brand — returns to the portfolio */}
        <Link
          href="/"
          onClick={goHome}
          className={`relative z-10 flex items-center px-3 text-[12px] font-semibold tracking-[-0.01em] text-white ${FOCUS_CLS}`}
        >
          Mahin
        </Link>

        <NavSeparator />

        {/* back to work — Lenis smooth return to the settled Work section */}
        <Link
          href="/#work"
          onClick={goToWork}
          className={`relative z-10 flex items-center rounded-full px-3 py-1.5 text-[12px] font-medium text-white/65 transition-colors hover:text-white ${FOCUS_CLS}`}
        >
          <span aria-hidden="true" className="mr-1.5 inline-block">
            ←
          </span>
          Work
        </Link>

        {/* contextual project label — desktop/enough-space notch */}
        {title && (
          <span className="hidden max-w-[140px] truncate px-2 text-[11px] font-medium tracking-[-0.01em] text-white/40 lg:block">
            {title}
          </span>
        )}

        {/* section links — desktop + tablet */}
        <div className="hidden items-center gap-0.5 md:flex">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              data-nav-href={section.id}
              onClick={(e) => goToSection(e, section.id)}
              ref={(el) => {
                if (el) itemRefs.current.set(section.id, el);
                else itemRefs.current.delete(section.id);
              }}
              aria-current={activeId === section.id ? "true" : undefined}
              className={`${ITEM_CLS} ${
                activeId === section.id ? "!text-white" : ""
              }`}
            >
              {section.label}
            </a>
          ))}
        </div>

        {/* mobile — current section label */}
        <div className="flex items-center gap-0.5 md:hidden">
          <a
            href={activeSection ? `#${activeSection.id}` : "#"}
            onClick={(e) => activeSection && goToSection(e, activeSection.id)}
            data-mobile-label
            aria-current="true"
            className="relative z-10 flex min-w-[72px] items-center px-2.5 py-1.5 text-[11px] font-medium text-white"
          >
            {activeSection?.label ?? "…"}
          </a>

          {/* ••• contextual section menu (project-reading only) */}
          <div className="relative">
            <button
              ref={moreRef}
              type="button"
              aria-label="More project sections"
              aria-haspopup="true"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              className={`relative z-10 flex h-7 w-7 items-center justify-center rounded-full text-[11px] tracking-[0.08em] text-white/65 transition-colors hover:text-white ${FOCUS_CLS}`}
            >
              •••
            </button>
            {menuOpen && (
              <div
                ref={menuRef}
                role="menu"
                aria-label="Project sections"
                className="absolute right-0 top-[calc(100%+10px)] z-50 flex w-44 flex-col gap-0.5 rounded-2xl p-1.5"
                style={PILL_STYLE}
              >
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    role="menuitem"
                    onClick={(e) => goToSection(e, section.id)}
                    aria-current={activeId === section.id ? "true" : undefined}
                    className={`rounded-xl px-3 py-2 text-left text-[12px] font-medium text-white/65 transition-colors hover:bg-white/10 hover:text-white ${FOCUS_CLS} ${
                      activeId === section.id ? "!text-white" : ""
                    }`}
                  >
                    {section.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* reading progress — thin line + percentage */}
        <div className="pointer-events-none absolute inset-x-2 bottom-[2px] h-px overflow-hidden rounded-full bg-white/10">
          <div
            ref={progressBarRef}
            className="h-full w-full origin-left scale-x-0 rounded-full bg-white/60"
          />
        </div>
        <span
          ref={progressTextRef}
          className="relative z-10 ml-1 px-2 text-[10px] font-medium tabular-nums text-white/45"
        >
          0%
        </span>
      </div>
    </NavigationShell>
  );
}

/* ===========================================================================
   Router — picks the mode from the current route
   =========================================================================== */

export default function Navigation() {
  const pathname = usePathname();
  const isProject = pathname.startsWith("/work/");
  const slug = isProject ? pathname.split("/")[2] ?? "" : "";

  return isProject ? <ProjectNavigation slug={slug} /> : <MainNavigation />;
}