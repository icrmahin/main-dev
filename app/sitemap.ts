import type { MetadataRoute } from "next";
import { getAllProjects } from "./lib/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://icrmahin.dev";
  const base = siteUrl.replace(/\/$/, "");

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${base}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  const projectRoutes: MetadataRoute.Sitemap = getAllProjects().map(
    (project) => ({
      url: `${base}/work/${project.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }),
  );

  return [...staticRoutes, ...projectRoutes];
}
