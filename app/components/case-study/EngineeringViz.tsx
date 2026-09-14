"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type { DiagramFlow } from "../../lib/projects";

/* ---------------------------------------------------------------------------
   Helpers
   --------------------------------------------------------------------------- */

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

const LAYER_STYLES: Record<
  string,
  { bg: string; border: string; text: string }
> = {
  client: {
    bg: "bg-[var(--color-violet-soft)]",
    border: "border-[var(--color-violet)]/20",
    text: "text-[var(--color-violet-hover)]",
  },
  server: {
    bg: "bg-[var(--color-surface)]",
    border: "border-[var(--color-border)]",
    text: "text-[var(--color-ink)]",
  },
  data: {
    bg: "bg-[var(--color-mint-soft)]",
    border: "border-[var(--color-mint)]/20",
    text: "text-[#159b70]",
  },
  external: {
    bg: "bg-[var(--color-coral-soft)]",
    border: "border-[var(--color-coral)]/20",
    text: "text-[var(--color-coral-hover)]",
  },
};

/* ---------------------------------------------------------------------------
   Component
   --------------------------------------------------------------------------- */

export function EngineeringViz({ flow }: { readonly flow: DiagramFlow }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<Map<string, HTMLDivElement>>(new Map());

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const nodes = Array.from(nodesRef.current.values());
      if (nodes.length === 0) return;
      gsap.fromTo(
        nodes,
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          ease: "power3.out",
          stagger: 0.05,
        },
      );
    },
    { scope: containerRef },
  );

  return (
    <div ref={containerRef} className="mt-8">
      <div className="rounded-[var(--radius-xl)] border border-[var(--color-border-subtle)] bg-[var(--color-background-subtle)] p-6 md:p-8">
        <div className="flex flex-col gap-3">
          {flow.nodes.map((node) => {
            const style = LAYER_STYLES[node.layer ?? "server"];
            const edge = flow.edges.find((e) => e.from === node.id);

            return (
              <div key={node.id} className="flex items-center gap-3">
                <div
                  ref={(el) => {
                    if (el) nodesRef.current.set(node.id, el);
                    else nodesRef.current.delete(node.id);
                  }}
                  className={`flex items-center gap-2.5 rounded-[var(--radius-md)] border px-4 py-2.5 ${style.bg} ${style.border}`}
                >
                  <span
                    className={`text-[13px] font-medium tracking-[-0.01em] ${style.text}`}
                  >
                    {node.label}
                  </span>
                </div>

                {edge && (
                  <div className="flex items-center gap-2 text-[var(--color-ink-muted)]">
                    <svg
                      width="24"
                      height="12"
                      viewBox="0 0 24 12"
                      fill="none"
                      aria-hidden="true"
                      className="shrink-0"
                    >
                      <path
                        d="M0 6h20M16 1.5L21 6l-4.5 4.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {edge.label && (
                      <span className="text-[11px] font-medium text-[var(--color-ink-muted)] whitespace-nowrap">
                        {edge.label}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {flow.caption && (
          <p className="mt-5 border-t border-[var(--color-border-subtle)] pt-4 text-[12px] leading-[1.5] text-[var(--color-ink-tertiary)]">
            {flow.caption}
          </p>
        )}
      </div>
    </div>
  );
}
