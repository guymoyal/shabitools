// scripts/exportDemand.js
// Usage: node scripts/exportDemand.js   (reads the bound D1 database)
const { execSync } = require('child_process');

const DB = 'shabitools-advisor';
function q(sql) {
  const out = execSync(
    `pnpm exec wrangler d1 execute ${DB} --remote --json --command ${JSON.stringify(sql)}`,
    { encoding: 'utf8' });
  const parsed = JSON.parse(out);
  return parsed[0]?.results ?? [];
}

function main() {
  const topQuestions = q(
    'SELECT normalized_question, COUNT(*) n FROM questions GROUP BY normalized_question ORDER BY n DESC LIMIT 30');
  const gaps = q(
    "SELECT title, asin, COUNT(*) n FROM answer_cards WHERE internal_match IS NULL " +
    'GROUP BY asin ORDER BY n DESC LIMIT 30');
  const clicks = q(
    'SELECT asin, COUNT(*) n FROM clicks GROUP BY asin ORDER BY n DESC LIMIT 30');

  console.log('\n=== TOP QUESTIONS ===');
  topQuestions.forEach((r) => console.log(`${r.n}\t${r.normalized_question}`));
  console.log('\n=== CONTENT GAPS (most-shown products with NO review) ===');
  gaps.forEach((r) => console.log(`${r.n}\t${r.asin}\t${r.title}`));
  console.log('\n=== TOP CLICKED PRODUCTS ===');
  clicks.forEach((r) => console.log(`${r.n}\t${r.asin}`));
}

main();
