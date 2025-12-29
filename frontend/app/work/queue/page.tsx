'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AppShell } from '@/components/app-shell/AppShell'
import { ContentContainer } from '@/components/app-shell/ContentContainer'
import { ShellHeader } from '@/components/app-shell/ShellHeader'
import { FiZap } from 'react-icons/fi'
import { EmptyState } from '@/components/ui/empty-state'

import { apiFetch } from '@/lib/api'

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
    <span className={`text-xs px-2.5 py-1 rounded font-medium border ${colors[status as keyof typeof colors] || 'bg-slate-50 text-slate-600 border-slate-200'}`} style={{ fontFamily: "'Archivo', sans-serif" }}>
      {status.toUpperCase()}
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
  const [filtersOpen, setFiltersOpen] = useState(false)

  useEffect(() => {
    fetchLabs()
    fetchTasks()
    fetchJobs()
  }, [])

  useEffect(() => {
    fetchJobs()
  }, [selectedLabId, selectedTaskId, selectedFailureReason])

  const fetchLabs = async () => {
    const { data, error } = await apiFetch('/api/labs')
    if (error) {
      setLabs([])
      return
    }
    setLabs(data?.labs || [])
  }

  const fetchTasks = async () => {
    const { data, error } = await apiFetch('/api/tasks')
    if (error) {
      setTasks([])
      return
    }
    setTasks(data?.tasks || [])
  }

  const fetchJobs = async () => {
    setLoading(true)
    try {
      let url = '/api/jobs?'
      const params = new URLSearchParams()
      if (selectedLabId) params.append('lab_id', selectedLabId)
      if (selectedTaskId) params.append('task_id', selectedTaskId)
      if (selectedFailureReason) params.append('failure_reason', selectedFailureReason)
      url += params.toString()
      
      const { data, error } = await apiFetch(url)
      if (error) {
        setJobs([])
        return
      }
      
      // Sort: open first, then claimed, then submitted
      const sorted = (data?.jobs || []).sort((a: Job, b: Job) => {
        const order: Record<string, number> = { open: 0, claimed: 1, submitted: 2, accepted: 3, rejected: 4 }
        return (order[a.status] || 99) - (order[b.status] || 99)
      })
      setJobs(sorted)
    } finally {
      setLoading(false)
    }
  }

  const failureReasons = Array.from(new Set(jobs.map(j => j.failure_reason).filter(Boolean)))
  const nextJob = jobs.find(j => j.status === 'open') || jobs[0]

  const clearFilters = () => {
    setSelectedLabId('')
    setSelectedTaskId('')
    setSelectedFailureReason('')
  }

  if (loading) {
    return (
      <AppShell type="work">
        <ContentContainer>
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-600" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>Loading...</p>
            </div>
          </div>
        </ContentContainer>
      </AppShell>
    )
  }

  return (
    <AppShell type="work">
      <ContentContainer>
      <ShellHeader 
        title="Work Queue"
        description="Fix robot failures and earn"
      />

      {/* Filters - Collapsible */}
      <details className="bg-white border border-slate-200/60 rounded-lg mb-4">
        <summary 
          className="px-4 py-3 cursor-pointer text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-between"
          style={{ fontFamily: "'Archivo', sans-serif" }}
          onClick={() => setFiltersOpen(!filtersOpen)}
        >
          <span>Filters</span>
          <span className="text-xs text-slate-500">
            {(selectedLabId || selectedTaskId || selectedFailureReason) && 'Active'}
          </span>
        </summary>
        <div className="px-4 py-4 border-t border-slate-200/60">
          <div className="grid grid-cols-3 gap-3 mb-3">
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
          {(selectedLabId || selectedTaskId || selectedFailureReason) && (
            <button
              onClick={clearFilters}
              className="text-xs text-slate-600 hover:text-slate-900"
              style={{ fontFamily: "'Rethink Sans', sans-serif" }}
            >
              Clear filters
            </button>
          )}
        </div>
      </details>

      {/* Sticky Primary Action - Fix Next Episode */}
      {nextJob && (
        <div className="sticky top-6 z-10 bg-[#8350e8]/5 border border-[#8350e8]/20 rounded-lg p-5 mb-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 flex-1">
              <div className="w-10 h-10 bg-[#8350e8]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <FiZap className="w-5 h-5 text-[#8350e8]" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 
                  className="text-lg font-semibold text-slate-900 mb-1"
                  style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '-0.02em' }}
                >
                  Fix Next Episode
                </h3>
                <div className="flex items-center gap-2 mb-2">
                  <StatusBadge status={nextJob.status} />
                  {nextJob.lab_name && (
                    <span className="text-xs px-2 py-0.5 bg-slate-50 text-slate-700 rounded border border-slate-200" style={{ fontFamily: "'Archivo', sans-serif" }}>
                      {nextJob.lab_name}
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-700 mb-1" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>
                  {nextJob.task_id}
                </p>
                {nextJob.failure_reason && (
                  <p className="text-xs text-slate-600" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>
                    {nextJob.failure_reason}
                  </p>
                )}
              </div>
            </div>
            <Link
              href={`/work/jobs/${nextJob.id}`}
              className="px-6 py-2.5 bg-[#8350e8] hover:bg-[#8350e8]/90 text-white rounded-lg font-medium transition-colors whitespace-nowrap"
              style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '-0.02em' }}
            >
              Start Fixing →
            </Link>
          </div>
        </div>
      )}

      {/* Jobs Count */}
      {jobs.length > 0 && (
        <div className="mb-3">
          <p className="text-sm text-slate-600" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>
            {jobs.length} {jobs.length === 1 ? 'job' : 'jobs'} found
          </p>
        </div>
      )}

              {/* Jobs List - Card Layout */}
              {jobs.length === 0 ? (
                <div className="bg-white border border-slate-200/60 rounded-lg overflow-hidden">
                  <div className="flex items-center justify-center overflow-hidden px-8 pt-10 pb-12">
                    <EmptyState size="sm">
                      <EmptyState.Header pattern="grid">
                        <EmptyState.Illustration type="document">
                          <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </EmptyState.Illustration>
                      </EmptyState.Header>
                      <EmptyState.Content>
                        <EmptyState.Title>No jobs available</EmptyState.Title>
                        <EmptyState.Description>
                          There are no jobs in the queue right now. <br />
                          Check back later for new opportunities.
                        </EmptyState.Description>
                      </EmptyState.Content>
                    </EmptyState>
                  </div>
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
      </ContentContainer>
    </AppShell>
  )
}
