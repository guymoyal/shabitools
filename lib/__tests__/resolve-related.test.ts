import { describe, expect, it } from 'vitest';
import { getReview, getGuide, resolveRelated } from '../content';

describe('resolveRelated', () => {
  it('resolves a review slug to /reviews/<slug> with review title', () => {
    const review = getReview('makita-xfd131');
    const result = resolveRelated(['makita-xfd131']);
    expect(result).toEqual([{ href: '/reviews/makita-xfd131', label: review!.title }]);
  });

  it('resolves a guide slug to /guides/<slug> with guide title', () => {
    const guide = getGuide('best-cordless-drill-2026');
    const result = resolveRelated(['best-cordless-drill-2026']);
    expect(result).toEqual([
      { href: '/guides/best-cordless-drill-2026', label: guide!.title },
    ]);
  });

  it('drops slugs that do not match any collection', () => {
    const result = resolveRelated(['unknown-slug-that-does-not-exist-xyz']);
    expect(result).toEqual([]);
  });

  it('handles a mix of known and unknown slugs, preserving order', () => {
    const review = getReview('makita-xfd131');
    const guide = getGuide('best-cordless-drill-2026');
    const result = resolveRelated([
      'makita-xfd131',
      'unknown-slug-that-does-not-exist-xyz',
      'best-cordless-drill-2026',
    ]);
    expect(result).toEqual([
      { href: '/reviews/makita-xfd131', label: review!.title },
      { href: '/guides/best-cordless-drill-2026', label: guide!.title },
    ]);
  });
});
