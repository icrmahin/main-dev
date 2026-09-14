"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight, ChevronDown } from "lucide-react";

/* ---------------------------------------------------------------------------
   Types
   --------------------------------------------------------------------------- */

interface StackItem {
  readonly name: string;
  readonly icon: (props: { size?: number }) => React.JSX.Element;
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
   SVG Icons — simple, recognizable brand marks
   --------------------------------------------------------------------------- */

function FigmaIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="3.2" y="0.5" width="8" height="8" rx="2.6" fill="#F24E1E"/>
      <rect x="11.2" y="0.5" width="8" height="8" rx="2.6" fill="#FF7262"/>
      <rect x="3.2" y="8" width="8" height="8" rx="2.6" fill="#A259FF"/>
      <rect x="11.2" y="8" width="8" height="8" rx="2.6" fill="#1ABCFE"/>
      <rect x="3.2" y="15.5" width="8" height="8" rx="2.6" fill="#0ACF83"/>
    </svg>
  );
}

function NextjsIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 180 180" fill="none">
      <mask id="mask0" style={{maskType: "alpha"}} maskUnits="userSpaceOnUse" x="0" y="0" width="180" height="180">
        <circle cx="90" cy="90" r="90" fill="black"/>
      </mask>
      <g mask="url(#mask0)" transform="translate(90 90) scale(0.85) translate(-90 -90)">
        <circle cx="90" cy="90" r="90" fill="black"/>
        <path d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z" fill="url(#paint0)"/>
        <rect x="115" y="54" width="12" height="72" fill="url(#paint1)"/>
      </g>
      <defs>
        <linearGradient id="paint0" x1="109" y1="116.5" x2="144.5" y2="160.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="white"/>
          <stop offset="1" stopColor="white" stopOpacity="0"/>
        </linearGradient>
        <linearGradient id="paint1" x1="121" y1="54" x2="120.799" y2="106.875" gradientUnits="userSpaceOnUse">
          <stop stopColor="white"/>
          <stop offset="1" stopColor="white" stopOpacity="0"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

function ReactIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="2.5"/>
      <ellipse cx="12" cy="12" rx="10" ry="4"/>
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/>
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/>
    </svg>
  );
}

function TypescriptIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="3" fill="#3178C6"/>
      <path d="M14.0732 19.3604V17.6562C14.0732 17.0378 14.1756 16.4753 14.3804 15.9688C14.5852 15.4622 14.8666 15.0434 15.2247 14.7124C15.5827 14.3814 15.9927 14.1464 16.4544 14.0073C16.9162 13.8682 17.4066 13.7986 17.9258 13.7986C18.4538 13.7986 18.9442 13.8682 19.3968 14.0073C19.8494 14.1464 20.2486 14.3766 20.5945 14.6978C20.9403 15.019 21.2109 15.4288 21.4063 15.9272C21.6016 16.4257 21.6993 16.9978 21.6993 17.6436V19.3604H20.1493V17.7861C20.1493 17.2238 20.0517 16.7312 19.8564 16.3083C19.661 15.8854 19.3904 15.5544 19.0445 15.3152C18.6987 15.076 18.3043 14.9315 17.8614 14.8818C17.4186 14.8322 16.9523 14.8074 16.4626 14.8074C15.9586 14.8074 15.4815 14.837 15.0313 14.8963C14.581 14.9556 14.1818 15.0654 13.8337 15.2258C13.4856 15.3862 13.2042 15.6116 12.9895 15.902C12.7748 16.1924 12.6674 16.5664 12.6674 17.024V19.3604H14.0732ZM9.78084 19.3604V9.01172H11.3308V19.3604H9.78084Z" fill="white"/>
      <path d="M6.90188 18.0059C7.27599 18.4487 7.75308 18.7946 8.33317 19.0436C8.91326 19.2927 9.5469 19.4172 10.2341 19.4172C10.7621 19.4172 11.2441 19.3427 11.6804 19.1937C12.1166 19.0446 12.4908 18.8362 12.8028 18.5684C13.1149 18.3006 13.3535 17.9843 13.5188 17.6196C13.6841 17.2549 13.7667 16.8532 13.7667 16.4145C13.7653 16.1008 13.7143 15.7982 13.6137 15.5066C13.5132 15.215 13.3716 14.9562 13.1889 14.7302C13.0061 14.5042 12.7909 14.316 12.5433 14.1656C12.2957 14.0152 12.025 13.9027 11.7311 13.8281C11.4372 13.7535 11.1353 13.7103 10.8253 13.6985L10.0474 13.667C9.64137 13.6524 9.25848 13.6075 8.89871 13.5322C8.53894 13.457 8.21963 13.3398 7.94077 13.1808C7.66192 13.0217 7.43857 12.8103 7.27072 12.5466C7.10288 12.2828 7.01896 11.9561 7.01896 11.5664C7.01896 11.0473 7.13767 10.5784 7.37508 10.1596C7.6125 9.74084 7.94453 9.40114 8.37118 9.14055C8.79783 8.87996 9.2985 8.70255 9.87318 8.60834C10.4479 8.51413 11.0748 8.46703 11.7539 8.46703C12.4331 8.46703 13.0572 8.51721 13.6263 8.61757C14.1953 8.71793 14.696 8.86715 15.1283 9.06522C15.5606 9.26329 15.9164 9.51046 16.1957 9.80673C16.475 10.103 16.678 10.4489 16.8047 10.8444L15.4277 11.3896C15.2985 11.0406 15.0901 10.7393 14.8026 10.4856C14.515 10.2319 14.1691 10.0386 13.7649 9.90568C13.3607 9.7728 12.9134 9.70636 12.4229 9.70636C11.9094 9.70636 11.4431 9.77436 11.0239 9.91035C10.6048 10.0463 10.2503 10.2366 9.96058 10.4813C9.67089 10.726 9.44895 11.0226 9.29478 11.371C9.14061 11.7195 9.06353 12.1136 9.06353 12.5533C9.06353 12.9976 9.15614 13.3963 9.34135 13.7495C9.52656 14.1027 9.77876 14.3968 10.098 14.6319C10.4172 14.867 10.7851 15.0434 11.2017 15.1611C11.6184 15.2789 12.0657 15.3378 12.5437 15.3378L13.4121 15.3065C13.8549 15.2947 14.284 15.2604 14.6996 15.2036C15.1152 15.1468 15.4921 15.0621 15.8304 14.9496C16.1687 14.8371 16.4519 14.6917 16.6801 14.5134C16.9083 14.3352 17.0707 14.1178 17.1673 13.8612C17.264 13.6046 17.3123 13.3037 17.3123 12.9586V11.5664H14.4967V12.7239H15.8127V12.9586C15.8127 13.1784 15.7807 13.3898 15.7169 13.5928C15.653 13.7958 15.5536 13.9732 15.4186 14.125C15.2837 14.2768 15.1192 14.3932 14.9252 14.4742C14.7312 14.5552 14.5141 14.5957 14.2738 14.5957C13.8522 14.5957 13.4973 14.5083 13.2091 14.3335C12.9209 14.1587 12.7029 13.9248 12.555 13.6319C12.4072 13.339 12.3333 13.0094 12.3333 12.6431C12.3333 12.184 12.4414 11.7822 12.6576 11.4378C12.8738 11.0933 13.1718 10.8219 13.5516 10.6234C13.9314 10.425 14.3674 10.3258 14.8595 10.3258C15.3253 10.3258 15.7411 10.4181 16.1068 10.6027C16.4726 10.7873 16.7628 11.0493 16.9774 11.3888C17.1921 11.7283 17.2994 12.1307 17.2994 12.596V13.8403C17.2994 14.778 17.0814 15.5828 16.6454 16.2548C16.2094 16.9268 15.6085 17.433 14.8427 17.7734C14.0769 18.1138 13.1922 18.284 12.1886 18.284C11.5334 18.284 10.9211 18.2149 10.3517 18.0767C9.78229 17.9385 9.27769 17.7439 8.83797 17.493L6.90188 18.0059Z" fill="white"/>
    </svg>
  );
}

function TailwindIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 6c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.3.74 1.9 1.35.98 1 2.13 2.15 4.6 2.15 2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.3-.74-1.9-1.35C15.62 7.15 14.47 6 12 6zM7 12c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.3.74 1.9 1.35C8.38 16.85 9.53 18 12 18c2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.3-.74-1.9-1.35C10.62 13.15 9.47 12 7 12z"/>
    </svg>
  );
}

function GsapIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm4 0h-2V7h2v10z"/>
    </svg>
  );
}

function PythonIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.914 0C5.82 0 6.2 2.656 6.2 2.656l.007 2.752h5.813v.828H3.9S0 5.789 0 11.968c0 6.18 3.403 5.96 3.403 5.96h2.026v-2.867s-.109-3.403 3.355-3.403h5.767s3.246.052 3.246-3.149V3.256S18.085 0 11.914 0zM8.708 1.842a1.05 1.05 0 011.05 1.05 1.05 1.05 0 01-1.05 1.05A1.05 1.05 0 017.658 2.892a1.05 1.05 0 011.05-1.05z"/>
      <path d="M12.086 24c6.094 0 5.714-2.656 5.714-2.656l-.007-2.752h-5.813v-.828h8.12S24 18.211 24 12.032c0-6.18-3.403-5.96-3.403-5.96h-2.026v2.867s.109 3.403-3.355 3.403H9.449s-3.246-.052-3.246 3.149v4.28S5.915 24 12.086 24zm3.206-1.842a1.05 1.05 0 01-1.05-1.05 1.05 1.05 0 011.05-1.05 1.05 1.05 0 011.05 1.05 1.05 1.05 0 01-1.05 1.05z"/>
    </svg>
  );
}

function AiIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a4 4 0 0 1 4 4v1a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z"/>
      <path d="M8 14h8"/>
      <path d="M9 18h6"/>
      <path d="M10 22h4"/>
      <circle cx="9" cy="7" r="0.5" fill="currentColor"/>
      <circle cx="15" cy="7" r="0.5" fill="currentColor"/>
    </svg>
  );
}

/* ---------------------------------------------------------------------------
   Data
   --------------------------------------------------------------------------- */

const INTRO_LEAD =
  "I design and engineer digital products where thoughtful interfaces meet reliable software.";

const INTRO_BODY =
  "My work sits at the intersection of product design, frontend engineering, and AI. I care about systems that feel intentional — interfaces that are quiet, fast, and build trust through clarity rather than decoration.";

const CURRENTLY =
  "Building at the intersection of product design, frontend engineering and AI.";

const STACK: readonly StackItem[] = [
  { name: "Figma", icon: FigmaIcon },
  { name: "Next.js", icon: NextjsIcon },
  { name: "React", icon: ReactIcon },
  { name: "TypeScript", icon: TypescriptIcon },
  { name: "Tailwind", icon: TailwindIcon },
  { name: "GSAP", icon: GsapIcon },
  { name: "Python", icon: PythonIcon },
  { name: "AI APIs", icon: AiIcon },
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
                src="/avater.jpeg"
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
                    <Icon size={16} />
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
              href="mailto:mahin@example.com"
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
