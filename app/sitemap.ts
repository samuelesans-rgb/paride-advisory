import type { MetadataRoute } from "next";
import { articles } from "@/lib/articles";
import { authorityPages, sectorPages } from "@/lib/authority-data";
import { services, siteConfig } from "@/lib/site-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const core = ["", "/chi-siamo", "/servizi", "/network", "/settori", "/blog", "/contatti", "/privacy-policy", "/cookie-policy", "/note-legali"];
  return [
    ...core.map((path) => ({ url: `${siteConfig.url}${path}`, changeFrequency: path === "/blog" ? "weekly" as const : "monthly" as const, priority: path === "" ? 1 : path.startsWith("/privacy") || path.startsWith("/cookie") || path.startsWith("/note") ? 0.3 : 0.8 })),
    ...services.map((service) => ({ url: `${siteConfig.url}/servizi/${service.slug}`, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...authorityPages.map((page) => ({ url: `${siteConfig.url}/competenze/${page.slug}`, changeFrequency: "monthly" as const, priority: 0.75 })),
    ...sectorPages.map((page) => ({ url: `${siteConfig.url}/settori/${page.slug}`, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...articles.map((article) => ({ url: `${siteConfig.url}/blog/${article.slug}`, lastModified: new Date(article.updated), changeFrequency: "monthly" as const, priority: 0.65 })),
  ];
}
