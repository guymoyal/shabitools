import type { ProjectStep } from '@/types/project';

export default function StepList({ steps }: { steps: ProjectStep[] }) {
  return (
    <section className="mt-10">
      <h2 className="text-2xl font-bold text-stone-900">Step-by-step</h2>
      <ol className="mt-6 space-y-8">
        {steps.map((step, i) => (
          <li key={i} id={`step-${i + 1}`} className="scroll-mt-20">
            <div className="flex items-start gap-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-stone-900 font-bold text-white">
                {i + 1}
              </span>
              <div>
                <h3 className="text-xl font-semibold text-stone-900">{step.name}</h3>
                <p className="mt-2 leading-relaxed text-stone-700">{step.text}</p>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
