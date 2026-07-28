import type { MetadataRoute } from "next";
import { articles, services, siteConfig } from "@/lib/site-data";
export default function sitemap(): MetadataRoute.Sitemap { const now = new Date(); return ["", "/chi-siamo", "/servizi", "/network", "/settori", "/blog", "/contatti", "/privacy-policy", "/cookie-policy", "/note-legali", ...services.map((service) => `/servizi/${service.slug}`), ...articles.map((article) => `/blog/${article.slug}`)].map((path) => ({ url: `${siteConfig.url}${path}`, lastModified: now, changeFrequency: "monthly", priority: path === "" ? 1 : 0.8 })); }
