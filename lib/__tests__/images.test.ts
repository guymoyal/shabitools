import { describe, expect, it } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { loadImageIndex, imageFromIndex } from '@/lib/images';

function fixture() {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), 'img-'));
  fs.mkdirSync(path.join(base, 'images'));
  fs.writeFileSync(
    path.join(base, 'images', 'a.json'),
    JSON.stringify({ 'reviews/x': { source: 'https://e.com/x.jpg', alt: 'X drill' } })
  );
  fs.writeFileSync(
    path.join(base, 'images', 'b.json'),
    JSON.stringify({ 'categories/saws': { source: 'pexels:saw', alt: 'Saw' } })
  );
  fs.writeFileSync(
    path.join(base, 'images.meta.json'),
    JSON.stringify({
      'reviews/x': { width: 1200, height: 800, smWidth: 640, credit: null },
      'reviews/narrow': { width: 400, height: 300, smWidth: 400, credit: null },
      'reviews/legacy': { width: 1200, height: 800, credit: null },
    })
  );
  // Add narrow and legacy entries to manifest too
  fs.writeFileSync(
    path.join(base, 'images', 'extra.json'),
    JSON.stringify({
      'reviews/narrow': { source: 'https://e.com/narrow.jpg', alt: 'Narrow image' },
      'reviews/legacy': { source: 'https://e.com/legacy.jpg', alt: 'Legacy image' },
    })
  );
  return base;
}

describe('image index', () => {
  it('merges manifest fragments and joins meta', () => {
    const idx = loadImageIndex(fixture());
    const img = imageFromIndex(idx, 'reviews/x');
    expect(img).toEqual({
      src: '/images/reviews/x.webp',
      srcSm: '/images/reviews/x-sm.webp',
      alt: 'X drill',
      width: 1200,
      height: 800,
      smWidth: 640,
    });
  });
  it('returns null when image not yet fetched (no meta)', () => {
    const idx = loadImageIndex(fixture());
    expect(imageFromIndex(idx, 'categories/saws')).toBeNull();
  });
  it('returns null for unknown id', () => {
    expect(imageFromIndex(loadImageIndex(fixture()), 'nope/nope')).toBeNull();
  });
  it('smWidth flows through for narrow images (smWidth === width)', () => {
    const idx = loadImageIndex(fixture());
    const img = imageFromIndex(idx, 'reviews/narrow');
    expect(img).not.toBeNull();
    expect(img!.smWidth).toBe(400);
    expect(img!.width).toBe(400);
  });
  it('back-compat: absent smWidth defaults to Math.min(640, width)', () => {
    const idx = loadImageIndex(fixture());
    const img = imageFromIndex(idx, 'reviews/legacy');
    expect(img).not.toBeNull();
    // width=1200, no smWidth in meta → defaults to Math.min(640, 1200) = 640
    expect(img!.smWidth).toBe(640);
  });
});
