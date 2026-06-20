// components/advisor/AdvisorApp.tsx
'use client';
import { useEffect, useState } from 'react';
import type { Answer } from '@/lib/advisor/types';
import AnswerView from './AnswerView';

type State =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'result'; answer: Answer }
  | { status: 'error'; message: string };

export default function AdvisorApp({ initialQuestion = '' }: { initialQuestion?: string }) {
  const [q, setQ] = useState(initialQuestion);
  const [state, setState] = useState<State>({ status: 'idle' });

  async function ask(question: string) {
    if (question.trim().length < 3) return;
    setState({ status: 'loading' });
    try {
      const res = await fetch('/api/advisor', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ question }),
      });
      if (res.status === 429) return setState({ status: 'error', message: 'Too many questions — try again in a minute.' });
      if (!res.ok) throw new Error('request failed');
      setState({ status: 'result', answer: await res.json() });
    } catch {
      setState({ status: 'error', message: 'Something went wrong. Please try again.' });
    }
  }

  // Auto-run when arriving from the homepage hero with ?q= (reads URL client-side for static export)
  useEffect(() => {
    const fromProp = initialQuestion.trim();
    const fromUrl = typeof window !== 'undefined'
      ? (new URLSearchParams(window.location.search).get('q') ?? '').trim() : '';
    const q0 = fromProp.length >= 3 ? fromProp : fromUrl;
    if (q0.length >= 3) { setQ(q0); ask(q0); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <form
        onSubmit={(e) => { e.preventDefault(); ask(q); }}
        className="flex gap-2"
      >
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="e.g. a good cordless drill around $300"
          className="flex-1 rounded-lg border border-stone-300 px-4 py-3 text-base dark:border-stone-600 dark:bg-stone-800"
        />
        <button type="submit" className="rounded-lg bg-orange-600 px-5 py-3 font-semibold text-white hover:bg-orange-700">
          Ask
        </button>
      </form>

      {state.status === 'loading' && <p className="mt-6 animate-pulse text-stone-500">Finding the best options&hellip;</p>}
      {state.status === 'error' && <p className="mt-6 text-red-600">{state.message}</p>}
      {state.status === 'result' && <AnswerView answer={state.answer} />}
    </div>
  );
}
