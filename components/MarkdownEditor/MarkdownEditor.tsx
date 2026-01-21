'use client';

import { useState } from 'react';
import { marked } from 'marked';

export default function MarkdownEditor() {
  const [markdown, setMarkdown] = useState('# Hello World\n\nThis is **bold** and this is *italic*.');
  const [html, setHtml] = useState('');
  const [showPreview, setShowPreview] = useState(true);

  const updatePreview = (md: string) => {
    setMarkdown(md);
    try {
      const htmlContent = marked(md);
      setHtml(htmlContent as string);
    } catch (err) {
      setHtml('<p>Error parsing Markdown</p>');
    }
  };

  const insertFormat = (before: string, after: string = '') => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = markdown.substring(start, end);
    const newText = markdown.substring(0, start) + before + selectedText + after + markdown.substring(end);
    updatePreview(newText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const copyMarkdown = () => {
    navigator.clipboard.writeText(markdown);
  };

  const copyHTML = () => {
    navigator.clipboard.writeText(html);
  };

  const downloadMarkdown = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadHTML = () => {
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Markdown Editor</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">Live preview Markdown editor</p>
        </div>

        {/* Toolbar */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => insertFormat('# ', '')}
              className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-sm font-semibold transition-colors"
              title="Heading 1"
            >
              H1
            </button>
            <button
              onClick={() => insertFormat('## ', '')}
              className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-sm font-semibold transition-colors"
              title="Heading 2"
            >
              H2
            </button>
            <button
              onClick={() => insertFormat('**', '**')}
              className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-sm font-semibold transition-colors"
              title="Bold"
            >
              <strong>B</strong>
            </button>
            <button
              onClick={() => insertFormat('*', '*')}
              className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-sm font-semibold transition-colors"
              title="Italic"
            >
              <em>I</em>
            </button>
            <button
              onClick={() => insertFormat('[', '](url)')}
              className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-sm font-semibold transition-colors"
              title="Link"
            >
              Link
            </button>
            <button
              onClick={() => insertFormat('![', '](url)')}
              className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-sm font-semibold transition-colors"
              title="Image"
            >
              Image
            </button>
            <button
              onClick={() => insertFormat('```\n', '\n```')}
              className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-sm font-semibold transition-colors"
              title="Code Block"
            >
              Code
            </button>
            <button
              onClick={() => insertFormat('- ', '')}
              className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-sm font-semibold transition-colors"
              title="List"
            >
              List
            </button>
            <div className="flex-1" />
            <button
              onClick={copyMarkdown}
              className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 text-sm font-semibold transition-colors"
            >
              Copy MD
            </button>
            <button
              onClick={copyHTML}
              className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 text-sm font-semibold transition-colors"
            >
              Copy HTML
            </button>
            <button
              onClick={downloadMarkdown}
              className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 text-sm font-semibold transition-colors"
            >
              Download MD
            </button>
            <button
              onClick={downloadHTML}
              className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 text-sm font-semibold transition-colors"
            >
              Download HTML
            </button>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="px-3 py-1 bg-primary-600 dark:bg-primary-500 text-white rounded hover:bg-primary-700 dark:hover:bg-primary-600 text-sm font-semibold transition-colors"
            >
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </button>
          </div>
        </div>

        <div className={`grid ${showPreview ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'} gap-6`}>
          {/* Editor */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Markdown Editor</label>
            <textarea
              value={markdown}
              onChange={(e) => updatePreview(e.target.value)}
              placeholder="# Start writing Markdown..."
              rows={25}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-600 dark:focus:ring-primary-500 focus:border-transparent font-mono text-sm"
            />
          </div>

          {/* Preview */}
          {showPreview && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Preview</label>
              <div
                className="prose dark:prose-invert max-w-none border border-gray-200 dark:border-gray-600 rounded-lg p-4 max-h-[600px] overflow-auto"
                dangerouslySetInnerHTML={{ __html: html || '<p>Start typing to see preview...</p>' }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
