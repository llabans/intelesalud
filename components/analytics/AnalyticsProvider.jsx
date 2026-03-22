'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { getClientAnalytics, trackEvent } from '@/lib/analytics/firebaseAnalytics';

function buildPageLocation(pathname, search) {
  if (typeof window === 'undefined') {
    return pathname;
  }

  const suffix = search ? `?${search}` : '';
  return `${window.location.origin}${pathname}${suffix}`;
}

export default function AnalyticsProvider() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hasTrackedInitialRoute = useRef(false);
  const search = searchParams.toString();

  useEffect(() => {
    void getClientAnalytics();
  }, []);

  useEffect(() => {
    if (!pathname) {
      return;
    }

    if (!hasTrackedInitialRoute.current) {
      hasTrackedInitialRoute.current = true;
      return;
    }

    void trackEvent('page_view', {
      page_location: buildPageLocation(pathname, search),
      page_path: `${pathname}${search ? `?${search}` : ''}`,
      page_title: typeof document !== 'undefined' ? document.title : pathname,
    });
  }, [pathname, search]);

  return null;
}
