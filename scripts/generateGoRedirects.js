#!/usr/bin/env node
/**
 * Generate public/_redirects for Cloudflare Pages:
 *  - legacy /tools/* → / (301, preserve old SEO equity)
 *  - /go/<slug> → tracking link (302, server-side) — the ad-blocker fix:
 *    page HTML only ever contains first-party /go/ URLs, never tatrck.com.
 * Source of truth: content/admitad-landings.json. Run before every build.
 */
const fs = require('fs');
const path = require('path');

const LEGACY = ['/tools / 301', '/tools/* / 301'];
const LIMIT = 2000; // Cloudflare Pages static-redirect cap

function buildRedirectLines(entries) {
  const lines = [...LEGACY];
  for (const e of entries) {
    const link = e?.admitad?.gotolink;
    if (e?.slug && typeof link === 'string' && /^https:\/\//.test(link)) {
      lines.push(`/go/${e.slug} ${link} 302`);
      const cpc = e.admitad.cpcGotolink;
      if (typeof cpc === 'string' && /^https:\/\//.test(cpc)) {
        lines.push(`/go/${e.slug}~cpc ${cpc} 302`);
      }
    }
  }
  if (lines.length > LIMIT) {
    throw new Error(`${lines.length} redirect rules exceed Cloudflare's ${LIMIT} static-rule limit`);
  }
  return lines;
}

module.exports = { buildRedirectLines };

if (require.main === module) {
  const dataFile = path.join(__dirname, '..', 'content', 'admitad-landings.json');
  let entries = [];
  try {
    entries = JSON.parse(fs.readFileSync(dataFile, 'utf8')).entries || [];
  } catch {
    /* pre-harvest: legacy rules only */
  }
  const lines = buildRedirectLines(entries);
  const out = path.join(__dirname, '..', 'public', '_redirects');
  fs.writeFileSync(out, lines.join('\n') + '\n');
  console.log(`[go-redirects] wrote ${lines.length} rules (${lines.length - LEGACY.length} affiliate) to public/_redirects`);
}
