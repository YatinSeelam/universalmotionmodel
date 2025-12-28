'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface Lab {
  id: string
  name: string
}

interface Episode {
  id: string
  task_id: string
  success: boolean
  failure_reason: string | null
  failure_time_sec: number | null
  duration_sec: number
  quality_score: number
  video_path: string | null
  created_at: string
}

interface Task {
  id: string
  name: string
}

export default function LabDatasetPage() {
  const [labs, setLabs] = useState<Lab[]>([])
  const [selectedLabId, setSelectedLabId] = useState<string>('')
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedTaskId, setSelectedTaskId] = useState<string>('')
  const [selectedTab, setSelectedTab] = useState<'accepted' | 'edge_cases' | 'fixes'>('accepted')
  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLabs()
    fetchTasks()
  }, [])

  useEffect(() => {
    if (selectedLabId) {
      fetchEpisodes()
    }
  }, [selectedLabId, selectedTab, selectedTaskId])

  const fetchLabs = async () => {
    try {
      const res = await fetch(`${API_URL}/api/labs`)
      const data = await res.json()
      setLabs(data.labs || [])
      if (data.labs && data.labs.length > 0) {
        setSelectedLabId(data.labs[0].id)
      }
    } catch (error) {
      console.error('Failed to fetch labs:', error)
    } finally {
      setLoading(false)
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

  const fetchEpisodes = async () => {
    if (!selectedLabId) return
    setLoading(true)
    try {
      let url = `${API_URL}/api/labs/${selectedLabId}/episodes?`
      if (selectedTab === 'accepted') {
        url += 'accepted=true'
      } else if (selectedTab === 'edge_cases') {
        url += 'edge_case=true'
      }
      if (selectedTaskId) {
        url += `&task_id=${selectedTaskId}`
      }
      const res = await fetch(url)
      const data = await res.json()
      setEpisodes(data.episodes || [])
    } catch (error) {
      console.error('Failed to fetch episodes:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading && !episodes.length) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-[1396px] mx-auto px-6 sm:px-8 lg:px-12 py-12">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-600" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>Loading dataset...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const selectedLab = labs.find(l => l.id === selectedLabId)

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-[1396px] mx-auto px-6 sm:px-8 lg:px-12 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-medium text-slate-900 mb-3 leading-tight" style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '-0.02em' }}>
            Dataset Browser
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl" style={{ fontFamily: "'Rethink Sans', sans-serif", letterSpacing: '-0.02em' }}>
            Browse accepted data and edge cases.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 mb-6 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            {labs.length > 1 && (
              <div className="flex-1">
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2" style={{ fontFamily: "'Archivo', sans-serif" }}>
                  Lab
                </label>
                <select
                  value={selectedLabId}
                  onChange={(e) => setSelectedLabId(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                >
                  {labs.map((lab) => (
                    <option key={lab.id} value={lab.id}>
                      {lab.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
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
          </div>

          {/* Tabs */}
          <div className="flex gap-2 border-b border-slate-200">
            <button
              onClick={() => setSelectedTab('accepted')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                selectedTab === 'accepted'
                  ? 'border-b-2 border-purple-600 text-purple-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              style={{ fontFamily: "'Archivo', sans-serif" }}
            >
              Accepted
            </button>
            <button
              onClick={() => setSelectedTab('edge_cases')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                selectedTab === 'edge_cases'
                  ? 'border-b-2 border-purple-600 text-purple-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              style={{ fontFamily: "'Archivo', sans-serif" }}
            >
              Edge Cases
            </button>
            <button
              onClick={() => setSelectedTab('fixes')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                selectedTab === 'fixes'
                  ? 'border-b-2 border-purple-600 text-purple-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              style={{ fontFamily: "'Archivo', sans-serif" }}
            >
              Fixes
            </button>
          </div>
        </div>

        {/* Episodes Table */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-600" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>Loading episodes...</p>
            </div>
          ) : episodes.length === 0 ? (
            <div className="p-12 text-center">
              <svg className="w-16 h-16 mx-auto mb-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-lg font-medium text-slate-900 mb-2" style={{ fontFamily: "'Archivo', sans-serif" }}>
                No episodes found
              </p>
              <p className="text-sm text-slate-600" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>
                Try adjusting your filters to see more results.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider" style={{ fontFamily: "'Archivo', sans-serif" }}>
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider" style={{ fontFamily: "'Archivo', sans-serif" }}>
                      Task
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider" style={{ fontFamily: "'Archivo', sans-serif" }}>
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider" style={{ fontFamily: "'Archivo', sans-serif" }}>
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider" style={{ fontFamily: "'Archivo', sans-serif" }}>
                      Quality
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider" style={{ fontFamily: "'Archivo', sans-serif" }}>
                      Video
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {episodes.map((episode) => (
                    <tr key={episode.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>
                        {new Date(episode.created_at).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>
                        {episode.task_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-xs px-2.5 py-1 rounded-md font-medium ${
                          episode.success 
                            ? 'bg-green-100 text-green-800 border border-green-200' 
                            : 'bg-red-100 text-red-800 border border-red-200'
                        }`}>
                          {episode.success ? 'Success' : 'Failed'}
                        </span>
                        {episode.failure_reason && (
                          <span className="ml-2 text-xs text-slate-500" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>
                            {episode.failure_reason}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>
                        {episode.duration_sec.toFixed(1)}s
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>
                        {episode.quality_score}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {episode.video_path ? (
                          <span className="text-green-600 font-medium">✓</span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
