'use client';

import { useState } from 'react';

interface ContrastResult {
  ratio: number;
  wcag: {
    aaNormal: boolean;
    aaLarge: boolean;
    aaaNormal: boolean;
    aaaLarge: boolean;
  };
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((val) => {
    val = val / 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function calculateContrast(foreground: string, background: string): ContrastResult {
  const fgRgb = hexToRgb(foreground);
  const bgRgb = hexToRgb(background);

  if (!fgRgb || !bgRgb) {
    return {
      ratio: 0,
      wcag: {
        aaNormal: false,
        aaLarge: false,
        aaaNormal: false,
        aaaLarge: false,
      },
    };
  }

  const fgLum = getLuminance(fgRgb.r, fgRgb.g, fgRgb.b);
  const bgLum = getLuminance(bgRgb.r, bgRgb.g, bgRgb.b);

  const lighter = Math.max(fgLum, bgLum);
  const darker = Math.min(fgLum, bgLum);
  const ratio = (lighter + 0.05) / (darker + 0.05);

  return {
    ratio: Math.round(ratio * 100) / 100,
    wcag: {
      aaNormal: ratio >= 4.5,
      aaLarge: ratio >= 3,
      aaaNormal: ratio >= 7,
      aaaLarge: ratio >= 4.5,
    },
  };
}

export default function ColorContrastChecker() {
  const [foreground, setForeground] = useState('#000000');
  const [background, setBackground] = useState('#ffffff');
  const [textSize, setTextSize] = useState<'normal' | 'large'>('normal');

  const result = calculateContrast(foreground, background);

  const getRatioColor = (ratio: number) => {
    if (ratio >= 7) return 'text-green-600';
    if (ratio >= 4.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Color Contrast Checker</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">WCAG accessibility compliance checker</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Color Inputs */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">Color Selection</h2>

            <div className="space-y-6">
              <div>
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Foreground Color</label>
                <div className="flex items-center gap-4">
                  <input
                    type="color"
                    value={foreground}
                    onChange={(e) => setForeground(e.target.value)}
                    className="w-20 h-20 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={foreground}
                    onChange={(e) => setForeground(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-mono text-sm"
                    placeholder="#000000"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Background Color</label>
                <div className="flex items-center gap-4">
                  <input
                    type="color"
                    value={background}
                    onChange={(e) => setBackground(e.target.value)}
                    className="w-20 h-20 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={background}
                    onChange={(e) => setBackground(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-mono text-sm"
                    placeholder="#ffffff"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Text Size</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setTextSize('normal')}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                      textSize === 'normal'
                        ? 'bg-primary-600 dark:bg-primary-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    Normal Text
                  </button>
                  <button
                    onClick={() => setTextSize('large')}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                      textSize === 'large'
                        ? 'bg-primary-600 dark:bg-primary-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    Large Text
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-6">
            {/* Contrast Ratio */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Contrast Ratio</h2>
              <div className={`text-4xl font-bold mb-2 ${getRatioColor(result.ratio)}`}>
                {result.ratio}:1
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {result.ratio >= 7
                  ? 'Excellent contrast'
                  : result.ratio >= 4.5
                  ? 'Good contrast'
                  : 'Poor contrast'}
              </div>
            </div>

            {/* WCAG Compliance */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">WCAG Compliance</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">AA Normal Text (4.5:1)</span>
                  <span
                    className={`text-sm font-semibold ${
                      result.wcag.aaNormal ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {result.wcag.aaNormal ? '✓ Pass' : '✗ Fail'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">AA Large Text (3:1)</span>
                  <span
                    className={`text-sm font-semibold ${
                      result.wcag.aaLarge ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {result.wcag.aaLarge ? '✓ Pass' : '✗ Fail'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">AAA Normal Text (7:1)</span>
                  <span
                    className={`text-sm font-semibold ${
                      result.wcag.aaaNormal ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {result.wcag.aaaNormal ? '✓ Pass' : '✗ Fail'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">AAA Large Text (4.5:1)</span>
                  <span
                    className={`text-sm font-semibold ${
                      result.wcag.aaaLarge ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {result.wcag.aaaLarge ? '✓ Pass' : '✗ Fail'}
                  </span>
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Preview</h2>
              <div
                style={{ backgroundColor: background }}
                className="p-8 rounded-lg border border-gray-200 dark:border-gray-600"
              >
                <p
                  style={{ color: foreground }}
                  className={`${textSize === 'large' ? 'text-2xl' : 'text-base'} font-semibold`}
                >
                  Sample Text
                </p>
                <p
                  style={{ color: foreground }}
                  className={`${textSize === 'large' ? 'text-xl' : 'text-sm'} mt-2`}
                >
                  This is how your text will look on this background color.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
