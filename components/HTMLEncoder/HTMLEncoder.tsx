'use client';

import { useState } from 'react';

export default function HTMLEncoder() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const encode = () => {
    const textarea = document.createElement('textarea');
    textarea.textContent = input;
    setOutput(textarea.innerHTML);
  };

  const decode = () => {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = input;
    setOutput(textarea.value);
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
  };

  const entities = [
    { name: 'Less than', encoded: '&lt;', decoded: '<' },
    { name: 'Greater than', encoded: '&gt;', decoded: '>' },
    { name: 'Ampersand', encoded: '&amp;', decoded: '&' },
    { name: 'Quote', encoded: '&quot;', decoded: '"' },
    { name: 'Apostrophe', encoded: '&#39;', decoded: "'" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-4 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">HTML Encoder & Decoder</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">Escape HTML entities</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex gap-2 mb-4">
              <button
                onClick={encode}
                className="px-4 py-2 bg-primary-600 dark:bg-primary-500 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 text-sm font-semibold transition-colors"
              >
                Encode
              </button>
              <button
                onClick={decode}
                className="px-4 py-2 bg-gray-600 dark:bg-gray-500 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 text-sm font-semibold transition-colors"
              >
                Decode
              </button>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter HTML or text to encode/decode"
              rows={12}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-600 dark:focus:ring-primary-500 focus:border-transparent font-mono text-sm"
            />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Output</label>
              <button
                onClick={copyOutput}
                disabled={!output}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold transition-colors"
              >
                Copy
              </button>
            </div>
            <textarea
              value={output}
              readOnly
              rows={12}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 font-mono text-sm text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>

        <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Common HTML Entities</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {entities.map((entity, idx) => (
              <div key={idx} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">{entity.name}</div>
                <div className="font-mono text-sm text-gray-900 dark:text-gray-100">{entity.encoded}</div>
                <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">→ {entity.decoded}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
