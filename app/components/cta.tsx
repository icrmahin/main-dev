"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight } from "lucide-react";

/* ---------------------------------------------------------------------------
   Content
   --------------------------------------------------------------------------- */

const HEADLINE = "Have something\nworth building?";

const DESCRIPTION =
  "I'm available for thoughtful product work across design, frontend engineering and AI.";

const CTA = { label: "Get in touch", href: "mailto:mahin@example.com" };

const CONTACT_LINKS = [
  { label: "Email", href: "mailto:mahin@example.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "GitHub", href: "https://github.com" },
] as const;

const FOOTER = {
  copyright: "© 2026 Abdulla Al Mahin",
  location: "Dhaka · Bangladesh",
} as const;

/* ---------------------------------------------------------------------------
   Animation constants
   --------------------------------------------------------------------------- */

const EASE = "power3.out" as const;

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

export default function Cta() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const arrowRef = useRef<HTMLSpanElement>(null);

  /* ---- CTA button hover ---- */
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const btn = ctaRef.current;
      const arrow = arrowRef.current;
      if (!btn || !arrow) return;

      const onEnter = () => {
        gsap.to(btn, { y: -1, duration: 0.3, ease: EASE });
        gsap.to(arrow, { x: 3, duration: 0.3, ease: EASE });
      };
      const onLeave = () => {
        gsap.to(btn, { y: 0, duration: 0.3, ease: EASE });
        gsap.to(arrow, { x: 0, duration: 0.25, ease: EASE });
      };

      btn.addEventListener("mouseenter", onEnter);
      btn.addEventListener("mouseleave", onLeave);
      return () => {
        btn.removeEventListener("mouseenter", onEnter);
        btn.removeEventListener("mouseleave", onLeave);
      };
    },
    { scope: sectionRef },
  );

  /* ---- scroll reveal ---- */
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const section = sectionRef.current;
      if (!section) return;

      let revealed = false;

      const targets = [headlineRef.current, descRef.current, ctaRef.current, linksRef.current].filter(
        Boolean,
      ) as Element[];

      gsap.set(targets, { opacity: 0, y: 14 });

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting || revealed) return;
          revealed = true;

          const tl = gsap.timeline();

          tl.to(headlineRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: EASE,
          });
          tl.to(
            descRef.current,
            { opacity: 1, y: 0, duration: 0.5, ease: EASE },
            0.1,
          );
          tl.to(
            ctaRef.current,
            { opacity: 1, y: 0, duration: 0.5, ease: EASE },
            0.2,
          );
          tl.to(
            linksRef.current,
            { opacity: 1, y: 0, duration: 0.4, ease: EASE },
            0.3,
          );

          observer.disconnect();
        },
        { threshold: 0.2 },
      );

      observer.observe(section);
      return () => observer.disconnect();
    },
    { scope: sectionRef },
  );

  /* ---- render ---- */
  return (
    <>
      <section
        ref={sectionRef}
        id="contact"
        aria-label="Contact"
        className="flex flex-col items-center px-6 pb-[100px] pt-[160px] text-center max-md:pb-[80px] max-md:pt-[100px]"
      >
        {/* headline */}
        <h2
          ref={headlineRef}
          className="mb-5 whitespace-pre-line text-[clamp(32px,5vw,52px)] font-medium leading-[1.02] tracking-[-0.04em] text-[var(--color-ink)]"
        >
          {HEADLINE}
        </h2>

        {/* description */}
        <p
          ref={descRef}
          className="mb-9 max-w-[460px] text-[15px] leading-[1.65] text-[var(--color-ink-secondary)]"
        >
          {DESCRIPTION}
        </p>

        {/* primary CTA */}
        <div ref={ctaRef}>
          <Link
            href={CTA.href}
            className="inline-flex items-center gap-2 rounded-full bg-[var(--color-ink)] px-6 py-2.5 text-[13px] font-medium text-[var(--color-background)] transition-colors duration-200 hover:bg-[var(--color-primary-hover)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--color-violet)]"
          >
            {CTA.label}
            <span ref={arrowRef} className="inline-flex">
              <ArrowUpRight size={14} strokeWidth={2.2} />
            </span>
          </Link>
        </div>

        {/* contact links */}
        <div ref={linksRef} className="mt-8 flex items-center gap-4">
          {CONTACT_LINKS.map((link, i) => (
            <span key={link.label} className="flex items-center gap-4">
              {i > 0 && (
                <span className="text-[var(--color-ink-muted)]">·</span>
              )}
              <Link
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={
                  link.href.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
                className="text-[13px] font-medium text-[var(--color-ink-tertiary)] transition-colors duration-200 hover:text-[var(--color-ink-secondary)]"
              >
                {link.label}
              </Link>
            </span>
          ))}
        </div>
      </section>

      {/* ---- footer ---- */}
      <footer
        ref={footerRef}
        className="mx-auto flex w-full max-w-[1060px] items-center justify-between border-t border-[var(--color-border-subtle)] px-6 py-6 text-[11px] font-medium text-[var(--color-ink-muted)] max-md:flex-col max-md:gap-3 max-md:text-center"
      >
        <span>{FOOTER.copyright}</span>
        <span>{FOOTER.location}</span>
      </footer>
    </>
  );
}
