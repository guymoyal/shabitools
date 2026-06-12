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
    JSON.stringify({ 'reviews/x': { width: 1200, height: 800, credit: null } })
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
    });
  });
  it('returns null when image not yet fetched (no meta)', () => {
    const idx = loadImageIndex(fixture());
    expect(imageFromIndex(idx, 'categories/saws')).toBeNull();
  });
  it('returns null for unknown id', () => {
    expect(imageFromIndex(loadImageIndex(fixture()), 'nope/nope')).toBeNull();
  });
});
