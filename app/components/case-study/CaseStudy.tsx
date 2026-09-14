"use client";

import type { Project } from "../../lib/projects";
import { CaseStudyFooter } from "./CaseStudyFooter";
import { CaseStudyHero } from "./CaseStudyHero";
import { CaseStudySection } from "./CaseStudySection";
import { ReflectionSection } from "./ReflectionSection";

interface CaseStudyProps {
  readonly project: Project;
  readonly nextProject: Project;
}

export function CaseStudy({ project, nextProject }: CaseStudyProps) {
  return (
    <main>
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
