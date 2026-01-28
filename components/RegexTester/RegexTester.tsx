'use client';

import { useState, useEffect, useRef } from 'react';

interface Match {
  match: string;
  groups: string[];
  index: number;
  input: string;
}

interface Pattern {
  name: string;
  pattern: string;
  description: string;
  category: string;
  example: string;
  flags: string[];
}

export default function RegexTester() {
  const [pattern, setPattern] = useState('');
  const [testString, setTestString] = useState('');
  const [flags, setFlags] = useState({
    g: false,
    i: false,
    m: false,
    s: false,
    u: false,
    y: false,
  });
  const [matches, setMatches] = useState<Match[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<string>('');
  const [showPatternLibrary, setShowPatternLibrary] = useState(false);
  const [patternLibrary, setPatternLibrary] = useState<Pattern[]>([]);
  const testStringRef = useRef<HTMLDivElement>(null);

  // Load pattern library
  useEffect(() => {
    fetch('/data/tools/regex-tester/patterns.json')
      .then((res) => res.json())
      .then((data) => setPatternLibrary(data.patterns))
      .catch(() => setPatternLibrary([]));
  }, []);

  // Test regex pattern
  useEffect(() => {
    if (!pattern) {
      setMatches([]);
      setError(null);
      setExplanation('Enter a regex pattern to see matches and explanation.');
      return;
    }

    try {
      const flagString = Object.entries(flags)
        .filter(([_, enabled]) => enabled)
        .map(([flag]) => flag)
        .join('');

      const regex = new RegExp(pattern, flagString);
      const matchArray: Match[] = [];
      let match;

      if (flags.g) {
        // Global flag - find all matches
        const regexGlobal = new RegExp(pattern, flagString);
        while ((match = regexGlobal.exec(testString)) !== null) {
          matchArray.push({
            match: match[0],
            groups: match.slice(1),
            index: match.index,
            input: testString,
          });
          if (!flags.g) break; // Prevent infinite loop
          if (match.index === regexGlobal.lastIndex) regexGlobal.lastIndex++;
        }
      } else {
        // Single match
        match = regex.exec(testString);
        if (match) {
          matchArray.push({
            match: match[0],
            groups: match.slice(1),
            index: match.index,
            input: testString,
          });
        }
      }

      setMatches(matchArray);
      setError(null);
      generateExplanation(pattern, flagString);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid regex pattern');
      setMatches([]);
      setExplanation('Fix the regex pattern error to see explanation.');
    }
  }, [pattern, testString, flags]);

  const generateExplanation = (pattern: string, flags: string) => {
    let exp = `Pattern: /${pattern}/${flags}\n\n`;
    exp += `Flags: ${flags || 'none'}\n\n`;
    exp += `Explanation:\n`;

    // Basic explanation
    if (pattern.includes('^')) exp += '^ - Matches start of string\n';
    if (pattern.includes('$')) exp += '$ - Matches end of string\n';
    if (pattern.includes('.')) exp += '. - Matches any character\n';
    if (pattern.includes('*')) exp += '* - Matches 0 or more of preceding\n';
    if (pattern.includes('+')) exp += '+ - Matches 1 or more of preceding\n';
    if (pattern.includes('?')) exp += '? - Matches 0 or 1 of preceding\n';
    if (pattern.includes('[')) exp += '[] - Character class\n';
    if (pattern.includes('(')) exp += '() - Capturing group\n';
    if (pattern.includes('\\d')) exp += '\\d - Matches digit\n';
    if (pattern.includes('\\w')) exp += '\\w - Matches word character\n';
    if (pattern.includes('\\s')) exp += '\\s - Matches whitespace\n';

    if (exp === `Pattern: /${pattern}/${flags}\n\nFlags: ${flags || 'none'}\n\nExplanation:\n`) {
      exp += 'Basic pattern matching';
    }

    setExplanation(exp);
  };

  const loadPattern = (patternData: Pattern) => {
    setPattern(patternData.pattern);
    setTestString(patternData.example);
    const newFlags = { ...flags };
    patternData.flags.forEach((flag) => {
      if (flag in newFlags) {
        newFlags[flag as keyof typeof newFlags] = true;
      }
    });
    setFlags(newFlags);
    setShowPatternLibrary(false);
  };

  const getHighlightedParts = (text: string, matches: Match[]) => {
    if (matches.length === 0) return [{ text, isMatch: false }];

    const parts: Array<{ text: string; isMatch: boolean }> = [];
    let lastIndex = 0;

    matches.forEach((match) => {
      if (match.index > lastIndex) {
        parts.push({
          text: text.slice(lastIndex, match.index),
          isMatch: false,
        });
      }
      parts.push({
        text: match.match,
        isMatch: true,
      });
      lastIndex = match.index + match.match.length;
    });

    if (lastIndex < text.length) {
      parts.push({
        text: text.slice(lastIndex),
        isMatch: false,
      });
    }

    return parts;
  };

  const highlightedParts = getHighlightedParts(testString, matches);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Regex Tester & Visualizer</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">Test, debug, and learn regular expressions</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Editor Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pattern Input */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Regular Expression Pattern</label>
                <button
                  onClick={() => setShowPatternLibrary(!showPatternLibrary)}
                  className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                >
                  {showPatternLibrary ? 'Hide' : 'Show'} Pattern Library
                </button>
              </div>
              <input
                type="text"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                placeholder="Enter regex pattern (e.g., ^[a-z]+$)"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-600 dark:focus:ring-primary-500 focus:border-transparent font-mono text-sm"
              />
              {error && (
                <div className="mt-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded">
                  Error: {error}
                </div>
              )}
            </div>

            {/* Flags */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 block">Flags</label>
              <div className="flex flex-wrap gap-4">
                {Object.entries(flags).map(([flag, enabled]) => (
                  <label key={flag} className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enabled}
                      onChange={(e) => setFlags({ ...flags, [flag]: e.target.checked })}
                      className="mr-2"
                    />
                    <span className="text-sm font-mono text-gray-900 dark:text-gray-100">{flag}</span>
                    <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                      {flag === 'g' && '(global)'}
                      {flag === 'i' && '(case-insensitive)'}
                      {flag === 'm' && '(multiline)'}
                      {flag === 's' && '(dotall)'}
                      {flag === 'u' && '(unicode)'}
                      {flag === 'y' && '(sticky)'}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Test String */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 block">Test String</label>
              <textarea
                value={testString}
                onChange={(e) => setTestString(e.target.value)}
                placeholder="Enter text to test against the pattern"
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-600 dark:focus:ring-primary-500 focus:border-transparent font-mono text-sm"
              />
              {/* Highlighted matches */}
              {testString && matches.length > 0 && (
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Matches Highlighted:</div>
                  <div ref={testStringRef} className="font-mono text-sm whitespace-pre-wrap text-gray-900 dark:text-gray-100">
                    {highlightedParts.map((part, idx) => (
                      <span
                        key={idx}
                        className={part.isMatch ? 'bg-yellow-200 dark:bg-yellow-900/30 font-semibold' : ''}
                      >
                        {part.text}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Matches List */}
            {matches.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                  Matches ({matches.length})
                </h3>
                <div className="space-y-3">
                  {matches.map((match, idx) => (
                    <div key={idx} className="p-3 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
                      <div className="text-sm font-mono text-gray-900 dark:text-gray-100 mb-1">
                        Match {idx + 1}: &quot;{match.match}&quot;
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Position: {match.index} - {match.index + match.match.length}
                      </div>
                      {match.groups.length > 0 && (
                        <div className="mt-2 text-xs">
                          <div className="font-semibold text-gray-700 dark:text-gray-300">Groups:</div>
                          {match.groups.map((group, gIdx) => (
                            <div key={gIdx} className="ml-2 text-gray-600 dark:text-gray-400">
                              Group {gIdx + 1}: &quot;{group}&quot;
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pattern Library */}
            {showPatternLibrary && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Pattern Library</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {patternLibrary.map((pat, idx) => (
                    <button
                      key={idx}
                      onClick={() => loadPattern(pat)}
                      className="w-full text-left p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded text-sm"
                    >
                      <div className="font-semibold text-gray-900 dark:text-gray-100">{pat.name}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 font-mono">{pat.pattern}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-500">{pat.description}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Explanation */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Explanation</h3>
              <pre className="text-xs text-gray-600 dark:text-gray-400 whitespace-pre-wrap font-mono bg-gray-50 dark:bg-gray-900 p-3 rounded">
                {explanation || 'Enter a pattern to see explanation...'}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
