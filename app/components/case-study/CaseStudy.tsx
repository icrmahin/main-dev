"use client";

import type { Project } from "../../lib/projects";
import { CaseStudyFooter } from "./CaseStudyFooter";
import { CaseStudyHero } from "./CaseStudyHero";
import { CaseStudySection } from "./CaseStudySection";
import { ReflectionSection } from "./ReflectionSection";

function buildJsonLd(project: Project, siteUrl: string) {
  const base = siteUrl.replace(/\/$/, "");
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.description,
    author: {
      "@type": "Person",
      name: "Abdulla Al Mahin",
      alternateName: "icrmahin",
      url: base,
    },
    url: `${base}/work/${project.slug}`,
    image: `${base}${project.hero.src}`,
    datePublished: project.year,
    keywords: project.stack.map((s) => s.label).join(", "),
  };
}

interface CaseStudyProps {
  readonly project: Project;
  readonly nextProject: Project;
}

export function CaseStudy({ project, nextProject }: CaseStudyProps) {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://icrmahin.dev";
  const jsonLd = buildJsonLd(project, siteUrl);

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CaseStudyHero project={project} />

      <div className="container-center mt-20 max-md:mt-12">
        <div className="flex max-w-[680px] flex-col gap-20 pb-24 max-md:gap-14 max-md:pb-16">
          {project.sections.map((section) => (
            <CaseStudySection key={section.id} section={section} />
          ))}

          <ReflectionSection reflection={project.reflection} />
        </div>
      </div>

      <CaseStudyFooter nextProject={nextProject} />
    </main>
  );
}
