import fs from 'fs';
import path from 'path';
import type { Brand } from '@/types/brand';
import type { Category } from '@/types/category';
import type { Compare } from '@/types/compare';
import type { Guide } from '@/types/guide';
import type { StoreLanding } from '@/types/landing';
import type { Project } from '@/types/project';
import type { Review } from '@/types/review';

const DEFAULT_BASE = path.join(process.cwd(), 'content');

const collectionCache = new Map<string, unknown[]>();

export function loadCollection<T extends { slug: string; datePublished?: string }>(
  dir: string,
  base: string = DEFAULT_BASE
): T[] {
  const full = path.join(base, dir);
  if (collectionCache.has(full)) return collectionCache.get(full) as T[];
  if (!fs.existsSync(full)) return [];
  const result = fs
    .readdirSync(full)
    .filter((f) => f.endsWith('.json'))
    .map((f) => JSON.parse(fs.readFileSync(path.join(full, f), 'utf8')) as T)
    .sort((a, b) => (b.datePublished ?? '').localeCompare(a.datePublished ?? ''));
  collectionCache.set(full, result);
  return result;
}

export function loadOne<T extends { slug: string; datePublished?: string }>(
  dir: string,
  slug: string,
  base: string = DEFAULT_BASE
): T | undefined {
  return loadCollection<T>(dir, base).find((i) => i.slug === slug);
}

export const getReviews = () => loadCollection<Review>('reviews');
export const getReview = (slug: string) => loadOne<Review>('reviews', slug);
export const getCompares = () => loadCollection<Compare>('compare');
export const getCompare = (slug: string) => loadOne<Compare>('compare', slug);
export const getGuides = () => loadCollection<Guide>('guides');
export const getGuide = (slug: string) => loadOne<Guide>('guides', slug);
export const getBrands = () => loadCollection<Brand>('brands');
export const getBrand = (slug: string) => loadOne<Brand>('brands', slug);
export const getCategories = () => loadCollection<Category>('categories');
export const getCategory = (slug: string) => loadOne<Category>('categories', slug);
export const getProjects = () => loadCollection<Project>('projects');
export const getProject = (slug: string) => loadOne<Project>('projects', slug);

const landingsCache = new Map<string, StoreLanding[]>();

/** CPC store landings from content/admitad-landings.json (aibuzz format:
 *  `{ entries: [...] }`). Only entries with a tracking link render. */
export function getStoreLandings(base: string = DEFAULT_BASE): StoreLanding[] {
  const file = path.join(base, 'admitad-landings.json');
  if (landingsCache.has(file)) return landingsCache.get(file)!;
  if (!fs.existsSync(file)) return [];
  const payload = JSON.parse(fs.readFileSync(file, 'utf8'));
  const entries: StoreLanding[] = Array.isArray(payload?.entries) ? payload.entries : [];
  const result = entries.filter((e) => e.slug && e.admitad?.gotolink);
  landingsCache.set(file, result);
  return result;
}

export const getStoreLanding = (slug: string) =>
  getStoreLandings().find((e) => e.slug === slug);
