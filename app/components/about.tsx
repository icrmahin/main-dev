"use client";

import { useCallback, useRef, useState } from "react";
import type { ComponentType, SVGProps } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import {
  Figma,
  Gsap,
  Nextjs,
  Openai,
  Python,
  React as ReactIcon,
  Tailwindcss,
  Typescript,
} from "@thesvg/react";

/* ---------------------------------------------------------------------------
   Types
   --------------------------------------------------------------------------- */

type SvgIcon = ComponentType<SVGProps<SVGSVGElement>>;

interface StackItem {
  readonly name: string;
  readonly icon: SvgIcon;
}

interface Experience {
  readonly role: string;
  readonly company: string;
  readonly period: string;
  readonly description?: string;
  readonly responsibilities?: readonly string[];
  readonly stack?: readonly string[];
  readonly href?: string;
}

/* ---------------------------------------------------------------------------
   Data
   --------------------------------------------------------------------------- */

const INTRO_LEAD =
  "Product Engineer — I design, engineer, and ship digital products.";

const INTRO_BODY =
  "I started in interface and brand design, then moved through frontend engineering into end-to-end product development. Today I work across product thinking, interface design, modern frontend, backend systems, and AI-assisted development — comfortable moving between the interface, the implementation, and the product decisions that connect them. I care about systems that feel intentional: quiet, fast, and trustworthy through clarity rather than decoration.";

const CURRENTLY =
  "Currently building product features across interface and systems layers — from design and frontend engineering to backend and AI integration.";

const STACK: readonly StackItem[] = [
  { name: "Figma", icon: Figma },
  { name: "Next.js", icon: Nextjs },
  { name: "React", icon: ReactIcon },
  { name: "TypeScript", icon: Typescript },
  { name: "Tailwind CSS", icon: Tailwindcss },
  { name: "GSAP", icon: Gsap },
  { name: "Python", icon: Python },
  { name: "OpenAI", icon: Openai },
] as const;

