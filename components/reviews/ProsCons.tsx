export default function ProsCons({ pros, cons }: { pros: string[]; cons: string[] }) {
  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2">
      <div className="rounded-xl border border-green-200 bg-green-50 p-5">
        <h3 className="font-bold text-green-900">Pros</h3>
        <ul className="mt-3 space-y-2">
          {pros.map((p) => (
            <li key={p} className="flex gap-2 text-sm text-green-900">
              <span aria-hidden>✓</span> {p}
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-xl border border-red-200 bg-red-50 p-5">
        <h3 className="font-bold text-red-900">Cons</h3>
        <ul className="mt-3 space-y-2">
          {cons.map((c) => (
            <li key={c} className="flex gap-2 text-sm text-red-900">
              <span aria-hidden>✗</span> {c}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
