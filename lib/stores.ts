import { getStoreLandings } from '@/lib/content';

/** True when at least one Admitad store landing is configured. */
export function hasStoreLandings(): boolean {
  return getStoreLandings().length > 0;
}
