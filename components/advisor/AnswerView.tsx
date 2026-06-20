// components/advisor/AnswerView.tsx
import type { Answer } from '@/lib/advisor/types';
import ProductCard from './ProductCard';

export default function AnswerView({ answer }: { answer: Answer }) {
  return (
    <div className="mt-6">
      <p className="text-base text-stone-700 dark:text-stone-200">{answer.intro}</p>
      {answer.groups.map((group) => (
        <section key={group.label} className="mt-6">
          {answer.groups.length > 1 && (
            <h2 className="mb-3 text-lg font-bold text-stone-900 dark:text-stone-100">{group.label}</h2>
          )}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {group.cards.map((card) => <ProductCard key={card.asin} card={card} />)}
          </div>
        </section>
      ))}
      <p className="mt-6 text-xs text-stone-400">
        As an Amazon Associate we earn from qualifying purchases. Prices and availability are accurate as of the time shown and subject to change.
      </p>
    </div>
  );
}
