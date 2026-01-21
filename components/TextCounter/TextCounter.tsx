'use client';

import { useState } from 'react';

export default function TextCounter() {
  const [text, setText] = useState('');

  const stats = {
    characters: text.length,
    charactersNoSpaces: text.replace(/\s/g, '').length,
    words: text.trim() ? text.trim().split(/\s+/).length : 0,
    paragraphs: text.trim() ? text.trim().split(/\n\s*\n/).filter(p => p.trim()).length : 0,
    lines: text.split('\n').length,
    sentences: text.match(/[.!?]+/g)?.length || 0,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-4 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Text Counter</h1>
          <p className="text-lg text-gray-600">Count words, characters, and paragraphs</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Text Input</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter or paste your text here..."
              rows={15}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
            />
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-600">Characters</div>
                <div className="text-2xl font-bold text-gray-900">{stats.characters}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Characters (no spaces)</div>
                <div className="text-2xl font-bold text-gray-900">{stats.charactersNoSpaces}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Words</div>
                <div className="text-2xl font-bold text-gray-900">{stats.words}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Sentences</div>
                <div className="text-2xl font-bold text-gray-900">{stats.sentences}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Paragraphs</div>
                <div className="text-2xl font-bold text-gray-900">{stats.paragraphs}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Lines</div>
                <div className="text-2xl font-bold text-gray-900">{stats.lines}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
