"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "../lib/projects";

interface ProjectCardProps {
  readonly project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      href={project.href}
      data-project-card
      className="group flex flex-col rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-3 text-left transition-[border-color,box-shadow] duration-300 ease-[var(--ease-soft)] hover:border-[var(--color-border)] hover:shadow-[var(--shadow-md)]"
      style={{ willChange: "transform" }}
      aria-label={`${project.title} — ${project.category}`}
    >
      <div
        data-card-image
        className="relative mb-3 aspect-[16/10] w-full overflow-hidden rounded-xl bg-[var(--color-background-subtle)]"
        style={{ willChange: "transform" }}
      >
        {project.image ? (
          <img src={project.image} alt={project.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-[13px] font-medium text-[var(--color-ink-muted)]">
              {project.title}
            </span>
          </div>
        )}

        <div
          data-card-arrow
          className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-surface)] text-[var(--color-ink-muted)] opacity-0 shadow-[var(--shadow-sm)] transition-[opacity] duration-300 group-hover:opacity-100"
        >
          <ArrowUpRight size={14} strokeWidth={2} />
        </div>
      </div>

      <div className="flex flex-1 flex-col px-1 pb-1">
        <div className="flex items-start justify-between gap-3">
          <h3
            data-card-title
            className="text-[16px] font-medium leading-[1.3] tracking-[-0.01em] text-[var(--color-ink)] max-md:text-[15px]"
            style={{ willChange: "transform" }}
          >
            {project.title}
          </h3>
          <span className="mt-0.5 shrink-0 text-[11px] font-medium tabular-nums text-[var(--color-ink-muted)]">
            {project.number}
          </span>
        </div>

        <p className="mt-1 text-[12px] leading-[1.5] text-[var(--color-ink-secondary)]">
          {project.description}
        </p>

        <div className="mt-auto flex items-center gap-2 pt-3">
          <span className="text-[11px] font-medium text-[var(--color-ink-tertiary)]">
            {project.category}
          </span>
          <span className="text-[var(--color-ink-muted)]">·</span>
          <span className="text-[11px] font-medium text-[var(--color-ink-muted)]">
            {project.year}
          </span>
        </div>
      </div>
    </Link>
  );
}