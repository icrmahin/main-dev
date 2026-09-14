"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useLenis } from "lenis/react";
import { ArrowUpRight, Mail } from "lucide-react";
import { PROJECTS } from "../lib/projects";
import { DECK_STATES, DECK_Z_BASE } from "../lib/deck";
import { smoothScrollTo } from "../lib/scroll-to";
import ProjectCard from "./project-card";

/* ---------------------------------------------------------------------------
   Content
   --------------------------------------------------------------------------- */

const NAME = "Abdulla Al Mahin";
const TITLE = "Product Engineer";

const STATEMENT_LINE_1 = "I design and build";
const STATEMENT_LINE_2 = "digital products.";

const SUPPORTING =
  "From product interfaces and frontend systems to backend architecture and AI-powered features.";

const CAPABILITIES = ["Product design", "Frontend", "Backend", "AI"];

const CTA_PRIMARY = { label: "View selected work", href: "#work" };
const CTA_SECONDARY = { label: "Get in touch", href: "#contact" };

const AVAILABILITY = "Available for selected product work";
const LOCATION = "Dhaka · Remote";

/* ---------------------------------------------------------------------------
   Inline brand icons
   --------------------------------------------------------------------------- */

function GithubIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-3.375-12-12-12z" />
    </svg>
  );
}

function LinkedinIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function XIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const SOCIAL_LINKS = [
  { label: "GitHub", href: "https://github.com", icon: GithubIcon },
  { label: "LinkedIn", href: "https://linkedin.com", icon: LinkedinIcon },
  { label: "X", href: "https://x.com", icon: XIcon },
  { label: "Email", href: "mailto:mahin@example.com", icon: Mail },
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

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const identityRef = useRef<HTMLDivElement>(null);
  const statement1Ref = useRef<HTMLDivElement>(null);
  const statement2Ref = useRef<HTMLDivElement>(null);
  const supportingRef = useRef<HTMLParagraphElement>(null);
  const capabilitiesRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const availabilityRef = useRef<HTMLDivElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);
  const compressRef = useRef<HTMLDivElement>(null);
  const deckRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  /* ---- entrance animation ---- */
  useGSAP(
    () => {
      const reduced = prefersReducedMotion();

      const targets = [
        identityRef.current,
        statement1Ref.current,
        statement2Ref.current,
        supportingRef.current,
        capabilitiesRef.current,
        ctaRef.current,
        availabilityRef.current,
        socialRef.current,
        deckRef.current,
      ].filter(Boolean) as Element[];

      if (reduced) {
        gsap.set(targets, { opacity: 1, y: 0 });
        return;
      }

      gsap.set(targets, { opacity: 0, y: 10 });

      const tl = gsap.timeline({ delay: 0.1 });

      targets.forEach((el, i) => {
        const isHeadline = el === statement1Ref.current || el === statement2Ref.current;
        tl.to(
          el,
          {
            opacity: 1,
            y: 0,
            duration: isHeadline ? 0.6 : 0.45,
            ease: EASE,
          },
          i * 0.07,
        );
      });

      /* headline clip reveal */
      [statement1Ref.current, statement2Ref.current].forEach((el) => {
        if (!el) return;
        const inner = el.querySelector("[data-reveal]");
        if (inner) {
          gsap.fromTo(
            inner,
            { yPercent: 100 },
            { yPercent: 0, duration: 0.6, ease: EASE, delay: 0.1 },
          );
        }
      });
    },
    { scope: sectionRef },
  );

  /* ---- scroll compression (text column only — deck must stay put for the
          Hero→Work flight to remain glued to the grid) ---- */
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const el = sectionRef.current;
      const content = compressRef.current;
      if (!el || !content) return;

      let last = 0;

      const onScroll = () => {
        const y = window.scrollY;
        const d = y - last;
        last = y;

        if (y < 30) {
          gsap.to(el, { opacity: 1, duration: 0.3, ease: "power2.out" });
          gsap.to(content, { y: 0, duration: 0.3, ease: "power2.out" });
        } else if (d > 2) {
          gsap.to(el, { opacity: 0.9, duration: 0.4, ease: "power2.out" });
          gsap.to(content, { y: -6, duration: 0.4, ease: "power2.out" });
        } else if (d < -2) {
          gsap.to(el, { opacity: 1, duration: 0.4, ease: "power2.out" });
          gsap.to(content, { y: 0, duration: 0.4, ease: "power2.out" });
        }
      };

      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    },
    { scope: sectionRef },
  );

  /* ---- render ---- */
  return (
    <section
      ref={sectionRef}
      data-hero-section
      aria-label="Hero"
      className="relative z-20 flex flex-col justify-center px-6 pt-[min(18vh,150px)] pb-[min(10vh,80px)] max-md:pt-[min(14vh,110px)] max-md:pb-[min(6vh,60px)]"
    >
      <div className="container-center">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[1fr_356px] lg:gap-12">
          {/* ---- text column ---- */}
          <div ref={compressRef} className="lg:max-w-[620px]">
            {/* identity row */}
            <div ref={identityRef} className="mb-8 flex items-center gap-3 max-md:mb-6">
              <div className="relative h-[44px] w-[44px] shrink-0 overflow-hidden rounded-full shadow-[0_1px_6px_rgba(0,0,0,0.06)]">
                <Image
                  src="/avater.jpeg"
                  alt="Abdulla Al Mahin"
                  fill
                  sizes="44px"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="text-[13px] font-semibold leading-[1.2] tracking-[-0.01em] text-[var(--color-ink)]">
                  {NAME}
                </span>
                <span className="text-[12px] font-medium leading-[1.3] text-[var(--color-ink-tertiary)]">
                  {TITLE}
                </span>
              </div>
            </div>

            {/* main statement */}
            <div ref={statement1Ref} className="overflow-hidden">
              <h1
                data-reveal
                className="text-[clamp(32px,4.5vw,48px)] font-medium leading-[1.05] tracking-[-0.04em] text-[var(--color-ink)]"
              >
                {STATEMENT_LINE_1}
              </h1>
            </div>

            <div ref={statement2Ref} className="overflow-hidden">
              <h1
                data-reveal
                className="text-[clamp(32px,4.5vw,48px)] font-medium leading-[1.05] tracking-[-0.04em] text-[var(--color-ink)]"
              >
                {STATEMENT_LINE_2}
              </h1>
            </div>

            {/* supporting statement */}
            <p
              ref={supportingRef}
              className="mt-5 max-w-[480px] text-[14px] leading-[1.65] text-[var(--color-ink-secondary)] max-md:mt-4"
            >
              {SUPPORTING}
            </p>

            {/* capability line */}
            <div
              ref={capabilitiesRef}
              className="mt-6 flex flex-wrap items-center gap-x-1 gap-y-1 max-md:mt-5"
            >
              {CAPABILITIES.map((cap, i) => (
                <span key={cap} className="flex items-center gap-1">
                  {i > 0 && (
                    <span className="text-[var(--color-ink-muted)]">·</span>
                  )}
                  <span className="text-[12px] font-medium text-[var(--color-ink-tertiary)]">
                    {cap}
                  </span>
                </span>
              ))}
            </div>

            {/* ctas */}
            <div ref={ctaRef} className="mt-8 flex items-center gap-3 max-md:mt-7">
              <Link
                href={CTA_PRIMARY.href}
                onClick={(e) => {
                  e.preventDefault();
                  smoothScrollTo(CTA_PRIMARY.href, lenis ?? null);
                }}
                className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-primary)] px-5 py-2 text-[12px] font-medium text-[var(--color-primary-foreground)] shadow-[0_4px_14px_rgba(17,17,24,0.12)] transition-all duration-200 hover:bg-[var(--color-primary-hover)] hover:shadow-[0_6px_18px_rgba(17,17,24,0.16)] hover:-translate-y-px active:scale-[0.97]"
              >
                {CTA_PRIMARY.label}
                <ArrowUpRight size={12} strokeWidth={2.2} />
              </Link>

              <Link
                href={CTA_SECONDARY.href}
                onClick={(e) => {
                  e.preventDefault();
                  smoothScrollTo(CTA_SECONDARY.href, lenis ?? null);
                }}
                className="inline-flex items-center gap-1 rounded-full px-4 py-2 text-[12px] font-medium text-[var(--color-ink-tertiary)] transition-colors duration-200 hover:text-[var(--color-ink)]"
              >
                {CTA_SECONDARY.label}
              </Link>
            </div>

            {/* availability + social */}
            <div
              ref={availabilityRef}
              className="mt-8 flex items-center gap-3 max-md:mt-7 max-md:flex-col max-md:items-start max-md:gap-2.5"
            >
              <span className="flex items-center gap-1.5 text-[11px] text-[var(--color-ink-muted)]">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-mint)]" />
                {AVAILABILITY}
              </span>
              <span className="hidden text-[var(--color-ink-muted)] max-md:hidden">·</span>
              <span className="text-[11px] text-[var(--color-ink-muted)]">
                {LOCATION}
              </span>
            </div>

            <div ref={socialRef} className="mt-5 flex items-center gap-3">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="text-[var(--color-ink-muted)] transition-colors duration-200 hover:text-[var(--color-ink-secondary)]"
                >
                  <s.icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* ---- stacked project deck ---- */}
          <div
            ref={deckRef}
            data-hero-deck
            className="relative mx-auto h-[360px] w-full max-w-[330px] lg:mt-0 lg:h-[400px] lg:w-[356px] lg:max-w-none"
          >
            {PROJECTS.map((project, i) => (
              <div
                key={project.id}
                data-hero-card
                className="absolute left-0 right-0 mx-auto w-[268px] lg:w-[296px]"
                style={{
                  transform: `translate(${DECK_STATES[i].x}px, ${DECK_STATES[i].y}px) scale(${DECK_STATES[i].scale}) rotate(${DECK_STATES[i].rotation}deg)`,
                  transformOrigin: "0 0",
                  zIndex: DECK_Z_BASE - i,
                  willChange: "transform",
                }}
              >
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}