'use client';

import { useState, useEffect } from 'react';

export default function TimestampConverter() {
  const [input, setInput] = useState('');
  const [inputType, setInputType] = useState<'timestamp' | 'date'>('timestamp');
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [results, setResults] = useState<any>(null);
  const [currentTimestamp, setCurrentTimestamp] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTimestamp(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const convert = () => {
    if (!input.trim()) {
      setResults(null);
      return;
    }

    try {
      let date: Date;
      let timestamp: number;

      if (inputType === 'timestamp') {
        // Handle both seconds and milliseconds
        const ts = Number(input);
        timestamp = ts < 10000000000 ? ts * 1000 : ts; // If less than 10 digits, assume seconds
        date = new Date(timestamp);
      } else {
        date = new Date(input);
        timestamp = date.getTime();
      }

      if (isNaN(date.getTime())) {
        throw new Error('Invalid date or timestamp');
      }

      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short',
      });

      setResults({
        timestamp: Math.floor(timestamp / 1000), // Unix timestamp in seconds
        timestampMs: timestamp, // Milliseconds
        iso8601: date.toISOString(),
        readable: formatter.format(date),
        utc: date.toUTCString(),
        local: date.toLocaleString(),
      });
    } catch (err) {
      setResults({ error: err instanceof Error ? err.message : 'Conversion failed' });
    }
  };

  useEffect(() => {
    if (input) {
      convert();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, inputType, timezone]);

  const copyValue = (value: string) => {
    navigator.clipboard.writeText(value);
  };

  const useCurrent = () => {
    setInput(Math.floor(Date.now() / 1000).toString());
    setInputType('timestamp');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-4 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Timestamp Converter</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">Convert Unix timestamps to dates</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Input Type</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setInputType('timestamp')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                    inputType === 'timestamp'
                      ? 'bg-primary-600 dark:bg-primary-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  Timestamp
                </button>
                <button
                  onClick={() => setInputType('date')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                    inputType === 'date'
                      ? 'bg-primary-600 dark:bg-primary-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  Date
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                {inputType === 'timestamp' ? 'Unix Timestamp' : 'Date String'}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={inputType === 'timestamp' ? '1704067200' : '2024-01-01T00:00:00Z'}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-600 dark:focus:ring-primary-500 focus:border-transparent font-mono text-sm"
                />
                <button
                  onClick={useCurrent}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 text-sm font-semibold"
                >
                  Current
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Timezone</label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-600 dark:focus:ring-primary-500 focus:border-transparent"
              >
                <option value="UTC">UTC</option>
                <option value="America/New_York">America/New_York</option>
                <option value="America/Los_Angeles">America/Los_Angeles</option>
                <option value="Europe/London">Europe/London</option>
                <option value="Europe/Paris">Europe/Paris</option>
                <option value="Asia/Tokyo">Asia/Tokyo</option>
                <option value="Asia/Shanghai">Asia/Shanghai</option>
              </select>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Current Timestamp</div>
              <div className="font-mono text-lg text-gray-900 dark:text-gray-100">
                {Math.floor(currentTimestamp / 1000)} (seconds)
              </div>
              <div className="font-mono text-sm text-gray-600 dark:text-gray-400 mt-1">
                {currentTimestamp} (milliseconds)
              </div>
            </div>
          </div>
        </div>

        {results && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            {results.error ? (
              <div className="text-red-600 dark:text-red-400">{results.error}</div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Unix Timestamp (seconds)</div>
                    <div className="font-mono text-lg text-gray-900 dark:text-gray-100">{results.timestamp}</div>
                  </div>
                  <button
                    onClick={() => copyValue(results.timestamp.toString())}
                    className="px-3 py-1 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                  >
                    Copy
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Unix Timestamp (milliseconds)</div>
                    <div className="font-mono text-lg text-gray-900 dark:text-gray-100">{results.timestampMs}</div>
                  </div>
                  <button
                    onClick={() => copyValue(results.timestampMs.toString())}
                    className="px-3 py-1 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                  >
                    Copy
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">ISO 8601</div>
                    <div className="font-mono text-sm text-gray-900 dark:text-gray-100">{results.iso8601}</div>
                  </div>
                  <button
                    onClick={() => copyValue(results.iso8601)}
                    className="px-3 py-1 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                  >
                    Copy
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Readable ({timezone})</div>
                    <div className="text-lg text-gray-900 dark:text-gray-100">{results.readable}</div>
                  </div>
                  <button
                    onClick={() => copyValue(results.readable)}
                    className="px-3 py-1 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                  >
                    Copy
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">UTC</div>
                    <div className="text-sm text-gray-900 dark:text-gray-100">{results.utc}</div>
                  </div>
                  <button
                    onClick={() => copyValue(results.utc)}
                    className="px-3 py-1 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                  >
                    Copy
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
