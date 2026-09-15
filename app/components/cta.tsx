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

const CTA = { label: "Get in touch", href: "mailto:icrmahin@gmail.com" };

const CONTACT_LINKS = [
  { label: "Email", href: "mailto:icrmahin@gmail.com" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/icrmahin" },
  { label: "GitHub", href: "https://github.com/icrmahin" },
] as const;

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

      gsap.set(targets, { opacity: 0, y: 12 });

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
    <section
      ref={sectionRef}
      id="contact"
      aria-label="Contact"
      className="flex flex-col items-center px-6 pb-[96px] pt-[96px] text-center max-md:pb-[64px] max-md:pt-[64px]"
    >
      {/* headline */}
      <h2
        ref={headlineRef}
        className="mb-3 whitespace-pre-line text-[clamp(26px,3.8vw,36px)] font-[600] leading-[1.06] tracking-[-0.032em] text-[var(--color-ink)]"
      >
        {HEADLINE}
      </h2>

      {/* description */}
      <p
        ref={descRef}
        className="mb-7 max-w-[420px] text-[13.5px] leading-[1.6] text-[var(--color-ink-secondary)]"
      >
        {DESCRIPTION}
      </p>

      {/* primary CTA */}
      <div ref={ctaRef}>
        <Link
          href={CTA.href}
          className="inline-flex items-center gap-2 rounded-full bg-[var(--color-ink)] px-5 py-2.5 text-[12px] font-medium text-[var(--color-background)] transition-colors duration-200 hover:bg-[var(--color-primary-hover)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--color-violet)]"
        >
          {CTA.label}
          <span ref={arrowRef} className="inline-flex">
            <ArrowUpRight size={13} strokeWidth={2.2} />
          </span>
        </Link>
      </div>

      {/* contact links */}
      <div ref={linksRef} className="mt-7 flex items-center gap-3.5">
        {CONTACT_LINKS.map((link, i) => (
          <span key={link.label} className="flex items-center gap-3.5">
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
              className="text-[12px] font-medium text-[var(--color-ink-tertiary)] transition-colors duration-200 hover:text-[var(--color-ink-secondary)]"
            >
              {link.label}
            </Link>
          </span>
        ))}
      </div>
    </section>
  );
}
