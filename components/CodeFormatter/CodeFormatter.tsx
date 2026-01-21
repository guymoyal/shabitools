'use client';

import { useState } from 'react';

type Language = 'javascript' | 'typescript' | 'python' | 'html' | 'css' | 'json';

export default function CodeFormatter() {
  const [language, setLanguage] = useState<Language>('javascript');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [indentSize, setIndentSize] = useState(2);

  const formatCode = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    try {
      let formatted = '';

      switch (language) {
        case 'json':
          const parsed = JSON.parse(input);
          formatted = JSON.stringify(parsed, null, indentSize);
          break;
        case 'javascript':
        case 'typescript':
          // Basic JavaScript/TypeScript formatting
          formatted = formatJavaScript(input, indentSize);
          break;
        case 'python':
          // Basic Python formatting (indentation only)
          formatted = formatPython(input, indentSize);
          break;
        case 'html':
          formatted = formatHTML(input, indentSize);
          break;
        case 'css':
          formatted = formatCSS(input, indentSize);
          break;
        default:
          formatted = input;
      }

      setOutput(formatted);
    } catch (err) {
      setOutput(`Error: ${err instanceof Error ? err.message : 'Formatting failed'}`);
    }
  };

  const formatJavaScript = (code: string, indent: number): string => {
    // Basic formatting - add indentation after braces
    let formatted = code.replace(/\{/g, ' {\n');
    formatted = formatted.replace(/\}/g, '\n}');
    formatted = formatted.replace(/;/g, ';\n');
    // Simple indentation
    const lines = formatted.split('\n');
    let indentLevel = 0;
    return lines
      .map((line) => {
        const trimmed = line.trim();
        if (trimmed.endsWith('}')) indentLevel = Math.max(0, indentLevel - 1);
        const indented = ' '.repeat(indentLevel * indent) + trimmed;
        if (trimmed.endsWith('{')) indentLevel++;
        return indented;
      })
      .join('\n');
  };

  const formatPython = (code: string, indent: number): string => {
    // Python formatting - preserve indentation
    return code
      .split('\n')
      .map((line) => {
        const trimmed = line.trim();
        if (!trimmed) return '';
        return ' '.repeat(indent) + trimmed;
      })
      .join('\n');
  };

  const formatHTML = (code: string, indent: number): string => {
    // Basic HTML formatting
    let formatted = code.replace(/></g, '>\n<');
    const lines = formatted.split('\n');
    let indentLevel = 0;
    return lines
      .map((line) => {
        const trimmed = line.trim();
        if (!trimmed) return '';
        if (trimmed.startsWith('</')) indentLevel = Math.max(0, indentLevel - 1);
        const indented = ' '.repeat(indentLevel * indent) + trimmed;
        if (trimmed.startsWith('<') && !trimmed.startsWith('</') && !trimmed.endsWith('/>')) {
          indentLevel++;
        }
        return indented;
      })
      .join('\n');
  };

  const formatCSS = (code: string, indent: number): string => {
    // Basic CSS formatting
    let formatted = code.replace(/\{/g, ' {\n');
    formatted = formatted.replace(/\}/g, '\n}\n');
    formatted = formatted.replace(/;/g, ';\n');
    const lines = formatted.split('\n');
    let indentLevel = 0;
    return lines
      .map((line) => {
        const trimmed = line.trim();
        if (!trimmed) return '';
        if (trimmed === '}') indentLevel = Math.max(0, indentLevel - 1);
        const indented = ' '.repeat(indentLevel * indent) + trimmed;
        if (trimmed.endsWith('{')) indentLevel++;
        return indented;
      })
      .join('\n');
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
  };

  const download = () => {
    const extension = language === 'python' ? 'py' : language === 'typescript' ? 'ts' : language === 'javascript' ? 'js' : language;
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `formatted.${extension}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Code Formatter</h1>
          <p className="text-lg text-gray-600">Format code in multiple languages</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-4">
          <div className="flex items-center gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
              >
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="python">Python</option>
                <option value="html">HTML</option>
                <option value="css">CSS</option>
                <option value="json">JSON</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Indent Size</label>
              <select
                value={indentSize}
                onChange={(e) => setIndentSize(Number(e.target.value))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
              >
                <option value={2}>2 spaces</option>
                <option value={4}>4 spaces</option>
              </select>
            </div>
            <div className="flex-1" />
            <button
              onClick={formatCode}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-semibold"
            >
              Format
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Input</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Enter ${language} code...`}
              rows={20}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent font-mono text-sm"
            />
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">Formatted Output</label>
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
          </div>
        </div>
      </div>
    </div>
  );
}
