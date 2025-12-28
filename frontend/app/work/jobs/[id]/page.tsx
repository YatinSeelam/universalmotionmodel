'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface JobDetail {
  id: string
  task_id: string
  episode_id: string
  status: string
  claimed_by: string | null
  claimed_by_worker_id?: string | null
  claimed_by_worker_name?: string | null
  lab_id?: string | null
  lab_name?: string | null
  fix_episode_id: string | null
  created_at: string
  updated_at: string
  episode: {
    id: string
    success: boolean
    failure_reason: string | null
    failure_time_sec: number | null
    hz: number
    steps: number
    duration_sec: number
    quality_score: number
  }
  video_url: string | null
}

function StatusBadge({ status }: { status: string }) {
  const colors = {
    open: 'bg-yellow-100 text-yellow-800',
    claimed: 'bg-blue-100 text-blue-800',
    submitted: 'bg-purple-100 text-purple-800',
    accepted: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  }
  return (
    <span className={`text-xs px-2 py-1 rounded font-medium ${colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`}>
      {status}
    </span>
  )
}

export default function JobDetailPage() {
  const params = useParams()
  const router = useRouter()
  const jobId = params.id as string
  const videoRef = useRef<HTMLVideoElement>(null)

  const [job, setJob] = useState<JobDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [claiming, setClaiming] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [showFixForm, setShowFixForm] = useState(false)
  
  // Fix form state
  const [durationSec, setDurationSec] = useState(8)
  const [hz, setHz] = useState(20)
  const [fixVideo, setFixVideo] = useState<File | null>(null)

  const steps = Math.round(durationSec * hz)

  useEffect(() => {
    fetchJob()
  }, [jobId])

  useEffect(() => {
    // Auto-seek to failure time when video loads
    if (videoRef.current && job?.episode.failure_time_sec !== null && job?.episode.failure_time_sec !== undefined) {
      const video = videoRef.current
      const handleLoadedMetadata = () => {
        video.currentTime = job.episode.failure_time_sec!
      }
      video.addEventListener('loadedmetadata', handleLoadedMetadata)
      return () => video.removeEventListener('loadedmetadata', handleLoadedMetadata)
    }
  }, [job])

  const fetchJob = async () => {
    try {
      const res = await fetch(`${API_URL}/api/jobs/${jobId}`)
      const data = await res.json()
      setJob(data)
    } catch (error) {
      console.error('Failed to fetch job:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleClaim = async () => {
    setClaiming(true)
    try {
      const res = await fetch(`${API_URL}/api/jobs/${jobId}/claim`, {
        method: 'POST',
      })
      if (res.ok) {
        fetchJob()
      }
    } catch (error) {
      console.error('Failed to claim job:', error)
    } finally {
      setClaiming(false)
    }
  }

  const jumpToFailure = () => {
    if (videoRef.current && job?.episode.failure_time_sec !== null && job) {
      videoRef.current.currentTime = job.episode.failure_time_sec
    }
  }

  const handleSubmitFix = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      // Build meta_json internally
      const meta_json = JSON.stringify({
        task_id: job!.task_id,
        hz: hz,
        steps: steps,
        duration_sec: durationSec,
        success: true, // Always true for fixes
      })

      const formData = new FormData()
      formData.append('meta_json', meta_json)
      if (fixVideo) {
        formData.append('video', fixVideo)
      }

      const res = await fetch(`${API_URL}/api/jobs/${jobId}/submit_fix`, {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        router.push('/work/queue')
      } else {
        alert('Failed to submit fix')
      }
    } catch (error) {
      console.error('Failed to submit fix:', error)
      alert('Failed to submit fix')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-gray-500">Job not found</p>
        </div>
      </div>
    )
  }

  const failureTime = job.episode.failure_time_sec
  const duration = job.video_url ? (videoRef.current?.duration || job.episode.duration_sec) : job.episode.duration_sec
  const markerPositionPct = failureTime !== null && duration > 0 ? (failureTime / duration) * 100 : 0

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Job Detail</h1>
          <Link href="/work/queue" className="text-blue-600 hover:underline">← Back to Queue</Link>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="mb-4 flex items-center gap-4">
            <div>
              <span className="text-sm font-medium text-gray-500">Status:</span>
              <span className="ml-2">
                <StatusBadge status={job.status} />
              </span>
            </div>
            {job.lab_name && (
              <div>
                <span className="text-sm font-medium text-gray-500">Lab:</span>
                <span className="ml-2 text-sm text-gray-700">{job.lab_name}</span>
              </div>
            )}
            {job.claimed_by_worker_name && (
              <div>
                <span className="text-sm font-medium text-gray-500">Claimed by:</span>
                <span className="ml-2 text-sm text-gray-700">{job.claimed_by_worker_name}</span>
              </div>
            )}
          </div>

          {job.video_url ? (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold">Replay Video</h2>
                {failureTime !== null && (
                  <button
                    onClick={jumpToFailure}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                  >
                    Jump to Failure
                  </button>
                )}
              </div>
              <div className="relative">
                <video
                  ref={videoRef}
                  src={job.video_url}
                  controls
                  className="w-full rounded-lg border"
                  onError={(e) => {
                    console.error('Video load error:', e)
                  }}
                >
                  Your browser does not support the video tag.
                </video>
                {failureTime !== null && duration > 0 && (
                  <div className="mt-2 relative h-2 bg-gray-200 rounded-full">
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-red-600 z-10"
                      style={{ left: `${markerPositionPct}%` }}
                    />
                    <div className="absolute top-0 left-0 text-xs text-red-600 mt-3" style={{ left: `${markerPositionPct}%`, transform: 'translateX(-50%)' }}>
                      Failure at {failureTime.toFixed(1)}s
                    </div>
                  </div>
                )}
              </div>
              {failureTime !== null && (
                <p className="text-xs text-gray-500 mt-2">
                  Failure marker at {failureTime.toFixed(1)}s
                </p>
              )}
            </div>
          ) : (
            <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                ⚠️ No video available for this episode. This may be a test episode or the video was not uploaded.
              </p>
            </div>
          )}

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">What Failed</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm mb-2">
                <span className="font-medium">Failure Reason:</span>{' '}
                {job.episode.failure_reason || 'N/A'}
              </p>
              {failureTime !== null && (
                <p className="text-sm mb-2">
                  <span className="font-medium">Failure Time:</span>{' '}
                  {failureTime.toFixed(1)}s
                </p>
              )}
              <p className="text-sm mb-2">
                <span className="font-medium">Duration:</span> {job.episode.duration_sec.toFixed(1)}s
              </p>
              <p className="text-sm">
                <span className="font-medium">Quality Score:</span> {job.episode.quality_score}
              </p>
            </div>
          </div>

          {(job.status === 'open' || job.status === 'claimed') && (
            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-md font-semibold text-blue-900 mb-2">What to do</h3>
              <p className="text-sm text-blue-800 mb-3">
                {job.video_url 
                  ? "Watch the replay above and identify why the robot failed. Your goal is to create a fix that succeeds where this episode failed."
                  : "Review the failure information above and identify why the robot failed. Your goal is to create a fix that succeeds where this episode failed."
                }
              </p>
              <div className="bg-white rounded p-3 mb-2">
                <p className="text-sm font-medium text-gray-900 mb-1">Goal:</p>
                <p className="text-sm text-gray-700">
                  Submit a successful episode that completes the same task without the failure shown above.
                </p>
              </div>
              <div className="bg-white rounded p-3">
                <p className="text-sm font-medium text-gray-900 mb-1">Requirements:</p>
                <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
                  <li>Fix must have <span className="font-semibold">success: true</span></li>
                  <li>Fix must complete in <span className="font-semibold">under 10 seconds</span></li>
                  <li>Upload meta.json and video.mp4 of your fix</li>
                </ul>
              </div>
            </div>
          )}

          <div className="flex gap-4">
            {job.status === 'open' && (
              <button
                onClick={handleClaim}
                disabled={claiming}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
              >
                {claiming ? 'Claiming...' : 'Claim Job'}
              </button>
            )}
            {(job.status === 'open' || job.status === 'claimed') && (
              <button
                onClick={() => setShowFixForm(!showFixForm)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
              >
                {showFixForm ? 'Cancel' : 'Submit Fix'}
              </button>
            )}
          </div>

          {showFixForm && (
            <form onSubmit={handleSubmitFix} className="mt-6 border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Submit Fix</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Duration (seconds) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={durationSec}
                    onChange={(e) => setDurationSec(parseFloat(e.target.value) || 8)}
                    required
                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Control Frequency (Hz) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={hz}
                    onChange={(e) => setHz(parseInt(e.target.value) || 20)}
                    required
                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Steps (auto-calculated)
                  </label>
                  <input
                    type="number"
                    value={steps}
                    readOnly
                    className="w-full border rounded-lg px-4 py-2 bg-gray-50 text-gray-600"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Steps = Duration × Hz = {durationSec} × {hz} = {steps}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Fix Video (optional)
                  </label>
                  <input
                    type="file"
                    accept="video/mp4"
                    onChange={(e) => setFixVideo(e.target.files?.[0] || null)}
                    className="w-full border rounded-lg px-4 py-2"
                  />
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-sm text-green-800">
                    <span className="font-medium">Note:</span> Success is automatically set to <code className="bg-green-100 px-1 rounded">true</code> for all fixes.
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium"
                >
                  {submitting ? 'Submitting...' : 'Submit Fix'}
                </button>
              </div>
            </form>
          )}

          {job.status === 'accepted' && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800">
                ✓ Fix accepted! Job resolved.
              </p>
            </div>
          )}

          {job.status === 'rejected' && (
            <div className="mt-4 p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-red-800">
                ✗ Fix rejected. Please try again.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

