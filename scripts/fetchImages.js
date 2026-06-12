#!/usr/bin/env node
/**
 * Fetch and optimise images declared in content/images/*.json manifests.
 * Resolves URLs (direct download) or Pexels search queries, converts to WebP
 * via sharp, and writes content/images.meta.json with dimensions + credit.
 *
 * Env: PEXELS_API_KEY — required only for pexels: sources.
 * Usage: pnpm images:fetch   (then commit the changed content + public/images files)
 */
'use strict';

const fs = require('fs');
const path = require('path');
require('dotenv').config();
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const CONTENT_DIR = path.join(__dirname, '..', 'content');
const PUBLIC_IMAGES_DIR = path.join(__dirname, '..', 'public', 'images');

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

/**
 * Parse a manifest source string into { kind, value }.
 * @param {string} source
 * @returns {{ kind: 'url' | 'pexels'; value: string }}
 */
function parseSource(source) {
  if (source.startsWith('pexels:')) {
    return { kind: 'pexels', value: source.slice('pexels:'.length) };
  }
  return { kind: 'url', value: source };
}

/**
 * Return ids that are in manifest but missing from meta.
 * @param {Record<string, { source: string; alt: string }>} manifest
 * @param {Record<string, unknown>} meta
 * @returns {string[]}
 */
function pendingIds(manifest, meta) {
  return Object.keys(manifest).filter((id) => !meta[id]);
}

/**
 * Sleep for ms milliseconds.
 * @param {number} ms
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchBytes(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

async function resolvePexels(query) {
  const key = process.env.PEXELS_API_KEY;
  if (!key) return null; // no key — skip
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=3&orientation=landscape`;
  const res = await fetch(url, { headers: { Authorization: key } });
  if (!res.ok) throw new Error(`Pexels API ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const data = await res.json();
  if (!data.photos || data.photos.length === 0) throw new Error(`No Pexels photos for query: ${query}`);
  const photo = data.photos[0];
  const imageUrl = photo.src.large2x || photo.src.large;
  const buf = await fetchBytes(imageUrl);
  const credit = `Photo by ${photo.photographer} on Pexels`;
  return { buf, credit };
}

async function processImage(sharp, id, source, outBase) {
  const parsed = parseSource(source);
  let buf;
  let credit = null;

  if (parsed.kind === 'url') {
    buf = await fetchBytes(parsed.value);
  } else {
    const result = await resolvePexels(parsed.value);
    if (result === null) return { skipped: true };
    buf = result.buf;
    credit = result.credit;
  }

  // Ensure output directory exists
  const idDir = path.dirname(path.join(outBase, id));
  fs.mkdirSync(idDir, { recursive: true });

  const largePath = path.join(outBase, `${id}.webp`);
  const smPath = path.join(outBase, `${id}-sm.webp`);

  // Process large variant (1200px wide max)
  const largeInfo = await sharp(buf)
    .rotate()
    .resize({ width: 1200, withoutEnlargement: true })
    .webp({ quality: 78 })
    .toFile(largePath);

  // Process small variant (640px wide)
  await sharp(buf)
    .rotate()
    .resize({ width: 640, withoutEnlargement: true })
    .webp({ quality: 78 })
    .toFile(smPath);

  return {
    skipped: false,
    meta: { width: largeInfo.width, height: largeInfo.height, credit },
  };
}

async function main() {
  // Dynamically require sharp so the module can be imported in tests without it
  let sharp;
  try {
    sharp = require('sharp');
  } catch {
    console.error('[images] sharp not installed — run: pnpm add -D sharp');
    process.exit(1);
  }

  // Load all manifest fragments
  const imagesDir = path.join(CONTENT_DIR, 'images');
  const manifest = {};
  if (fs.existsSync(imagesDir)) {
    for (const f of fs.readdirSync(imagesDir).filter((f) => f.endsWith('.json'))) {
      Object.assign(manifest, JSON.parse(fs.readFileSync(path.join(imagesDir, f), 'utf8')));
    }
  }

  // Load existing meta
  const metaFile = path.join(CONTENT_DIR, 'images.meta.json');
  const meta = fs.existsSync(metaFile) ? JSON.parse(fs.readFileSync(metaFile, 'utf8')) : {};

  const pending = pendingIds(manifest, meta);
  console.log(`[images] manifest: ${Object.keys(manifest).length}, pending: ${pending.length}`);

  let fetched = 0;
  let skippedNoKey = 0;
  let failed = 0;

  for (const id of pending) {
    try {
      const result = await processImage(sharp, id, manifest[id].source, PUBLIC_IMAGES_DIR);
      if (result.skipped) {
        console.log(`[images] ⊘ ${id}: skipped (no PEXELS_API_KEY)`);
        skippedNoKey++;
      } else {
        meta[id] = result.meta;
        fetched++;
        console.log(`[images] ✓ ${id}`);
      }
    } catch (err) {
      console.error(`[images] ✗ ${id}: ${err.message}`);
      failed++;
    }
    // Sleep between remote fetches to be polite
    await sleep(300);
  }

  // Write meta with sorted keys
  const sortedMeta = Object.fromEntries(Object.keys(meta).sort().map((k) => [k, meta[k]]));
  fs.writeFileSync(metaFile, JSON.stringify(sortedMeta, null, 2) + '\n');

  const total = Object.keys(manifest).length;
  console.log(
    `[images] fetched ${fetched}, skipped-no-key ${skippedNoKey}, failed ${failed} (total manifest ${total})`
  );

  if (failed > 0) process.exit(1);
}

module.exports = { parseSource, pendingIds };

if (require.main === module) {
  main().catch((err) => {
    console.error('[images] fatal:', err);
    process.exit(1);
  });
}
