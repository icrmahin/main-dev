"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight } from "lucide-react";

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
  readonly href?: string;
}

/* ---------------------------------------------------------------------------
   SVG Icons — simple, recognizable brand marks
   --------------------------------------------------------------------------- */

function FigmaIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 38 57" fill="none">
      <path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z" fill="#1ABCFE"/>
      <path d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z" fill="#0ACF83"/>
      <path d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z" fill="#FF7262"/>
      <path d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z" fill="#F24E1E"/>
      <path d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z" fill="#A259FF"/>
    </svg>
  );
}

function NextjsIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 180 180" fill="none">
      <mask id="mask0" style={{maskType: "alpha"}} maskUnits="userSpaceOnUse" x="0" y="0" width="180" height="180">
        <circle cx="90" cy="90" r="90" fill="black"/>
      </mask>
      <g mask="url(#mask0)">
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
      <path d="M6.90188 18.0059C7.27599 18.4487 7.75308 18.7946 8.33317 19.0436C8.91326 19.2927 9.5469 19.4172 10.2341 19.4172C10.7621 19.4172 11.2441 19.3427 11.6804 19.1937C12.1166 19.0446 12.4908 18.8362 12.8028 18.5684C13.1149 18.3006 13.3535 17.9843 13.5188 17.6196C13.6841 17.2549 13.7667 16.8532 13.7667 16.4145C13.7653 16.1008 13.7143 15.7982 13.6137 15.5066C13.5132 15.215 13.3716 14.9562 13.1889 14.7302C13.0061 14.5042 12.7909 14.316 12.5433 14.1656C12.2957 14.0152 12.025 13.9027 11.7311 13.8281C11.4372 13.7535 11.1353 13.7103 10.8253 13.6985L10.0474 13.667C9.64137 13.6524 9.25848 13.6075 8.89871 13.5322C8.53894 13.457 8.21963 13.3398 7.94077 13.1808C7.66192 13.0217 7.43857 12.8103 7.27072 12.5466C7.10288 12.2828 7.01896 11.9561 7.01896 11.5664C7.01896 11.0473 7.13767 10.5784 7.37508 10.1596C7.6125 9.74084 7.94453 9.40114 8.37118 9.14055C8.79783 8.87996 9.2985 8.70255 9.87318 8.60834C10.4479 8.51413 11.0748 8.46703 11.7539 8.46703C12.4331 8.46703 13.0572 8.51721 13.6263 8.61757C14.1953 8.71793 14.696 8.86715 15.1283 9.06522C15.5606 9.26329 15.9164 9.51046 16.1957 9.80673C16.475 10.103 16.678 10.4489 16.8047 10.8444L15.4277 11.3896C15.2985 11.0406 15.0901 10.7393 14.8026 10.4856C14.515 10.2319 14.1691 10.0386 13.7649 9.90568C13.3607 9.7728 12.9134 9.70636 12.4229 9.70636C11.9094 9.70636 11.4431 9.77436 11.0239 9.91035C10.6048 10.0463 10.2503 10.2366 9.96058 10.4813C9.67089 10.726 9.44895 11.0226 9.29478 11.371C9.14061 11.7195 9.06353 12.1136 9.06353 12.5533C9.06353 12.9976 9.15614 13.3963 9.34135 13.7495C9.52656 14.1027 9.77876 14.3968 10.098 14.6319C10.4172 14.867 10.7851 15.0434 11.2017 15.1611C11.6184 15.2789 12.0657 15.3378 12.5437 15.3378L13.4121 15.3065C13.8549 15.2947 14.284 15.2604 14.6996 15.2036C15.1152 15.1468 15.4921 15.0621 15.8304 14.9496C16.1687 14.8371 16.4519 14.6917 16.6801 14.5134C16.9083 14.3352 17.0707 14.1178 17.1673 13.8612C17.264 13.6046 17.3123 13.3037 17.3123 12.9586V11.5664H14.4967V12.7239H15.8127V12.9586C15.8127 13.1784 15.7807 13.3706 15.7168 13.5352C15.6529 13.6997 15.5567 13.8329 15.4282 13.9348C15.2997 14.0367 15.142 14.1026 14.955 14.1325C14.768 14.1625 14.5597 14.1774 14.3301 14.1774H13.4121C12.9081 14.1774 12.4476 14.1312 12.0306 14.0386C11.6137 13.946 11.2555 13.8095 10.9561 13.6291C10.6567 13.4487 10.4241 13.2248 10.2583 12.9575C10.0925 12.6902 10.0096 12.3784 10.0096 12.0222C10.0096 11.6385 10.0966 11.2916 10.2706 10.9815C10.4445 10.6713 10.6801 10.4133 10.9774 10.2074C11.2747 10.0015 11.6179 9.85474 12.007 9.76708C12.396 9.67942 12.8111 9.63559 13.2521 9.63559L14.3301 9.6669C14.7525 9.67868 15.1617 9.71663 15.5578 9.78075C15.9538 9.84488 16.3183 9.94046 16.6511 10.0675C16.9838 10.1945 17.264 10.3577 17.4917 10.557C17.7193 10.7564 17.889 10.9971 18.0008 11.2793L16.8127 11.7549C16.7009 11.4983 16.5266 11.2682 16.2899 11.0645C16.0532 10.8609 15.7743 10.7011 15.4532 10.5852C15.132 10.4693 14.7811 10.3975 14.4004 10.3698L13.2521 10.3385C12.7858 10.3385 12.3489 10.3823 11.9414 10.4699C11.5339 10.5576 11.1745 10.6873 10.8633 10.8592C10.5521 11.031 10.3065 11.2454 10.1264 11.5023C9.94632 11.7592 9.85626 12.0618 9.85626 12.4102H8.53906C8.53906 11.8856 8.64847 11.4066 8.8673 10.9732C9.08613 10.5399 9.38945 10.1685 9.77727 9.85898C10.1651 9.54947 10.6245 9.31343 11.1554 9.15084C11.6864 8.98826 12.2668 8.90696 12.8966 8.90696Z" fill="white"/>
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
    company: "Independent",
    period: "2024 — Present",
    description:
      "Designing and engineering digital products across interface, systems, and AI — from concept through production.",
    href: "#",
  },
  {
    role: "Frontend Engineer",
    company: "Placeholder Co.",
    period: "2022 — 2024",
    description:
      "Built and maintained frontend systems for web and mobile applications using React, TypeScript, and modern tooling.",
    href: "#",
  },
  {
    role: "UI/UX Designer",
    company: "Placeholder Studio",
    period: "2021 — 2022",
    description:
      "Designed interfaces, design systems, and product experiences for startups and digital products.",
    href: "#",
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

  const [tooltip, setTooltip] = useState<{ name: string; x: number; y: number } | null>(null);
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

  /* ---- stack icon hover ---- */
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const container = stackContainerRef.current;
      if (!container) return;

      const cleanups: Array<() => void> = [];
      const icons = container.querySelectorAll("[data-stack-icon]");

      icons.forEach((icon, index) => {
        const onEnter = () => {
          /* bring to front */
          gsap.set(icon, { zIndex: 20 });

          gsap.to(icon, {
            y: -3,
            scale: 1.05,
            boxShadow: "0 6px 18px rgb(61 59 92 / 0.12)",
            duration: 0.22,
            ease: "power2.out",
          });

          /* show tooltip */
          const rect = icon.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();
          setTooltip({
            name: STACK[index].name,
            x: rect.left - containerRect.left + rect.width / 2,
            y: rect.top - containerRect.top - 8,
          });
        };

        const onLeave = () => {
          gsap.set(icon, { zIndex: index + 1 });

          gsap.to(icon, {
            y: 0,
            scale: 1,
            boxShadow: "0 2px 8px rgb(61 59 92 / 0.06)",
            duration: 0.25,
            ease: "power2.out",
          });

          setTooltip(null);
        };

        const onFocus = () => {
          gsap.set(icon, { zIndex: 20 });
          gsap.to(icon, {
            y: -3,
            scale: 1.05,
            boxShadow: "0 6px 18px rgb(61 59 92 / 0.12)",
            duration: 0.22,
            ease: "power2.out",
          });
          const rect = icon.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();
          setTooltip({
            name: STACK[index].name,
            x: rect.left - containerRect.left + rect.width / 2,
            y: rect.top - containerRect.top - 8,
          });
        };

        const onBlur = () => {
          gsap.set(icon, { zIndex: index + 1 });
          gsap.to(icon, {
            y: 0,
            scale: 1,
            boxShadow: "0 2px 8px rgb(61 59 92 / 0.06)",
            duration: 0.25,
            ease: "power2.out",
          });
          setTooltip(null);
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

  /* ---- experience row hover ---- */
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const list = expListRef.current;
      if (!list) return;

      const cleanups: Array<() => void> = [];

      const rows = list.querySelectorAll("[data-exp-row]");
      rows.forEach((row) => {
        const arrow = row.querySelector("[data-exp-arrow]");
        const role = row.querySelector("[data-exp-role]");

        const onEnter = () => {
          if (role) gsap.to(role, { x: 2, duration: 0.25, ease: EASE });
          if (arrow) gsap.to(arrow, { x: 3, duration: 0.25, ease: EASE });
        };
        const onLeave = () => {
          if (role) gsap.to(role, { x: 0, duration: 0.2, ease: EASE });
          if (arrow) gsap.to(arrow, { x: 0, duration: 0.2, ease: EASE });
        };

        row.addEventListener("mouseenter", onEnter);
        row.addEventListener("mouseleave", onLeave);
        cleanups.push(() => {
          row.removeEventListener("mouseenter", onEnter);
          row.removeEventListener("mouseleave", onLeave);
        });
      });

      return () => cleanups.forEach((fn) => fn());
    },
    { scope: sectionRef },
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
              onMouseLeave={() => setTooltip(null)}
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

              {/* tooltip */}
              {tooltip && (
                <div
                  className="pointer-events-none absolute z-50 -translate-x-1/2 whitespace-nowrap rounded-lg bg-[var(--color-ink)] px-2.5 py-1 text-[11px] font-medium text-[var(--color-ink-on-dark)]"
                  style={{
                    left: tooltip.x,
                    top: tooltip.y,
                    transform: "translate(-50%, -100%)",
                  }}
                >
                  {tooltip.name}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full">
                    <div className="h-0 w-0 border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent border-t-[var(--color-ink)]" />
                  </div>
                </div>
              )}
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
              {EXPERIENCE.map((exp) => (
                <Link
                  key={`${exp.company}-${exp.period}`}
                  href={exp.href ?? "#"}
                  data-exp-row
                  className="group flex items-start justify-between gap-5 border-t border-[var(--color-border-subtle)] py-5 text-left transition-colors duration-200 hover:bg-[var(--color-surface-hover)] max-md:flex-col max-md:gap-1.5 max-md:py-4"
                  aria-label={`${exp.role} at ${exp.company}`}
                >
                  <div className="flex flex-1 flex-col gap-0.5">
                    <span
                      data-exp-role
                      className="text-[14px] font-medium leading-[1.3] tracking-[-0.01em] text-[var(--color-ink)] max-md:text-[13px]"
                    >
                      {exp.role}{" "}
                      <span className="text-[var(--color-ink-tertiary)]">
                        / {exp.company}
                      </span>
                    </span>
                    {exp.description && (
                      <span className="mt-0.5 max-w-[420px] text-[12px] leading-[1.55] text-[var(--color-ink-secondary)]">
                        {exp.description}
                      </span>
                    )}
                  </div>

                  <div className="flex shrink-0 items-center gap-2.5 max-md:mt-0.5">
                    <span className="text-[11px] font-medium text-[var(--color-ink-muted)]">
                      {exp.period}
                    </span>
                    <ArrowUpRight
                      data-exp-arrow
                      size={12}
                      strokeWidth={2}
                      className="text-[var(--color-ink-muted)] transition-colors duration-200 group-hover:text-[var(--color-ink-secondary)]"
                    />
                  </div>
                </Link>
              ))}
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
