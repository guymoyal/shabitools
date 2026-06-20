// lib/advisor/amazon.ts

/** Canonical tagged product URL from an ASIN. */
export function asinUrl(asin: string, tag: string): string {
  return `https://www.amazon.com/dp/${asin}?tag=${tag}`;
}

/** Extract a 10-char ASIN from a /dp/ or /gp/product/ Amazon URL, else null. */
export function extractAsin(url: string): string | null {
  const m = url.match(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})/i);
  return m ? m[1].toUpperCase() : null;
}
