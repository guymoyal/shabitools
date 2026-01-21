import overviewData from '@/data/tools/password-generator/overview.json';

export default function Overview() {
  return (
    <div className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-4 lg:px-8">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Password Generator</h2>
          <p className="text-xl text-gray-600 mb-6">Generate secure random passwords</p>
          <p className="text-lg text-gray-700 mb-8">
            Create strong, secure passwords with customizable length and character types. Perfect for accounts, API keys, and secure tokens.
          </p>
        </div>
      </div>
    </div>
  );
}
