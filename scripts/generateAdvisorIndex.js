// scripts/generateAdvisorIndex.js
const fs = require('fs');
const path = require('path');

function extractAsin(url) {
  if (!url) return undefined;
  const m = String(url).match(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})/i);
  return m ? m[1].toUpperCase() : undefined;
}

/** Pure transform: reviews + categories -> CatalogEntry[] */
function buildIndex(reviews, categories) {
  const reviewEntries = reviews.map((r) => {
    const amazon = (r.affiliate || []).find((a) => a.productUrl && /amazon\./i.test(a.productUrl));
    return {
      slug: r.slug, kind: 'review', href: `/reviews/${r.slug}`, label: r.title,
      brand: r.brand, category: r.category, model: r.model,
      asin: amazon ? extractAsin(amazon.productUrl) : undefined,
    };
  });
  const categoryEntries = categories.map((c) => ({
    slug: c.slug, kind: 'category', href: `/categories/${c.slug}`,
    label: c.name, category: c.slug,
  }));
  return [...reviewEntries, ...categoryEntries];
}

function readJsonDir(dir) {
  const full = path.join(process.cwd(), 'content', dir);
  if (!fs.existsSync(full)) return [];
  return fs.readdirSync(full).filter((f) => f.endsWith('.json'))
    .map((f) => JSON.parse(fs.readFileSync(path.join(full, f), 'utf8')));
}

function main() {
  const index = buildIndex(readJsonDir('reviews'), readJsonDir('categories'));
  const out = path.join(process.cwd(), 'content', '_advisor-index.json');
  fs.writeFileSync(out, JSON.stringify(index, null, 2) + '\n');
  console.log(`advisor index: ${index.length} entries -> ${out}`);
}

module.exports = { buildIndex, extractAsin };
if (require.main === module) main();