const EXPERIENCE: readonly Experience[] = [
  {
    role: "Product Engineer",
    company: "Pathao",
    period: "Mar 2025 — Present",
    description:
      "Building product features across interface and systems layers for a leading mobility platform.",
    responsibilities: [
      "Designed and shipped product features end-to-end",
      "Built frontend systems with React and TypeScript",
      "Collaborated with design and backend teams on integration",
    ],
    stack: ["React", "TypeScript", "Next.js"],
  },
  {
    role: "Frontend Engineer",
    company: "klikit",
    period: "Mar 2023 — Feb 2025",
    description:
      "Led frontend development for a digital commerce platform, building scalable interfaces and design systems.",
    responsibilities: [
      "Built and maintained the core frontend application",
      "Developed reusable component libraries",
      "Improved performance and accessibility across the platform",
    ],
    stack: ["React", "TypeScript", "Tailwind CSS"],
  },
  {
    role: "Frontend Engineer",
    company: "ACS Future School",
    period: "Sept 2024 — Feb 2025",
    description:
      "Developed frontend interfaces for an education technology platform.",
    responsibilities: [
      "Built responsive web interfaces for student and admin dashboards",
      "Implemented real-time data visualization components",
    ],
    stack: ["React", "TypeScript", "Next.js"],
  },
  {
    role: "UI/UX Designer",
    company: "Panorama",
    period: "Oct 2022 — Feb 2023",
    description:
      "Designed product interfaces and user experiences for digital products.",
    responsibilities: [
      "Created interface designs and interactive prototypes",
      "Developed design systems and component guidelines",
      "Conducted user research and usability testing",
    ],
    stack: ["Figma"],
  },
  {
    role: "Frontend Developer",
    company: "Better Aid BD",
    period: "May 2022 — Sept 2022",
    description:
      "Built frontend interfaces for a social impact platform connecting aid organizations.",
    responsibilities: [
      "Developed responsive web interfaces",
      "Implemented interactive data dashboards",
    ],
    stack: ["React", "JavaScript", "Tailwind CSS"],
  },
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

function isTouchDevice(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(pointer: coarse)").matches;
}

/* ---------------------------------------------------------------------------
   Component
   --------------------------------------------------------------------------- */

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const stackContainerRef = useRef<HTMLDivElement>(null);
  const expHeaderRef = useRef<HTMLDivElement>(null);
  const expListRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  const [openExp, setOpenExp] = useState<string | null>(null);
  const openExpRef = useRef<string | null>(null);

  const iconRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  /* ---- portrait hover ---- */
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const el = portraitRef.current;
      if (!el) return;

      const onEnter = () => {
        gsap.to(el, {
          rotation: -1,
          scale: 1.01,
          boxShadow: "0 20px 50px rgb(61 59 92 / 0.12)",
          duration: 0.4,
          ease: EASE,
        });
      };
      const onLeave = () => {
        gsap.to(el, {
          rotation: -2,
          scale: 1,
          boxShadow: "0 8px 24px rgb(61 59 92 / 0.06)",
          duration: 0.5,
          ease: EASE,
        });
      };

      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
      return () => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
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

      const portrait = portraitRef.current;
      const contentEls = contentRef.current
        ? Array.from(contentRef.current.children)
        : [];
      const stackItems = stackContainerRef.current
        ? Array.from(stackContainerRef.current.querySelectorAll("[data-stack-icon]"))
        : [];
      const expHeader = expHeaderRef.current;
      const expRows = expListRef.current
        ? Array.from(expListRef.current.querySelectorAll("[data-exp-row]"))
        : [];
      const footer = footerRef.current;

      const targets = [
        portrait,
        ...contentEls,
        ...stackItems,
        expHeader,
        ...expRows,
        footer,
      ].filter(Boolean) as Element[];

      gsap.set(targets, { opacity: 0, y: 14 });

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting || revealed) return;
          revealed = true;

          const tl = gsap.timeline();

          if (portrait) {
            tl.to(portrait, { opacity: 1, y: 0, duration: 0.6, ease: EASE }, 0);
          }

          contentEls.forEach((el, i) => {
            tl.to(
              el,
              { opacity: 1, y: 0, duration: 0.5, ease: EASE },
              0.1 + i * 0.06,
            );
          });

          /* stack icons stagger in */
          stackItems.forEach((item, i) => {
            tl.fromTo(
              item,
              { opacity: 0, y: 6, scale: 0.9 },
              { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: EASE },
              0.25 + i * 0.04,
            );
          });

          if (expHeader) {
            tl.to(expHeader, { opacity: 1, y: 0, duration: 0.4, ease: EASE }, 0.4);
          }

          expRows.forEach((row, i) => {
            tl.to(row, { opacity: 1, y: 0, duration: 0.4, ease: EASE }, 0.45 + i * 0.06);
          });

          if (footer) {
            tl.to(footer, { opacity: 1, y: 0, duration: 0.4, ease: EASE }, 0.6);
          }

          observer.disconnect();
        },
        { threshold: 0.08 },
      );

      observer.observe(section);
      return () => observer.disconnect();
    },
    { scope: sectionRef },
  );

  /* ---- stack antigravity ---- */
  useGSAP(
    () => {
      if (prefersReducedMotion() || isTouchDevice()) return;
      const container = stackContainerRef.current;
      if (!container) return;

      const RADIUS = 90;
      const MAX_DISPLACEMENT = 16;
      const icons = Array.from(container.querySelectorAll("[data-stack-icon]")) as HTMLElement[];
      if (!icons.length) return;

      /* cache rest positions (all 0 at rest, we just need quickTo instances) */
      const xTos = icons.map((el) => gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" }));
      const yTos = icons.map((el) => gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" }));

      const onMove = (e: PointerEvent) => {
        const containerRect = container.getBoundingClientRect();
        const mx = e.clientX - containerRect.left;
        const my = e.clientY - containerRect.top;

        icons.forEach((icon, i) => {
          const iconRect = icon.getBoundingClientRect();
          const ix = iconRect.left - containerRect.left + iconRect.width / 2;
          const iy = iconRect.top - containerRect.top + iconRect.height / 2;

          const dx = ix - mx;
          const dy = iy - my;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < RADIUS) {
            const force = 1 - dist / RADIUS;
            const nx = dx / (dist || 1);
            const ny = dy / (dist || 1);
            xTos[i](nx * force * MAX_DISPLACEMENT);
            yTos[i](ny * force * MAX_DISPLACEMENT);
          } else {
            xTos[i](0);
            yTos[i](0);
          }
        });
      };

      const onLeave = () => {
        icons.forEach((_, i) => {
          xTos[i](0);
          yTos[i](0);
        });
      };

      container.addEventListener("pointermove", onMove);
      container.addEventListener("pointerleave", onLeave);
      return () => {
        container.removeEventListener("pointermove", onMove);
        container.removeEventListener("pointerleave", onLeave);
      };
    },
    { scope: sectionRef },
  );

  /* ---- stack icon hover (micro-interaction) ---- */
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const container = stackContainerRef.current;
      if (!container) return;

      const cleanups: Array<() => void> = [];
      const icons = container.querySelectorAll("[data-stack-icon]");

      icons.forEach((icon, index) => {
        const onEnter = () => {
          gsap.set(icon, { zIndex: 20 });
          gsap.to(icon, {
            scale: 1.04,
            boxShadow: "0 6px 18px rgb(61 59 92 / 0.12)",
            duration: 0.22,
            ease: "power2.out",
          });
        };

        const onLeave = () => {
          gsap.set(icon, { zIndex: index + 1 });
          gsap.to(icon, {
            scale: 1,
            boxShadow: "0 2px 8px rgb(61 59 92 / 0.06)",
            duration: 0.25,
            ease: "power2.out",
          });
        };

        const onFocus = () => {
          gsap.set(icon, { zIndex: 20 });
          gsap.to(icon, {
            scale: 1.04,
            boxShadow: "0 6px 18px rgb(61 59 92 / 0.12)",
            duration: 0.22,
            ease: "power2.out",
          });
        };

        const onBlur = () => {
          gsap.set(icon, { zIndex: index + 1 });
          gsap.to(icon, {
            scale: 1,
            boxShadow: "0 2px 8px rgb(61 59 92 / 0.06)",
            duration: 0.25,
            ease: "power2.out",
          });
        };

        icon.addEventListener("mouseenter", onEnter);
        icon.addEventListener("mouseleave", onLeave);
        icon.addEventListener("focus", onFocus);
        icon.addEventListener("blur", onBlur);
        cleanups.push(() => {
          icon.removeEventListener("mouseenter", onEnter);
          icon.removeEventListener("mouseleave", onLeave);
          icon.removeEventListener("focus", onFocus);
          icon.removeEventListener("blur", onBlur);
        });
      });

      return () => cleanups.forEach((fn) => fn());
    },
    { scope: sectionRef },
  );

  /* ---- experience accordion ---- */
  const toggleExp = useCallback(
    (company: string) => {
      const wasOpen = openExpRef.current;
      const next = wasOpen === company ? null : company;

      /* close previous */
      if (wasOpen) {
        const prevPanel = document.getElementById(`exp-panel-${wasOpen}`);
        const prevChevron = document.querySelector(`[data-exp-chevron="${wasOpen}"]`);
        if (prevPanel) {
          gsap.to(prevPanel, {
            height: 0,
            opacity: 0,
            duration: 0.3,
            ease: "power2.out",
            onComplete: () => {
              prevPanel.style.overflow = "hidden";
            },
          });
        }
        if (prevChevron) {
          gsap.to(prevChevron, { rotation: 0, duration: 0.3, ease: "power2.out" });
        }
      }

      /* open new */
      if (next) {
        const panel = document.getElementById(`exp-panel-${next}`);
        const chevron = document.querySelector(`[data-exp-chevron="${next}"]`);
        if (panel) {
          panel.style.overflow = "hidden";
          const targetH = panel.scrollHeight;
          gsap.set(panel, { height: 0, opacity: 0 });
          gsap.to(panel, {
            height: targetH,
            opacity: 1,
            duration: 0.4,
            ease: "power2.out",
            onComplete: () => {
              panel.style.overflow = "visible";
            },
          });
        }
        if (chevron) {
          gsap.to(chevron, { rotation: 180, duration: 0.3, ease: "power2.out" });
        }
      }

      openExpRef.current = next;
      setOpenExp(next);
    },
    [],
  );

  /* ---- render ---- */
  return (
    <section
      ref={sectionRef}
      id="about"
      aria-label="About"
      className="container-center section-space"
    >
      <div className="flex gap-[72px] max-lg:flex-col max-lg:gap-10">
        {/* ---- left: portrait ---- */}
        <div className="w-[30%] shrink-0 max-lg:w-full">
          <div
            ref={portraitRef}
            className="sticky top-28 inline-block rotate-[-2deg] rounded-2xl bg-[var(--color-surface)] p-2.5 max-lg:static max-lg:mx-auto max-lg:block max-lg:w-fit"
            style={{ boxShadow: "0 8px 24px rgb(61 59 92 / 0.06)" }}
          >
            <div className="relative h-[260px] w-[220px] overflow-hidden rounded-xl max-md:h-[200px] max-md:w-[170px]">
              <Image
                src="/avater.jpg"
                alt="Abdulla Al Mahin"
                fill
                sizes="(max-width: 768px) 170px, 220px"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>

        {/* ---- right: content ---- */}
        <div className="flex flex-1 flex-col gap-8 max-lg:w-full max-lg:gap-7">
          {/* intro block */}
          <div ref={contentRef}>
            <span className="section-label">About</span>

            <p className="mb-4 max-w-[520px] text-[20px] font-medium leading-[1.35] tracking-[-0.02em] text-[var(--color-ink)] max-md:text-[18px]">
              {INTRO_LEAD}
            </p>

            <p className="max-w-[500px] text-[14px] leading-[1.65] text-[var(--color-ink-secondary)]">
              {INTRO_BODY}
            </p>
          </div>

          {/* currently + stack */}
          <div>
            <span className="mb-2 block text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--color-ink-muted)]">
              Currently
            </span>
            <p className="mb-6 max-w-[440px] text-[13px] leading-[1.6] text-[var(--color-ink-secondary)]">
              {CURRENTLY}
            </p>

            {/* stack */}
            <span className="mb-3 block text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--color-ink-muted)]">
              My Stack
            </span>

            <div
              ref={stackContainerRef}
              className="relative flex items-center"
            >
              {STACK.map((item, index) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.name}
                    data-stack-icon
                    ref={(el) => {
                      if (el) iconRefs.current.set(item.name, el);
                      else iconRefs.current.delete(item.name);
                    }}
                    type="button"
                    aria-label={item.name}
                    className="relative flex h-[36px] w-[36px] items-center justify-center rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-surface)] text-[var(--color-ink-secondary)] transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-violet)]"
                    style={{
                      boxShadow: "0 2px 8px rgb(61 59 92 / 0.06)",
                      marginLeft: index === 0 ? 0 : -5,
                      zIndex: index + 1,
                      willChange: "transform",
                    }}
                  >
                    <Icon
                      aria-hidden="true"
                      className="h-[22px] w-[22px] shrink-0"
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* experience */}
          <div>
            <div ref={expHeaderRef} className="mb-1">
              <span className="mb-2 block text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--color-ink-muted)]">
                Experience
              </span>
            </div>

            <div ref={expListRef} className="flex flex-col">
              {EXPERIENCE.map((exp) => {
                const isOpen = openExp === exp.company;
                const panelId = `exp-panel-${exp.company}`;
                const triggerId = `exp-trigger-${exp.company}`;

                return (
                  <div key={`${exp.company}-${exp.period}`} data-exp-row>
                    <button
                      id={triggerId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => toggleExp(exp.company)}
                      className="group flex w-full items-center justify-between gap-5 border-t border-[var(--color-border-subtle)] py-5 text-left transition-colors duration-200 hover:bg-[var(--color-surface-hover)] max-md:flex-col max-md:gap-1.5 max-md:py-4"
                    >
                      <div className="flex flex-1 flex-col gap-0.5">
                        <span
                          data-exp-role
                          className="text-[14px] font-medium leading-[1.3] tracking-[-0.01em] text-[var(--color-ink)] max-md:text-[13px]"
                        >
                          {exp.company}
                          <span className="ml-2 text-[var(--color-ink-tertiary)]">
                            {exp.role}
                          </span>
                        </span>
                      </div>

                      <div className="flex shrink-0 items-center gap-2.5 max-md:mt-0.5">
                        <span className="text-[11px] font-medium text-[var(--color-ink-muted)]">
                          {exp.period}
                        </span>
                        <ChevronDown
                          data-exp-chevron={exp.company}
                          size={14}
                          strokeWidth={2}
                          className="text-[var(--color-ink-muted)] transition-colors duration-200 group-hover:text-[var(--color-ink-secondary)]"
                        />
                      </div>
                    </button>

                    {/* accordion panel */}
                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={triggerId}
                      style={{ height: 0, opacity: 0, overflow: "hidden" }}
                    >
                      <div className="px-1 pb-5 pt-2">
                        {exp.description && (
                          <p className="mb-3 max-w-[500px] text-[13px] leading-[1.6] text-[var(--color-ink-secondary)]">
                            {exp.description}
                          </p>
                        )}

                        {exp.responsibilities && exp.responsibilities.length > 0 && (
                          <div className="mb-3">
                            <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.06em] text-[var(--color-ink-muted)]">
                              Responsibilities
                            </span>
                            <ul className="flex flex-col gap-1">
                              {exp.responsibilities.map((r) => (
                                <li
                                  key={r}
                                  className="flex items-start gap-2 text-[13px] leading-[1.5] text-[var(--color-ink-secondary)]"
                                >
                                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[var(--color-ink-muted)]" />
                                  {r}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {exp.stack && exp.stack.length > 0 && (
                          <div className="mb-3">
                            <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.06em] text-[var(--color-ink-muted)]">
                              Stack
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {exp.stack.map((s) => (
                                <span
                                  key={s}
                                  className="inline-flex items-center rounded-full bg-[var(--color-background-subtle)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--color-ink-secondary)]"
                                >
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {exp.href && exp.href !== "#" && (
                          <Link
                            href={exp.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/link inline-flex items-center gap-1 text-[12px] font-medium text-[var(--color-ink-secondary)] transition-colors duration-200 hover:text-[var(--color-ink)]"
                          >
                            Visit site
                            <ArrowUpRight
                              size={11}
                              strokeWidth={2}
                              className="transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                            />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div className="border-t border-[var(--color-border-subtle)]" />
            </div>
          </div>

          {/* footer */}
          <div ref={footerRef} className="pt-1">
            <p className="mb-3 text-[13px] leading-[1.6] text-[var(--color-ink-tertiary)]">
              Open to thoughtful product work.
            </p>
            <Link
              href="mailto:icrmahin@gmail.com"
              className="group inline-flex items-center gap-1.5 text-[12px] font-medium text-[var(--color-ink-secondary)] transition-colors duration-200 hover:text-[var(--color-ink)]"
            >
              Let&apos;s work together
              <ArrowUpRight
                size={12}
                strokeWidth={2}
                className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
