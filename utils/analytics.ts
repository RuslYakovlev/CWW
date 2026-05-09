type AnalyticsEventParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
  }
}

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || '';
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || '';
export const GOOGLE_SITE_VERIFICATION = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '';

export const trackEvent = (eventName: string, params: AnalyticsEventParams = {}) => {
  if (typeof window === 'undefined') return;

  if (window.dataLayer) {
    window.dataLayer.push({ event: eventName, ...params });
  }

  if (!GTM_ID && window.gtag) {
    window.gtag('event', eventName, params);
  }
};
