export interface Project {
  readonly id: string;
  readonly number: string;
  readonly title: string;
  readonly description: string;
  readonly category: string;
  readonly year: string;
  readonly href: string;
  readonly image?: string;
}

export const PROJECTS: readonly Project[] = [
  {
    id: "project-01",
    number: "01",
    title: "Nova Dashboard",
    description:
      "A real-time analytics platform for monitoring product performance, user engagement, and system health across multiple services.",
    category: "Product Engineering",
    year: "2026",
    href: "/work/nova-dashboard",
  },
  {
    id: "project-02",
    number: "02",
    title: "Relay",
    description:
      "A collaborative design tool that bridges the gap between design intent and engineering implementation with live component preview.",
    category: "Design + Engineering",
    year: "2025",
    href: "/work/relay",
  },
  {
    id: "project-03",
    number: "03",
    title: "Arclight AI",
    description:
      "An AI-powered content pipeline that generates, edits, and publishes structured product documentation from natural language.",
    category: "AI + Product",
    year: "2025",
    href: "/work/arclight-ai",
  },
  {
    id: "project-04",
    number: "04",
    title: "Verdant",
    description:
      "A sustainability tracking dashboard for teams to measure, report, and reduce their environmental footprint.",
    category: "Brand + Frontend",
    year: "2024",
    href: "/work/verdant",
  },
] as const;