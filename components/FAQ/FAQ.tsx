'use client';

import { useState } from 'react';
import { FAQData } from '@/types';

interface FAQProps {
  data: FAQData;
}

export default function FAQ({ data }: FAQProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <section className="bg-white dark:bg-gray-900 py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
            {data.title}
          </h2>
          <p className="mt-2 text-lg leading-8 text-gray-600 dark:text-gray-300">
            {data.description}
          </p>
        </div>
        <div className="mx-auto mt-12 max-w-2xl sm:mt-16 lg:mt-20 lg:max-w-4xl">
          <dl className="space-y-4">
            {data.items.map((item) => {
              const isOpen = openItems.has(item.id);
              return (
                <div
                  key={item.id}
                  className="rounded-lg bg-gray-50 dark:bg-gray-800 p-4 ring-1 ring-gray-200 dark:ring-gray-700"
                >
                  <dt>
                    <button
                      type="button"
                      className="flex w-full items-start justify-between text-left text-gray-900 dark:text-gray-100"
                      onClick={() => toggleItem(item.id)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-answer-${item.id}`}
                    >
                      <span className="text-base font-semibold leading-7 pr-4">
                        {item.question}
                      </span>
                      <span className="ml-4 flex h-7 items-center flex-shrink-0">
                        <svg
                          className={`h-6 w-6 transform transition-transform text-gray-600 dark:text-gray-400 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                          />
                        </svg>
                      </span>
                    </button>
                  </dt>
                  <dd
                    id={`faq-answer-${item.id}`}
                    className={`mt-2 ${
                      isOpen ? 'block' : 'hidden'
                    }`}
                  >
                    <p className="text-base leading-7 text-gray-600 dark:text-gray-300">
                      {item.answer}
                    </p>
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
      </div>
    </section>
  );
}
