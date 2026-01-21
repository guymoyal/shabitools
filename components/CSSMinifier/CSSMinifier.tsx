'use client';

import { useState } from 'react';

function minifyCSS(css: string): string {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/\s*{\s*/g, '{') // Remove spaces around {
    .replace(/;\s*}/g, '}') // Remove semicolon before }
    .replace(/\s*:\s*/g, ':') // Remove spaces around :
    .replace(/\s*;\s*/g, ';') // Remove spaces around ;
    .replace(/\s*,\s*/g, ',') // Remove spaces around ,
    .replace(/\s*>\s*/g, '>') // Remove spaces around >
    .replace(/\s*\+\s*/g, '+') // Remove spaces around +
    .replace(/\s*~\s*/g, '~') // Remove spaces around ~
    .replace(/;\s*}/g, '}') // Remove semicolon before closing brace
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim();
}

export default function CSSMinifier() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [originalSize, setOriginalSize] = useState(0);
  const [minifiedSize, setMinifiedSize] = useState(0);

  const handleMinify = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    const minified = minifyCSS(input);
    setOutput(minified);
    setOriginalSize(new Blob([input]).size);
    setMinifiedSize(new Blob([minified]).size);
  };

  const savings = originalSize > 0 ? originalSize - minifiedSize : 0;
  const savingsPercent = originalSize > 0 ? Math.round((savings / originalSize) * 100) : 0;

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
  };

  const download = () => {
    const blob = new Blob([output], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'minified.css';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">CSS Minifier & Optimizer</h1>
          <p className="text-lg text-gray-600">Minify and optimize CSS code</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-semibold text-gray-700">CSS Input</label>
              <button
                onClick={handleMinify}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-semibold"
              >
                Minify
              </button>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your CSS here..."
              rows={20}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent font-mono text-sm"
            />
            {originalSize > 0 && (
              <div className="mt-2 text-sm text-gray-600">
                Original size: {originalSize} bytes
              </div>
            )}
          </div>

          {/* Output */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-semibold text-gray-700">Minified Output</label>
              <div className="flex gap-2">
                <button
                  onClick={copyOutput}
                  disabled={!output}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold"
                >
                  Copy
                </button>
                <button
                  onClick={download}
                  disabled={!output}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold"
                >
                  Download
                </button>
              </div>
            </div>
            <textarea
              value={output}
              readOnly
              rows={20}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
            />
            {minifiedSize > 0 && (
              <div className="mt-2 space-y-1">
                <div className="text-sm text-gray-600">
                  Minified size: {minifiedSize} bytes
                </div>
                <div className="text-sm font-semibold text-green-600">
                  Savings: {savings} bytes ({savingsPercent}%)
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
