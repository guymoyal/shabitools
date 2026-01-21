export default function Overview() {
  return (
    <div className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-4 lg:px-8">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">UUID Generator</h2>
          <p className="text-xl text-gray-600 mb-6">Generate UUIDs (Universally Unique Identifiers)</p>
          <p className="text-lg text-gray-700 mb-8">
            Generate RFC 4122 compliant UUIDs for use in databases, APIs, and applications. Generate single or multiple UUIDs at once.
          </p>
        </div>
      </div>
    </div>
  );
}
