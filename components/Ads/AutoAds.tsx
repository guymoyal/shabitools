'use client';

import Script from 'next/script';

/**
 * Auto Ads Component
 * Google AdSense will automatically place ads in optimal locations
 * No ad slot IDs needed - Google handles placement automatically
 */
export default function AutoAds() {
  return (
    <Script
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2201239508910470"
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
