'use client';

import { useState } from 'react';

interface DiffLine {
  type: 'added' | 'removed' | 'unchanged';
  content: string;
  lineNumber1?: number;
  lineNumber2?: number;
}

export default function TextDiff() {
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [diff, setDiff] = useState<DiffLine[]>([]);
  const [viewMode, setViewMode] = useState<'side-by-side' | 'unified'>('side-by-side');

  const computeDiff = () => {
    if (!text1.trim() || !text2.trim()) {
      setDiff([]);
      return;
    }

    const lines1 = text1.split('\n');
    const lines2 = text2.split('\n');

    // Simple line-by-line diff
    const diffLines: DiffLine[] = [];
    const maxLen = Math.max(lines1.length, lines2.length);

    for (let i = 0; i < maxLen; i++) {
      const line1 = lines1[i];
      const line2 = lines2[i];

      if (line1 === undefined) {
        diffLines.push({ type: 'added', content: line2 || '', lineNumber2: i + 1 });
      } else if (line2 === undefined) {
        diffLines.push({ type: 'removed', content: line1, lineNumber1: i + 1 });
      } else if (line1 === line2) {
        diffLines.push({ type: 'unchanged', content: line1, lineNumber1: i + 1, lineNumber2: i + 1 });
      } else {
        diffLines.push({ type: 'removed', content: line1, lineNumber1: i + 1 });
        diffLines.push({ type: 'added', content: line2, lineNumber2: i + 1 });
      }
    }

    setDiff(diffLines);
  };

  const getLineColor = (type: string) => {
    switch (type) {
      case 'added':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300';
      case 'removed':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300';
      default:
        return 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100';
    }
  };

  const getPrefix = (type: string) => {
    switch (type) {
      case 'added':
        return '+';
      case 'removed':
        return '-';
      default:
        return ' ';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Text Diff Tool</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">Compare text files and find differences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Text 1</label>
            <textarea
              value={text1}
              onChange={(e) => setText1(e.target.value)}
              placeholder="Enter first text..."
              rows={15}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-600 dark:focus:ring-primary-500 focus:border-transparent font-mono text-sm"
            />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Text 2</label>
            <textarea
              value={text2}
              onChange={(e) => setText2(e.target.value)}
              placeholder="Enter second text..."
              rows={15}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-600 dark:focus:ring-primary-500 focus:border-transparent font-mono text-sm"
            />
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={computeDiff}
            className="px-6 py-3 bg-primary-600 dark:bg-primary-500 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 font-semibold transition-colors"
          >
            Compare Texts
          </button>
          {diff.length > 0 && (
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('side-by-side')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  viewMode === 'side-by-side'
                    ? 'bg-primary-600 dark:bg-primary-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                Side-by-Side
              </button>
              <button
                onClick={() => setViewMode('unified')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  viewMode === 'unified'
                    ? 'bg-primary-600 dark:bg-primary-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                Unified
              </button>
            </div>
          )}
        </div>

        {diff.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Differences</h2>
            
            {viewMode === 'unified' ? (
              <div className="space-y-1 max-h-96 overflow-y-auto">
                {diff.map((line, idx) => (
                  <div
                    key={idx}
                    className={`p-2 border-l-4 rounded ${getLineColor(line.type)} font-mono text-sm`}
                  >
                    <span className="mr-2 font-bold">{getPrefix(line.type)}</span>
                    {line.content || '\u00A0'}
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Text 1</h3>
                  <div className="space-y-1">
                    {diff.filter(l => l.type !== 'added').map((line, idx) => (
                      <div
                        key={idx}
                        className={`p-2 border-l-4 rounded ${getLineColor(line.type)} font-mono text-sm`}
                      >
                        <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">{line.lineNumber1}</span>
                        {line.content || '\u00A0'}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Text 2</h3>
                  <div className="space-y-1">
                    {diff.filter(l => l.type !== 'removed').map((line, idx) => (
                      <div
                        key={idx}
                        className={`p-2 border-l-4 rounded ${getLineColor(line.type)} font-mono text-sm`}
                      >
                        <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">{line.lineNumber2}</span>
                        {line.content || '\u00A0'}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="mt-4 flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700"></div>
                <span className="text-gray-600 dark:text-gray-400">Added</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700"></div>
                <span className="text-gray-600 dark:text-gray-400">Removed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600"></div>
                <span className="text-gray-600 dark:text-gray-400">Unchanged</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
