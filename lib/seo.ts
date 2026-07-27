import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-data";

const socialImage = {
  url: "/images/hero-advisory.jpg",
  width: 2400,
  height: 1800,
  alt: "Paride Sansò Advisory — consulenza multidisciplinare per imprese",
};

export function createMetadata({ title, description, path = "" }: { title: string; description: string; path?: string }): Metadata {
  const canonical = new URL(path, siteConfig.url).toString();
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: siteConfig.name,
      locale: "it_IT",
      type: "website",
      images: [socialImage],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteConfig.name}`,
      description,
      images: [socialImage.url],
    },
  };
}
