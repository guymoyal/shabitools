'use client';

import { useState } from 'react';

type Format = 'paragraphs' | 'words' | 'sentences';

const loremText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';

export default function LoremIpsum() {
  const [format, setFormat] = useState<Format>('paragraphs');
  const [count, setCount] = useState(3);
  const [htmlFormat, setHtmlFormat] = useState(false);
  const [output, setOutput] = useState('');

  const generate = () => {
    let text = '';

    if (format === 'paragraphs') {
      const paragraphs: string[] = [];
      for (let i = 0; i < count; i++) {
        paragraphs.push(loremText);
      }
      text = paragraphs.join('\n\n');
      if (htmlFormat) {
        text = paragraphs.map(p => `<p>${p}</p>`).join('\n');
      }
    } else if (format === 'words') {
      const words = loremText.split(' ').slice(0, count);
      text = words.join(' ');
      if (htmlFormat) {
        text = `<span>${words.join(' ')}</span>`;
      }
    } else if (format === 'sentences') {
      const sentences = loremText.split('. ').filter(s => s).slice(0, count);
      text = sentences.map(s => s.trim() + '.').join(' ');
      if (htmlFormat) {
        text = sentences.map(s => `<p>${s.trim()}.</p>`).join('\n');
      }
    }

    setOutput(text);
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-4 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Lorem Ipsum Generator</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">Generate placeholder text</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Format</label>
              <div className="flex gap-2">
                {(['paragraphs', 'words', 'sentences'] as Format[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFormat(f)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize ${
                      format === f
                        ? 'bg-primary-600 dark:bg-primary-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                Count: {count}
              </label>
              <input
                type="range"
                min="1"
                max={format === 'paragraphs' ? 20 : format === 'words' ? 100 : 50}
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={htmlFormat}
                  onChange={(e) => setHtmlFormat(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Wrap in HTML tags</span>
              </label>
            </div>

            <button
              onClick={generate}
              className="w-full px-6 py-3 bg-primary-600 dark:bg-primary-500 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 font-semibold transition-colors"
            >
              Generate Lorem Ipsum
            </button>
          </div>
        </div>

        {output && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Generated Text</label>
              <button
                onClick={copyOutput}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 text-sm font-semibold transition-colors"
              >
                Copy
              </button>
            </div>
            <textarea
              value={output}
              readOnly
              rows={15}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-mono text-sm"
            />
          </div>
        )}
      </div>
    </div>
  );
}
