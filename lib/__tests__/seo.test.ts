import { describe, expect, it } from 'vitest';
import { pageMetadata, ogImage, SITE_URL } from '../seo';
import type { SiteImageData } from '../images';

describe('pageMetadata', () => {
  it('returns canonical + og without image when image is omitted', () => {
    const meta = pageMetadata({
      title: 'Test',
      description: 'A test',
      path: '/test',
    });
    expect(meta.alternates?.canonical).toBe(`${SITE_URL}/test`);
    expect((meta.openGraph as { images?: unknown })?.images).toBeUndefined();
    expect((meta.twitter as { images?: unknown })?.images).toBeUndefined();
  });

  it('injects og:image and twitter:image when image is provided', () => {
    const meta = pageMetadata({
      title: 'Test',
      description: 'A test',
      path: '/test',
      image: { url: '/images/reviews/foo.webp', width: 1200, height: 800, alt: 'Foo drill' },
    });
    const ogImages = (meta.openGraph as { images?: { url: string; width: number; height: number; alt: string }[] })?.images;
    expect(Array.isArray(ogImages)).toBe(true);
    expect(ogImages?.[0].url).toBe(`${SITE_URL}/images/reviews/foo.webp`);
    expect(ogImages?.[0].width).toBe(1200);
    expect(ogImages?.[0].alt).toBe('Foo drill');
    const twImages = (meta.twitter as { images?: string[] })?.images;
    expect(Array.isArray(twImages)).toBe(true);
    expect(twImages?.[0]).toBe(`${SITE_URL}/images/reviews/foo.webp`);
  });
});

describe('ogImage', () => {
  it('returns undefined for null input', () => {
    expect(ogImage(null)).toBeUndefined();
  });

  it('converts SiteImageData to pageMetadata image shape', () => {
    const imageData: SiteImageData = {
      src: '/images/reviews/test.webp',
      srcSm: '/images/reviews/test-sm.webp',
      alt: 'Test tool',
      width: 1200,
      height: 800,
      smWidth: 640,
    };
    const result = ogImage(imageData);
    expect(result).toEqual({
      url: '/images/reviews/test.webp',
      width: 1200,
      height: 800,
      alt: 'Test tool',
    });
  });
});
