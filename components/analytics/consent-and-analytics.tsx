/* eslint-disable @next/next/no-before-interactive-script-outside-document -- App Router root-layout scripts are supported by Next.js 16. */
import Script from "next/script";
import { Suspense } from "react";
import { GoogleAnalyticsPageView } from "./google-analytics-page-view";

const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
const iubendaWidgetUrl =
  "https://embeds.iubenda.com/widgets/51987e01-5df2-499e-97d3-2b85f3987fa9.js";

export function ConsentDefaults() {
  return (
    <Script id="google-consent-mode-defaults" strategy="beforeInteractive">
      {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = window.gtag || gtag;
        gtag('consent', 'default', {
          ad_storage: 'denied',
          ad_user_data: 'denied',
          ad_personalization: 'denied',
          analytics_storage: 'denied',
          functionality_storage: 'denied',
          personalization_storage: 'denied',
          security_storage: 'granted',
          wait_for_update: 2000
        });
        gtag('set', 'ads_data_redaction', true);
        gtag('set', 'url_passthrough', true);
        gtag('js', new Date());
      `}
    </Script>
  );
}

export function IubendaConsentManager() {
  return (
    <Script
      id="iubenda-consent-widget"
      src={iubendaWidgetUrl}
      strategy="beforeInteractive"
    />
  );
}

export function GoogleAnalytics() {
  if (!measurementId) return null;
  return (
    <>
      <Script id="google-analytics-library" src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`} strategy="afterInteractive" />
      <Suspense fallback={null}>
        <GoogleAnalyticsPageView measurementId={measurementId} />
      </Suspense>
    </>
  );
}
