'use client';

import { useState } from 'react';
import Link from 'next/link';
import { TabsData, Tab } from '@/types';

interface TabsProps {
  data: TabsData;
}

export default function Tabs({ data }: TabsProps) {
  const [activeTab, setActiveTab] = useState<string>(data.tabs[0]?.id || '');

  const currentTab: Tab | undefined = data.tabs.find((tab) => tab.id === activeTab);

  const getTabColor = (id: string) => {
    if (id === 'developers') return 'bg-blue-500';
    if (id === 'designers') return 'bg-purple-500';
    if (id === 'general') return 'bg-green-500';
    return 'bg-gray-500';
  };

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
            {data.title}
          </h2>
          <p className="mt-2 text-lg leading-8 text-gray-600 dark:text-gray-300">
            {data.description}
          </p>
        </div>
        <div className="mx-auto mt-12 max-w-2xl sm:mt-16 lg:mt-20 lg:max-w-none">
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {data.tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-full px-6 py-2.5 text-sm font-semibold transition-all ${
                  activeTab === tab.id
                    ? `${getTabColor(tab.id)} text-white shadow-lg scale-105`
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                }`}
                aria-pressed={activeTab === tab.id}
              >
                {tab.label}
              </button>
            ))}
          </div>
          {currentTab && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {currentTab.tools.map((tool, index) => (
                <Link
                  key={index}
                  href={tool.link}
                  className="group relative rounded-xl bg-white dark:bg-gray-800 p-5 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 hover:ring-primary-600 dark:hover:ring-primary-500 transition-all hover:shadow-lg hover:-translate-y-0.5"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-4xl group-hover:scale-110 transition-transform">{tool.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {tool.title}
                      </h3>
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                        {tool.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}