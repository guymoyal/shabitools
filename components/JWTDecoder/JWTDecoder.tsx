'use client';

import { useState, useEffect } from 'react';

interface DecodedToken {
  header: any;
  payload: any;
  signature: string;
  expired?: boolean;
  expiresAt?: number;
}

export default function JWTDecoder() {
  const [token, setToken] = useState('');
  const [decoded, setDecoded] = useState<DecodedToken | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [secret, setSecret] = useState('');

  const decodeToken = () => {
    if (!token.trim()) {
      setError('Please enter a JWT token');
      setDecoded(null);
      return;
    }

    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid JWT format. Token must have 3 parts separated by dots.');
      }

      const [headerB64, payloadB64, signature] = parts;

      // Decode header
      const headerJson = atob(headerB64.replace(/-/g, '+').replace(/_/g, '/'));
      const header = JSON.parse(headerJson);

      // Decode payload
      const payloadJson = atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/'));
      const payload = JSON.parse(payloadJson);

      // Check expiration
      let expired = false;
      let expiresAt: number | undefined;
      if (payload.exp) {
        expiresAt = payload.exp * 1000; // Convert to milliseconds
        expired = Date.now() > expiresAt;
      }

      setDecoded({
        header,
        payload,
        signature,
        expired,
        expiresAt,
      });
      setError(null);

      // Save to history
      const history = JSON.parse(localStorage.getItem('jwt-history') || '[]');
      const newHistory = [token, ...history.filter((t: string) => t !== token)].slice(0, 10);
      localStorage.setItem('jwt-history', JSON.stringify(newHistory));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to decode token');
      setDecoded(null);
    }
  };

  const copyValue = (value: any) => {
    navigator.clipboard.writeText(typeof value === 'string' ? value : JSON.stringify(value, null, 2));
  };

  const loadFromHistory = (tokenFromHistory: string) => {
    setToken(tokenFromHistory);
  };

  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('jwt-history') || '[]');
    setHistory(savedHistory);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">JWT Decoder & Validator</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">Decode and validate JSON Web Tokens</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">JWT Token</label>
              <textarea
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-600 dark:focus:ring-primary-500 focus:border-transparent font-mono text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                Secret Key (Optional - for signature validation)
              </label>
              <input
                type="password"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                placeholder="Enter secret to validate signature"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-600 dark:focus:ring-primary-500 focus:border-transparent font-mono text-sm"
              />
            </div>

            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              onClick={decodeToken}
              className="w-full px-6 py-3 bg-primary-600 dark:bg-primary-500 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 font-semibold transition-colors"
            >
              Decode Token
            </button>
          </div>
        </div>

        {decoded && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Header</h2>
                <button
                  onClick={() => copyValue(decoded.header)}
                  className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                >
                  Copy
                </button>
              </div>
              <pre className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg text-xs font-mono text-gray-900 dark:text-gray-100 overflow-auto">
                {JSON.stringify(decoded.header, null, 2)}
              </pre>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Payload</h2>
                <button
                  onClick={() => copyValue(decoded.payload)}
                  className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                >
                  Copy
                </button>
              </div>
              <pre className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg text-xs font-mono text-gray-900 dark:text-gray-100 overflow-auto">
                {JSON.stringify(decoded.payload, null, 2)}
              </pre>
              {decoded.expiresAt && (
                <div className={`mt-4 p-3 rounded-lg text-sm ${
                  decoded.expired
                    ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                    : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                }`}>
                  {decoded.expired ? '❌ Token Expired' : '✅ Token Valid'}
                  <div className="mt-1 text-xs">
                    Expires: {new Date(decoded.expiresAt).toLocaleString()}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {history.length > 0 && (
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Recent Tokens</h3>
            <div className="space-y-2">
              {history.map((tokenFromHistory, idx) => (
                <button
                  key={idx}
                  onClick={() => loadFromHistory(tokenFromHistory)}
                  className="w-full text-left p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded text-sm font-mono text-gray-600 dark:text-gray-400 truncate"
                >
                  {tokenFromHistory.substring(0, 50)}...
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
