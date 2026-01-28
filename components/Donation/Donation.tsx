'use client';

import Script from 'next/script';
import { useEffect } from 'react';

interface DonationProps {
  username: string;
  description?: string;
  message?: string;
  color?: string;
  position?: 'Left' | 'Right';
  xMargin?: number;
  yMargin?: number;
}

export default function Donation({
  username,
  description = 'Support shabitools development',
  message = 'Enjoying shabitools? Buy me a coffee!',
  color = '#0284c7',
  position = 'Right',
  xMargin = 18,
  yMargin = 18,
}: DonationProps) {
  return (
    <>
      <Script
        id="buymeacoffee-widget"
        strategy="lazyOnload"
        data-name="BMC-Widget"
        data-cfasync="false"
        src="https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js"
        data-id={username}
        data-description={description}
        data-message={message}
        data-color={color}
        data-position={position}
        data-x_margin={xMargin}
        data-y_margin={yMargin}
      />
    </>
  );
}
