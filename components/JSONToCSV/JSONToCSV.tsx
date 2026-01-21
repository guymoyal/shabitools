'use client';

import { useState } from 'react';

export default function JSONToCSV() {
  const [jsonInput, setJsonInput] = useState('');
  const [csvOutput, setCsvOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [delimiter, setDelimiter] = useState(',');
  const [includeHeaders, setIncludeHeaders] = useState(true);

  const flattenObject = (obj: any, prefix = ''): Record<string, any> => {
    const flattened: Record<string, any> = {};
    
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const newKey = prefix ? `${prefix}.${key}` : key;
        
        if (obj[key] === null || obj[key] === undefined) {
          flattened[newKey] = '';
        } else if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
          Object.assign(flattened, flattenObject(obj[key], newKey));
        } else if (Array.isArray(obj[key])) {
          flattened[newKey] = obj[key].join('; ');
        } else {
          flattened[newKey] = obj[key];
        }
      }
    }
    
    return flattened;
  };

  const convert = () => {
    if (!jsonInput.trim()) {
      setCsvOutput('');
      setError(null);
      return;
    }

    try {
      const parsed = JSON.parse(jsonInput);
      let data: any[] = [];

      if (Array.isArray(parsed)) {
        data = parsed;
      } else if (typeof parsed === 'object') {
        data = [parsed];
      } else {
        throw new Error('JSON must be an object or array');
      }

      if (data.length === 0) {
        throw new Error('JSON array is empty');
      }

      // Flatten all objects
      const flattenedData = data.map(item => flattenObject(item));
      
      // Get all unique keys
      const allKeys = new Set<string>();
      flattenedData.forEach(item => {
        Object.keys(item).forEach(key => allKeys.add(key));
      });
      
      const headers = Array.from(allKeys);

      // Build CSV
      let csv = '';

      // Add headers
      if (includeHeaders) {
        csv += headers.map(h => escapeCSV(h)).join(delimiter) + '\n';
      }

      // Add rows
      flattenedData.forEach(row => {
        const values = headers.map(header => {
          const value = row[header];
          return escapeCSV(value !== undefined && value !== null ? String(value) : '');
        });
        csv += values.join(delimiter) + '\n';
      });

      setCsvOutput(csv.trim());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON');
      setCsvOutput('');
    }
  };

  const escapeCSV = (value: string): string => {
    if (value.includes(delimiter) || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(csvOutput);
  };

  const downloadCSV = () => {
    const blob = new Blob([csvOutput], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'output.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">JSON to CSV Converter</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">Convert JSON data to CSV format</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">JSON Input</label>
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-600 dark:text-gray-400">Delimiter:</label>
                <select
                  value={delimiter}
                  onChange={(e) => setDelimiter(e.target.value)}
                  className="text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value=",">Comma (,)</option>
                  <option value=";">Semicolon (;)</option>
                  <option value="\t">Tab</option>
                </select>
              </div>
            </div>
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder='[{"name": "John", "age": 30}, {"name": "Jane", "age": 25}]'
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
            <div className="mt-4 flex items-center gap-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={includeHeaders}
                  onChange={(e) => setIncludeHeaders(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Include headers</span>
              </label>
            </div>
            <button
              onClick={convert}
              className="mt-4 w-full px-6 py-3 bg-primary-600 dark:bg-primary-500 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 font-semibold transition-colors"
            >
              Convert to CSV
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">CSV Output</label>
              <div className="flex gap-2">
                <button
                  onClick={copyOutput}
                  disabled={!csvOutput}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold transition-colors"
                >
                  Copy
                </button>
                <button
                  onClick={downloadCSV}
                  disabled={!csvOutput}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold transition-colors"
                >
                  Download
                </button>
              </div>
            </div>
            <textarea
              value={csvOutput}
              readOnly
              rows={20}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 font-mono text-sm text-gray-900 dark:text-gray-100"
            />
            {csvOutput && (
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {csvOutput.split('\n').length} rows, {csvOutput.split('\n')[0]?.split(delimiter).length || 0} columns
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
