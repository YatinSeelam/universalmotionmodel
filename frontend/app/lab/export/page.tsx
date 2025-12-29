'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AppShell } from '@/components/app-shell/AppShell'
import { ContentContainer } from '@/components/app-shell/ContentContainer'
import { ShellHeader } from '@/components/app-shell/ShellHeader'

import { apiFetch, API_URL } from '@/lib/api'

interface Task {
  id: string
  name: string
}

interface DatasetStats {
  task_id: string
  total_episodes: number
  edge_cases: number
  fixes_submitted: number
  fixes_accepted: number
  accepted_episodes: number
  acceptance_rate: number
  average_quality_score: number
  top_failure_reasons: Array<{ reason: string; count: number }>
}

export default function LabExportPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedTask, setSelectedTask] = useState('')
  const [exporting, setExporting] = useState(false)
  const [stats, setStats] = useState<DatasetStats | null>(null)
  const [loadingStats, setLoadingStats] = useState(false)

  useEffect(() => {
    fetchTasks()
  }, [])

  useEffect(() => {
    if (selectedTask) {
      fetchStats()
    }
  }, [selectedTask])

  const fetchTasks = async () => {
    const { data, error } = await apiFetch('/api/tasks')
    if (error) {
      setTasks([])
      return
    }
    setTasks(data?.tasks || [])
    if (data?.tasks && data.tasks.length > 0) {
      setSelectedTask(data.tasks[0].id)
    }
  }

  const fetchStats = async () => {
    if (!selectedTask) return
    setLoadingStats(true)
    const { data, error } = await apiFetch(`/api/dataset/stats?task_id=${selectedTask}`)
    if (error) {
      setStats(null)
    } else {
      setStats(data)
    }
    setLoadingStats(false)
  }

  const handleExport = async () => {
    if (!selectedTask) {
      alert('Please select a task')
      return
    }

    setExporting(true)
    try {
      const { data, error } = await apiFetch(`/api/export?task_id=${selectedTask}`, {
        headers: { 'Accept': 'application/zip' }
      })
      if (error) {
        alert('Export failed')
      } else if (data instanceof Blob) {
        const url = window.URL.createObjectURL(data)
        const a = document.createElement('a')
        a.href = url
        a.download = `dataset_${selectedTask}_${new Date().toISOString().split('T')[0]}.zip`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Export error:', error)
      alert('Export failed')
    } finally {
      setExporting(false)
    }
  }

  return (
    <AppShell type="lab">
      <ContentContainer>
        <ShellHeader 
          title="Export"
          description="Download training datasets"
        />

        {/* Task Selection */}
        <div className="bg-white border border-slate-200/60 rounded-lg p-4 mb-4">
          <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5" style={{ fontFamily: "'Archivo', sans-serif" }}>
            Select Task
          </label>
          <select
            value={selectedTask}
            onChange={(e) => setSelectedTask(e.target.value)}
            className="w-full border border-slate-300/60 rounded-lg px-3 py-1.5 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#8350e8]/20 focus:border-[#8350e8]"
            style={{ fontFamily: "'Rethink Sans', sans-serif" }}
          >
            {tasks.map((task) => (
              <option key={task.id} value={task.id}>
                {task.name} ({task.id})
              </option>
            ))}
          </select>
        </div>

        {/* Loading State */}
        {loadingStats ? (
          <div className="bg-white border border-slate-200/60 rounded-lg p-8">
            <div className="flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mr-3"></div>
              <p className="text-slate-600 text-sm" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>Loading...</p>
            </div>
          </div>
        ) : stats && (
          <>
            {/* Dataset Report */}
            <div className="bg-white border border-slate-200/60 rounded-lg p-4 mb-4">
              <h2 className="text-sm font-semibold text-slate-900 mb-4" style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '-0.02em' }}>Dataset Report</h2>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                  <div className="text-xl font-bold text-blue-600 mb-0.5" style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '-0.02em' }}>{stats.total_episodes}</div>
                  <div className="text-xs text-slate-600" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>Total Episodes</div>
                </div>
                <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3">
                  <div className="text-xl font-bold text-yellow-600 mb-0.5" style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '-0.02em' }}>{stats.edge_cases}</div>
                  <div className="text-xs text-slate-600" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>Edge Cases</div>
                </div>
                <div className="bg-green-50 border border-green-100 rounded-lg p-3">
                  <div className="text-xl font-bold text-green-600 mb-0.5" style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '-0.02em' }}>{stats.accepted_episodes}</div>
                  <div className="text-xs text-slate-600" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>Accepted</div>
                </div>
                <div className="bg-[#8350e8]/5 border border-[#8350e8]/20 rounded-lg p-3">
                  <div className="text-xl font-bold text-[#8350e8] mb-0.5" style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '-0.02em' }}>{stats.fixes_submitted}</div>
                  <div className="text-xs text-slate-600" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>Fixes Submitted</div>
                </div>
                <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3">
                  <div className="text-xl font-bold text-emerald-600 mb-0.5" style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '-0.02em' }}>{stats.fixes_accepted}</div>
                  <div className="text-xs text-slate-600" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>Fixes Accepted</div>
                </div>
                <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3">
                  <div className="text-xl font-bold text-indigo-600 mb-0.5" style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '-0.02em' }}>{stats.acceptance_rate}%</div>
                  <div className="text-xs text-slate-600" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>Acceptance Rate</div>
                </div>
              </div>

              {/* Average Quality Score */}
              <div className="mb-4 pb-4 border-b border-slate-200/60">
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1" style={{ fontFamily: "'Archivo', sans-serif" }}>
                  Average Quality Score
                </div>
                <div className="text-2xl font-bold text-slate-900" style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '-0.02em' }}>{stats.average_quality_score}/100</div>
              </div>

              {/* Top Failure Reasons */}
              {stats.top_failure_reasons.length > 0 && (
                <div>
                  <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3" style={{ fontFamily: "'Archivo', sans-serif" }}>
                    Top Failure Reasons
                  </div>
                  <div className="space-y-2">
                    {stats.top_failure_reasons.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between py-2 px-3 bg-slate-50/50 rounded-lg border border-slate-200/60">
                        <span className="text-sm text-slate-700 font-medium" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>{item.reason}</span>
                        <span className="text-sm font-bold text-slate-900" style={{ fontFamily: "'Archivo', sans-serif" }}>{item.count} {item.count === 1 ? 'occurrence' : 'occurrences'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Export Button */}
            <div className="bg-white border border-slate-200/60 rounded-lg p-4">
              <button
                onClick={handleExport}
                disabled={exporting || !selectedTask}
                className="w-full px-6 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors flex items-center justify-center gap-2"
                style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '-0.02em' }}
              >
                {exporting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Exporting...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span>Download Dataset ZIP</span>
                  </>
                )}
              </button>
              <p className="text-xs text-slate-500 mt-2 text-center" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>
                Downloads a ZIP file containing all accepted episodes and fixes.
              </p>
            </div>
          </>
        )}
      </ContentContainer>
    </AppShell>
  )
}
