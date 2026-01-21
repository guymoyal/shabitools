'use client';

import { useState } from 'react';

interface PageSpeedResult {
  url: string;
  score: number;
  metrics: {
    lcp?: number;
    fid?: number;
    cls?: number;
    fcp?: number;
    tbt?: number;
    speedIndex?: number;
  };
  loading: boolean;
  error?: string;
}

export default function PageSpeedCompare() {
  const [urls, setUrls] = useState<string[]>(['', '']);
  const [device, setDevice] = useState<'mobile' | 'desktop'>('mobile');
  const [results, setResults] = useState<PageSpeedResult[]>([]);
  const [loading, setLoading] = useState(false);

  const addUrl = () => {
    setUrls([...urls, '']);
  };

  const updateUrl = (index: number, url: string) => {
    const newUrls = [...urls];
    newUrls[index] = url;
    setUrls(newUrls);
  };

  const removeUrl = (index: number) => {
    setUrls(urls.filter((_, i) => i !== index));
  };

  const testUrls = async () => {
    const validUrls = urls.filter((url) => url.trim());
    if (validUrls.length === 0) {
      alert('Please enter at least one URL');
      return;
    }

    setLoading(true);
    setResults(
      validUrls.map((url) => ({
        url,
        score: 0,
        metrics: {},
        loading: true,
      }))
    );

    const apiKey = process.env.NEXT_PUBLIC_PAGESPEED_API_KEY;

    if (!apiKey) {
      setResults(
        validUrls.map((url) => ({
          url,
          score: 0,
          metrics: {},
          loading: false,
          error: 'API key not configured. Please set NEXT_PUBLIC_PAGESPEED_API_KEY in .env.local',
        }))
      );
      setLoading(false);
      return;
    }

    const testPromises = validUrls.map(async (url, index) => {
      try {
        const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=${device}&key=${apiKey}`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.error) {
          return {
            url,
            score: 0,
            metrics: {},
            loading: false,
            error: data.error.message || 'API error',
          };
        }

        const lighthouse = data.lighthouseResult;
        const score = Math.round(lighthouse.categories.performance.score * 100);
        const audits = lighthouse.audits;

        return {
          url,
          score,
          metrics: {
            lcp: audits['largest-contentful-paint']?.numericValue,
            fid: audits['max-potential-fid']?.numericValue,
            cls: audits['cumulative-layout-shift']?.numericValue,
            fcp: audits['first-contentful-paint']?.numericValue,
            tbt: audits['total-blocking-time']?.numericValue,
            speedIndex: audits['speed-index']?.numericValue,
          },
          loading: false,
        };
      } catch (err) {
        return {
          url,
          score: 0,
          metrics: {},
          loading: false,
          error: err instanceof Error ? err.message : 'Request failed',
        };
      }
    });

    const testResults = await Promise.all(testPromises);
    setResults(testResults);
    setLoading(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 50) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Page Speed Compare</h1>
          <p className="text-lg text-gray-600">Compare performance metrics between multiple websites</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="mb-4">
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Device Type</label>
            <div className="flex gap-2">
              <button
                onClick={() => setDevice('mobile')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                  device === 'mobile'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Mobile
              </button>
              <button
                onClick={() => setDevice('desktop')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                  device === 'desktop'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Desktop
              </button>
            </div>
          </div>

          <div className="space-y-3 mb-4">
            {urls.map((url, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => updateUrl(index, e.target.value)}
                  placeholder={`URL ${index + 1} (e.g., https://example.com)`}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                />
                {urls.length > 2 && (
                  <button
                    onClick={() => removeUrl(index)}
                    className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={addUrl}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm font-semibold"
            >
              + Add URL
            </button>
            <button
              onClick={testUrls}
              disabled={loading}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              {loading ? 'Testing...' : 'Compare'}
            </button>
          </div>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {results.map((result, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{result.url}</h3>
                  {result.loading ? (
                    <div className="text-sm text-gray-600">Loading...</div>
                  ) : result.error ? (
                    <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
                      Error: {result.error}
                    </div>
                  ) : (
                    <div className={`inline-block px-4 py-2 rounded-lg text-2xl font-bold ${getScoreColor(result.score)}`}>
                      {result.score}
                    </div>
                  )}
                </div>

                {!result.loading && !result.error && (
                  <div className="space-y-2 text-sm">
                    {result.metrics.lcp && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">LCP:</span>
                        <span className="font-semibold">{(result.metrics.lcp / 1000).toFixed(2)}s</span>
                      </div>
                    )}
                    {result.metrics.fid && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">FID:</span>
                        <span className="font-semibold">{result.metrics.fid.toFixed(0)}ms</span>
                      </div>
                    )}
                    {result.metrics.cls && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">CLS:</span>
                        <span className="font-semibold">{result.metrics.cls.toFixed(3)}</span>
                      </div>
                    )}
                    {result.metrics.fcp && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">FCP:</span>
                        <span className="font-semibold">{(result.metrics.fcp / 1000).toFixed(2)}s</span>
                      </div>
                    )}
                    {result.metrics.speedIndex && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Speed Index:</span>
                        <span className="font-semibold">{(result.metrics.speedIndex / 1000).toFixed(2)}s</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
