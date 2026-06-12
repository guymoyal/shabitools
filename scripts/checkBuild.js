#!/usr/bin/env node
/**
 * Post-build guard: (1) hard 1,500-page cap; (2) zero tatrck.com tracker
 * leaks in HTML (every monetized link must go through first-party /go/).
 * Fails the build (exit 1) on violation.
 */
const fs = require('fs');
const path = require('path');

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const full = path.join(dir, d.name);
    return d.isDirectory() ? walk(full) : [full];
  });
}

function auditOutDir(outDir, cap) {
  const html = walk(outDir).filter((f) => f.endsWith('.html'));
  const leaks = html.filter((f) => fs.readFileSync(f, 'utf8').includes('tatrck.com'));
  return { pageCount: html.length, overCap: html.length > cap, leaks };
}

module.exports = { auditOutDir };

if (require.main === module) {
  const out = path.join(__dirname, '..', 'out');
  const { pageCount, overCap, leaks } = auditOutDir(out, 1500);
  console.log(`[check-build] ${pageCount}/1500 pages`);
  if (overCap) {
    console.error('[check-build] FAIL: page cap exceeded');
    process.exit(1);
  }
  if (leaks.length) {
    console.error(`[check-build] FAIL: tatrck.com leaked in:\n${leaks.join('\n')}`);
    process.exit(1);
  }
  console.log('[check-build] OK: under cap, zero tracker leaks');
}
