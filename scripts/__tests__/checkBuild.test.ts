import { describe, expect, it } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { auditOutDir } from '../checkBuild.js';

function makeOut(files: Record<string, string>): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'shabi-out-'));
  for (const [rel, body] of Object.entries(files)) {
    const full = path.join(dir, rel);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, body);
  }
  return dir;
}

describe('auditOutDir', () => {
  it('passes a clean small build', () => {
    const dir = makeOut({ 'index.html': '<a href="/go/x">go</a>', 'reviews/a.html': 'ok' });
    expect(auditOutDir(dir, 1500)).toMatchObject({ pageCount: 2, leaks: [] });
  });

  it('reports tatrck leaks', () => {
    const dir = makeOut({ 'bad.html': '<a href="https://tatrck.com/h/x">x</a>' });
    expect(auditOutDir(dir, 1500).leaks).toEqual([path.join(dir, 'bad.html')]);
  });

  it('flags page-cap violations', () => {
    const dir = makeOut({ 'a.html': '1', 'b.html': '2' });
    expect(auditOutDir(dir, 1).overCap).toBe(true);
  });
});
