'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { AppShell } from '@/components/app-shell/AppShell'
import { ContentContainer } from '@/components/app-shell/ContentContainer'
import { ShellHeader } from '@/components/app-shell/ShellHeader'

import { apiFetch, API_URL } from '@/lib/api'

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
    open: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    claimed: 'bg-blue-50 text-blue-700 border-blue-200',
    submitted: 'bg-purple-50 text-purple-700 border-purple-200',
    accepted: 'bg-green-50 text-green-700 border-green-200',
    rejected: 'bg-red-50 text-red-700 border-red-200',
  }
  return (
    <span className={`text-xs px-2 py-0.5 rounded font-medium border ${colors[status as keyof typeof colors] || 'bg-slate-50 text-slate-600 border-slate-200'}`} style={{ fontFamily: "'Archivo', sans-serif" }}>
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
  
  // Auto-fill from original episode
  const [durationSec, setDurationSec] = useState(8)
  const [hz, setHz] = useState(20)
  const [fixVideo, setFixVideo] = useState<File | null>(null)

  const steps = Math.round(durationSec * hz)

  useEffect(() => {
    fetchJob()
  }, [jobId])

  // Auto-fill defaults when job loads
  useEffect(() => {
    if (job?.episode) {
      setDurationSec(job.episode.duration_sec || 8)
      setHz(job.episode.hz || 20)
    }
  }, [job])

  useEffect(() => {
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
    const { data, error } = await apiFetch(`/api/jobs/${jobId}`)
    if (error) {
      setJob(null)
    } else {
      setJob(data)
    }
    setLoading(false)
  }

  const handleClaim = async () => {
    setClaiming(true)
    try {
      const { data, error } = await apiFetch(`/api/jobs/${jobId}/claim`, { method: 'POST' })
      if (!error && data) {
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
      const meta_json = JSON.stringify({
        task_id: job!.task_id,
        hz: hz,
        steps: steps,
        duration_sec: durationSec,
        success: true,
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
        const data = await res.json()
        const isAccepted = data.job?.status === 'accepted'
        
        if (isAccepted) {
          alert('✓ Fix approved! Payment and quality score updated.')
        } else {
          alert('Fix submitted. Awaiting review.')
        }
        
        router.push('/work/queue')
      } else {
        const errorData = await res.json().catch(() => ({}))
        alert(errorData.detail || 'Failed to submit fix')
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
      <ContentContainer>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>Loading...</p>
          </div>
        </div>
      </ContentContainer>
    )
  }

  if (!job) {
    return (
      <ContentContainer>
        <p className="text-slate-600" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>Job not found</p>
      </ContentContainer>
    )
  }

  const failureTime = job.episode.failure_time_sec
  const duration = job.video_url ? (videoRef.current?.duration || job.episode.duration_sec) : job.episode.duration_sec
  const markerPositionPct = failureTime !== null && duration > 0 ? (failureTime / duration) * 100 : 0

  return (
    <AppShell type="work">
      <ContentContainer>
        <div className="mb-5">
          <Link href="/work/queue" className="text-xs text-slate-500 hover:text-[#8350e8] mb-1.5 inline-block" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>
            ← Back to Queue
          </Link>
          <ShellHeader 
            title="Job Detail"
            description={`Task: ${job.task_id}`}
            actions={
              <div className="flex items-center gap-2">
                <StatusBadge status={job.status} />
                {job.lab_name && (
                  <span className="text-xs px-2 py-0.5 bg-slate-50 text-slate-700 rounded border border-slate-200" style={{ fontFamily: "'Archivo', sans-serif" }}>
                    {job.lab_name}
                  </span>
                )}
              </div>
            }
          />
        </div>

        <div className="bg-white border border-slate-200/60 rounded-lg p-5 mb-4">
          {job.video_url ? (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-semibold text-slate-900" style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '-0.02em' }}>Replay Video</h2>
                {failureTime !== null && (
                  <button
                    onClick={jumpToFailure}
                    className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
                    style={{ fontFamily: "'Archivo', sans-serif" }}
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
                  className="w-full rounded-lg border border-slate-200/60"
                />
                {failureTime !== null && duration > 0 && (
                  <div className="mt-2 relative h-1.5 bg-slate-200 rounded-full">
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-red-600 z-10"
                      style={{ left: `${markerPositionPct}%` }}
                    />
                    <div className="absolute top-0 left-0 text-xs text-red-600 mt-2" style={{ left: `${markerPositionPct}%`, transform: 'translateX(-50%)' }}>
                      {failureTime.toFixed(1)}s
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="mb-4 bg-yellow-50/50 border border-yellow-200/60 rounded-lg p-4">
              <p className="text-sm text-yellow-800" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>
                No video available
              </p>
            </div>
          )}

          <div className="mb-4">
            <h2 className="text-sm font-semibold text-slate-900 mb-2" style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '-0.02em' }}>Failure Details</h2>
            <div className="bg-slate-50/50 border border-slate-200/60 rounded-lg p-3 space-y-1.5 text-sm">
              <div>
                <span className="text-slate-500" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>Failure Reason:</span>
                <p className="text-slate-900 mt-0.5" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>{job.episode.failure_reason || 'N/A'}</p>
              </div>
              {failureTime !== null && (
                <div>
                  <span className="text-slate-500" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>Failure Time:</span>
                  <p className="text-slate-900 mt-0.5" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>{failureTime.toFixed(1)}s</p>
                </div>
              )}
              <div>
                <span className="text-slate-500" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>Duration:</span>
                <p className="text-slate-900 mt-0.5" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>{job.episode.duration_sec.toFixed(1)}s</p>
              </div>
            </div>
          </div>

          {(job.status === 'open' || job.status === 'claimed') && job.status === 'open' && (
            <div className="mb-4">
              <button
                onClick={handleClaim}
                disabled={claiming}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50 font-medium transition-colors"
                style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '-0.02em' }}
              >
                {claiming ? 'Claiming...' : 'Claim Job'}
              </button>
            </div>
          )}

          {/* Fix Form - Always Visible */}
          {(job.status === 'open' || job.status === 'claimed') && (
            <form onSubmit={handleSubmitFix} className="mt-5 pt-5 border-t border-slate-200/60">
              <h3 className="text-base font-semibold text-slate-900 mb-4" style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '-0.02em' }}>Submit Fix</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5" style={{ fontFamily: "'Archivo', sans-serif" }}>
                    Duration (seconds) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={durationSec}
                    onChange={(e) => setDurationSec(parseFloat(e.target.value) || 8)}
                    required
                    className="w-full border border-slate-300/60 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8350e8]/20 focus:border-[#8350e8]"
                    style={{ fontFamily: "'Rethink Sans', sans-serif" }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5" style={{ fontFamily: "'Archivo', sans-serif" }}>
                    Control Frequency (Hz) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={hz}
                    onChange={(e) => setHz(parseInt(e.target.value) || 20)}
                    required
                    className="w-full border border-slate-300/60 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8350e8]/20 focus:border-[#8350e8]"
                    style={{ fontFamily: "'Rethink Sans', sans-serif" }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5" style={{ fontFamily: "'Archivo', sans-serif" }}>
                    Steps
                  </label>
                  <div className="w-full border border-slate-300/60 rounded-lg px-4 py-2 bg-slate-50/50 text-slate-600 text-sm" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>
                    {steps}
                  </div>
                  <p className="text-xs text-slate-500 mt-1" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>
                    {durationSec} × {hz} = {steps}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5" style={{ fontFamily: "'Archivo', sans-serif" }}>
                    Fix Video (optional)
                  </label>
                  <input
                    type="file"
                    accept="video/mp4"
                    onChange={(e) => setFixVideo(e.target.files?.[0] || null)}
                    className="w-full border border-slate-300/60 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
                    style={{ fontFamily: "'Rethink Sans', sans-serif" }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full px-6 py-3 bg-[#8350e8] text-white rounded-lg hover:bg-[#8350e8]/90 disabled:opacity-50 font-medium transition-colors text-base"
                  style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '-0.02em' }}
                >
                  {submitting ? 'Submitting...' : 'Submit Fix'}
                </button>
              </div>
            </form>
          )}

          {job.status === 'accepted' && (
            <div className="mt-4 p-3 bg-green-50/50 border border-green-200/60 rounded-lg">
              <p className="text-sm text-green-800" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>
                ✓ Fix accepted! Job resolved.
              </p>
            </div>
          )}

          {job.status === 'rejected' && (
            <div className="mt-4 p-3 bg-red-50/50 border border-red-200/60 rounded-lg">
              <p className="text-sm text-red-800" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>
                ✗ Fix rejected. Please try again.
              </p>
            </div>
          )}
        </div>
      </ContentContainer>
    </AppShell>
  )
}
