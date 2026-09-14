import type { ComponentType, SVGProps } from "react";
import {
  Figma,
  Gsap,
  Nextjs,
  Openai,
  Python,
  React,
  Tailwindcss,
  Typescript,
} from "@thesvg/react";
import type { TechnologyId } from "../lib/projects";

const ICONS: Record<TechnologyId, ComponentType<SVGProps<SVGSVGElement>>> = {
  figma: Figma,
  nextjs: Nextjs,
  react: React,
  typescript: Typescript,
  tailwindcss: Tailwindcss,
  gsap: Gsap,
  python: Python,
  openai: Openai,
};

interface TechnologyIconProps {
  readonly id: TechnologyId;
  readonly className?: string;
}

export function TechnologyIcon({ id, className }: TechnologyIconProps) {
  const Icon = ICONS[id];
  return <Icon className={className} aria-hidden="true" />;
}