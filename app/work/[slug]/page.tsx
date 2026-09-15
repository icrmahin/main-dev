import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudy } from "../../components/case-study/CaseStudy";
import {
  getAllProjects,
  getNextProject,
  getProjectBySlug,
} from "../../lib/projects";

interface PageProps {
  readonly params: Promise<{ slug: string }>;
}

export const dynamicParams = true;

export function generateStaticParams() {
  return getAllProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};

  const title = `${project.title} — Product Case Study`;
  const description = project.description;
  return {
    title,
    description,
    alternates: { canonical: `/work/${project.slug}` },
    authors: [{ name: "Abdulla Al Mahin" }],
    openGraph: {
      title: `${project.title} — Abdulla Al Mahin`,
      description,
      type: "article",
      url: `/work/${project.slug}`,
      images: [
        {
          url: project.hero.src,
          alt: project.hero.alt,
          width: 1600,
          height: 1000,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} — Abdulla Al Mahin`,
      description,
      images: [project.hero.src],
    },
  };
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  return <CaseStudy project={project} nextProject={getNextProject(slug)} />;
}