// lib/advisor/__tests__/db.test.ts
import { describe, it, expect } from 'vitest';
import { checkRateLimit, getCachedSearch, putCachedSearch } from '@/lib/advisor/db';

// Minimal fake D1 capturing calls and returning programmed rows.
function fakeDb(firstRow: any = null) {
  const calls: { sql: string; binds: any[] }[] = [];
  const db: any = {
    calls,
    prepare(sql: string) {
      const stmt: any = {
        _binds: [] as any[],
        bind(...b: any[]) { stmt._binds = b; return stmt; },
        async run() { calls.push({ sql, binds: stmt._binds }); return { success: true }; },
        async first() { calls.push({ sql, binds: stmt._binds }); return firstRow; },
        async all() { calls.push({ sql, binds: stmt._binds }); return { results: [] }; },
      };
      return stmt;
    },
  };
  return db;
}

describe('search cache', () => {
  it('returns null on miss', async () => {
    expect(await getCachedSearch(fakeDb(null), 'k', 1000)).toBeNull();
  });
  it('returns parsed payload when not expired', async () => {
    const row = { payload: JSON.stringify([{ asin: 'A1' }]), expires_at: 5000 };
    expect(await getCachedSearch(fakeDb(row), 'k', 1000)).toEqual([{ asin: 'A1' }]);
  });
  it('treats expired rows as a miss', async () => {
    const row = { payload: '[]', expires_at: 500 };
    expect(await getCachedSearch(fakeDb(row), 'k', 1000)).toBeNull();
  });
  it('putCachedSearch issues an upsert', async () => {
    const db = fakeDb();
    await putCachedSearch(db, 'k', [{ asin: 'A1' }] as any, 9000);
    expect(db.calls[0].sql).toMatch(/INSERT INTO search_cache/i);
  });
});

describe('rate limit', () => {
  it('allows when under the cap', async () => {
    const db = fakeDb({ count: 2 });
    expect(await checkRateLimit(db, 'iphash', 1000, 60000, 20)).toBe(true);
  });
  it('blocks when at/over the cap', async () => {
    const db = fakeDb({ count: 20 });
    expect(await checkRateLimit(db, 'iphash', 1000, 60000, 20)).toBe(false);
  });
});
