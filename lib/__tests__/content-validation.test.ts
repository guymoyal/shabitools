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

function isObj(x: unknown): x is Record<string, unknown> {
  return typeof x === 'object' && x !== null && !Array.isArray(x);
}

// ---------------------------------------------------------------------------
// Load image manifest (merged)
// ---------------------------------------------------------------------------

function loadMergedManifest(): Record<string, unknown> {
  const imagesDir = path.join(CONTENT_DIR, 'images');
  const merged: Record<string, unknown> = {};
  if (!fs.existsSync(imagesDir)) return merged;
  for (const f of fs.readdirSync(imagesDir).filter((f) => f.endsWith('.json'))) {
    const fragment = JSON.parse(
      fs.readFileSync(path.join(imagesDir, f), 'utf8')
    ) as Record<string, unknown>;
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
    if (!isObj(item)) {
      errors.push(`${file}: faq[${i}] must be an object {q, a}`);
      return;
    }
    const extraKeys = Object.keys(item).filter((k) => k !== 'q' && k !== 'a');
    if (extraKeys.length > 0) {
      errors.push(`${file}: faq[${i}] has unexpected keys: ${extraKeys.join(', ')}`);
    }
    if (!item.q || typeof item.q !== 'string' || (item.q as string).trim() === '') {
      errors.push(`${file}: faq[${i}].q is missing or empty`);
    }
    if (!item.a || typeof item.a !== 'string' || (item.a as string).trim() === '') {
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

      // specs >= 5; every value must be a non-empty string
      const specsCount = typeof data.specs === 'object' && data.specs !== null
        ? Object.keys(data.specs).length : 0;
      if (specsCount < 5) {
        errors.push(`${file}: specs has ${specsCount} entries, minimum is 5`);
      }
      if (typeof data.specs === 'object' && data.specs !== null) {
        for (const [k, v] of Object.entries(data.specs as Record<string, unknown>)) {
          if (typeof v !== 'string' || (v as string).trim() === '') {
            errors.push(`${file}: specs["${k}"] must be a non-empty string, got ${JSON.stringify(v)}`);
          }
        }
      }

      // related >= 3; non-array → error; elements must be non-empty strings
      if (!Array.isArray(data.related) || data.related.length < 3) {
        errors.push(`${file}: related has ${Array.isArray(data.related) ? data.related.length : 0} items, minimum is 3`);
      } else {
        for (let ri = 0; ri < (data.related as unknown[]).length; ri++) {
          const r = (data.related as unknown[])[ri];
          if (typeof r !== 'string' || (r as string).trim() === '') {
            errors.push(`${file}: related[${ri}] must be a non-empty string`);
          } else if (!allContentSlugs.has(r as string)) {
            errors.push(`${file}: related slug "${r}" does not exist in any collection`);
          }
        }
      }

      // affiliate: every entry has merchant (non-empty) and url is null or non-empty https string
      if (Array.isArray(data.affiliate)) {
        for (let i = 0; i < data.affiliate.length; i++) {
          const aff = data.affiliate[i];
          if (!isObj(aff)) {
            errors.push(`${file}: affiliate[${i}] must be an object`);
            continue;
          }
          if (!aff.merchant || typeof aff.merchant !== 'string' || (aff.merchant as string).trim() === '') {
            errors.push(`${file}: affiliate[${i}].merchant is missing or empty`);
          }
          if (aff.url !== null && typeof aff.url !== 'string') {
            errors.push(`${file}: affiliate[${i}].url must be a string or null`);
          }
          if (typeof aff.url === 'string' && (aff.url as string).trim() === '') {
            errors.push(`${file}: affiliate[${i}].url must be null or a non-empty https string, got ""`);
          }
          if (typeof aff.url === 'string' && (aff.url as string).trim() !== '' && !(aff.url as string).startsWith('https://')) {
            errors.push(`${file}: affiliate[${i}].url "${aff.url}" must start with https://`);
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

      // productA and productB must be objects; reviewSlugs must exist
      if (!isObj(data.productA)) {
        errors.push(`${file}: productA must be an object`);
      }
      if (!isObj(data.productB)) {
        errors.push(`${file}: productB must be an object`);
      }
      const pa = isObj(data.productA) ? data.productA.reviewSlug : undefined;
      const pb = isObj(data.productB) ? data.productB.reviewSlug : undefined;
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

      // related slugs must exist; non-array → error; elements must be non-empty strings
      if ('related' in data && data.related !== undefined) {
        if (!Array.isArray(data.related)) {
          errors.push(`${file}: related must be an array`);
        } else {
          for (let ri = 0; ri < (data.related as unknown[]).length; ri++) {
            const r = (data.related as unknown[])[ri];
            if (typeof r !== 'string' || (r as string).trim() === '') {
              errors.push(`${file}: related[${ri}] must be a non-empty string`);
            } else if (!allContentSlugs.has(r as string)) {
              errors.push(`${file}: related slug "${r}" does not exist in any collection`);
            }
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

      // picks: ranks are contiguous 1..n, all elements must be objects
      if (Array.isArray(data.picks)) {
        const picksArr = data.picks as unknown[];
        const allObjs = picksArr.every((p, i) => {
          if (!isObj(p)) {
            errors.push(`${file}: picks[${i}] must be an object`);
            return false;
          }
          return true;
        });
        if (allObjs) {
          const picks = picksArr as Record<string, unknown>[];
          const ranks = picks.map((p) => Number(p.rank)).sort((a, b) => a - b);
          const expected = Array.from({ length: ranks.length }, (_, i) => i + 1);
          if (JSON.stringify(ranks) !== JSON.stringify(expected)) {
            errors.push(`${file}: picks ranks are not contiguous 1..n, got: [${ranks.join(',')}]`);
          }
          for (let i = 0; i < picks.length; i++) {
            const rs = picks[i].reviewSlug;
            if (rs !== undefined && rs !== null && !reviewSlugs.has(String(rs))) {
              errors.push(`${file}: picks[${i}].reviewSlug "${rs}" does not exist in reviews`);
            }
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

      // related slugs must exist; non-array → error; elements must be non-empty strings
      if ('related' in data && data.related !== undefined) {
        if (!Array.isArray(data.related)) {
          errors.push(`${file}: related must be an array`);
        } else {
          for (let ri = 0; ri < (data.related as unknown[]).length; ri++) {
            const r = (data.related as unknown[])[ri];
            if (typeof r !== 'string' || (r as string).trim() === '') {
              errors.push(`${file}: related[${ri}] must be a non-empty string`);
            } else if (!allContentSlugs.has(r as string)) {
              errors.push(`${file}: related slug "${r}" does not exist in any collection`);
            }
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

      // timeRequiredIso matches /^PT(\d+H)?(\d+M)?$/, is not just 'PT', and is not zero duration
      const tiso = String(data.timeRequiredIso ?? '');
      const ZERO_DURATION_RE = /^PT(0H)?(0M)?$/;
      if (!TIME_ISO_RE.test(tiso) || tiso === 'PT' || ZERO_DURATION_RE.test(tiso)) {
        errors.push(`${file}: timeRequiredIso "${tiso}" does not match PT<hours>H<minutes>M format (non-zero required)`);
      }

      // steps >= 5; each step must be an object with non-empty name and text
      if (!Array.isArray(data.steps) || data.steps.length < 5) {
        errors.push(`${file}: steps has ${Array.isArray(data.steps) ? data.steps.length : 0} items, minimum is 5`);
      }
      if (Array.isArray(data.steps)) {
        for (let i = 0; i < (data.steps as unknown[]).length; i++) {
          const step = (data.steps as unknown[])[i];
          if (!isObj(step)) {
            errors.push(`${file}: steps[${i}] must be an object`);
            continue;
          }
          if (!step.name || typeof step.name !== 'string' || (step.name as string).trim() === '') {
            errors.push(`${file}: steps[${i}].name must be a non-empty string`);
          }
          if (!step.text || typeof step.text !== 'string' || (step.text as string).trim() === '') {
            errors.push(`${file}: steps[${i}].text must be a non-empty string`);
          }
        }
      }

      // toolsNeeded >= 3; each element must be an object with non-empty name
      if (!Array.isArray(data.toolsNeeded) || data.toolsNeeded.length < 3) {
        errors.push(`${file}: toolsNeeded has ${Array.isArray(data.toolsNeeded) ? data.toolsNeeded.length : 0} items, minimum is 3`);
      } else {
        for (let i = 0; i < (data.toolsNeeded as unknown[]).length; i++) {
          const tool = (data.toolsNeeded as unknown[])[i];
          if (!isObj(tool)) {
            errors.push(`${file}: toolsNeeded[${i}] must be an object`);
            continue;
          }
          if (!tool.name || typeof tool.name !== 'string' || (tool.name as string).trim() === '') {
            errors.push(`${file}: toolsNeeded[${i}].name must be a non-empty string`);
          }
          const rs = tool.reviewSlug;
          if (rs !== undefined && rs !== null && !reviewSlugs.has(String(rs))) {
            errors.push(`${file}: toolsNeeded[${i}].reviewSlug "${rs}" does not exist in reviews`);
          }
        }
      }

      // materials >= 3; each element must be a non-empty string
      if (!Array.isArray(data.materials) || data.materials.length < 3) {
        errors.push(`${file}: materials has ${Array.isArray(data.materials) ? data.materials.length : 0} items, minimum is 3`);
      }
      if (Array.isArray(data.materials)) {
        for (let i = 0; i < (data.materials as unknown[]).length; i++) {
          const mat = (data.materials as unknown[])[i];
          if (typeof mat !== 'string' || (mat as string).trim() === '') {
            errors.push(`${file}: materials[${i}] must be a non-empty string`);
          }
        }
      }

      // description length 120–170 chars, used for meta description
      const descLen = typeof data.description === 'string' ? data.description.length : 0;
      if (descLen < 120 || descLen > 170) {
        errors.push(`${file}: description is ${descLen} chars, must be 120–170`);
      }

      // body word count >= 700
      if (wordCount(data.body) < 700) {
        errors.push(`${file}: body has ${wordCount(data.body)} words, minimum is 700`);
      }

      // faq >= 4
      errors.push(...checkFaq(file, data.faq, 4));

      // related slugs must exist; non-array → error; elements must be non-empty strings
      if ('related' in data && data.related !== undefined) {
        if (!Array.isArray(data.related)) {
          errors.push(`${file}: related must be an array`);
        } else {
          for (let ri = 0; ri < (data.related as unknown[]).length; ri++) {
            const r = (data.related as unknown[])[ri];
            if (typeof r !== 'string' || (r as string).trim() === '') {
              errors.push(`${file}: related[${ri}] must be a non-empty string`);
            } else if (!allContentSlugs.has(r as string)) {
              errors.push(`${file}: related slug "${r}" does not exist in any collection`);
            }
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
// timeRequiredIso validation
// ---------------------------------------------------------------------------

describe('timeRequiredIso validation', () => {
  const TIME_ISO_RE_LOCAL = /^PT(\d+H)?(\d+M)?$/;
  const ZERO_DURATION_RE_LOCAL = /^PT(0H)?(0M)?$/;

  function validateTiso(tiso: string): boolean {
    return TIME_ISO_RE_LOCAL.test(tiso) && tiso !== 'PT' && !ZERO_DURATION_RE_LOCAL.test(tiso);
  }

  it('accepts valid non-zero durations', () => {
    expect(validateTiso('PT2H')).toBe(true);
    expect(validateTiso('PT30M')).toBe(true);
    expect(validateTiso('PT1H30M')).toBe(true);
  });

  it('rejects PT (bare)', () => {
    expect(validateTiso('PT')).toBe(false);
  });

  it('rejects zero durations PT0H, PT0M, PT0H0M', () => {
    expect(validateTiso('PT0H')).toBe(false);
    expect(validateTiso('PT0M')).toBe(false);
    expect(validateTiso('PT0H0M')).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// related field validation
// ---------------------------------------------------------------------------

describe('related field validation', () => {
  it('non-array related produces error not silent skip', () => {
    const errors: string[] = [];
    const file = 'test/file.json';
    const related: unknown = 'not-an-array';
    if (related !== undefined) {
      if (!Array.isArray(related)) {
        errors.push(`${file}: related must be an array`);
      }
    }
    expect(errors).toEqual(['test/file.json: related must be an array']);
  });

  it('non-string related elements produce errors', () => {
    const errors: string[] = [];
    const file = 'test/file.json';
    const related: unknown[] = ['valid-slug', '', 42, null];
    for (let i = 0; i < related.length; i++) {
      const r = related[i];
      if (typeof r !== 'string' || (r as string).trim() === '') {
        errors.push(`${file}: related[${i}] must be a non-empty string`);
      }
    }
    expect(errors).toEqual([
      'test/file.json: related[1] must be a non-empty string',
      'test/file.json: related[2] must be a non-empty string',
      'test/file.json: related[3] must be a non-empty string',
    ]);
  });
});

// ---------------------------------------------------------------------------
// Specs value validation
// ---------------------------------------------------------------------------

describe('specs value validation', () => {
  it('detects non-string and empty-string spec values', () => {
    const specs: Record<string, unknown> = { key1: '', key2: 42, key3: 'valid' };
    const errors: string[] = [];
    const file = 'test/file.json';
    for (const [k, v] of Object.entries(specs)) {
      if (typeof v !== 'string' || (v as string).trim() === '') {
        errors.push(`${file}: specs["${k}"] must be a non-empty string, got ${JSON.stringify(v)}`);
      }
    }
    expect(errors).toEqual([
      'test/file.json: specs["key1"] must be a non-empty string, got ""',
      'test/file.json: specs["key2"] must be a non-empty string, got 42',
    ]);
  });
});

// ---------------------------------------------------------------------------
// Cross-collection duplicate slug detection
// ---------------------------------------------------------------------------

describe('cross-collection duplicate slugs', () => {
  it('no slug appears in more than one collection', () => {
    const errors: string[] = [];
    const collections = [
      { name: 'reviews', items: reviews },
      { name: 'compare', items: compares },
      { name: 'guides', items: guides },
      { name: 'brands', items: brands },
      { name: 'categories', items: categories },
      { name: 'projects', items: projects },
    ];
    const seen = new Map<string, string>(); // slug -> "collection/file"
    for (const { items } of collections) {
      for (const { slug, file } of items) {
        if (seen.has(slug)) {
          errors.push(`duplicate slug "${slug}": found in both ${seen.get(slug)} and ${file}`);
        } else {
          seen.set(slug, file);
        }
      }
    }
    expect(errors).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// element guards unit tests
// ---------------------------------------------------------------------------

describe('element guards', () => {
  it('isObj rejects null, strings, arrays; accepts plain objects', () => {
    expect(isObj(null)).toBe(false);
    expect(isObj('string')).toBe(false);
    expect(isObj([1, 2])).toBe(false);
    expect(isObj(42)).toBe(false);
    expect(isObj({ key: 'val' })).toBe(true);
    expect(isObj({})).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// checkFaq helper unit tests
// ---------------------------------------------------------------------------

describe('checkFaq helper', () => {
  it('returns a named error for null elements, not a crash', () => {
    const errs = checkFaq('test/file.json', [null], 0);
    expect(errs).toEqual(['test/file.json: faq[0] must be an object {q, a}']);
  });

  it('returns a named error for non-object array elements', () => {
    const errs = checkFaq('test/file.json', ['string-not-obj'], 0);
    expect(errs).toEqual(['test/file.json: faq[0] must be an object {q, a}']);
  });

  it('does not report "extra keys: 0,1,2" for non-objects', () => {
    const errs = checkFaq('test/file.json', [[1, 2, 3]], 0);
    expect(errs).not.toContain(expect.stringContaining('extra keys: 0, 1, 2'));
    expect(errs).toEqual(['test/file.json: faq[0] must be an object {q, a}']);
  });
});

// ---------------------------------------------------------------------------
// Image manifest integrity
// ---------------------------------------------------------------------------

describe('image manifest integrity', () => {
  it('every manifest entry has non-empty alt and valid source', () => {
    const errors: string[] = [];

    for (const [id, entry] of Object.entries(manifest)) {
      if (!isObj(entry)) {
        errors.push(`manifest entry "${id}": entry must be an object`);
        continue;
      }
      const alt = entry.alt;
      const source = entry.source;
      if (!alt || typeof alt !== 'string' || (alt as string).trim() === '') {
        errors.push(`manifest entry "${id}": alt is empty`);
      }
      if (!source || typeof source !== 'string' || (source as string).trim() === '') {
        errors.push(`manifest entry "${id}": source is empty`);
      } else {
        const src = source as string;
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
      const pa = isObj(data.productA) ? data.productA.reviewSlug : undefined;
      const pb = isObj(data.productB) ? data.productB.reviewSlug : undefined;
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
