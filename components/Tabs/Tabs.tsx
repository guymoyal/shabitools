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

  return (
    <section className="bg-gray-50 py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {data.title}
          </h2>
          <p className="mt-2 text-lg leading-8 text-gray-600">
            {data.description}
          </p>
        </div>
        <div className="mx-auto mt-12 max-w-2xl sm:mt-16 lg:mt-20 lg:max-w-none">
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {data.tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-md px-4 py-2 text-sm font-semibold transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-900 hover:bg-gray-100'
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
                  href={tool.href}
                  className="group relative rounded-lg bg-white p-4 shadow-sm ring-1 ring-gray-200 hover:ring-primary-600 transition-all hover:shadow-md"
                >
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">{tool.icon}</span>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                        {tool.name}
                      </h3>
                      <p className="mt-2 text-sm text-gray-600">
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
