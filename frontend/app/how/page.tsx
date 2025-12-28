export default function HowPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">How It Works</h1>
        
        <div className="bg-white rounded-lg shadow p-8 space-y-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">1. Upload Robot Runs</h2>
            <p className="text-gray-600 mb-4">
              Labs upload episodes (robot run data) with metadata and optional video recordings.
              Each episode includes task ID, duration, success status, and failure information.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">2. Automatic Edge Case Detection</h2>
            <p className="text-gray-600 mb-4">
              Our system automatically detects edge cases:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Episodes with <code className="bg-gray-100 px-1 rounded">success: false</code></li>
              <li>Episodes exceeding 20 seconds duration</li>
              <li>Episodes with failure reasons specified</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">3. Human-in-the-Loop Fixes</h2>
            <p className="text-gray-600 mb-4">
              Edge cases are added to the Fix Queue. Workers can:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Watch replay videos with failure markers</li>
              <li>Claim jobs and analyze failures</li>
              <li>Submit successful fixes that complete the same task</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">4. Quality Control</h2>
            <p className="text-gray-600 mb-4">
              Every episode and fix is automatically scored and evaluated:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Quality scores (0-100) based on success, duration, and failure status</li>
              <li>Automatic acceptance criteria for episodes and fixes</li>
              <li>Rejection of fixes that don't meet quality standards</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">5. Export Clean Datasets</h2>
            <p className="text-gray-600 mb-4">
              Labs can export curated datasets containing:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>All accepted original episodes</li>
              <li>All accepted human fixes</li>
              <li>Manifest.json with metadata and QC scores</li>
              <li>Dataset statistics and failure analysis</li>
            </ul>
          </div>

          <div className="pt-8 border-t">
            <h2 className="text-2xl font-semibold mb-4">Benefits</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded p-4">
                <h3 className="font-semibold mb-2">For Labs</h3>
                <p className="text-sm text-gray-700">
                  Scale your data pipeline, automatically detect failures, and export training-ready datasets.
                </p>
              </div>
              <div className="bg-green-50 rounded p-4">
                <h3 className="font-semibold mb-2">For Workers</h3>
                <p className="text-sm text-gray-700">
                  Review robot failures, understand edge cases, and contribute to improving datasets.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

