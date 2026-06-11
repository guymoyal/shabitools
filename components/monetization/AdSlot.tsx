'use client';

import { useEffect, useRef, useState } from 'react';

const CLIENT = 'ca-pub-2201239508910470';

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/** Manual AdSense slot. Loads the ads script only when the slot nears the
 *  viewport (IntersectionObserver), inside a fixed-height box so CLS stays 0. */
export default function AdSlot({ slot, height = 280 }: { slot: string; height?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setVisible(true),
      { rootMargin: '600px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    if (!document.querySelector('script[data-adsense]')) {
      const s = document.createElement('script');
      s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${CLIENT}`;
      s.async = true;
      s.crossOrigin = 'anonymous';
      s.dataset.adsense = '1';
      document.head.appendChild(s);
    }
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      /* ad blocked — box stays empty */
    }
  }, [visible]);

  return (
    <div ref={ref} style={{ minHeight: height }} className="my-8 overflow-hidden" aria-hidden>
      {visible && (
        <ins
          className="adsbygoogle block"
          style={{ display: 'block', minHeight: height }}
          data-ad-client={CLIENT}
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      )}
    </div>
  );
}
