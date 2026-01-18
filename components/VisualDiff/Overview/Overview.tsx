import overviewData from '@/data/tools/visual-diff/overview.json';

export default function Overview() {
  return (
    <div className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-4 lg:px-8">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{overviewData.title}</h2>
          <p className="text-xl text-gray-600 mb-6">{overviewData.subtitle}</p>
          <p className="text-lg text-gray-700 mb-8">{overviewData.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {overviewData.features.map((feature, index) => (
              <div key={index} className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-primary-600 mt-2"></div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Common Use Cases</h3>
            <ul className="space-y-2">
              {overviewData.useCases.map((useCase, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-primary-600 mt-1">•</span>
                  <span className="text-gray-700">{useCase}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
