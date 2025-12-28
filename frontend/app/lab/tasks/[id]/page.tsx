'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { LabDashboardNav } from '@/components/DashboardNav'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface JobDetail {
  id: string
  task_id: string
  episode_id: string
  status: string
  claimed_by_worker_id?: string | null
  fix_episode_id?: string | null
  episode: {
    id: string
    success: boolean
    failure_reason: string | null
    failure_time_sec: number | null
    video_path: string | null
  }
  fix_episode?: {
    id: string
    success: boolean
    video_path: string | null
  }
  video_url: string | null
  fix_video_url: string | null
}

export default function LabTaskDetailPage() {
  const params = useParams()
  const router = useRouter()
  const taskId = params.id as string
  const videoRef = useRef<HTMLVideoElement>(null)
  const fixVideoRef = useRef<HTMLVideoElement>(null)

  const [job, setJob] = useState<JobDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    fetchJob()
  }, [taskId])

  const fetchJob = async () => {
    try {
      const res = await fetch(`${API_URL}/api/jobs/${taskId}`)
      const data = await res.json()
      
      if (data.fix_episode_id) {
        try {
          const fixRes = await fetch(`${API_URL}/api/episodes/${data.fix_episode_id}`)
          if (fixRes.ok) {
            const fixData = await fixRes.json()
            data.fix_episode = fixData
            data.fix_video_url = fixData.video_url
          }
        } catch (error) {
          console.error('Failed to fetch fix episode:', error)
        }
      }
      
      setJob(data)
    } catch (error) {
      console.error('Failed to fetch job:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async () => {
    setActionLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/jobs/${taskId}/approve`, { method: 'POST' })
      if (res.ok) {
        fetchJob()
      }
    } catch (error) {
      console.error('Failed to approve:', error)
      alert('Failed to approve task')
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async () => {
    const reason = prompt('Rejection reason:')
    if (!reason) return
    
    setActionLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/jobs/${taskId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: reason || '' })
      })
      if (res.ok) {
        fetchJob()
      }
    } catch (error) {
      console.error('Failed to reject:', error)
      alert('Failed to reject task')
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-slate-600">Task not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <LabDashboardNav />
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <div>
            <Link href="/lab/dashboard" className="text-xs text-slate-500 hover:text-[#8350e8] mb-1.5 inline-block" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>
              ← Back to Dashboard
            </Link>
            <h1 className="text-xl font-medium text-slate-900 mb-1" style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '-0.02em' }}>Task Detail</h1>
            <p className="text-sm text-slate-500" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>Task ID: {job.task_id}</p>
          </div>
          {job.status === 'submitted' && (
            <div className="flex gap-2">
              <button
                onClick={handleReject}
                disabled={actionLoading}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 transition-colors"
                style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '-0.02em' }}
              >
                Reject
              </button>
              <button
                onClick={handleApprove}
                disabled={actionLoading}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 transition-colors"
                style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '-0.02em' }}
              >
                Approve
              </button>
            </div>
          )}
        </div>

        {/* Split Layout */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Left: Original Failure */}
          <div className="bg-white border border-slate-200/60 rounded-lg p-4">
            <h2 className="text-sm font-semibold text-slate-900 mb-3" style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '-0.02em' }}>Original Failure</h2>
            
            {job.video_url ? (
              <div className="mb-3">
                <video
                  ref={videoRef}
                  src={job.video_url}
                  controls
                  className="w-full rounded-lg border border-slate-200/60"
                />
              </div>
            ) : (
              <div className="mb-3 bg-slate-50/50 border border-slate-200/60 rounded-lg p-6 text-center">
                <p className="text-slate-400 text-sm" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>No video available</p>
              </div>
            )}

            <div className="space-y-2 text-sm">
              <div>
                <span className="text-slate-500" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>Failure Reason:</span>
                <p className="text-slate-900 mt-0.5" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>{job.episode.failure_reason || 'N/A'}</p>
              </div>
              {job.episode.failure_time_sec !== null && (
                <div>
                  <span className="text-slate-500" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>Failure Time:</span>
                  <p className="text-slate-900 mt-0.5" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>{job.episode.failure_time_sec.toFixed(1)}s</p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Worker's Correction */}
          <div className="bg-white border border-slate-200/60 rounded-lg p-4">
            <h2 className="text-sm font-semibold text-slate-900 mb-3" style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '-0.02em' }}>Worker's Correction</h2>
            
            {job.fix_episode ? (
              <>
                {job.fix_video_url ? (
                  <div className="mb-3">
                    <video
                      ref={fixVideoRef}
                      src={job.fix_video_url}
                      controls
                      className="w-full rounded-lg border border-slate-200/60"
                    />
                  </div>
                ) : (
                  <div className="mb-3 bg-slate-50/50 border border-slate-200/60 rounded-lg p-6 text-center">
                    <p className="text-slate-400 text-sm" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>No video available</p>
                  </div>
                )}

                <div className="space-y-2 text-sm mb-3">
                  <div>
                    <span className="text-slate-500" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>Status:</span>
                    <p className="text-slate-900 mt-0.5" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>{job.fix_episode.success ? 'Success' : 'Failed'}</p>
                  </div>
                </div>
                
                {/* Quality Signals */}
                <div className="mt-3 pt-3 border-t border-slate-200/60">
                  <h3 className="text-xs font-semibold text-slate-700 mb-2" style={{ fontFamily: "'Archivo', sans-serif" }}>Quality Signals</h3>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>Path Smoothness</span>
                      <span className="text-green-600 font-medium" style={{ fontFamily: "'Archivo', sans-serif" }}>Good</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>Constraint Violations</span>
                      <span className="text-green-600 font-medium" style={{ fontFamily: "'Archivo', sans-serif" }}>None</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>Confidence Score</span>
                      <span className="text-[#8350e8] font-medium" style={{ fontFamily: "'Archivo', sans-serif" }}>85%</span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-slate-50/50 border border-slate-200/60 rounded-lg p-6 text-center">
                <p className="text-slate-400 text-sm" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>No correction submitted yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
