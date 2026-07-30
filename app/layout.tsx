import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { ConsentDefaults, GoogleAnalytics, IubendaConsentManager } from "@/components/analytics/consent-and-analytics";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { siteConfig } from "@/lib/site-data";

const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"], display: "swap" });
const socialImage = "/images/brand/logo.png";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: siteConfig.name, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  manifest: "/manifest.webmanifest",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },

  verification: {
    google: "_TVb6grE6lKoi1Y8L514T_cIcSesEPLBEX28GS9jCv8",
  },

  openGraph: {
    type: "website",
    locale: "it_IT",
    siteName: siteConfig.name,
    url: siteConfig.url,
    images: [{ url: socialImage, width: 1254, height: 1254, alt: "Logo Paride Sansò Advisory" }],
  },
  twitter: {
    card: "summary_large_image",
    images: [socialImage],
  },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const organization = {
    "@context": "https://schema.org",
    "@type": ["Organization", "ProfessionalService"],
    name: siteConfig.name,
    url: siteConfig.url,
    email: siteConfig.email,
    telephone: siteConfig.phone,
    description: siteConfig.description,
    areaServed: ["Milano", "IT"],
    sameAs: [siteConfig.linkedin],
  };
  return <html lang="it" className={manrope.variable}><head><ConsentDefaults /><IubendaConsentManager /></head><body><Navbar /><main id="main-content" tabIndex={-1}>{children}</main><Footer /><WhatsAppButton /><GoogleAnalytics /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }} /></body></html>;
}
