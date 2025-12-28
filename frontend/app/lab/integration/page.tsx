export default function LabIntegrationPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-[1396px] mx-auto px-6 sm:px-8 lg:px-12 py-8 sm:py-12">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-medium text-slate-900 mb-3 leading-tight" style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '-0.02em' }}>
          Integration Contract
        </h1>
        <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl mb-8" style={{ fontFamily: "'Rethink Sans', sans-serif", letterSpacing: '-0.02em' }}>
          Learn how to integrate your lab's robot runs with the platform.
        </p>
        
        <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 lg:p-10 shadow-sm space-y-10">
          <section>
            <h2 className="text-2xl font-medium text-slate-900 mb-4" style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '-0.02em' }}>
              What Labs Upload
            </h2>
            <p className="text-slate-600 mb-4" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>
              Labs upload <strong>episodes</strong> (robot run data) in a simple format:
            </p>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 mb-4">
              <h3 className="font-semibold text-slate-900 mb-3" style={{ fontFamily: "'Archivo', sans-serif" }}>Required Files</h3>
              <ul className="list-disc list-inside text-slate-700 space-y-2" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>
                <li><code className="bg-slate-200 px-2 py-0.5 rounded text-sm">meta.json</code> - Episode metadata (JSON)</li>
                <li><code className="bg-slate-200 px-2 py-0.5 rounded text-sm">video.mp4</code> - Optional video recording of the episode</li>
              </ul>
            </div>
            <p className="text-slate-600" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>
              Each episode is a single robot run. Upload via API or Web UI.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-medium text-slate-900 mb-4" style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '-0.02em' }}>
              Required Fields in meta.json
            </h2>
            <div className="bg-slate-900 rounded-lg p-5 overflow-x-auto mb-4">
              <pre className="text-green-400 text-sm font-mono">
{`{
  "task_id": "pick_v1",           // Task identifier (must exist)
  "hz": 20,                        // Control frequency (int)
  "steps": 200,                    // Number of control steps (int)
  "duration_sec": 10.0,           // Episode duration (float)
  "success": false,                // Whether episode succeeded (boolean)
  "failure_reason": "slip_after_grasp",  // Optional: reason for failure
  "failure_time_sec": 8.2          // Optional: time when failure occurred
}`}
              </pre>
            </div>
            <div className="mt-4 space-y-2 text-sm text-slate-600" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>
              <p><strong>task_id:</strong> Identifies which task/experiment this episode belongs to.</p>
              <p><strong>hz:</strong> Control loop frequency (e.g., 20Hz, 30Hz)</p>
              <p><strong>steps:</strong> Total number of control steps executed</p>
              <p><strong>duration_sec:</strong> Total duration of the episode</p>
              <p><strong>success:</strong> <code className="bg-slate-100 px-1.5 py-0.5 rounded">true</code> if episode completed successfully, <code className="bg-slate-100 px-1.5 py-0.5 rounded">false</code> otherwise</p>
              <p><strong>failure_reason:</strong> Human-readable reason (e.g., "slip_after_grasp", "missed_grasp", "timeout", "collision_spike")</p>
              <p><strong>failure_time_sec:</strong> Timestamp (in seconds) when failure occurred</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-medium text-slate-900 mb-4" style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '-0.02em' }}>
              What Labs Get Back
            </h2>
            
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-5">
                <h3 className="font-semibold text-slate-900 mb-2" style={{ fontFamily: "'Archivo', sans-serif" }}>1. Automatic Edge Case Detection</h3>
                <p className="text-sm text-slate-700 mb-2" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>The platform automatically detects edge cases:</p>
                <ul className="list-disc list-inside text-sm text-slate-700 space-y-1 ml-2" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>
                  <li>Episode has <code className="bg-blue-100 px-1.5 py-0.5 rounded">success: false</code></li>
                  <li>Episode duration exceeds 20 seconds</li>
                  <li>Episode has a <code className="bg-blue-100 px-1.5 py-0.5 rounded">failure_reason</code> specified</li>
                </ul>
                <p className="text-sm text-slate-700 mt-2" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>Edge cases are automatically added to the Fix Queue.</p>
              </div>

              <div className="bg-green-50 border border-green-100 rounded-lg p-5">
                <h3 className="font-semibold text-slate-900 mb-2" style={{ fontFamily: "'Archivo', sans-serif" }}>2. Quality Control (QC) Scoring</h3>
                <p className="text-sm text-slate-700 mb-2" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>Each episode receives a quality_score (0-100):</p>
                <ul className="list-disc list-inside text-sm text-slate-700 space-y-1 ml-2" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>
                  <li>Base score: 50</li>
                  <li>+30 if <code className="bg-green-100 px-1.5 py-0.5 rounded">success: true</code></li>
                  <li>-20 if <code className="bg-green-100 px-1.5 py-0.5 rounded">duration_sec &gt; 15</code></li>
                  <li>-10 if <code className="bg-green-100 px-1.5 py-0.5 rounded">failure_reason</code> is present</li>
                </ul>
              </div>

              <div className="bg-purple-50 border border-purple-100 rounded-lg p-5">
                <h3 className="font-semibold text-slate-900 mb-2" style={{ fontFamily: "'Archivo', sans-serif" }}>3. Acceptance Criteria</h3>
                <p className="text-sm text-slate-700 mb-2" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>Episodes are automatically marked as accepted if:</p>
                <ul className="list-disc list-inside text-sm text-slate-700 space-y-1 ml-2" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>
                  <li><code className="bg-purple-100 px-1.5 py-0.5 rounded">success == true</code> AND <code className="bg-purple-100 px-1.5 py-0.5 rounded">duration_sec &lt;= 20</code></li>
                </ul>
                <p className="text-sm text-slate-700 mt-2" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>Fixes are accepted if:</p>
                <ul className="list-disc list-inside text-sm text-slate-700 space-y-1 ml-2" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>
                  <li><code className="bg-purple-100 px-1.5 py-0.5 rounded">success == true</code> AND <code className="bg-purple-100 px-1.5 py-0.5 rounded">duration_sec &lt;= 10</code></li>
                </ul>
              </div>

              <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-5">
                <h3 className="font-semibold text-slate-900 mb-2" style={{ fontFamily: "'Archivo', sans-serif" }}>4. Fix Queue Management</h3>
                <p className="text-sm text-slate-700" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>
                  Edge cases appear in the Fix Queue. Workers can claim jobs, watch replays, and submit fixes. 
                  Fixes are automatically QC'd and marked accepted/rejected.
                </p>
              </div>

              <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-5">
                <h3 className="font-semibold text-slate-900 mb-2" style={{ fontFamily: "'Archivo', sans-serif" }}>5. Dataset Export</h3>
                <p className="text-sm text-slate-700 mb-2" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>Labs can export curated datasets:</p>
                <ul className="list-disc list-inside text-sm text-slate-700 space-y-1 ml-2" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>
                  <li>All accepted episodes (meta.json + video.mp4)</li>
                  <li>All accepted fixes (meta.json + video.mp4)</li>
                  <li><code className="bg-indigo-100 px-1.5 py-0.5 rounded">manifest.json</code> with metadata</li>
                </ul>
              </div>

              <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-5">
                <h3 className="font-semibold text-slate-900 mb-2" style={{ fontFamily: "'Archivo', sans-serif" }}>6. Dataset Reports</h3>
                <p className="text-sm text-slate-700" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>Before export, labs see a Dataset Report with statistics, acceptance rates, and failure analysis.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-medium text-slate-900 mb-4" style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '-0.02em' }}>
              Integration Workflow
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-slate-700" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>
              <li><strong>Setup:</strong> Create a task in the system (or use existing task_id)</li>
              <li><strong>Upload:</strong> Upload episodes via API or web UI</li>
              <li><strong>Auto-Processing:</strong> Platform detects edge cases and creates jobs</li>
              <li><strong>Fix Queue:</strong> Workers review failures and submit fixes</li>
              <li><strong>Export:</strong> Download curated dataset with accepted episodes + fixes</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-medium text-slate-900 mb-4" style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '-0.02em' }}>
              API Endpoints
            </h2>
            <div className="space-y-3">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <code className="text-blue-600 font-mono text-sm">POST /api/episodes/upload</code>
                <p className="text-slate-600 mt-1 text-sm" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>Upload an episode with metadata and optional video</p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <code className="text-blue-600 font-mono text-sm">GET /api/jobs?status=open</code>
                <p className="text-slate-600 mt-1 text-sm" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>List open edge case jobs</p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <code className="text-blue-600 font-mono text-sm">GET /api/jobs/{'{job_id}'}</code>
                <p className="text-slate-600 mt-1 text-sm" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>Get job details with signed video URL</p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <code className="text-blue-600 font-mono text-sm">POST /api/jobs/{'{job_id}'}/submit_fix</code>
                <p className="text-slate-600 mt-1 text-sm" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>Submit a fix for a job</p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <code className="text-blue-600 font-mono text-sm">GET /api/export?task_id={'{task_id}'}</code>
                <p className="text-slate-600 mt-1 text-sm" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>Export dataset as ZIP file</p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <code className="text-blue-600 font-mono text-sm">GET /api/dataset/stats?task_id={'{task_id}'}</code>
                <p className="text-slate-600 mt-1 text-sm" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>Get dataset report statistics</p>
              </div>
            </div>
          </section>

          <section className="pt-6 border-t border-slate-200">
            <h2 className="text-2xl font-medium text-slate-900 mb-4" style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '-0.02em' }}>
              Benefits for Labs
            </h2>
            <ul className="list-disc list-inside space-y-2 text-slate-700" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>
              <li><strong>Automated Edge Case Detection:</strong> No manual review needed to find failures</li>
              <li><strong>Quality Control:</strong> Automatic scoring and acceptance criteria</li>
              <li><strong>Human-in-the-Loop Fixes:</strong> Workers can fix failures to improve dataset quality</li>
              <li><strong>Curated Datasets:</strong> Export only high-quality, accepted episodes</li>
              <li><strong>Failure Analysis:</strong> Track failure reasons and patterns</li>
              <li><strong>Scalable:</strong> Handle thousands of episodes with minimal manual work</li>
            </ul>
          </section>

          <section className="pt-6 border-t border-slate-200">
            <p className="text-sm text-slate-500" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>
              For integration questions or issues, check API documentation at <code className="bg-slate-100 px-1.5 py-0.5 rounded">/api/docs</code> (FastAPI auto-generated).
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
