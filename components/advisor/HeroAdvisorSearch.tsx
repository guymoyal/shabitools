// components/advisor/HeroAdvisorSearch.tsx
'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function HeroAdvisorSearch() {
  const router = useRouter();
  const [q, setQ] = useState('');
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); if (q.trim().length >= 3) router.push(`/advisor?q=${encodeURIComponent(q)}`); }}
      className="mt-6 flex gap-2"
    >
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder='Ask anything — e.g. "a good cordless drill around $300"'
        className="flex-1 rounded-lg border border-stone-300 px-4 py-3 text-base dark:border-stone-600 dark:bg-stone-800"
      />
      <button type="submit" className="rounded-lg bg-orange-600 px-5 py-3 font-semibold text-white hover:bg-orange-700">
        Ask AI
      </button>
    </form>
  );
}
