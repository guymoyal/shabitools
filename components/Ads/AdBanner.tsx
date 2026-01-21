'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';

interface AdBannerProps {
  adSlot: string;
  adFormat?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  fullWidthResponsive?: boolean;
  className?: string;
}

export default function AdBanner({
  adSlot,
  adFormat = 'auto',
  fullWidthResponsive = true,
  className = '',
}: AdBannerProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      setIsLoaded(true);
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, []);

  return (
    <>
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_PUBLISHER_ID"
        crossOrigin="anonymous"
        strategy="lazyOnload"
      />
      <ins
        className={`adsbygoogle ${className}`}
        style={{ display: 'block' }}
        data-ad-client="ca-pub-YOUR_PUBLISHER_ID"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive ? 'true' : 'false'}
      />
    </>
  );
}
