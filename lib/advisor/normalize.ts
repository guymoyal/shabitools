// lib/advisor/normalize.ts

/** Lowercase, trim, collapse internal whitespace. Runtime-agnostic. */
export function normalizeQuestion(q: string): string {
  return q.toLowerCase().trim().replace(/\s+/g, ' ');
}

/** FNV-1a 32-bit hash → 8-char hex. Deterministic, no crypto/runtime deps. */
export function hashString(input: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, '0');
}

export function answerHashFor(question: string): string {
  return hashString(normalizeQuestion(question));
}
