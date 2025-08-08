/**
 * Analytics utility for tracking user events and behavior
 * Supports Google Analytics, Facebook Pixel, and custom analytics
 */

// Types for analytics events
export interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  customParameters?: Record<string, any>;
}

export interface EcommerceEvent {
  event: 'purchase' | 'add_to_cart' | 'remove_from_cart' | 'view_item' | 'begin_checkout';
  currency: string;
  value: number;
  items: EcommerceItem[];
}

export interface EcommerceItem {
  item_id: string;
  item_name: string;
  category: string;
  quantity: number;
  price: number;
  item_brand?: string;
  item_variant?: string;
}

// Analytics configuration
interface AnalyticsConfig {
  googleAnalyticsId?: string;
  facebookPixelId?: string;
  customEndpoint?: string;
  debug?: boolean;
  enableAutoTracking?: boolean;
}

class Analytics {
  private config: AnalyticsConfig;
  private isInitialized = false;

  constructor(config: AnalyticsConfig = {}) {
    this.config = {
      debug: process.env.NODE_ENV === 'development',
      enableAutoTracking: true,
      ...config
    };
  }

  /**
   * Initialize analytics services
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Initialize Google Analytics
      if (this.config.googleAnalyticsId) {
        await this.initializeGoogleAnalytics();
      }

      // Initialize Facebook Pixel
      if (this.config.facebookPixelId) {
        await this.initializeFacebookPixel();
      }

      // Set up auto-tracking
      if (this.config.enableAutoTracking) {
        this.setupAutoTracking();
      }

      this.isInitialized = true;
      this.log('Analytics initialized successfully');
    } catch (error) {
      console.error('Failed to initialize analytics:', error);
    }
  }

  /**
   * Initialize Google Analytics 4
   */
  private async initializeGoogleAnalytics(): Promise<void> {
    return new Promise((resolve) => {
      // Load gtag script
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${this.config.googleAnalyticsId}`;
      document.head.appendChild(script);

      script.onload = () => {
        // Initialize gtag
        (window as any).dataLayer = (window as any).dataLayer || [];
        (window as any).gtag = function() {
          (window as any).dataLayer.push(arguments);
        };

        (window as any).gtag('js', new Date());
        (window as any).gtag('config', this.config.googleAnalyticsId, {
          page_title: document.title,
          page_location: window.location.href,
        });

        this.log('Google Analytics initialized');
        resolve();
      };
    });
  }

  /**
   * Initialize Facebook Pixel
   */
  private async initializeFacebookPixel(): Promise<void> {
    return new Promise((resolve) => {
      // Facebook Pixel Code
      (function(f: any, b, e, v, n, t, s) {
        if (f.fbq) return;
        n = f.fbq = function() {
          n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = !0;
        n.version = '2.0';
        n.queue = [];
        t = b.createElement(e);
        t.async = !0;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);
      })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

      (window as any).fbq('init', this.config.facebookPixelId);
      (window as any).fbq('track', 'PageView');

      this.log('Facebook Pixel initialized');
      resolve();
    });
  }

  /**
   * Set up automatic page view tracking
   */
  private setupAutoTracking(): void {
    // Track page views on route changes
    let currentPath = window.location.pathname;
    
    const observer = new MutationObserver(() => {
      if (window.location.pathname !== currentPath) {
        currentPath = window.location.pathname;
        this.trackPageView();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Track initial page view
    this.trackPageView();
  }

  /**
   * Track page view
   */
  trackPageView(path?: string, title?: string): void {
    const pagePath = path || window.location.pathname;
    const pageTitle = title || document.title;

    // Google Analytics
    if (this.config.googleAnalyticsId && (window as any).gtag) {
      (window as any).gtag('config', this.config.googleAnalyticsId, {
        page_path: pagePath,
        page_title: pageTitle,
      });
    }

    // Facebook Pixel
    if (this.config.facebookPixelId && (window as any).fbq) {
      (window as any).fbq('track', 'PageView');
    }

    this.log('Page view tracked:', { path: pagePath, title: pageTitle });
  }

  /**
   * Track custom event
   */
  trackEvent(event: AnalyticsEvent): void {
    // Google Analytics
    if (this.config.googleAnalyticsId && (window as any).gtag) {
      (window as any).gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        ...event.customParameters
      });
    }

    // Facebook Pixel
    if (this.config.facebookPixelId && (window as any).fbq) {
      (window as any).fbq('trackCustom', event.action, {
        category: event.category,
        label: event.label,
        value: event.value,
        ...event.customParameters
      });
    }

    // Custom analytics endpoint
    if (this.config.customEndpoint) {
      this.sendToCustomEndpoint('event', event);
    }

    this.log('Event tracked:', event);
  }

  /**
   * Track ecommerce events
   */
  trackEcommerce(event: EcommerceEvent): void {
    // Google Analytics Enhanced Ecommerce
    if (this.config.googleAnalyticsId && (window as any).gtag) {
      (window as any).gtag('event', event.event, {
        currency: event.currency,
        value: event.value,
        items: event.items
      });
    }

    // Facebook Pixel
    if (this.config.facebookPixelId && (window as any).fbq) {
      const fbEvent = this.mapToFacebookEvent(event);
      (window as any).fbq('track', fbEvent.event, fbEvent.data);
    }

    // Custom analytics endpoint
    if (this.config.customEndpoint) {
      this.sendToCustomEndpoint('ecommerce', event);
    }

    this.log('Ecommerce event tracked:', event);
  }

  /**
   * Map ecommerce events to Facebook Pixel events
   */
  private mapToFacebookEvent(event: EcommerceEvent) {
    const eventMap: Record<string, string> = {
      'view_item': 'ViewContent',
      'add_to_cart': 'AddToCart',
      'begin_checkout': 'InitiateCheckout',
      'purchase': 'Purchase'
    };

    return {
      event: eventMap[event.event] || 'CustomEvent',
      data: {
        currency: event.currency,
        value: event.value,
        content_ids: event.items.map(item => item.item_id),
        content_type: 'product',
        contents: event.items.map(item => ({
          id: item.item_id,
          quantity: item.quantity,
          item_price: item.price
        }))
      }
    };
  }

  /**
   * Send data to custom analytics endpoint
   */
  private async sendToCustomEndpoint(type: string, data: any): Promise<void> {
    try {
      await fetch(this.config.customEndpoint!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          data,
          timestamp: new Date().toISOString(),
          url: window.location.href,
          userAgent: navigator.userAgent
        })
      });
    } catch (error) {
      console.error('Failed to send analytics data:', error);
    }
  }

  /**
   * Log debug information
   */
  private log(message: string, data?: any): void {
    if (this.config.debug) {
      console.log(`[Analytics] ${message}`, data || '');
    }
  }
}

// Create singleton instance
const analytics = new Analytics({
  googleAnalyticsId: import.meta.env.VITE_GA_MEASUREMENT_ID,
  facebookPixelId: import.meta.env.VITE_FB_PIXEL_ID,
  customEndpoint: import.meta.env.VITE_ANALYTICS_ENDPOINT,
});

// Convenience functions for common tracking events
export const trackPageView = (path?: string, title?: string) => {
  analytics.trackPageView(path, title);
};

export const trackEvent = (event: AnalyticsEvent) => {
  analytics.trackEvent(event);
};

export const trackEcommerce = (event: EcommerceEvent) => {
  analytics.trackEcommerce(event);
};

// Specific tracking functions for TrustyLads
export const trackProductView = (product: { id: string; name: string; category: string; price: number }) => {
  trackEcommerce({
    event: 'view_item',
    currency: 'INR',
    value: product.price,
    items: [{
      item_id: product.id,
      item_name: product.name,
      category: product.category,
      quantity: 1,
      price: product.price,
      item_brand: 'TrustyLads'
    }]
  });
};

export const trackAddToCart = (product: { id: string; name: string; category: string; price: number; quantity: number }) => {
  trackEcommerce({
    event: 'add_to_cart',
    currency: 'INR',
    value: product.price * product.quantity,
    items: [{
      item_id: product.id,
      item_name: product.name,
      category: product.category,
      quantity: product.quantity,
      price: product.price,
      item_brand: 'TrustyLads'
    }]
  });
};

export const trackRemoveFromCart = (product: { id: string; name: string; category: string; price: number; quantity: number }) => {
  trackEcommerce({
    event: 'remove_from_cart',
    currency: 'INR',
    value: product.price * product.quantity,
    items: [{
      item_id: product.id,
      item_name: product.name,
      category: product.category,
      quantity: product.quantity,
      price: product.price,
      item_brand: 'TrustyLads'
    }]
  });
};

export const trackBeginCheckout = (items: Array<{ id: string; name: string; category: string; price: number; quantity: number }>, value: number) => {
  trackEcommerce({
    event: 'begin_checkout',
    currency: 'INR',
    value,
    items: items.map(item => ({
      item_id: item.id,
      item_name: item.name,
      category: item.category,
      quantity: item.quantity,
      price: item.price,
      item_brand: 'TrustyLads'
    }))
  });
};

export const trackPurchase = (orderId: string, items: Array<{ id: string; name: string; category: string; price: number; quantity: number }>, value: number) => {
  trackEcommerce({
    event: 'purchase',
    currency: 'INR',
    value,
    items: items.map(item => ({
      item_id: item.id,
      item_name: item.name,
      category: item.category,
      quantity: item.quantity,
      price: item.price,
      item_brand: 'TrustyLads'
    }))
  });

  // Track as custom event as well
  trackEvent({
    action: 'purchase',
    category: 'ecommerce',
    label: orderId,
    value,
    customParameters: {
      order_id: orderId,
      items_count: items.length
    }
  });
};

export const trackSearch = (query: string, results: number) => {
  trackEvent({
    action: 'search',
    category: 'engagement',
    label: query,
    value: results,
    customParameters: {
      search_term: query,
      results_count: results
    }
  });
};

export const trackOrderCompletion = (orderId: string, value: number, paymentMethod: string) => {
  trackEvent({
    action: 'order_completed',
    category: 'ecommerce',
    label: orderId,
    value,
    customParameters: {
      order_id: orderId,
      payment_method: paymentMethod
    }
  });
};

export const trackNewsletterSignup = (email: string) => {
  trackEvent({
    action: 'newsletter_signup',
    category: 'engagement',
    label: email,
    customParameters: {
      email
    }
  });
};

export const trackSocialShare = (platform: string, content: string) => {
  trackEvent({
    action: 'social_share',
    category: 'engagement',
    label: platform,
    customParameters: {
      platform,
      content
    }
  });
};

// Initialize analytics when module is imported
if (typeof window !== 'undefined') {
  analytics.initialize();
}

export default analytics;