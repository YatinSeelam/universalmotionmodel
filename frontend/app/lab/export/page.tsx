'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

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
    try {
      const res = await fetch(`${API_URL}/api/tasks`)
      const data = await res.json()
      setTasks(data.tasks || [])
      if (data.tasks && data.tasks.length > 0) {
        setSelectedTask(data.tasks[0].id)
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error)
    }
  }

  const fetchStats = async () => {
    if (!selectedTask) return
    setLoadingStats(true)
    try {
      const res = await fetch(`${API_URL}/api/dataset/stats?task_id=${selectedTask}`)
      const data = await res.json()
      setStats(data)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoadingStats(false)
    }
  }

  const handleExport = async () => {
    if (!selectedTask) {
      alert('Please select a task')
      return
    }

    setExporting(true)
    try {
      const res = await fetch(`${API_URL}/api/export?task_id=${selectedTask}`)
      if (res.ok) {
        const blob = await res.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `dataset_${selectedTask}_${new Date().toISOString().split('T')[0]}.zip`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        alert('Export failed')
      }
    } catch (error) {
      console.error('Export error:', error)
      alert('Export failed')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-[1396px] mx-auto px-6 sm:px-8 lg:px-12 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-medium text-slate-900 mb-3 leading-tight" style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '-0.02em' }}>
            Export Dataset
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl" style={{ fontFamily: "'Rethink Sans', sans-serif", letterSpacing: '-0.02em' }}>
            Download curated datasets with accepted episodes and fixes.
          </p>
        </div>

        {/* Task Selection */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6 shadow-sm">
          <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-3" style={{ fontFamily: "'Archivo', sans-serif" }}>
            Select Task
          </label>
          <select
            value={selectedTask}
            onChange={(e) => setSelectedTask(e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
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
          <div className="bg-white border border-slate-200 rounded-xl p-12 shadow-sm">
            <div className="flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin mr-3"></div>
              <p className="text-slate-600" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>Loading dataset statistics...</p>
            </div>
          </div>
        ) : stats && (
          <>
            {/* Dataset Report */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 mb-6 shadow-sm">
              <h2 className="text-2xl font-medium text-slate-900 mb-6" style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '-0.02em' }}>
                Dataset Report
              </h2>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-5">
                  <div className="text-3xl font-bold text-blue-600 mb-1">{stats.total_episodes}</div>
                  <div className="text-sm text-slate-600 font-medium">Total Episodes</div>
                </div>
                <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-5">
                  <div className="text-3xl font-bold text-yellow-600 mb-1">{stats.edge_cases}</div>
                  <div className="text-sm text-slate-600 font-medium">Edge Cases</div>
                </div>
                <div className="bg-green-50 border border-green-100 rounded-lg p-5">
                  <div className="text-3xl font-bold text-green-600 mb-1">{stats.accepted_episodes}</div>
                  <div className="text-sm text-slate-600 font-medium">Accepted Episodes</div>
                </div>
                <div className="bg-purple-50 border border-purple-100 rounded-lg p-5">
                  <div className="text-3xl font-bold text-purple-600 mb-1">{stats.fixes_submitted}</div>
                  <div className="text-sm text-slate-600 font-medium">Fixes Submitted</div>
                </div>
                <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-5">
                  <div className="text-3xl font-bold text-emerald-600 mb-1">{stats.fixes_accepted}</div>
                  <div className="text-sm text-slate-600 font-medium">Fixes Accepted</div>
                </div>
                <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-5">
                  <div className="text-3xl font-bold text-indigo-600 mb-1">{stats.acceptance_rate}%</div>
                  <div className="text-sm text-slate-600 font-medium">Acceptance Rate</div>
                </div>
              </div>

              {/* Average Quality Score */}
              <div className="mb-6 pb-6 border-b border-slate-200">
                <div className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2" style={{ fontFamily: "'Archivo', sans-serif" }}>
                  Average Quality Score
                </div>
                <div className="text-4xl font-bold text-slate-900">{stats.average_quality_score}/100</div>
              </div>

              {/* Top Failure Reasons */}
              {stats.top_failure_reasons.length > 0 && (
                <div>
                  <div className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-4" style={{ fontFamily: "'Archivo', sans-serif" }}>
                    Top Failure Reasons
                  </div>
                  <div className="space-y-2">
                    {stats.top_failure_reasons.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between py-2 px-3 bg-slate-50 rounded-lg border border-slate-200">
                        <span className="text-sm text-slate-700 font-medium">{item.reason}</span>
                        <span className="text-sm font-bold text-slate-900">{item.count} {item.count === 1 ? 'occurrence' : 'occurrences'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Export Button */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <button
                onClick={handleExport}
                disabled={exporting || !selectedTask}
                className="w-full px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                style={{ fontFamily: "'Archivo', sans-serif" }}
              >
                {exporting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Exporting...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span>Download Dataset ZIP</span>
                  </>
                )}
              </button>
              <p className="text-sm text-slate-500 mt-4 text-center" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>
                Downloads a ZIP file containing all accepted episodes and fixes for the selected task.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
