'use client';

import { useState } from 'react';

interface ValidationResult {
  valid: boolean;
  format: boolean;
  domain: boolean;
  disposable: boolean;
  role: boolean;
  errors: string[];
  suggestions: string[];
}

const DISPOSABLE_DOMAINS = [
  'tempmail.com', 'guerrillamail.com', 'mailinator.com', '10minutemail.com',
  'throwaway.email', 'temp-mail.org', 'getnada.com', 'mohmal.com'
];

const ROLE_ACCOUNTS = ['admin', 'info', 'support', 'sales', 'contact', 'help', 'noreply', 'no-reply'];

export default function EmailValidator() {
  const [email, setEmail] = useState('');
  const [results, setResults] = useState<ValidationResult | null>(null);
  const [bulkEmails, setBulkEmails] = useState('');
  const [bulkResults, setBulkResults] = useState<Array<{ email: string; valid: boolean }>>([]);

  const validateFormat = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email) && email.length <= 254;
  };

  const checkDomain = async (email: string): Promise<boolean> => {
    const domain = email.split('@')[1];
    if (!domain) return false;
    
    try {
      // Check if domain has MX records (simplified check)
      // In production, you'd use a DNS lookup API
      return domain.includes('.') && domain.split('.').length >= 2;
    } catch {
      return false;
    }
  };

  const isDisposable = (email: string): boolean => {
    const domain = email.split('@')[1]?.toLowerCase();
    return DISPOSABLE_DOMAINS.some(d => domain?.includes(d));
  };

  const isRoleAccount = (email: string): boolean => {
    const localPart = email.split('@')[0]?.toLowerCase();
    return ROLE_ACCOUNTS.some(role => localPart === role);
  };

  const validateEmail = async () => {
    if (!email.trim()) {
      setResults(null);
      return;
    }

    const errors: string[] = [];
    const suggestions: string[] = [];

    const formatValid = validateFormat(email);
    const domainValid = await checkDomain(email);
    const disposable = isDisposable(email);
    const role = isRoleAccount(email);

    if (!formatValid) {
      errors.push('Invalid email format');
      suggestions.push('Check for typos, missing @ symbol, or invalid characters');
    }

    if (!domainValid) {
      errors.push('Domain may not exist');
      suggestions.push('Verify the domain name is correct');
    }

    if (disposable) {
      errors.push('Disposable email detected');
      suggestions.push('Consider using a permanent email address');
    }

    if (role) {
      errors.push('Role-based email detected');
      suggestions.push('Personal emails are preferred for signups');
    }

    setResults({
      valid: formatValid && domainValid && !disposable,
      format: formatValid,
      domain: domainValid,
      disposable,
      role,
      errors,
      suggestions,
    });
  };

  const validateBulk = () => {
    const emails = bulkEmails.split('\n').map(e => e.trim()).filter(e => e);
    const results = emails.map(email => ({
      email,
      valid: validateFormat(email) && !isDisposable(email),
    }));
    setBulkResults(results);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-4 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Email Validator</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">Validate email addresses online</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Email Address</label>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && validateEmail()}
                  placeholder="example@domain.com"
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-600 dark:focus:ring-primary-500 focus:border-transparent"
                />
                <button
                  onClick={validateEmail}
                  className="px-6 py-2 bg-primary-600 dark:bg-primary-500 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 font-semibold transition-colors"
                >
                  Validate
                </button>
              </div>
            </div>

            {results && (
              <div className={`p-4 rounded-lg border ${
                results.valid
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                  : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
              }`}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{results.valid ? '✅' : '❌'}</span>
                  <span className={`font-semibold ${results.valid ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                    {results.valid ? 'Valid Email' : 'Invalid Email'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Format:</span>
                    <span className={`ml-2 font-semibold ${results.format ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {results.format ? '✓ Valid' : '✗ Invalid'}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Domain:</span>
                    <span className={`ml-2 font-semibold ${results.domain ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                      {results.domain ? '✓ Valid' : '⚠ Check'}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Disposable:</span>
                    <span className={`ml-2 font-semibold ${results.disposable ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                      {results.disposable ? '✗ Yes' : '✓ No'}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Role Account:</span>
                    <span className={`ml-2 font-semibold ${results.role ? 'text-yellow-600 dark:text-yellow-400' : 'text-green-600 dark:text-green-400'}`}>
                      {results.role ? '⚠ Yes' : '✓ No'}
                    </span>
                  </div>
                </div>

                {results.errors.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Issues Found:</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      {results.errors.map((error, idx) => (
                        <li key={idx}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {results.suggestions.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Suggestions:</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      {results.suggestions.map((suggestion, idx) => (
                        <li key={idx}>{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Bulk Validation</h2>
          <div className="space-y-4">
            <textarea
              value={bulkEmails}
              onChange={(e) => setBulkEmails(e.target.value)}
              placeholder="Enter multiple emails, one per line"
              rows={8}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-600 dark:focus:ring-primary-500 focus:border-transparent font-mono text-sm"
            />
            <button
              onClick={validateBulk}
              className="px-6 py-2 bg-gray-600 dark:bg-gray-500 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 font-semibold transition-colors"
            >
              Validate All
            </button>

            {bulkResults.length > 0 && (
              <div className="mt-4 space-y-2">
                {bulkResults.map((result, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border ${
                      result.valid
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                        : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm text-gray-900 dark:text-gray-100">{result.email}</span>
                      <span className={`text-sm font-semibold ${result.valid ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {result.valid ? '✓ Valid' : '✗ Invalid'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
