// lib/advisor/orchestrate.ts
import type { Answer, Card, CardGroup, CatalogEntry, Plan, RawProduct, SearchGroup } from './types';
import { answerHashFor } from './normalize';
import { asinUrl } from './amazon';
import { matchInternal } from './internalMatch';
import type { WriteResult } from './deepseek';

export interface OrchestrateDeps {
  plan: (question: string) => Promise<Plan>;
  search: (group: SearchGroup) => Promise<RawProduct[]>;
  write: (question: string, products: RawProduct[]) => Promise<WriteResult>;
  catalog: CatalogEntry[];
  tag: string;
}

export async function buildAnswer(question: string, deps: OrchestrateDeps): Promise<Answer> {
  const plan = await deps.plan(question);

  // Fetch products per group (sequential to respect PA-API rate limits).
  const groupProducts: { group: SearchGroup; products: RawProduct[] }[] = [];
  for (const group of plan.groups) {
    try {
      groupProducts.push({ group, products: await deps.search(group) });
    } catch {
      groupProducts.push({ group, products: [] }); // a failed group yields no cards, never crashes
    }
  }

  const allProducts = groupProducts.flatMap((g) => g.products);
  const written = allProducts.length
    ? await deps.write(question, allProducts)
    : { intro: 'I could not find good matches for that — try rephrasing or adding a budget.', picks: [] };

  const whyByAsin = new Map(written.picks.map((p) => [p.asin, p.why]));

  const groups: CardGroup[] = groupProducts.map(({ group, products }) => {
    const cards: Card[] = products
      .filter((p) => whyByAsin.has(p.asin)) // only products the writer chose
      .map((p, idx) => {
        const m = matchInternal(p, deps.catalog);
        return {
          groupLabel: group.label,
          asin: p.asin,
          title: p.title,
          imageUrl: p.imageUrl,
          price: p.price,
          currency: p.currency,
          rating: p.rating,
          why: whyByAsin.get(p.asin) ?? '',
          affiliateUrl: asinUrl(p.asin, deps.tag),
          internalHref: m?.href ?? null,
          internalLabel: m?.label ?? null,
          position: idx,
        } as Card;
      });
    return { label: group.label, totalEstimate: null, cards };
  }).filter((g) => g.cards.length > 0);

  return { question, answerHash: answerHashFor(question), intent: plan.intent, intro: written.intro, groups };
}
