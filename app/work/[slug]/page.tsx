import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CASE_STUDIES, getCaseStudy } from "../../lib/case-study";

interface PageProps {
  readonly params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return CASE_STUDIES.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  return {
    title: study ? `${study.title} — Mahin` : "Case Study — Mahin",
    description: study?.description,
  };
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return null;

  return (
    <main className="flex flex-1 flex-col">
      {/* ---- project hero ---- */}
      <header
        data-case-study
        className="container-center flex flex-col pt-36 pb-14 max-md:pt-28"
      >
        <span className="section-label">
          Case Study&nbsp;&nbsp;·&nbsp;&nbsp;{study.number} /{" "}
          {study.year}
        </span>
        <h1
          data-case-study-title
          className="section-heading mb-4 max-w-[720px]"
        >
          {study.title}
        </h1>
        <p className="max-w-[520px] text-[15px] leading-[1.65] text-[var(--color-ink-secondary)]">
          {study.description}
        </p>
        <div className="mt-5 flex items-center gap-2 text-[12px] font-medium text-[var(--color-ink-tertiary)]">
          <span>{study.role}</span>
          <span className="text-[var(--color-ink-muted)]">·</span>
          <span>{study.category}</span>
        </div>
      </header>

      {/* ---- sections ---- */}
      {study.sections.map((section) => (
        <section
          key={section.id}
          id={section.id}
          data-nav-section={section.label}
          aria-label={section.label}
          className="container-center scroll-mt-28 border-t border-[var(--color-border-subtle)] py-16 max-md:py-12"
        >
          <span className="section-label">{section.eyebrow}</span>
          <h2 className="text-[24px] font-medium leading-[1.2] tracking-[-0.02em] text-[var(--color-ink)] max-md:text-[20px]">
            {section.label}
          </h2>
          <div className="mt-5 flex max-w-[620px] flex-col gap-4">
            {section.body.map((paragraph) => (
              <p
                key={paragraph}
                className="text-[14px] leading-[1.7] text-[var(--color-ink-secondary)]"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </section>
      ))}

      {/* ---- end cap ---- */}
      <div className="container-center pt-8 pb-28 max-md:pb-20">
        <Link
          href="/#work"
          className="group inline-flex items-center gap-2 text-[13px] font-medium text-[var(--color-ink-secondary)] transition-colors duration-200 hover:text-[var(--color-ink)]"
        >
          <ArrowLeft
            size={14}
            strokeWidth={2}
            className="transition-transform duration-200 group-hover:-translate-x-0.5"
          />
          Back to all work
        </Link>
      </div>
    </main>
  );
}