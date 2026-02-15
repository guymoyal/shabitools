'use client';

import Script from 'next/script';
import { useEffect } from 'react';

interface AdSidebarProps {
  adSlot: string;
  className?: string;
}

export default function AdSidebar({ adSlot, className = '' }: AdSidebarProps) {
  useEffect(() => {
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, []);

  return (
    <>
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2201239508910470"
        crossOrigin="anonymous"
        strategy="lazyOnload"
      />
      <ins
        className={`adsbygoogle ${className}`}
        style={{ display: 'block', width: '300px', height: '250px' }}
        data-ad-client="ca-pub-2201239508910470"
        data-ad-slot={adSlot}
        data-ad-format="rectangle"
      />
    </>
  );
}
