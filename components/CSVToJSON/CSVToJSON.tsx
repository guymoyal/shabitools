'use client';

import { useState } from 'react';

export default function CSVToJSON() {
  const [csvInput, setCsvInput] = useState('');
  const [jsonOutput, setJsonOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [delimiter, setDelimiter] = useState(',');
  const [hasHeaders, setHasHeaders] = useState(true);

  const convert = () => {
    if (!csvInput.trim()) {
      setJsonOutput('');
      setError(null);
      return;
    }

    try {
      const lines = csvInput.trim().split('\n');
      if (lines.length === 0) {
        throw new Error('CSV is empty');
      }

      // Detect delimiter if auto
      let detectedDelimiter = delimiter;
      if (delimiter === 'auto') {
        const firstLine = lines[0];
        if (firstLine.includes(',')) detectedDelimiter = ',';
        else if (firstLine.includes(';')) detectedDelimiter = ';';
        else if (firstLine.includes('\t')) detectedDelimiter = '\t';
        else detectedDelimiter = ',';
      }

      // Parse CSV
      const parseCSVLine = (line: string): string[] => {
        const result: string[] = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          const nextChar = line[i + 1];

          if (char === '"') {
            if (inQuotes && nextChar === '"') {
              current += '"';
              i++;
            } else {
              inQuotes = !inQuotes;
            }
          } else if (char === detectedDelimiter && !inQuotes) {
            result.push(current.trim());
            current = '';
          } else {
            current += char;
          }
        }
        result.push(current.trim());
        return result;
      };

      const parsedLines = lines.map(line => parseCSVLine(line));
      
      let headers: string[] = [];
      let dataLines = parsedLines;

      if (hasHeaders && parsedLines.length > 0) {
        headers = parsedLines[0];
        dataLines = parsedLines.slice(1);
      } else {
        headers = parsedLines[0].map((_, i) => `column${i + 1}`);
      }

      // Convert to JSON
      const jsonArray = dataLines.map(line => {
        const obj: Record<string, any> = {};
        headers.forEach((header, index) => {
          let value: any = line[index] || '';
          
          // Try to parse as number
          if (value !== '' && !isNaN(Number(value)) && value.trim() !== '') {
            value = Number(value);
          }
          // Try to parse as boolean
          else if (value.toLowerCase() === 'true') {
            value = true;
          } else if (value.toLowerCase() === 'false') {
            value = false;
          }
          // Try to parse as null
          else if (value.toLowerCase() === 'null' || value === '') {
            value = null;
          }

          obj[header] = value;
        });
        return obj;
      });

      setJsonOutput(JSON.stringify(jsonArray, null, 2));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid CSV');
      setJsonOutput('');
    }
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(jsonOutput);
  };

  const downloadJSON = () => {
    const blob = new Blob([jsonOutput], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'output.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">CSV to JSON Converter</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">Convert CSV files to JSON format</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">CSV Input</label>
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-600 dark:text-gray-400">Delimiter:</label>
                <select
                  value={delimiter}
                  onChange={(e) => setDelimiter(e.target.value)}
                  className="text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="auto">Auto-detect</option>
                  <option value=",">Comma (,)</option>
                  <option value=";">Semicolon (;)</option>
                  <option value="\t">Tab</option>
                </select>
              </div>
            </div>
            <textarea
              value={csvInput}
              onChange={(e) => setCsvInput(e.target.value)}
              placeholder="name,age,city&#10;John,30,New York&#10;Jane,25,London"
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
                  checked={hasHeaders}
                  onChange={(e) => setHasHeaders(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">First row contains headers</span>
              </label>
            </div>
            <button
              onClick={convert}
              className="mt-4 w-full px-6 py-3 bg-primary-600 dark:bg-primary-500 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 font-semibold transition-colors"
            >
              Convert to JSON
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">JSON Output</label>
              <div className="flex gap-2">
                <button
                  onClick={copyOutput}
                  disabled={!jsonOutput}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold transition-colors"
                >
                  Copy
                </button>
                <button
                  onClick={downloadJSON}
                  disabled={!jsonOutput}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold transition-colors"
                >
                  Download
                </button>
              </div>
            </div>
            <textarea
              value={jsonOutput}
              readOnly
              rows={20}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 font-mono text-sm text-gray-900 dark:text-gray-100"
            />
            {jsonOutput && (
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {JSON.parse(jsonOutput).length} objects converted
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
