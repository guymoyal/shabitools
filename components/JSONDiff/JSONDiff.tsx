'use client';

import { useState } from 'react';

interface DiffResult {
  added: string[];
  removed: string[];
  modified: string[];
  unchanged: string[];
}

export default function JSONDiff() {
  const [json1, setJson1] = useState('');
  const [json2, setJson2] = useState('');
  const [diff, setDiff] = useState<DiffResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const compare = () => {
    if (!json1.trim() || !json2.trim()) {
      setDiff(null);
      setError(null);
      return;
    }

    try {
      const obj1 = JSON.parse(json1);
      const obj2 = JSON.parse(json2);

      const added: string[] = [];
      const removed: string[] = [];
      const modified: string[] = [];
      const unchanged: string[] = [];

      const compareObjects = (obj1: any, obj2: any, path = '') => {
        const keys1 = new Set(Object.keys(obj1));
        const keys2 = new Set(Object.keys(obj2));

        // Find added keys
        keys2.forEach(key => {
          if (!keys1.has(key)) {
            added.push(path ? `${path}.${key}` : key);
          }
        });

        // Find removed keys
        keys1.forEach(key => {
          if (!keys2.has(key)) {
            removed.push(path ? `${path}.${key}` : key);
          }
        });

        // Compare common keys
        keys1.forEach(key => {
          if (keys2.has(key)) {
            const newPath = path ? `${path}.${key}` : key;
            const val1 = obj1[key];
            const val2 = obj2[key];

            if (typeof val1 === 'object' && typeof val2 === 'object' && val1 !== null && val2 !== null && !Array.isArray(val1) && !Array.isArray(val2)) {
              compareObjects(val1, val2, newPath);
            } else if (JSON.stringify(val1) !== JSON.stringify(val2)) {
              modified.push(newPath);
            } else {
              unchanged.push(newPath);
            }
          }
        });
      };

      compareObjects(obj1, obj2);

      setDiff({ added, removed, modified, unchanged });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON');
      setDiff(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">JSON Diff Tool</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">Compare and find differences in JSON</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">JSON 1</label>
            <textarea
              value={json1}
              onChange={(e) => setJson1(e.target.value)}
              placeholder='{"name": "John", "age": 30}'
              rows={15}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-600 dark:focus:ring-primary-500 focus:border-transparent font-mono text-sm ${
                error ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100'
              }`}
            />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">JSON 2</label>
            <textarea
              value={json2}
              onChange={(e) => setJson2(e.target.value)}
              placeholder='{"name": "Jane", "age": 25}'
              rows={15}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-600 dark:focus:ring-primary-500 focus:border-transparent font-mono text-sm ${
                error ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100'
              }`}
            />
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-700 dark:text-red-400 font-semibold">Error</p>
            <p className="text-sm text-red-600 dark:text-red-400 mt-1">{error}</p>
          </div>
        )}

        <div className="mb-6">
          <button
            onClick={compare}
            className="w-full px-6 py-3 bg-primary-600 dark:bg-primary-500 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 font-semibold transition-colors"
          >
            Compare JSON
          </button>
        </div>

        {diff && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Differences</h2>
            
            {diff.added.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-green-700 dark:text-green-400 mb-2">
                  Added ({diff.added.length})
                </h3>
                <div className="space-y-1">
                  {diff.added.map((key, idx) => (
                    <div key={idx} className="p-2 bg-green-50 dark:bg-green-900/20 rounded text-sm font-mono text-green-800 dark:text-green-300">
                      + {key}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {diff.removed.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-red-700 dark:text-red-400 mb-2">
                  Removed ({diff.removed.length})
                </h3>
                <div className="space-y-1">
                  {diff.removed.map((key, idx) => (
                    <div key={idx} className="p-2 bg-red-50 dark:bg-red-900/20 rounded text-sm font-mono text-red-800 dark:text-red-300">
                      - {key}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {diff.modified.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-yellow-700 dark:text-yellow-400 mb-2">
                  Modified ({diff.modified.length})
                </h3>
                <div className="space-y-1">
                  {diff.modified.map((key, idx) => (
                    <div key={idx} className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded text-sm font-mono text-yellow-800 dark:text-yellow-300">
                      ~ {key}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {diff.unchanged.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-400 mb-2">
                  Unchanged ({diff.unchanged.length})
                </h3>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {diff.unchanged.map((key, idx) => (
                    <div key={idx} className="p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm font-mono text-gray-600 dark:text-gray-400">
                      = {key}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {diff.added.length === 0 && diff.removed.length === 0 && diff.modified.length === 0 && (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-green-700 dark:text-green-400 font-semibold">✓ JSONs are identical</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
