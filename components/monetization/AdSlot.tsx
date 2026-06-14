'use client';

import { useEffect, useRef, useState } from 'react';

const CLIENT = 'ca-pub-2201239508910470';

/** One responsive Display ad unit drives every in-content slot on the site.
 *  Set NEXT_PUBLIC_ADSENSE_SLOT in .env to the ~10-digit slot id from
 *  AdSense → Ads → By ad unit → Display. When it's empty, AdSlot renders
 *  nothing (no blank/placeholder ad, no policy risk). */
const DEFAULT_SLOT = process.env.NEXT_PUBLIC_ADSENSE_SLOT ?? '';

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/** Manual AdSense slot. Reserves a fixed-height box so content never shifts
 *  (CLS = 0) and lazy-loads the ads script only when the slot nears the
 *  viewport (IntersectionObserver) so it never slows the initial page. */
export default function AdSlot({
  slot = DEFAULT_SLOT,
  height = 280,
}: {
  slot?: string;
  height?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!slot) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setVisible(true),
      { rootMargin: '600px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [slot]);

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
      /* ad blocked — box stays empty, layout unchanged */
    }
  }, [visible]);

  // No slot configured yet → render nothing at all.
  if (!slot) return null;

  return (
    <div ref={ref} className="my-8" style={{ minHeight: height + 18 }}>
      <p className="mb-1 text-[11px] uppercase tracking-wide text-gray-400 select-none">
        Advertisement
      </p>
      <div style={{ minHeight: height }} className="overflow-hidden">
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
    </div>
  );
}
