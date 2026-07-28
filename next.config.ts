import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async redirects() {
    return [
      { source: "/blog/pianificazione-finanziaria-pmi", destination: "/competenze/pianificazione-finanziaria", permanent: true },
      { source: "/blog/controllo-gestione-crescita", destination: "/blog/controllo-di-gestione-pmi-redditivita", permanent: true },
      { source: "/:path*", has: [{ type: "host", value: "www.sansoadvisory.it" }], destination: "https://sansoadvisory.it/:path*", permanent: true },
    ];
  },
  async headers() {
    return [{ source: "/(.*)", headers: [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    ] }];
  },
};

export default nextConfig;
