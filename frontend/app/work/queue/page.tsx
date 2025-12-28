'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { WorkerDashboardNav } from '@/components/DashboardNav'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface Job {
  id: string
  task_id: string
  episode_id: string
  status: string
  failure_reason: string | null
  failure_time_sec: number | null
  created_at: string
  video_url?: string | null
  lab_id?: string | null
  lab_name?: string | null
  claimed_by_worker_name?: string | null
}

interface Lab {
  id: string
  name: string
}

interface Task {
  id: string
  name: string
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

export default function WorkQueuePage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [labs, setLabs] = useState<Lab[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedLabId, setSelectedLabId] = useState<string>('')
  const [selectedTaskId, setSelectedTaskId] = useState<string>('')
  const [selectedFailureReason, setSelectedFailureReason] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLabs()
    fetchTasks()
    fetchJobs()
  }, [])

  useEffect(() => {
    fetchJobs()
  }, [selectedLabId, selectedTaskId, selectedFailureReason])

  const fetchLabs = async () => {
    try {
      const res = await fetch(`${API_URL}/api/labs`)
      const data = await res.json()
      setLabs(data.labs || [])
    } catch (error) {
      console.error('Failed to fetch labs:', error)
    }
  }

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API_URL}/api/tasks`)
      const data = await res.json()
      setTasks(data.tasks || [])
    } catch (error) {
      console.error('Failed to fetch tasks:', error)
    }
  }

  const fetchJobs = async () => {
    setLoading(true)
    try {
      let url = `${API_URL}/api/jobs?`
      const params = new URLSearchParams()
      if (selectedLabId) params.append('lab_id', selectedLabId)
      if (selectedTaskId) params.append('task_id', selectedTaskId)
      if (selectedFailureReason) params.append('failure_reason', selectedFailureReason)
      url += params.toString()
      
      const res = await fetch(url)
      const data = await res.json()
      setJobs(data.jobs || [])
    } catch (error) {
      console.error('Failed to fetch jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  const failureReasons = Array.from(new Set(jobs.map(j => j.failure_reason).filter(Boolean)))

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <WorkerDashboardNav />
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-600" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>Loading...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <WorkerDashboardNav />
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Header */}
        <div className="mb-5">
          <h1 className="text-2xl font-medium text-slate-900 mb-1.5" style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '-0.02em' }}>Fix Queue</h1>
          <p className="text-sm text-slate-600" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>Review robot failures and submit corrections.</p>
        </div>

        {/* Filters */}
        <div className="bg-white border border-slate-200/60 rounded-lg p-4 mb-4">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5" style={{ fontFamily: "'Archivo', sans-serif" }}>Lab</label>
              <select
                value={selectedLabId}
                onChange={(e) => setSelectedLabId(e.target.value)}
                className="w-full border border-slate-300/60 rounded-lg px-3 py-1.5 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#8350e8]/20 focus:border-[#8350e8]"
                style={{ fontFamily: "'Rethink Sans', sans-serif" }}
              >
                <option value="">All Labs</option>
                {labs.map((lab) => (
                  <option key={lab.id} value={lab.id}>{lab.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5" style={{ fontFamily: "'Archivo', sans-serif" }}>Task</label>
              <select
                value={selectedTaskId}
                onChange={(e) => setSelectedTaskId(e.target.value)}
                className="w-full border border-slate-300/60 rounded-lg px-3 py-1.5 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#8350e8]/20 focus:border-[#8350e8]"
                style={{ fontFamily: "'Rethink Sans', sans-serif" }}
              >
                <option value="">All Tasks</option>
                {tasks.map((task) => (
                  <option key={task.id} value={task.id}>{task.name} ({task.id})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5" style={{ fontFamily: "'Archivo', sans-serif" }}>Failure Reason</label>
              <select
                value={selectedFailureReason}
                onChange={(e) => setSelectedFailureReason(e.target.value)}
                className="w-full border border-slate-300/60 rounded-lg px-3 py-1.5 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#8350e8]/20 focus:border-[#8350e8]"
                style={{ fontFamily: "'Rethink Sans', sans-serif" }}
              >
                <option value="">All Failure Reasons</option>
                {failureReasons.filter((reason) => reason !== null).map((reason) => (
                  <option key={reason} value={reason}>{reason}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Jobs Count */}
        {jobs.length > 0 && (
          <div className="mb-3">
            <p className="text-sm text-slate-600" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>
              {jobs.length} {jobs.length === 1 ? 'job' : 'jobs'} found
            </p>
          </div>
        )}

        {/* Jobs List */}
        {jobs.length === 0 ? (
          <div className="bg-white border border-slate-200/60 rounded-lg p-12 text-center">
            <p className="text-slate-600 text-sm" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>No jobs found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => (
              <div key={job.id} className="bg-white border border-slate-200/60 rounded-lg p-4 hover:border-[#8350e8]/30 hover:bg-[#8350e8]/5 transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <StatusBadge status={job.status} />
                      {job.lab_name && (
                        <span className="text-xs px-2 py-0.5 bg-slate-50 text-slate-700 rounded border border-slate-200" style={{ fontFamily: "'Archivo', sans-serif" }}>
                          {job.lab_name}
                        </span>
                      )}
                      <span className="text-xs text-slate-400 font-mono">#{job.id.slice(0, 8)}</span>
                    </div>
                    <div className="space-y-1.5 mb-2">
                      <p className="text-sm font-medium text-slate-900" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>
                        {job.task_id}
                      </p>
                      {job.failure_reason && (
                        <p className="text-xs text-slate-600" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>
                          {job.failure_reason}
                        </p>
                      )}
                      {job.failure_time_sec !== null && (
                        <p className="text-xs text-slate-500" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>
                          Failed at {job.failure_time_sec.toFixed(1)}s
                        </p>
                      )}
                    </div>
                    <p className="text-xs text-slate-400" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>
                      {new Date(job.created_at).toLocaleString()}
                    </p>
                  </div>
                  <Link
                    href={`/work/jobs/${job.id}`}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
                    style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '-0.02em' }}
                  >
                    Fix
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
