import { firebaseApp } from '@/lib/auth/firebaseClient';

let analyticsPromise = null;

function hasAnalyticsConfig() {
  return (
    typeof window !== 'undefined' &&
    Boolean(process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID)
  );
}

function sanitizeEventParams(params = {}) {
  return Object.fromEntries(
    Object.entries(params).flatMap(([key, value]) => {
      if (value === undefined || value === null) {
        return [];
      }

      if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        return [[key, value]];
      }

      if (value instanceof Date) {
        return [[key, value.toISOString()]];
      }

      return [[key, String(value)]];
    })
  );
}

export async function getClientAnalytics() {
  if (!hasAnalyticsConfig()) {
    return null;
  }

  if (!analyticsPromise) {
    analyticsPromise = import('firebase/analytics')
      .then(async ({ getAnalytics, isSupported }) => {
        const supported = await isSupported().catch(() => false);
        if (!supported) {
          return null;
        }

        return getAnalytics(firebaseApp);
      })
      .catch(() => null);
  }

  return analyticsPromise;
}

export async function trackEvent(eventName, params = {}) {
  const analytics = await getClientAnalytics();
  if (!analytics) {
    return false;
  }

  const { logEvent } = await import('firebase/analytics');
  logEvent(analytics, eventName, sanitizeEventParams(params));
  return true;
}
