/**
 * Whole-corpus content validation gate.
 *
 * Validates EVERY JSON file in content/{reviews,compare,guides,brands,categories,projects}
 * and the merged image manifest in content/images/*.json.
 *
 * A failure names the offending file and the violated rule.
 * This test file is permanent — it runs on every `pnpm test:unit` invocation.
 */

import { describe, expect, it } from 'vitest';
import fs from 'fs';
import path from 'path';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const CONTENT_DIR = path.join(process.cwd(), 'content');

function readJsonFiles(dir: string): { slug: string; file: string; data: Record<string, unknown> }[] {
  const full = path.join(CONTENT_DIR, dir);
  if (!fs.existsSync(full)) return [];
  return fs
    .readdirSync(full)
    .filter((f) => f.endsWith('.json'))
    .map((f) => ({
      slug: f.replace(/\.json$/, ''),
      file: `content/${dir}/${f}`,
      data: JSON.parse(fs.readFileSync(path.join(full, f), 'utf8')) as Record<string, unknown>,
    }));
}

function wordCount(text: unknown): number {
  if (typeof text !== 'string' || text.trim() === '') return 0;
  return text.trim().split(/\s+/).length;
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_ISO_RE = /^PT(\d+H)?(\d+M)?$/;
const HONESTY_RE = /\bwe (tested|tried|used|ran)\b|\bin our (shop|workshop|hands)\b|hands-on/i;

// ---------------------------------------------------------------------------
// Load image manifest (merged)
// ---------------------------------------------------------------------------

function loadMergedManifest(): Record<string, { source: string; alt: string }> {
  const imagesDir = path.join(CONTENT_DIR, 'images');
  const merged: Record<string, { source: string; alt: string }> = {};
  if (!fs.existsSync(imagesDir)) return merged;
  for (const f of fs.readdirSync(imagesDir).filter((f) => f.endsWith('.json'))) {
    const fragment = JSON.parse(
      fs.readFileSync(path.join(imagesDir, f), 'utf8')
    ) as Record<string, { source: string; alt: string }>;
    Object.assign(merged, fragment);
  }
  return merged;
}

// ---------------------------------------------------------------------------
// Load all collections
// ---------------------------------------------------------------------------

const reviews = readJsonFiles('reviews');
const compares = readJsonFiles('compare');
const guides = readJsonFiles('guides');
const brands = readJsonFiles('brands');
const categories = readJsonFiles('categories');
const projects = readJsonFiles('projects');
const manifest = loadMergedManifest();

// Slug sets for cross-reference checks
const reviewSlugs = new Set(reviews.map((r) => r.slug));
const allContentSlugs = new Set([
  ...reviews.map((r) => r.slug),
  ...compares.map((r) => r.slug),
  ...guides.map((r) => r.slug),
  ...projects.map((r) => r.slug),
]);

// ---------------------------------------------------------------------------
// Common field checks (shared across all types)
// ---------------------------------------------------------------------------

function checkCommonFields(
  file: string,
  slug: string,
  data: Record<string, unknown>
): string[] {
  const errors: string[] = [];
  if (data.slug !== slug) {
    errors.push(`${file}: slug field "${data.slug}" does not match filename "${slug}"`);
  }
  if (!DATE_RE.test(String(data.datePublished ?? ''))) {
    errors.push(`${file}: datePublished "${data.datePublished}" is not YYYY-MM-DD`);
  }
  if (!DATE_RE.test(String(data.dateModified ?? ''))) {
    errors.push(`${file}: dateModified "${data.dateModified}" is not YYYY-MM-DD`);
  }
  return errors;
}

function checkFaq(
  file: string,
  faq: unknown,
  minItems: number
): string[] {
  const errors: string[] = [];
  if (!Array.isArray(faq)) {
    errors.push(`${file}: faq must be an array`);
    return errors;
  }
  if (faq.length < minItems) {
    errors.push(`${file}: faq has ${faq.length} items, minimum is ${minItems}`);
  }
  faq.forEach((item: unknown, i) => {
    const f = item as Record<string, unknown>;
    const keys = Object.keys(f);
    const extraKeys = keys.filter((k) => k !== 'q' && k !== 'a');
    if (extraKeys.length > 0) {
      errors.push(`${file}: faq[${i}] has unexpected keys: ${extraKeys.join(', ')}`);
    }
    if (!f.q || typeof f.q !== 'string' || f.q.trim() === '') {
      errors.push(`${file}: faq[${i}].q is missing or empty`);
    }
    if (!f.a || typeof f.a !== 'string' || f.a.trim() === '') {
      errors.push(`${file}: faq[${i}].a is missing or empty`);
    }
  });
  return errors;
}

function checkHonesty(file: string, body: unknown): string[] {
  const errors: string[] = [];
  if (typeof body === 'string' && HONESTY_RE.test(body)) {
    errors.push(`${file}: body contains a forbidden honesty-tripwire phrase (pattern: ${HONESTY_RE.source})`);
  }
  return errors;
}

// ---------------------------------------------------------------------------
// Review validation
// ---------------------------------------------------------------------------

describe('content/reviews', () => {
  it('all review files pass validation', () => {
    const errors: string[] = [];

    for (const { file, slug, data } of reviews) {
      errors.push(...checkCommonFields(file, slug, data));

      // Required fields
      const required = ['title', 'brand', 'category', 'model', 'rating', 'priceRange',
        'affiliate', 'pros', 'cons', 'bestFor', 'skipIf', 'specs', 'faq', 'body', 'related'];
      for (const field of required) {
        if (!(field in data)) errors.push(`${file}: missing required field "${field}"`);
      }

      // Rating: 3..5, at most one decimal
      const rating = Number(data.rating);
      if (isNaN(rating) || rating < 3 || rating > 5) {
        errors.push(`${file}: rating ${data.rating} must be between 3 and 5`);
      }
      const ratingStr = String(data.rating ?? '');
      if (ratingStr.includes('.') && ratingStr.split('.')[1].length > 1) {
        errors.push(`${file}: rating ${data.rating} has more than one decimal place`);
      }

      // pros >= 4
      if (!Array.isArray(data.pros) || data.pros.length < 4) {
        errors.push(`${file}: pros has ${Array.isArray(data.pros) ? data.pros.length : 0} items, minimum is 4`);
      }

      // cons >= 2
      if (!Array.isArray(data.cons) || data.cons.length < 2) {
        errors.push(`${file}: cons has ${Array.isArray(data.cons) ? data.cons.length : 0} items, minimum is 2`);
      }

      // specs >= 5
      const specsCount = typeof data.specs === 'object' && data.specs !== null
        ? Object.keys(data.specs).length : 0;
      if (specsCount < 5) {
        errors.push(`${file}: specs has ${specsCount} entries, minimum is 5`);
      }

      // related >= 3
      if (!Array.isArray(data.related) || data.related.length < 3) {
        errors.push(`${file}: related has ${Array.isArray(data.related) ? data.related.length : 0} items, minimum is 3`);
      } else {
        // every related slug must exist in the union of all review/compare/guide/project slugs
        for (const r of data.related as string[]) {
          if (!allContentSlugs.has(r)) {
            errors.push(`${file}: related slug "${r}" does not exist in any collection`);
          }
        }
      }

      // affiliate: every entry has merchant (non-empty) and url is string|null
      if (Array.isArray(data.affiliate)) {
        for (let i = 0; i < data.affiliate.length; i++) {
          const aff = data.affiliate[i] as Record<string, unknown>;
          if (!aff.merchant || typeof aff.merchant !== 'string' || String(aff.merchant).trim() === '') {
            errors.push(`${file}: affiliate[${i}].merchant is missing or empty`);
          }
          if (aff.url !== null && typeof aff.url !== 'string') {
            errors.push(`${file}: affiliate[${i}].url must be a string or null`);
          }
        }
      }

      // body word count >= 800
      if (wordCount(data.body) < 800) {
        errors.push(`${file}: body has ${wordCount(data.body)} words, minimum is 800`);
      }

      // faq >= 5
      errors.push(...checkFaq(file, data.faq, 5));

      // honesty
      errors.push(...checkHonesty(file, data.body));
    }

    expect(errors).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// Compare validation
// ---------------------------------------------------------------------------

describe('content/compare', () => {
  it('all compare files pass validation', () => {
    const errors: string[] = [];

    for (const { file, slug, data } of compares) {
      errors.push(...checkCommonFields(file, slug, data));

      const required = ['title', 'category', 'productA', 'productB', 'winner',
        'verdict', 'rows', 'faq', 'body', 'related'];
      for (const field of required) {
        if (!(field in data)) errors.push(`${file}: missing required field "${field}"`);
      }

      // productA.reviewSlug and productB.reviewSlug must exist
      const pa = (data.productA as Record<string, unknown> | undefined)?.reviewSlug;
      const pb = (data.productB as Record<string, unknown> | undefined)?.reviewSlug;
      if (!pa || !reviewSlugs.has(String(pa))) {
        errors.push(`${file}: productA.reviewSlug "${pa}" does not exist in reviews`);
      }
      if (!pb || !reviewSlugs.has(String(pb))) {
        errors.push(`${file}: productB.reviewSlug "${pb}" does not exist in reviews`);
      }

      // winner in ['a', 'b', 'tie']
      if (!['a', 'b', 'tie'].includes(String(data.winner ?? ''))) {
        errors.push(`${file}: winner "${data.winner}" must be one of a, b, tie`);
      }

      // body word count >= 500
      if (wordCount(data.body) < 500) {
        errors.push(`${file}: body has ${wordCount(data.body)} words, minimum is 500`);
      }

      // faq >= 4
      errors.push(...checkFaq(file, data.faq, 4));

      // related slugs must exist
      if (Array.isArray(data.related)) {
        for (const r of data.related as string[]) {
          if (!allContentSlugs.has(r)) {
            errors.push(`${file}: related slug "${r}" does not exist in any collection`);
          }
        }
      }

      // honesty
      errors.push(...checkHonesty(file, data.body));
    }

    expect(errors).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// Guide validation
// ---------------------------------------------------------------------------

describe('content/guides', () => {
  it('all guide files pass validation', () => {
    const errors: string[] = [];

    for (const { file, slug, data } of guides) {
      errors.push(...checkCommonFields(file, slug, data));

      const required = ['title', 'category', 'intro', 'picks', 'faq', 'body', 'related'];
      for (const field of required) {
        if (!(field in data)) errors.push(`${file}: missing required field "${field}"`);
      }

      // picks: ranks are contiguous 1..n
      if (Array.isArray(data.picks)) {
        const ranks = (data.picks as Record<string, unknown>[])
          .map((p) => Number(p.rank))
          .sort((a, b) => a - b);
        const expected = Array.from({ length: ranks.length }, (_, i) => i + 1);
        if (JSON.stringify(ranks) !== JSON.stringify(expected)) {
          errors.push(`${file}: picks ranks are not contiguous 1..n, got: [${ranks.join(',')}]`);
        }
        // every picks[].reviewSlug (when set) must exist in review slugs
        for (let i = 0; i < (data.picks as Record<string, unknown>[]).length; i++) {
          const pick = (data.picks as Record<string, unknown>[])[i];
          const rs = pick.reviewSlug;
          if (rs !== undefined && rs !== null && !reviewSlugs.has(String(rs))) {
            errors.push(`${file}: picks[${i}].reviewSlug "${rs}" does not exist in reviews`);
          }
        }
      } else {
        errors.push(`${file}: picks must be an array`);
      }

      // body word count >= 500
      if (wordCount(data.body) < 500) {
        errors.push(`${file}: body has ${wordCount(data.body)} words, minimum is 500`);
      }

      // faq >= 4
      errors.push(...checkFaq(file, data.faq, 4));

      // related slugs must exist
      if (Array.isArray(data.related)) {
        for (const r of data.related as string[]) {
          if (!allContentSlugs.has(r)) {
            errors.push(`${file}: related slug "${r}" does not exist in any collection`);
          }
        }
      }

      // honesty
      errors.push(...checkHonesty(file, data.body));
    }

    expect(errors).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// Brand validation
// ---------------------------------------------------------------------------

describe('content/brands', () => {
  it('all brand files pass validation', () => {
    const errors: string[] = [];

    for (const { file, slug, data } of brands) {
      errors.push(...checkCommonFields(file, slug, data));

      const required = ['name', 'description', 'knownFor', 'faq'];
      for (const field of required) {
        if (!(field in data)) errors.push(`${file}: missing required field "${field}"`);
      }

      // description word count >= 200
      if (wordCount(data.description) < 200) {
        errors.push(`${file}: description has ${wordCount(data.description)} words, minimum is 200`);
      }

      // faq >= 4
      errors.push(...checkFaq(file, data.faq, 4));

      // honesty
      errors.push(...checkHonesty(file, data.description));
    }

    expect(errors).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// Category validation
// ---------------------------------------------------------------------------

describe('content/categories', () => {
  it('all category files pass validation', () => {
    const errors: string[] = [];

    for (const { file, slug, data } of categories) {
      errors.push(...checkCommonFields(file, slug, data));

      const required = ['name', 'description', 'buyingFactors', 'faq'];
      for (const field of required) {
        if (!(field in data)) errors.push(`${file}: missing required field "${field}"`);
      }

      // description word count >= 200
      if (wordCount(data.description) < 200) {
        errors.push(`${file}: description has ${wordCount(data.description)} words, minimum is 200`);
      }

      // faq >= 5
      errors.push(...checkFaq(file, data.faq, 5));

      // honesty
      errors.push(...checkHonesty(file, data.description));
    }

    expect(errors).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// Project validation
// ---------------------------------------------------------------------------

describe('content/projects', () => {
  it('all project files pass validation', () => {
    const errors: string[] = [];

    for (const { file, slug, data } of projects) {
      errors.push(...checkCommonFields(file, slug, data));

      const required = ['title', 'description', 'category', 'difficulty', 'timeRequired',
        'timeRequiredIso', 'estCost', 'toolsNeeded', 'materials', 'steps', 'faq', 'body', 'related'];
      for (const field of required) {
        if (!(field in data)) errors.push(`${file}: missing required field "${field}"`);
      }

      // difficulty in enum
      if (!['beginner', 'intermediate', 'advanced'].includes(String(data.difficulty ?? ''))) {
        errors.push(`${file}: difficulty "${data.difficulty}" must be beginner|intermediate|advanced`);
      }

      // timeRequiredIso matches /^PT(\d+H)?(\d+M)?$/ and is not just 'PT'
      const tiso = String(data.timeRequiredIso ?? '');
      if (!TIME_ISO_RE.test(tiso) || tiso === 'PT') {
        errors.push(`${file}: timeRequiredIso "${tiso}" does not match PT<hours>H<minutes>M format`);
      }

      // steps >= 5
      if (!Array.isArray(data.steps) || data.steps.length < 5) {
        errors.push(`${file}: steps has ${Array.isArray(data.steps) ? data.steps.length : 0} items, minimum is 5`);
      }

      // toolsNeeded >= 3
      if (!Array.isArray(data.toolsNeeded) || data.toolsNeeded.length < 3) {
        errors.push(`${file}: toolsNeeded has ${Array.isArray(data.toolsNeeded) ? data.toolsNeeded.length : 0} items, minimum is 3`);
      } else {
        // every toolsNeeded[].reviewSlug (when present) must exist in review slugs
        for (let i = 0; i < (data.toolsNeeded as Record<string, unknown>[]).length; i++) {
          const tool = (data.toolsNeeded as Record<string, unknown>[])[i];
          const rs = tool.reviewSlug;
          if (rs !== undefined && rs !== null && !reviewSlugs.has(String(rs))) {
            errors.push(`${file}: toolsNeeded[${i}].reviewSlug "${rs}" does not exist in reviews`);
          }
        }
      }

      // materials >= 3
      if (!Array.isArray(data.materials) || data.materials.length < 3) {
        errors.push(`${file}: materials has ${Array.isArray(data.materials) ? data.materials.length : 0} items, minimum is 3`);
      }

      // description length 80–200 chars
      const descLen = typeof data.description === 'string' ? data.description.length : 0;
      if (descLen < 80 || descLen > 200) {
        errors.push(`${file}: description is ${descLen} chars, must be 80–200`);
      }

      // body word count >= 700
      if (wordCount(data.body) < 700) {
        errors.push(`${file}: body has ${wordCount(data.body)} words, minimum is 700`);
      }

      // faq >= 4
      errors.push(...checkFaq(file, data.faq, 4));

      // honesty
      errors.push(...checkHonesty(file, data.body));
    }

    expect(errors).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// Image manifest integrity
// ---------------------------------------------------------------------------

describe('image manifest integrity', () => {
  it('every manifest entry has non-empty alt and valid source', () => {
    const errors: string[] = [];

    for (const [id, entry] of Object.entries(manifest)) {
      if (!entry.alt || entry.alt.trim() === '') {
        errors.push(`manifest entry "${id}": alt is empty`);
      }
      if (!entry.source || entry.source.trim() === '') {
        errors.push(`manifest entry "${id}": source is empty`);
      } else {
        const src = entry.source;
        const validSource = src.startsWith('pexels:') || src.startsWith('https://');
        if (!validSource) {
          errors.push(`manifest entry "${id}": source "${src}" must start with "pexels:" or "https://"`);
        }
      }
    }

    expect(errors).toEqual([]);
  });

  it('every review has a manifest entry', () => {
    const missing = reviews
      .map((r) => `reviews/${r.slug}`)
      .filter((id) => !(id in manifest));
    expect(missing).toEqual([]);
  });

  it('every guide has a manifest entry', () => {
    const missing = guides
      .map((g) => `guides/${g.slug}`)
      .filter((id) => !(id in manifest));
    expect(missing).toEqual([]);
  });

  it('every project has a manifest entry', () => {
    const missing = projects
      .map((p) => `projects/${p.slug}`)
      .filter((id) => !(id in manifest));
    expect(missing).toEqual([]);
  });

  it('every category has a manifest entry', () => {
    const missing = categories
      .map((c) => `categories/${c.slug}`)
      .filter((id) => !(id in manifest));
    expect(missing).toEqual([]);
  });

  it('compare pages: both referenced review manifest entries exist', () => {
    const errors: string[] = [];
    for (const { file, data } of compares) {
      const pa = (data.productA as Record<string, unknown> | undefined)?.reviewSlug;
      const pb = (data.productB as Record<string, unknown> | undefined)?.reviewSlug;
      if (pa && !(`reviews/${pa}` in manifest)) {
        errors.push(`${file}: productA review image "reviews/${pa}" not in manifest`);
      }
      if (pb && !(`reviews/${pb}` in manifest)) {
        errors.push(`${file}: productB review image "reviews/${pb}" not in manifest`);
      }
    }
    expect(errors).toEqual([]);
  });
});
