// Unified Analytics Dispatcher for GA4, Meta Pixel & TikTok Pixel

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    ttq?: {
      track: (eventName: string, params?: Record<string, unknown>) => void;
    };
  }
}

export const trackEvent = (
  eventName: 
    | 'page_view'
    | 'view_item'
    | 'add_to_cart'
    | 'remove_from_cart'
    | 'view_category'
    | 'search'
    | 'begin_checkout'
    | 'apply_coupon'
    | 'purchase',
  params?: Record<string, unknown>
) => {
  if (typeof window === 'undefined') return;

  // Log in development for transparent QA verification
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[ZenPaaw Analytics] Event: ${eventName}`, params);
  }

  // 1. Google Analytics 4 (GA4)
  if (window.gtag) {
    window.gtag('event', eventName, params);
  }

  // 2. Meta Pixel (Facebook)
  if (window.fbq) {
    const metaMap: Record<string, string> = {
      view_item: 'ViewContent',
      add_to_cart: 'AddToCart',
      begin_checkout: 'InitiateCheckout',
      purchase: 'Purchase',
      search: 'Search'
    };
    const metaEvent = metaMap[eventName];
    if (metaEvent) {
      window.fbq('track', metaEvent, params);
    }
  }

  // 3. TikTok Pixel
  if (window.ttq) {
    const ttMap: Record<string, string> = {
      view_item: 'ViewContent',
      add_to_cart: 'AddToCart',
      begin_checkout: 'InitiateCheckout',
      purchase: 'CompletePayment',
      search: 'Search'
    };
    const ttEvent = ttMap[eventName];
    if (ttEvent) {
      window.ttq.track(ttEvent, params);
    }
  }
};
