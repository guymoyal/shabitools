import overviewData from '@/data/tools/json-formatter/overview.json';

export default function Overview() {
  return (
    <div className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-4 lg:px-8">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{overviewData.title}</h2>
          <p className="text-xl text-gray-600 mb-6">{overviewData.subtitle}</p>
          <p className="text-lg text-gray-700 mb-8">{overviewData.description}</p>

          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {overviewData.features.map((feature, idx) => (
                <div key={idx} className="p-4 bg-white rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-2">{feature.title}</h4>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Use Cases</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              {overviewData.useCases.map((useCase, idx) => (
                <li key={idx}>{useCase}</li>
              ))}
            </ul>
          </div>

          {overviewData.tips && overviewData.tips.length > 0 && (
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Tips</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {overviewData.tips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
