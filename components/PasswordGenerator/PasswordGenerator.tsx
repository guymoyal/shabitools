'use client';

import { useState } from 'react';

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [password, setPassword] = useState('');

  const generatePassword = () => {
    let chars = '';
    if (includeUppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) chars += '0123456789';
    if (includeSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (!chars) {
      alert('Please select at least one character type');
      return;
    }

    let generated = '';
    for (let i = 0; i < length; i++) {
      generated += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(generated);
  };

  const copyPassword = () => {
    navigator.clipboard.writeText(password);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-4 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Password Generator</h1>
          <p className="text-lg text-gray-600">Generate secure random passwords</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">
              Length: {length}
            </label>
            <input
              type="range"
              min="4"
              max="128"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Include:</label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={includeUppercase}
                  onChange={(e) => setIncludeUppercase(e.target.checked)}
                  className="mr-2"
                />
                <span>Uppercase letters (A-Z)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={includeLowercase}
                  onChange={(e) => setIncludeLowercase(e.target.checked)}
                  className="mr-2"
                />
                <span>Lowercase letters (a-z)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={includeNumbers}
                  onChange={(e) => setIncludeNumbers(e.target.checked)}
                  className="mr-2"
                />
                <span>Numbers (0-9)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={includeSymbols}
                  onChange={(e) => setIncludeSymbols(e.target.checked)}
                  className="mr-2"
                />
                <span>Symbols (!@#$%...)</span>
              </label>
            </div>
          </div>

          <button
            onClick={generatePassword}
            className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-semibold"
          >
            Generate Password
          </button>

          {password && (
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={password}
                  readOnly
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 font-mono text-lg"
                />
                <button
                  onClick={copyPassword}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold"
                >
                  Copy
                </button>
              </div>
              <div className="text-sm text-gray-600">
                Strength: {password.length >= 12 && includeUppercase && includeLowercase && includeNumbers && includeSymbols ? 'Strong' : password.length >= 8 ? 'Medium' : 'Weak'}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
