import fs from 'fs';
import path from 'path';

export interface SiteImageData {
  src: string;
  srcSm: string;
  alt: string;
  width: number;
  height: number;
}

interface ManifestEntry { source: string; alt: string }
interface MetaEntry { width: number; height: number; credit: string | null }
export interface ImageIndex { manifest: Record<string, ManifestEntry>; meta: Record<string, MetaEntry> }

const DEFAULT_BASE = path.join(process.cwd(), 'content');
const indexCache = new Map<string, ImageIndex>();

export function loadImageIndex(base: string = DEFAULT_BASE): ImageIndex {
  if (indexCache.has(base)) return indexCache.get(base)!;
  const dir = path.join(base, 'images');
  const manifest: Record<string, ManifestEntry> = {};
  if (fs.existsSync(dir)) {
    for (const f of fs.readdirSync(dir).filter((f) => f.endsWith('.json'))) {
      Object.assign(manifest, JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')));
    }
  }
  const metaFile = path.join(base, 'images.meta.json');
  const meta = fs.existsSync(metaFile) ? JSON.parse(fs.readFileSync(metaFile, 'utf8')) : {};
  const idx = { manifest, meta };
  indexCache.set(base, idx);
  return idx;
}

export function imageFromIndex(idx: ImageIndex, id: string): SiteImageData | null {
  const m = idx.manifest[id];
  const d = idx.meta[id];
  if (!m || !d) return null;
  return {
    src: `/images/${id}.webp`,
    srcSm: `/images/${id}-sm.webp`,
    alt: m.alt,
    width: d.width,
    height: d.height,
  };
}

/** Main entry for pages/components. Null until `pnpm images:fetch` has run for this id. */
export const getImage = (id: string) => imageFromIndex(loadImageIndex(), id);
