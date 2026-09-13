"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight, Mail } from "lucide-react";

/* ---------------------------------------------------------------------------
   Content
   --------------------------------------------------------------------------- */

const NAME = "Abdulla Al Mahin";
const HEADLINE_LINE_1 = "Product Engineer";
const HEADLINE_LINE_2 = "design × engineering × AI";
const DESCRIPTION =
  "I design and engineer digital products — combining thoughtful interaction design, modern frontend systems, and AI.";

const CTA_PRIMARY = { label: "View work", href: "#work" };
const CTA_SECONDARY = { label: "About", href: "#about" };

/* ---------------------------------------------------------------------------
   Inline brand icons (lucide-react dropped brand marks)
   --------------------------------------------------------------------------- */

function GithubIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function LinkedinIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function XIcon({ size = 15 }: { size?: number }) {
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

const SEQUENCE = [
  { key: "avatar", delay: 0 },
  { key: "name", delay: 0.08 },
  { key: "line1", delay: 0.16 },
  { key: "line2", delay: 0.24 },
  { key: "desc", delay: 0.32 },
  { key: "cta", delay: 0.4 },
  { key: "social", delay: 0.48 },
] as const;

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
  const avatarRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLSpanElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);

  /* ---- entrance animation ---- */
  useGSAP(
    () => {
      const reduced = prefersReducedMotion();

      const targets = [
        avatarRef.current,
        nameRef.current,
        line1Ref.current,
        line2Ref.current,
        descRef.current,
        ctaRef.current,
        socialRef.current,
      ].filter(Boolean) as Element[];

      if (reduced) {
        gsap.set(targets, { opacity: 1, y: 0 });
        return;
      }

      gsap.set(targets, { opacity: 0, y: 12 });

      const tl = gsap.timeline({ delay: 0.15 });

      targets.forEach((el, i) => {
        const s = SEQUENCE[i];
        tl.to(
          el,
          {
            opacity: 1,
            y: 0,
            duration: s.key === "line1" || s.key === "line2" ? 0.6 : 0.45,
            ease: EASE,
          },
          s.delay,
        );
      });

      /* headline word reveal via yPercent */
      [line1Ref.current, line2Ref.current].forEach((el) => {
        if (!el) return;
        const inner = el.querySelector("[data-reveal]");
        if (inner) {
          gsap.fromTo(
            inner,
            { yPercent: 100 },
            { yPercent: 0, duration: 0.65, ease: EASE, delay: 0.12 },
          );
        }
      });
    },
    { scope: sectionRef },
  );

  /* ---- scroll compression ---- */
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const el = sectionRef.current;
      if (!el) return;

      let last = 0;

      const onScroll = () => {
        const y = window.scrollY;
        const d = y - last;
        last = y;

        if (y < 30) {
          gsap.to(el, { y: 0, opacity: 1, duration: 0.3, ease: "power2.out" });
        } else if (d > 2) {
          gsap.to(el, {
            y: -12,
            opacity: 0.88,
            duration: 0.4,
            ease: "power2.out",
          });
        } else if (d < -2) {
          gsap.to(el, { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" });
        }
      };

      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    },
    { scope: sectionRef },
  );

  /* ---- avatar mouse parallax ---- */
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const avatar = avatarRef.current;
      if (!avatar) return;

      const xTo = gsap.quickTo(avatar, "x", {
        duration: 0.4,
        ease: "power2.out",
      });
      const yTo = gsap.quickTo(avatar, "y", {
        duration: 0.4,
        ease: "power2.out",
      });

      const onMove = (e: MouseEvent) => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        const dx = ((e.clientX - w / 2) / w) * 5;
        const dy = ((e.clientY - h / 2) / h) * 3;
        xTo(Math.max(-4, Math.min(4, dx)));
        yTo(Math.max(-3, Math.min(3, dy)));
      };

      window.addEventListener("mousemove", onMove, { passive: true });
      return () => window.removeEventListener("mousemove", onMove);
    },
    { scope: sectionRef },
  );

  /* ---- render ---- */
  return (
    <section
      ref={sectionRef}
      aria-label="Hero"
      className="relative flex min-h-[85vh] flex-col items-center justify-center px-6"
    >
      <div className="flex max-w-[520px] flex-col items-center text-center">
        {/* ---- avatar ---- */}
        <div ref={avatarRef} className="mb-5">
          <div className="relative h-[60px] w-[60px] overflow-hidden rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.06)]">
            <Image
              src="/avater.jpeg"
              alt="Abdulla Al Mahin"
              fill
              sizes="60px"
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* ---- name ---- */}
        <span
          ref={nameRef}
          className="mb-8 block text-[12px] font-medium tracking-[-0.01em] text-[var(--color-ink-tertiary)]"
        >
          {NAME}
        </span>

        {/* ---- headline line 1 ---- */}
        <div
          ref={line1Ref}
          className="overflow-hidden"
        >
          <h1
            data-reveal
            className="text-[clamp(34px,5vw,52px)] font-medium leading-[0.95] tracking-[-0.045em] text-[var(--color-ink)]"
          >
            {HEADLINE_LINE_1}
          </h1>
        </div>

        {/* ---- headline line 2 ---- */}
        <div
          ref={line2Ref}
          className="overflow-hidden"
        >
          <p
            data-reveal
            className="text-[clamp(15px,1.8vw,20px)] font-normal leading-[1.3] tracking-[-0.015em] text-[var(--color-ink-tertiary)]"
          >
            {HEADLINE_LINE_2}
          </p>
        </div>

        {/* ---- description ---- */}
        <p
          ref={descRef}
          className="mt-6 max-w-[420px] text-[14px] leading-[1.6] text-[var(--color-ink-secondary)]"
        >
          {DESCRIPTION}
        </p>

        {/* ---- ctas ---- */}
        <div
          ref={ctaRef}
          className="mt-8 flex items-center gap-3"
        >
          <Link
            href={CTA_PRIMARY.href}
            className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-primary)] px-5 py-2 text-[12px] font-medium text-[var(--color-primary-foreground)] shadow-[0_4px_14px_rgba(17,17,24,0.12)] transition-all duration-200 hover:bg-[var(--color-primary-hover)] hover:shadow-[0_6px_18px_rgba(17,17,24,0.16)] hover:-translate-y-px active:scale-[0.97]"
          >
            {CTA_PRIMARY.label}
            <ArrowUpRight size={12} strokeWidth={2.2} />
          </Link>

          <Link
            href={CTA_SECONDARY.href}
            className="inline-flex items-center gap-1 rounded-full px-4 py-2 text-[12px] font-medium text-[var(--color-ink-tertiary)] transition-colors duration-200 hover:text-[var(--color-ink)]"
          >
            {CTA_SECONDARY.label}
          </Link>
        </div>

        {/* ---- social ---- */}
        <div
          ref={socialRef}
          className="mt-8 flex items-center gap-3.5"
        >
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
    </section>
  );
}
