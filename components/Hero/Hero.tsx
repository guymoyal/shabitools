import Link from 'next/link';
import { HeroData } from '@/types';

interface HeroProps {
  data: HeroData;
}

export default function Hero({ data }: HeroProps) {
  return (
            <section className="relative isolate overflow-hidden bg-gradient-to-br from-white via-blue-50/50 to-purple-50/50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 px-4 py-8 sm:px-4 sm:py-12 lg:px-8 lg:py-16">
              <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-200/20 via-transparent to-purple-200/20 dark:from-primary-900/10 dark:via-transparent dark:to-purple-900/10"></div>
              <div className="mx-auto max-w-4xl text-center">
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary-600 via-purple-600 to-primary-600 bg-clip-text text-transparent dark:from-primary-400 dark:via-purple-400 dark:to-primary-400 sm:text-5xl">
                  {data.title}
                </h1>
                <p className="mt-4 text-base leading-7 text-gray-700 dark:text-gray-300 sm:text-lg font-medium">
                  {data.subtitle}
                </p>
                <div className="mt-6 flex items-center justify-center gap-x-6">
                  <Link
                    href={data.primaryCTA.href}
                    className="rounded-full bg-gradient-to-r from-primary-600 to-purple-600 dark:from-primary-500 dark:to-purple-500 px-8 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 dark:focus-visible:outline-primary-500 transition-all"
                  >
                    {data.primaryCTA.label}
                  </Link>
                  <Link
                    href={data.secondaryCTA.href}
                    className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors group"
                  >
                    {data.secondaryCTA.label} <span aria-hidden="true" className="inline-block group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
      </div>
      <div className="mx-auto mt-8 max-w-2xl sm:mt-10 lg:mt-12 lg:max-w-4xl">
        <dl className="grid max-w-xl grid-cols-1 gap-x-6 gap-y-8 lg:max-w-none lg:grid-cols-3 lg:gap-y-10">
          {data.features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <dt className="text-4xl mb-4">{feature.icon}</dt>
              <dt className="text-base font-semibold leading-7 text-gray-900 dark:text-gray-100">
                {feature.title}
              </dt>
              <dd className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-300">
                {feature.description}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
