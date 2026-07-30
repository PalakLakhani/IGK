'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';

// Component to track page views on route changes
function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Track page view on route change (for SPA navigation)
    if (typeof window !== 'undefined' && window.umami) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
      window.umami.track(props => ({ ...props, url }));
    }
  }, [pathname, searchParams]);

  return null;
}

export default function Analytics() {
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  const scriptUrl = process.env.NEXT_PUBLIC_UMAMI_URL || 'https://cloud.umami.is/script.js';

  // Don't load analytics in development or if no website ID
  if (!websiteId) {
    return null;
  }

  // Check if we're in a non-production environment
  const isProduction = typeof window !== 'undefined' && 
    !window.location.hostname.includes('localhost') &&
    !window.location.hostname.includes('127.0.0.1') &&
    !window.location.hostname.includes('preview');

  return (
    <>
      {/* Umami Analytics Script - async, non-blocking */}
      <Script
        src={scriptUrl}
        data-website-id={websiteId}
        strategy="afterInteractive"
      />
      {/* Track SPA route changes */}
      <Suspense fallback={null}>
        <AnalyticsTracker />
      </Suspense>
    </>
  );
}
