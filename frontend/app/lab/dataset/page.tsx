'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { LabDashboardNav } from '@/components/DashboardNav'

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
      <div className="min-h-screen bg-white">
        <LabDashboardNav />
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
      <LabDashboardNav />
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Filters */}
        <div className="bg-white border border-slate-200/60 rounded-lg p-4 mb-4">
          <div className="flex flex-col sm:flex-row gap-3 mb-3">
            {labs.length > 1 && (
              <div className="flex-1">
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5" style={{ fontFamily: "'Archivo', sans-serif" }}>Lab</label>
                <select
                  value={selectedLabId}
                  onChange={(e) => setSelectedLabId(e.target.value)}
                  className="w-full border border-slate-300/60 rounded-lg px-3 py-1.5 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#8350e8]/20 focus:border-[#8350e8]"
                  style={{ fontFamily: "'Rethink Sans', sans-serif" }}
                >
                  {labs.map((lab) => (
                    <option key={lab.id} value={lab.id}>{lab.name}</option>
                  ))}
                </select>
              </div>
            )}
            <div className="flex-1">
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5" style={{ fontFamily: "'Archivo', sans-serif" }}>Task</label>
              <select
                value={selectedTaskId}
                onChange={(e) => setSelectedTaskId(e.target.value)}
                className="w-full border border-slate-300/60 rounded-lg px-3 py-1.5 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                style={{ fontFamily: "'Rethink Sans', sans-serif" }}
              >
                <option value="">All Tasks</option>
                {tasks.map((task) => (
                  <option key={task.id} value={task.id}>{task.name} ({task.id})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 border-b border-slate-200/60">
            <button
              onClick={() => setSelectedTab('accepted')}
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                selectedTab === 'accepted'
                  ? 'border-b-2 border-[#8350e8] text-[#8350e8]'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '-0.02em' }}
            >
              Accepted
            </button>
            <button
              onClick={() => setSelectedTab('edge_cases')}
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                selectedTab === 'edge_cases'
                  ? 'border-b-2 border-[#8350e8] text-[#8350e8]'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '-0.02em' }}
            >
              Edge Cases
            </button>
            <button
              onClick={() => setSelectedTab('fixes')}
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                selectedTab === 'fixes'
                  ? 'border-b-2 border-[#8350e8] text-[#8350e8]'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '-0.02em' }}
            >
              Fixes
            </button>
          </div>
        </div>

        {/* Episodes Table */}
        <div className="bg-white border border-slate-200/60 rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-600 text-sm" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>Loading...</p>
            </div>
          ) : episodes.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-slate-600 text-sm" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>No episodes found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50/50">
                  <tr>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-600 uppercase tracking-wider" style={{ fontFamily: "'Archivo', sans-serif" }}>Time</th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-600 uppercase tracking-wider" style={{ fontFamily: "'Archivo', sans-serif" }}>Task</th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-600 uppercase tracking-wider" style={{ fontFamily: "'Archivo', sans-serif" }}>Status</th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-600 uppercase tracking-wider" style={{ fontFamily: "'Archivo', sans-serif" }}>Duration</th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-600 uppercase tracking-wider" style={{ fontFamily: "'Archivo', sans-serif" }}>Quality</th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-600 uppercase tracking-wider" style={{ fontFamily: "'Archivo', sans-serif" }}>Video</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/60">
                  {episodes.map((episode) => (
                    <tr key={episode.id} className="hover:bg-[#8350e8]/5 transition-colors">
                      <td className="px-4 py-2.5 text-slate-600 text-xs" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>{new Date(episode.created_at).toLocaleString()}</td>
                      <td className="px-4 py-2.5 font-medium text-slate-900 text-sm" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>{episode.task_id}</td>
                      <td className="px-4 py-2.5">
                        <span className={`text-xs px-2 py-0.5 rounded font-medium border ${
                          episode.success 
                            ? 'bg-green-50 text-green-700 border-green-200' 
                            : 'bg-red-50 text-red-700 border-red-200'
                        }`} style={{ fontFamily: "'Archivo', sans-serif" }}>
                          {episode.success ? 'Success' : 'Failed'}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-slate-600 text-sm" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>{episode.duration_sec.toFixed(1)}s</td>
                      <td className="px-4 py-2.5 text-slate-600 text-sm" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>{episode.quality_score}</td>
                      <td className="px-4 py-2.5">
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
