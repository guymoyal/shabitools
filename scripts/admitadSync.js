#!/usr/bin/env node
/**
 * Fill CPA deeplinks into content JSON via the official Admitad API.
 * Looks for affiliate entries shaped {merchant, url, campaignId, productUrl}
 * in content/reviews/*.json (top-level `affiliate`) and content/guides/*.json
 * (`picks[].affiliate`) and regenerates `url` for every entry that has
 * campaignId + productUrl.
 *
 * Env: ADMITAD_BASE64_HEADER (base64 of client_id:client_secret),
 *      ADMITAD_CLIENT_ID, ADMITAD_API_URL, ADMITAD_WEBSITE_ID.
 * Usage: pnpm admitad:sync   (then commit the changed content files)
 */
const fs = require('fs');
const path = require('path');
require('dotenv').config();
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const API = process.env.ADMITAD_API_URL || 'https://api.admitad.com';

async function getToken() {
  const res = await fetch(`${API}/token/`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${process.env.ADMITAD_BASE64_HEADER}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: process.env.ADMITAD_CLIENT_ID,
      scope: 'deeplink_generator',
    }),
  });
  if (!res.ok) throw new Error(`token ${res.status}: ${(await res.text()).slice(0, 200)}`);
  return (await res.json()).access_token;
}

async function fetchDeeplink(token, websiteId, campaignId, productUrl) {
  const url = `${API}/deeplink/${websiteId}/advcampaign/${campaignId}/?ulp=${encodeURIComponent(productUrl)}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error(`deeplink ${campaignId} ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const data = await res.json();
  const link = Array.isArray(data) ? data[0] : data?.deeplink?.[0] ?? data?.deeplink;
  if (typeof link !== 'string') throw new Error(`unexpected deeplink payload for ${campaignId}`);
  return link;
}

/** Pure transform: walks affiliate arrays (top-level and inside picks[]). */
async function fillAffiliateUrls(doc, deeplinkFor) {
  let changed = 0;
  const fill = async (entry) => {
    if (entry && entry.campaignId && entry.productUrl) {
      entry.url = await deeplinkFor(entry.campaignId, entry.productUrl);
      changed += 1;
    }
  };
  if (Array.isArray(doc.affiliate)) for (const e of doc.affiliate) await fill(e);
  if (Array.isArray(doc.picks)) for (const p of doc.picks) await fill(p.affiliate);
  return { updated: doc, changed };
}

module.exports = { fillAffiliateUrls };

if (require.main === module) {
  (async () => {
    const websiteId = process.env.ADMITAD_WEBSITE_ID;
    if (!websiteId) throw new Error('Set ADMITAD_WEBSITE_ID (ad-space id)');
    const token = await getToken();
    const deeplinkFor = (cid, ulp) => fetchDeeplink(token, websiteId, cid, ulp);
    let total = 0;
    for (const dir of ['reviews', 'guides']) {
      const full = path.join(__dirname, '..', 'content', dir);
      if (!fs.existsSync(full)) continue;
      for (const f of fs.readdirSync(full).filter((x) => x.endsWith('.json'))) {
        const file = path.join(full, f);
        const doc = JSON.parse(fs.readFileSync(file, 'utf8'));
        const { updated, changed } = await fillAffiliateUrls(doc, deeplinkFor);
        if (changed) {
          fs.writeFileSync(file, JSON.stringify(updated, null, 2) + '\n');
          total += changed;
          console.log(`[admitad-sync] ${dir}/${f}: ${changed} link(s)`);
        }
      }
    }
    console.log(`[admitad-sync] done — ${total} deeplink(s) filled`);
  })().catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
}
