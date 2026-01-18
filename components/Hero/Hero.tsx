import Link from 'next/link';
import { HeroData } from '@/types';

interface HeroProps {
  data: HeroData;
}

export default function Hero({ data }: HeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-white px-4 py-16 sm:px-4 sm:py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          {data.title}
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600 sm:text-xl">
          {data.subtitle}
        </p>
        <div className="mt-8 flex items-center justify-center gap-x-4">
          <Link
            href={data.primaryCTA.href}
            className="rounded-md bg-primary-600 px-4 py-2 text-base font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 transition-colors"
          >
            {data.primaryCTA.label}
          </Link>
          <Link
            href={data.secondaryCTA.href}
            className="text-base font-semibold leading-6 text-gray-900 hover:text-primary-600 transition-colors"
          >
            {data.secondaryCTA.label} <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
      <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
        <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-12 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
          {data.features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <dt className="text-4xl mb-4">{feature.icon}</dt>
              <dt className="text-base font-semibold leading-7 text-gray-900">
                {feature.title}
              </dt>
              <dd className="mt-2 text-base leading-7 text-gray-600">
                {feature.description}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
