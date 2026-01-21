'use client';

import { useState } from 'react';

interface ParsedURL {
  href: string;
  protocol: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
  origin: string;
  host: string;
  params: Array<{ key: string; value: string }>;
  isValid: boolean;
  seoScore: number;
  seoIssues: string[];
}

export default function URLParser() {
  const [url, setUrl] = useState('');
  const [parsed, setParsed] = useState<ParsedURL | null>(null);

  const parseURL = () => {
    if (!url.trim()) {
      setParsed(null);
      return;
    }

    try {
      let urlToParse = url;
      if (!urlToParse.startsWith('http://') && !urlToParse.startsWith('https://')) {
        urlToParse = 'https://' + urlToParse;
      }

      const urlObj = new URL(urlToParse);
      const params: Array<{ key: string; value: string }> = [];
      urlObj.searchParams.forEach((value, key) => {
        params.push({ key, value });
      });

      // SEO Analysis
      const seoIssues: string[] = [];
      let seoScore = 100;

      // Check for uppercase
      if (urlObj.pathname !== urlObj.pathname.toLowerCase()) {
        seoIssues.push('URL contains uppercase letters (use lowercase)');
        seoScore -= 10;
      }

      // Check for underscores
      if (urlObj.pathname.includes('_')) {
        seoIssues.push('URL contains underscores (use hyphens instead)');
        seoScore -= 5;
      }

      // Check length
      if (urlObj.pathname.length > 100) {
        seoIssues.push('URL path is too long (keep under 100 characters)');
        seoScore -= 10;
      }

      // Check for special characters
      if (/[^a-z0-9\-/]/.test(urlObj.pathname.toLowerCase())) {
        seoIssues.push('URL contains special characters (avoid when possible)');
        seoScore -= 5;
      }

      // Check for multiple slashes
      if (urlObj.pathname.includes('//')) {
        seoIssues.push('URL contains multiple consecutive slashes');
        seoScore -= 5;
      }

      // Check for trailing slash (optional, but consistent)
      if (urlObj.pathname.length > 1 && urlObj.pathname.endsWith('/')) {
        seoIssues.push('URL has trailing slash (be consistent)');
        seoScore -= 2;
      }

      setParsed({
        href: urlObj.href,
        protocol: urlObj.protocol,
        hostname: urlObj.hostname,
        port: urlObj.port || '(default)',
        pathname: urlObj.pathname,
        search: urlObj.search,
        hash: urlObj.hash,
        origin: urlObj.origin,
        host: urlObj.host,
        params,
        isValid: true,
        seoScore: Math.max(0, seoScore),
        seoIssues,
      });
    } catch (error) {
      setParsed({
        href: url,
        protocol: '',
        hostname: '',
        port: '',
        pathname: '',
        search: '',
        hash: '',
        origin: '',
        host: '',
        params: [],
        isValid: false,
        seoScore: 0,
        seoIssues: ['Invalid URL format'],
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-4 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">URL Parser & Analyzer</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">Parse and analyze URLs</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && parseURL()}
                  placeholder="https://example.com/path?param=value"
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-600 dark:focus:ring-primary-500 focus:border-transparent font-mono"
                />
                <button
                  onClick={parseURL}
                  className="px-6 py-2 bg-primary-600 dark:bg-primary-500 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 font-semibold transition-colors"
                >
                  Parse
                </button>
              </div>
            </div>

            {parsed && (
              <div className="mt-6 space-y-4">
                {!parsed.isValid ? (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-red-700 dark:text-red-400 font-semibold">Invalid URL</p>
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">Please enter a valid URL</p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Protocol</div>
                        <div className="font-mono text-sm font-semibold text-gray-900 dark:text-gray-100">{parsed.protocol}</div>
                      </div>
                      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Hostname</div>
                        <div className="font-mono text-sm font-semibold text-gray-900 dark:text-gray-100">{parsed.hostname}</div>
                      </div>
                      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Port</div>
                        <div className="font-mono text-sm font-semibold text-gray-900 dark:text-gray-100">{parsed.port}</div>
                      </div>
                      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Pathname</div>
                        <div className="font-mono text-sm font-semibold text-gray-900 dark:text-gray-100 break-all">{parsed.pathname || '/'}</div>
                      </div>
                      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Search (Query)</div>
                        <div className="font-mono text-sm font-semibold text-gray-900 dark:text-gray-100">{parsed.search || '(none)'}</div>
                      </div>
                      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Hash (Fragment)</div>
                        <div className="font-mono text-sm font-semibold text-gray-900 dark:text-gray-100">{parsed.hash || '(none)'}</div>
                      </div>
                    </div>

                    {parsed.params.length > 0 && (
                      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Query Parameters</div>
                        <div className="space-y-2">
                          {parsed.params.map((param, idx) => (
                            <div key={idx} className="flex items-center gap-4">
                              <span className="font-mono text-sm text-gray-700 dark:text-gray-300 font-semibold">{param.key}</span>
                              <span className="text-gray-500 dark:text-gray-400">=</span>
                              <span className="font-mono text-sm text-gray-900 dark:text-gray-100 flex-1 break-all">{param.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">Full URL</div>
                      <div className="font-mono text-sm text-gray-900 dark:text-gray-100 break-all">{parsed.href}</div>
                    </div>

                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">SEO Score</div>
                        <div className={`text-2xl font-bold ${
                          parsed.seoScore >= 90 ? 'text-green-600 dark:text-green-400' :
                          parsed.seoScore >= 70 ? 'text-yellow-600 dark:text-yellow-400' :
                          'text-red-600 dark:text-red-400'
                        }`}>
                          {parsed.seoScore}/100
                        </div>
                      </div>
                      {parsed.seoIssues.length > 0 ? (
                        <div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">Issues Found:</div>
                          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
                            {parsed.seoIssues.map((issue, idx) => (
                              <li key={idx}>{issue}</li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <div className="text-sm text-green-700 dark:text-green-400">✓ URL follows SEO best practices</div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
