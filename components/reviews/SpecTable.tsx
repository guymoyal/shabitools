export default function SpecTable({ specs }: { specs: Record<string, string> }) {
  return (
    <table className="mt-8 w-full overflow-hidden rounded-xl border border-stone-200 text-sm">
      <caption className="sr-only">Technical specifications</caption>
      <tbody>
        {Object.entries(specs).map(([key, value], i) => (
          <tr key={key} className={i % 2 ? 'bg-white' : 'bg-stone-50'}>
            <th scope="row" className="w-1/3 px-4 py-3 text-left font-semibold capitalize text-stone-900">
              {key.replace(/([A-Z])/g, ' $1')}
            </th>
            <td className="px-4 py-3 text-stone-700">{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
