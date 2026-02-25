// src/hooks/useAnalytics.ts
import { logEvent } from "firebase/analytics";
// import type { Analytics } from "firebase/analytics";
import { trace } from "firebase/performance";
// import type { FirebasePerformance } from "firebase/performance";
import { analytics, perf } from "../firebase";

// Define the shape of your custom events for type safety (Optional but recommended)
type EventParams = {
  [key: string]: string | Number | Boolean | null;
};

export const useAnalytics = () => {
  
  // 1. Log Custom Event
  const trackEvent = (eventName: string, params?: EventParams) => {
    if (analytics) {
      // Automatically add environment to all events
      const enrichedParams = {
        ...params,
      };
      console.log(`[Analytics] Tracking event: ${eventName}`, enrichedParams);
      logEvent(analytics, eventName, enrichedParams);
      // Optional: Log to console in dev mode
    //   if (process.env.NODE_ENV === 'development') {
    //     console.log(`[Analytics] Event: ${eventName}`, enrichedParams);
    //   }
    } else {
      console.warn("Analytics not initialized");
    }
  };

  // 2. Track Page View (Useful for React Router)
  const trackPageView = (pagePath: string) => {
    if (analytics) {
      logEvent(analytics, 'page_view', {
        page_path: pagePath,
      });
    }
  };

  // 3. Measure Performance (Async operations)
  const measureOperation = async <T>(
    operationName: string, 
    operation: () => Promise<T>
  ): Promise<T> => {
    if (!perf) return await operation();

    const t = trace(perf, operationName);
    t.start();
    try {
      return await operation();
    } finally {
      t.stop();
    }
  };

  return { trackEvent, trackPageView, measureOperation };
};