'use client';

import { useState } from 'react';

export default function YAMLFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [indentSize, setIndentSize] = useState(2);

  const formatYAML = () => {
    if (!input.trim()) {
      setOutput('');
      setError(null);
      return;
    }

    try {
      // Basic YAML formatting (indentation-based)
      const lines = input.split('\n');
      let indentLevel = 0;
      const formatted: string[] = [];

      lines.forEach((line) => {
        const trimmed = line.trim();
        if (!trimmed) {
          formatted.push('');
          return;
        }

        // Decrease indent for closing items
        if (trimmed.startsWith('-') || trimmed.includes(':')) {
          // Check if this is a new top-level item
          if (trimmed.match(/^[a-zA-Z0-9_-]+:/)) {
            indentLevel = 0;
          }
        }

        formatted.push(' '.repeat(indentLevel * indentSize) + trimmed);

        // Increase indent for nested items
        if (trimmed.endsWith(':')) {
          indentLevel++;
        }
      });

      setOutput(formatted.join('\n'));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Formatting failed');
      setOutput('');
    }
  };

  const validateYAML = () => {
    try {
      // Try to parse as JSON first (YAML is a superset)
      const json = JSON.parse(input);
      setError(null);
      return true;
    } catch {
      // Basic YAML validation
      const lines = input.split('\n');
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        // Check for common YAML errors
        if (line.includes(':') && line.split(':').length > 2 && !line.includes('"')) {
          setError(`Potential syntax error at line ${i + 1}`);
          return false;
        }
      }
      setError(null);
      return true;
    }
  };

  const convertToJSON = () => {
    try {
      // Simple YAML to JSON conversion (basic)
      const json = JSON.parse(input.replace(/:/g, '":').replace(/^/gm, '"').replace(/$/gm, '"'));
      setOutput(JSON.stringify(json, null, indentSize));
      setError(null);
    } catch (err) {
      setError('Conversion failed. YAML may be too complex for automatic conversion.');
    }
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">YAML Formatter & Validator</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">Format and validate YAML files</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">YAML Input</label>
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-600 dark:text-gray-400">Indent:</label>
                <select
                  value={indentSize}
                  onChange={(e) => setIndentSize(Number(e.target.value))}
                  className="text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value={2}>2 spaces</option>
                  <option value={4}>4 spaces</option>
                </select>
              </div>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your YAML here..."
              rows={20}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-600 dark:focus:ring-primary-500 focus:border-transparent font-mono text-sm ${
                error ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100'
              }`}
            />
            {error && (
              <div className="mt-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded">
                {error}
              </div>
            )}
            <div className="flex gap-2 mt-4">
              <button
                onClick={formatYAML}
                className="px-4 py-2 bg-primary-600 dark:bg-primary-500 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 text-sm font-semibold transition-colors"
              >
                Format
              </button>
              <button
                onClick={validateYAML}
                className="px-4 py-2 bg-gray-600 dark:bg-gray-500 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 text-sm font-semibold transition-colors"
              >
                Validate
              </button>
              <button
                onClick={convertToJSON}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 text-sm font-semibold transition-colors"
              >
                To JSON
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Formatted Output</label>
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
              rows={20}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 font-mono text-sm text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
