"use client";
import { JSX, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { Briefcase, User, Layers, type LucideIcon } from "lucide-react";

export interface NavItem {
  readonly label: string;
  readonly href: string;
  readonly icon?: LucideIcon;
  readonly className?: string;
  readonly activeClassName?: string;
}

export interface NavClassNames {
  readonly nav?: string;
  readonly inner?: string;
  readonly brand?: string;
  readonly list?: string;
  readonly item?: string;
  readonly link?: string;
}

interface NavProps {
  readonly brand?: string;
  readonly brandHref?: string;
  readonly items?: readonly NavItem[];
  readonly classNames?: NavClassNames;
  readonly animate?: boolean;
}

const DEFAULT_ITEMS: readonly NavItem[] = [
  { label: "Work", href: "#work", icon: Briefcase },
  { label: "About", href: "#about", icon: User },
  { label: "Experience", href: "#experience", icon: Layers },
] as const;

const DEFAULT_CLASSES: Required<NavClassNames> = {
  nav: "glass-nav sticky top-0 z-50",
  inner: "mx-auto flex h-16 max-w-7xl items-center justify-center px-6 relative",
  brand:
    "absolute left-6 text-headline font-medium tracking-tight text-ink transition-colors duration-200 hover:text-accent",
  list: "relative flex items-center gap-1",
  item: "",
  link: "nav-link relative z-10 flex items-center gap-0 rounded-full px-4 py-1.5 text-subheadline text-ink-secondary transition-all duration-200 hover:text-ink",
};

const ACTIVE_LINK_CLASS = "text-ink";

const join = (...parts: Array<string | undefined | false>) =>
  parts.filter(Boolean).join(" ");

export default function Nav({
  brand = "Mahin",
  brandHref = "/",
  items = DEFAULT_ITEMS,
  classNames = {},
  animate = true,
}: NavProps): JSX.Element {
  const pathname = usePathname();

  const navRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);

  const [activeHref, setActiveHref] = useState(() =>
    typeof window === "undefined" ? "" : window.location.hash || pathname,
  );

  const { nav, inner, brand: brandCls, list, item, link } = {
    ...DEFAULT_CLASSES,
    ...classNames,
  };

  const matchesActive = useCallback(
    (navItem: NavItem) =>
      navItem.href.startsWith("#")
        ? activeHref === navItem.href
        : pathname === navItem.href,
    [activeHref, pathname],
  );

  useEffect(() => {
    const onHashChange = () => setActiveHref(window.location.hash || pathname);
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [pathname]);

  const linkRef = useCallback(
    (href: string) =>
      listRef.current?.querySelector<HTMLAnchorElement>(
        `a[data-nav-href="${href}"]`,
      ) ?? null,
    [],
  );

  const positionIndicator = useCallback(() => {
    const listEl = listRef.current;
    const indicator = indicatorRef.current;
    if (!listEl || !indicator) return;

    const target = items.find(
      (navItem) => navItem.href.startsWith("#") && matchesActive(navItem),
    );
    const targetEl = target ? linkRef(target.href) : null;

    if (!targetEl) {
      gsap.to(indicator, { opacity: 0, duration: 0.3, ease: "power2.out" });
      return;
    }

    const listRect = listEl.getBoundingClientRect();
    const linkRect = targetEl.getBoundingClientRect();

    gsap.to(indicator, {
      x: linkRect.left - listRect.left,
      width: linkRect.width,
      opacity: 1,
      duration: 0.5,
      ease: "power3.out",
    });
  }, [items, matchesActive, linkRef]);

  useLayoutEffect(() => {
    positionIndicator();

    if (typeof window === "undefined") return;
    const reflow = () => positionIndicator();
    window.addEventListener("resize", reflow);
    const observer = new ResizeObserver(reflow);
    if (listRef.current) observer.observe(listRef.current);

    return () => {
      window.removeEventListener("resize", reflow);
      observer.disconnect();
    };
  }, [positionIndicator]);

  useLayoutEffect(() => {
    if (!animate) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const links = Array.from(
        listRef.current?.querySelectorAll<HTMLAnchorElement>(
          "a[data-nav-href]",
        ) ?? [],
      );
      const brandEl =
        listRef.current?.parentElement?.querySelector<HTMLAnchorElement>(
          "a[data-nav-brand]",
        ) ?? null;

      gsap.fromTo(
        navRef.current,
        { opacity: 0, y: -16 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
      );

      gsap.fromTo(
        brandEl ? [brandEl, ...links] : links,
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power3.out",
          stagger: 0.07,
          delay: 0.15,
        },
      );

      const cleanups = links.map((linkEl) => {
        const onEnter = () =>
          gsap.to(linkEl, { y: -1, duration: 0.25, ease: "power2.out" });
        const onLeave = () =>
          gsap.to(linkEl, { y: 0, duration: 0.4, ease: "power2.out" });
        linkEl.addEventListener("mouseenter", onEnter);
        linkEl.addEventListener("mouseleave", onLeave);
        return () => {
          linkEl.removeEventListener("mouseenter", onEnter);
          linkEl.removeEventListener("mouseleave", onLeave);
        };
      });

      return () => cleanups.forEach((cleanup) => cleanup());
    });

    return () => mm.revert();
  }, [animate, items]);

  return (
    <nav ref={navRef} className={join(nav)}>
      <div className={join(inner)}>
        <Link
          href={brandHref}
          data-nav-brand
          className={join(brandCls)}
        >
          {brand}
        </Link>

        <ul ref={listRef} className={join(list)}>
          <span
            ref={indicatorRef}
            aria-hidden="true"
            className="glass-pill pointer-events-none absolute inset-y-0 left-0 z-0 rounded-full opacity-0"
          />
          {items.map((navItem) => {
            const isActive = matchesActive(navItem);
            const Icon = navItem.icon;
            return (
              <li key={navItem.href} className={join(item)}>
                <Link
                  href={navItem.href}
                  data-nav-href={navItem.href}
                  onClick={() => {
                    if (navItem.href.startsWith("#")) setActiveHref(navItem.href);
                  }}
                  className={join(
                    link,
                    isActive && ACTIVE_LINK_CLASS,
                    isActive && navItem.activeClassName,
                  )}
                >
                  <span className="nav-icon-wrapper items-center justify-center">
                    {Icon && <Icon size={15} strokeWidth={2} />}
                  </span>
                  {navItem.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
