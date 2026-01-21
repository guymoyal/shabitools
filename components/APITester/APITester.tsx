'use client';

import { useState } from 'react';

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
type BodyType = 'json' | 'form-data' | 'raw' | 'url-encoded';

export default function APITester() {
  const [method, setMethod] = useState<Method>('GET');
  const [url, setUrl] = useState('');
  const [headers, setHeaders] = useState<Array<{ key: string; value: string }>>([{ key: '', value: '' }]);
  const [queryParams, setQueryParams] = useState<Array<{ key: string; value: string }>>([{ key: '', value: '' }]);
  const [bodyType, setBodyType] = useState<BodyType>('json');
  const [body, setBody] = useState('');
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addHeader = () => {
    setHeaders([...headers, { key: '', value: '' }]);
  };

  const updateHeader = (index: number, key: string, value: string) => {
    const newHeaders = [...headers];
    newHeaders[index] = { key, value };
    setHeaders(newHeaders);
  };

  const removeHeader = (index: number) => {
    setHeaders(headers.filter((_, i) => i !== index));
  };

  const addQueryParam = () => {
    setQueryParams([...queryParams, { key: '', value: '' }]);
  };

  const updateQueryParam = (index: number, key: string, value: string) => {
    const newParams = [...queryParams];
    newParams[index] = { key, value };
    setQueryParams(newParams);
  };

  const removeQueryParam = (index: number) => {
    setQueryParams(queryParams.filter((_, i) => i !== index));
  };

  const sendRequest = async () => {
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const validHeaders = headers
        .filter((h) => h.key.trim())
        .reduce((acc, h) => ({ ...acc, [h.key]: h.value }), {} as Record<string, string>);

      const validQueryParams = queryParams
        .filter((p) => p.key.trim())
        .map((p) => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`)
        .join('&');

      const fullUrl = validQueryParams ? `${url}?${validQueryParams}` : url;

      const options: RequestInit = {
        method,
        headers: validHeaders,
      };

      if (['POST', 'PUT', 'PATCH'].includes(method)) {
        if (bodyType === 'json') {
          options.body = body;
          if (!validHeaders['Content-Type']) {
            options.headers = { ...validHeaders, 'Content-Type': 'application/json' };
          }
        } else if (bodyType === 'url-encoded') {
          const formData = new URLSearchParams();
          body.split('\n').forEach((line) => {
            const [key, value] = line.split('=');
            if (key && value) formData.append(key.trim(), value.trim());
          });
          options.body = formData.toString();
          if (!validHeaders['Content-Type']) {
            options.headers = { ...validHeaders, 'Content-Type': 'application/x-www-form-urlencoded' };
          }
        } else {
          options.body = body;
        }
      }

      const startTime = Date.now();
      const res = await fetch(fullUrl, options);
      const endTime = Date.now();

      const responseHeaders: Record<string, string> = {};
      res.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      let responseBody;
      const contentType = res.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        responseBody = await res.json();
      } else {
        responseBody = await res.text();
      }

      setResponse({
        status: res.status,
        statusText: res.statusText,
        headers: responseHeaders,
        body: responseBody,
        time: endTime - startTime,
        size: JSON.stringify(responseBody).length,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed. Note: CORS restrictions may prevent testing some APIs.');
    } finally {
      setLoading(false);
    }
  };

  const generateCurl = () => {
    const validHeaders = headers
      .filter((h) => h.key.trim())
      .map((h) => `-H "${h.key}: ${h.value}"`)
      .join(' ');

    const validQueryParams = queryParams
      .filter((p) => p.key.trim())
      .map((p) => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`)
      .join('&');

    const fullUrl = validQueryParams ? `${url}?${validQueryParams}` : url;
    let curl = `curl -X ${method} "${fullUrl}"`;

    if (validHeaders) {
      curl += ` ${validHeaders}`;
    }

    if (['POST', 'PUT', 'PATCH'].includes(method) && body) {
      curl += ` -d '${body}'`;
    }

    return curl;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">API Tester</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">Test REST APIs online</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value as Method)}
              className="px-4 py-2 border border-gray-300 rounded-lg font-semibold"
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
              <option value="PATCH">PATCH</option>
              <option value="HEAD">HEAD</option>
              <option value="OPTIONS">OPTIONS</option>
            </select>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://api.example.com/endpoint"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
            />
            <button
              onClick={sendRequest}
              disabled={loading}
              className="px-6 py-2 bg-primary-600 dark:bg-primary-500 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors"
            >
              {loading ? 'Sending...' : 'Send'}
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Query Parameters */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">Query Parameters</label>
              <button
                onClick={addQueryParam}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                + Add
              </button>
            </div>
            {queryParams.map((param, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={param.key}
                  onChange={(e) => updateQueryParam(idx, e.target.value, param.value)}
                  placeholder="Key"
                  className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm"
                />
                <input
                  type="text"
                  value={param.value}
                  onChange={(e) => updateQueryParam(idx, param.key, e.target.value)}
                  placeholder="Value"
                  className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm"
                />
                <button
                  onClick={() => removeQueryParam(idx)}
                  className="px-3 py-1 text-red-600 hover:bg-red-50 rounded text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Headers */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">Headers</label>
              <button
                onClick={addHeader}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                + Add
              </button>
            </div>
            {headers.map((header, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={header.key}
                  onChange={(e) => updateHeader(idx, e.target.value, header.value)}
                  placeholder="Header name"
                  className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm"
                />
                <input
                  type="text"
                  value={header.value}
                  onChange={(e) => updateHeader(idx, header.key, e.target.value)}
                  placeholder="Header value"
                  className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm"
                />
                <button
                  onClick={() => removeHeader(idx)}
                  className="px-3 py-1 text-red-600 hover:bg-red-50 rounded text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Body */}
          {['POST', 'PUT', 'PATCH'].includes(method) && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <label className="text-sm font-semibold text-gray-700">Body Type</label>
                <select
                  value={bodyType}
                  onChange={(e) => setBodyType(e.target.value as BodyType)}
                  className="px-3 py-1 border border-gray-300 rounded text-sm"
                >
                  <option value="json">JSON</option>
                  <option value="form-data">Form Data</option>
                  <option value="raw">Raw</option>
                  <option value="url-encoded">URL Encoded</option>
                </select>
              </div>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder={bodyType === 'json' ? '{"key": "value"}' : 'Enter body content'}
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent font-mono text-sm"
              />
            </div>
          )}
        </div>

        {/* Response */}
        {response && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className={`px-3 py-1 rounded text-sm font-semibold ${
                  response.status >= 200 && response.status < 300
                    ? 'bg-green-100 text-green-700'
                    : response.status >= 300 && response.status < 400
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {response.status} {response.statusText}
                </span>
                <span className="ml-4 text-sm text-gray-600">
                  Time: {response.time}ms | Size: {response.size} bytes
                </span>
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(generateCurl())}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 text-sm font-semibold transition-colors"
              >
                Copy cURL
              </button>
            </div>

              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Response Headers</h3>
                <div className="bg-gray-50 dark:bg-gray-900 rounded p-3 text-xs font-mono max-h-32 overflow-auto">
                  {Object.entries(response.headers).map(([key, value]) => (
                    <div key={key} className="mb-1 text-gray-900 dark:text-gray-100">
                      <span className="font-semibold">{key}:</span> {String(value)}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Response Body</h3>
                <pre className="bg-gray-50 dark:bg-gray-900 rounded p-4 text-xs font-mono max-h-96 overflow-auto text-gray-900 dark:text-gray-100">
                  {typeof response.body === 'string'
                    ? response.body
                    : JSON.stringify(response.body, null, 2)}
                </pre>
              </div>
          </div>
        )}
      </div>
    </div>
  );
}
