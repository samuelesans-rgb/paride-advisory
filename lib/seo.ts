import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-data";

const socialImage = { url: "/images/brand/logo.png", width: 1254, height: 1254, alt: "Logo Paride Sansò Advisory" };

type MetadataInput = { title: string; description: string; path?: string; type?: "website" | "article"; publishedTime?: string; modifiedTime?: string };
export function createMetadata({ title, description, path = "", type = "website", publishedTime, modifiedTime }: MetadataInput): Metadata {
  const canonical = new URL(path, siteConfig.url).toString();
  return {
    title, description, alternates: { canonical },
    openGraph: { title, description, url: canonical, siteName: siteConfig.name, locale: "it_IT", type, images: [socialImage], ...(type === "article" ? { publishedTime, modifiedTime, authors: [siteConfig.name] } : {}) },
    twitter: { card: "summary_large_image", title: `${title} | ${siteConfig.name}`, description, images: [socialImage.url] },
  };
}
