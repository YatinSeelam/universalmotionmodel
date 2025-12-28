'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

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
    open: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    claimed: 'bg-blue-100 text-blue-800 border border-blue-200',
    submitted: 'bg-purple-100 text-purple-800 border border-purple-200',
    accepted: 'bg-green-100 text-green-800 border border-green-200',
    rejected: 'bg-red-100 text-red-800 border border-red-200',
  }
  return (
    <span className={`text-xs px-2.5 py-1 rounded-md font-medium ${colors[status as keyof typeof colors] || 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
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
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-[1396px] mx-auto px-6 sm:px-8 lg:px-12 py-12">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-600" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>Loading jobs...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-[1396px] mx-auto px-6 sm:px-8 lg:px-12 py-8 sm:py-12">
        {/* Header Section */}
        <div className="mb-8 sm:mb-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-medium text-slate-900 mb-3 leading-tight" style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '-0.02em' }}>
            Fix Queue
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl" style={{ fontFamily: "'Rethink Sans', sans-serif", letterSpacing: '-0.02em' }}>
            Review robot failures and submit corrections.
          </p>
        </div>

        {/* Filters Section */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 mb-6 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2" style={{ fontFamily: "'Archivo', sans-serif" }}>
                Lab
              </label>
              <select
                value={selectedLabId}
                onChange={(e) => setSelectedLabId(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
              >
                <option value="">All Labs</option>
                {labs.map((lab) => (
                  <option key={lab.id} value={lab.id}>
                    {lab.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2" style={{ fontFamily: "'Archivo', sans-serif" }}>
                Task
              </label>
              <select
                value={selectedTaskId}
                onChange={(e) => setSelectedTaskId(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
              >
                <option value="">All Tasks</option>
                {tasks.map((task) => (
                  <option key={task.id} value={task.id}>
                    {task.name} ({task.id})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2" style={{ fontFamily: "'Archivo', sans-serif" }}>
                Failure Reason
              </label>
              <select
                value={selectedFailureReason}
                onChange={(e) => setSelectedFailureReason(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
              >
                <option value="">All Failure Reasons</option>
                {failureReasons.filter((reason) => reason !== null).map((reason) => (
                  <option key={reason} value={reason}>
                    {reason}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Jobs Count */}
        {jobs.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-slate-600" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>
              {jobs.length} {jobs.length === 1 ? 'job' : 'jobs'} found
            </p>
          </div>
        )}

        {/* Jobs List */}
        {jobs.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-16 text-center shadow-sm">
            <div className="max-w-md mx-auto">
              <svg className="w-16 h-16 mx-auto mb-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-lg font-medium text-slate-900 mb-2" style={{ fontFamily: "'Archivo', sans-serif" }}>
                No jobs found
              </p>
              <p className="text-sm text-slate-600" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>
                Try adjusting your filters to see more results.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-4">
            {jobs.map((job) => (
              <div key={job.id} className="bg-white border border-slate-200 rounded-xl p-6 hover:border-purple-500/40 hover:shadow-md transition-all duration-200 shadow-sm group">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1 min-w-0">
                    {/* Top Row: Badges and Status */}
                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                      <StatusBadge status={job.status} />
                      {job.lab_name && (
                        <span className="text-xs px-2.5 py-1 bg-slate-50 text-slate-700 rounded-md border border-slate-200 font-medium">
                          {job.lab_name}
                        </span>
                      )}
                      {job.claimed_by_worker_name && (
                        <span className="text-xs px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md border border-blue-200 font-medium">
                          {job.claimed_by_worker_name}
                        </span>
                      )}
                      <span className="text-xs font-medium text-slate-400">#{job.id.slice(0, 8)}</span>
                    </div>

                    {/* Main Content */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <p className="text-sm font-medium text-slate-900">
                          {job.task_id}
                        </p>
                      </div>
                      
                      {job.failure_reason && (
                        <div className="flex items-start gap-2">
                          <svg className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p className="text-sm text-slate-600">
                            <span className="font-medium text-slate-700">Failure:</span> {job.failure_reason}
                          </p>
                        </div>
                      )}
                      
                      {job.failure_time_sec !== null && (
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p className="text-sm text-slate-600">
                            <span className="font-medium text-slate-700">Failed at:</span> {job.failure_time_sec.toFixed(1)}s
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Footer: Timestamp */}
                    <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                      <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-xs text-slate-500">
                        Created {new Date(job.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  {/* Action Button */}
                  <div className="flex-shrink-0">
                    <Link
                      href={`/work/jobs/${job.id}`}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 text-sm font-medium transition-all whitespace-nowrap shadow-sm hover:shadow-md group-hover:scale-105"
                      style={{ fontFamily: "'Archivo', sans-serif" }}
                    >
                      <span>Fix</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
