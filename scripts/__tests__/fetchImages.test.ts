import { describe, expect, it } from 'vitest';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { pendingIds, parseSource } = require('../fetchImages.js') as typeof import('../fetchImages.js');

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
