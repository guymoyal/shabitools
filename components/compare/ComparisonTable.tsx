import type { Compare } from '@/types/compare';

export default function ComparisonTable({ compare }: { compare: Compare }) {
  const mark = (adv: string | undefined, side: 'a' | 'b') =>
    adv === side ? 'font-semibold text-green-800 bg-green-50' : 'text-stone-700';
  return (
    <div className="mt-8 overflow-x-auto">
      <table className="w-full min-w-[480px] overflow-hidden rounded-xl border border-stone-200 text-sm">
        <thead>
          <tr className="bg-stone-900 text-left text-white">
            <th className="px-4 py-3">Spec</th>
            <th className="px-4 py-3">{compare.productA.name}</th>
            <th className="px-4 py-3">{compare.productB.name}</th>
          </tr>
        </thead>
        <tbody>
          {compare.rows.map((row, i) => (
            <tr key={row.label} className={i % 2 ? 'bg-white' : 'bg-stone-50'}>
              <th scope="row" className="px-4 py-3 text-left font-semibold text-stone-900">
                {row.label}
              </th>
              <td className={`px-4 py-3 ${mark(row.advantage, 'a')}`}>{row.a}</td>
              <td className={`px-4 py-3 ${mark(row.advantage, 'b')}`}>{row.b}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
