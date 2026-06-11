import { describe, expect, it } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { loadCollection, loadOne, getStoreLandings } from '../content';

function fixtureDir(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'shabi-content-'));
  fs.mkdirSync(path.join(dir, 'reviews'));
  fs.writeFileSync(
    path.join(dir, 'reviews', 'older.json'),
    JSON.stringify({ slug: 'older', datePublished: '2026-01-01' })
  );
  fs.writeFileSync(
    path.join(dir, 'reviews', 'newer.json'),
    JSON.stringify({ slug: 'newer', datePublished: '2026-06-01' })
  );
  fs.writeFileSync(path.join(dir, 'reviews', 'notes.txt'), 'ignore me');
  return dir;
}

describe('loadCollection', () => {
  it('loads .json files newest-first and ignores non-json', () => {
    const items = loadCollection<{ slug: string; datePublished?: string }>('reviews', fixtureDir());
    expect(items.map((i) => i.slug)).toEqual(['newer', 'older']);
  });

  it('returns [] for a missing directory', () => {
    expect(loadCollection<{ slug: string; datePublished?: string }>('nope', fixtureDir())).toEqual([]);
  });
});

describe('loadOne', () => {
  it('finds by slug and returns undefined when absent', () => {
    const dir = fixtureDir();
    expect(loadOne<{ slug: string }>('reviews', 'older', dir)?.slug).toBe('older');
    expect(loadOne('reviews', 'ghost', dir)).toBeUndefined();
  });
});

describe('getStoreLandings', () => {
  it('returns [] when admitad-landings.json is missing', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'shabi-landings-'));
    expect(getStoreLandings(dir)).toEqual([]);
  });

  it('parses {entries:[...]} and filters out entries lacking slug or admitad.gotolink', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'shabi-landings-'));
    const payload = {
      entries: [
        { slug: 'amazon', admitad: { gotolink: 'https://track.admitad.com/amazon' }, name: 'Amazon' },
        { slug: 'no-link', admitad: {}, name: 'No Link' },
        { admitad: { gotolink: 'https://track.admitad.com/no-slug' }, name: 'No Slug' },
        { slug: 'ebay', admitad: { gotolink: 'https://track.admitad.com/ebay' }, name: 'eBay' },
      ],
    };
    fs.writeFileSync(path.join(dir, 'admitad-landings.json'), JSON.stringify(payload));
    const result = getStoreLandings(dir);
    expect(result.map((e) => e.slug)).toEqual(['amazon', 'ebay']);
  });
});
