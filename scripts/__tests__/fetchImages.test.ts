import { describe, expect, it } from 'vitest';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { pendingIds, parseSource, isSafeId } = require('../fetchImages.js') as typeof import('../fetchImages.js');

describe('fetchImages helpers', () => {
  it('parseSource splits url vs pexels', () => {
    expect(parseSource('https://e.com/a.jpg')).toEqual({ kind: 'url', value: 'https://e.com/a.jpg' });
    expect(parseSource('pexels:cordless drill')).toEqual({ kind: 'pexels', value: 'cordless drill' });
  });
  it('pendingIds = manifest ids missing from meta', () => {
    const manifest = { a: { source: 'x', alt: '' }, b: { source: 'y', alt: '' } };
    expect(pendingIds(manifest, { a: { width: 1, height: 1, credit: null } })).toEqual(['b']);
  });
});

describe('isSafeId', () => {
  it('accepts a normal nested id', () => {
    expect(isSafeId('reviews/makita-xfd131')).toBe(true);
  });
  it('rejects path traversal with leading ../', () => {
    expect(isSafeId('../../etc/evil')).toBe(false);
  });
  it('rejects path traversal with embedded ..', () => {
    expect(isSafeId('a/../../b')).toBe(false);
  });
  it('rejects absolute Unix path', () => {
    expect(isSafeId('/etc/x')).toBe(false);
  });
});
