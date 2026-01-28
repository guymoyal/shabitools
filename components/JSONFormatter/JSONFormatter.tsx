'use client';

import { useState, useEffect } from 'react';

interface ValidationResult {
  valid: boolean;
  error?: {
    message: string;
    line?: number;
    column?: number;
  };
  formatted?: string;
  minified?: string;
}

export default function JSONFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [validation, setValidation] = useState<ValidationResult>({ valid: true });
  const [indentSize, setIndentSize] = useState(2);
  const [showTree, setShowTree] = useState(false);
  const [treeData, setTreeData] = useState<any>(null);

  useEffect(() => {
    validateAndFormat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, indentSize]);

  const validateAndFormat = () => {
    if (!input.trim()) {
      setValidation({ valid: true });
      setOutput('');
      setTreeData(null);
      return;
    }

    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, indentSize);
      const minified = JSON.stringify(parsed);
      
      setOutput(formatted);
      setValidation({
        valid: true,
        formatted,
        minified,
      });
      setTreeData(parsed);
    } catch (err) {
      const error = err as Error;
      const message = error.message;
      let line: number | undefined;
      let column: number | undefined;

      // Try to extract line/column from error message
      const lineMatch = message.match(/position (\d+)/);
      if (lineMatch) {
        const pos = parseInt(lineMatch[1]);
        const beforeError = input.substring(0, pos);
        line = beforeError.split('\n').length;
        column = beforeError.split('\n').pop()?.length || 0;
      }

      setValidation({
        valid: false,
        error: {
          message,
          line,
          column,
        },
      });
      setOutput('');
      setTreeData(null);
    }
  };

  const format = () => {
    if (validation.valid && validation.formatted) {
      setInput(validation.formatted);
    }
  };

  const minify = () => {
    if (validation.valid && validation.minified) {
      setInput(validation.minified);
    }
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output || input);
  };

  const download = () => {
    const blob = new Blob([output || input], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const loadExample = (example: string) => {
    setInput(example);
  };

  const renderTree = (data: any, level = 0): JSX.Element => {
    if (data === null) return <span className="text-gray-500 dark:text-gray-400">null</span>;
    if (typeof data === 'string') return <span className="text-green-600 dark:text-green-400">&quot;{data}&quot;</span>;
    if (typeof data === 'number') return <span className="text-blue-600 dark:text-blue-400">{data}</span>;
    if (typeof data === 'boolean') return <span className="text-purple-600 dark:text-purple-400">{data.toString()}</span>;

      if (Array.isArray(data)) {
      return (
        <div className="ml-4">
          <span className="text-gray-600 dark:text-gray-400">[</span>
          {data.map((item, idx) => (
            <div key={idx} className="ml-4">
              {renderTree(item, level + 1)}
              {idx < data.length - 1 && <span className="text-gray-600 dark:text-gray-400">,</span>}
            </div>
          ))}
          <span className="text-gray-600 dark:text-gray-400">]</span>
        </div>
      );
    }

    if (typeof data === 'object') {
      const keys = Object.keys(data);
      return (
        <div className="ml-4">
          <span className="text-gray-600 dark:text-gray-400">{'{'}</span>
          {keys.map((key, idx) => (
            <div key={key} className="ml-4">
              <span className="text-red-600 dark:text-red-400">&quot;{key}&quot;</span>
              <span className="text-gray-600 dark:text-gray-400">: </span>
              {renderTree(data[key], level + 1)}
              {idx < keys.length - 1 && <span className="text-gray-600 dark:text-gray-400">,</span>}
            </div>
          ))}
          <span className="text-gray-600 dark:text-gray-400">{'}'}</span>
        </div>
      );
    }

    return <span>{String(data)}</span>;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">JSON Formatter & Validator</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">Format, validate, and minify JSON data</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">JSON Input</label>
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
                placeholder='Paste your JSON here...'
                rows={20}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-600 dark:focus:ring-primary-500 focus:border-transparent font-mono text-sm ${
                  !validation.valid 
                    ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20 text-gray-900 dark:text-gray-100' 
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                }`}
              />
              {!validation.valid && validation.error && (
                <div className="mt-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded">
                  <div className="font-semibold">Error: {validation.error.message}</div>
                  {validation.error.line && (
                    <div className="text-xs mt-1">
                      Line {validation.error.line}
                      {validation.error.column && `, Column ${validation.error.column}`}
                    </div>
                  )}
                </div>
              )}
              {validation.valid && input && (
                <div className="mt-2 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-2 rounded">
                  ✓ Valid JSON
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={format}
                disabled={!validation.valid}
                className="px-4 py-2 bg-primary-600 dark:bg-primary-500 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold transition-colors"
              >
                Format
              </button>
              <button
                onClick={minify}
                disabled={!validation.valid}
                className="px-4 py-2 bg-gray-600 dark:bg-gray-500 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold transition-colors"
              >
                Minify
              </button>
              <button
                onClick={copyOutput}
                disabled={!output && !input}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold transition-colors"
              >
                Copy
              </button>
              <button
                onClick={download}
                disabled={!output && !input}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold transition-colors"
              >
                Download
              </button>
            </div>
          </div>

          {/* Output Section */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Formatted Output</label>
                <button
                  onClick={() => setShowTree(!showTree)}
                  className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                >
                  {showTree ? 'Show JSON' : 'Show Tree'}
                </button>
              </div>
              {showTree && treeData ? (
                <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-900 max-h-[600px] overflow-auto">
                  <pre className="text-sm text-gray-900 dark:text-gray-100">{renderTree(treeData)}</pre>
                </div>
              ) : (
                <textarea
                  value={output || input}
                  readOnly
                  rows={20}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 font-mono text-sm text-gray-900 dark:text-gray-100"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
