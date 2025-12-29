'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AppShell } from '@/components/app-shell/AppShell'
import { ContentContainer } from '@/components/app-shell/ContentContainer'
import { ShellHeader } from '@/components/app-shell/ShellHeader'

import { apiFetch } from '@/lib/api'

interface Lab {
  id: string
  name: string
}

interface Project {
  id: string
  name: string
  lab_id: string
}

interface Task {
  id: string
  task_id: string
  status: string
  worker_id?: string
  quality_score?: number
  submitted_at?: string
}

interface PipelineStats {
  uploaded: number
  in_review: number
  in_progress: number
  completed: number
  rejected: number
}

interface DashboardStats {
  tasks_created: number
  tasks_completed: number
  approval_rate: number
  avg_fix_time: number
  active_workers: number
}

export default function LabDashboardPage() {
  const router = useRouter()
  const [labs, setLabs] = useState<Lab[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedLabId, setSelectedLabId] = useState<string>('')
  const [selectedProjectId, setSelectedProjectId] = useState<string>('')
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [pipelineStats, setPipelineStats] = useState<PipelineStats | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedStatus, setSelectedStatus] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLabs()
  }, [])

  useEffect(() => {
    if (selectedLabId) {
      fetchProjects()
      fetchStats()
      fetchPipelineStats()
      fetchTasks()
    }
  }, [selectedLabId, selectedProjectId, selectedStatus])

  const fetchLabs = async () => {
    const { data, error } = await apiFetch('/api/labs')
    if (error) {
      setLabs([])
      setLoading(false)
      return
    }
    setLabs(data?.labs || [])
    if (data?.labs && data.labs.length > 0) {
      setSelectedLabId(data.labs[0].id)
    }
    setLoading(false)
  }

  const fetchProjects = async () => {
    if (!selectedLabId) return
    
    const { data, error } = await apiFetch(`/api/projects?lab_id=${selectedLabId}`)
    if (error) {
      setProjects([])
      return
    }
    setProjects(data?.projects || [])
    if (data?.projects && data.projects.length > 0) {
      setSelectedProjectId(data.projects[0].id)
    }
  }

  const fetchStats = async () => {
    if (!selectedLabId) return
    
    const { data: summaryData, error: summaryError } = await apiFetch(`/api/labs/${selectedLabId}/summary`)
    if (summaryError) {
      setStats(null)
      return
    }
    
    const { data: jobsData, error: jobsError } = await apiFetch(`/api/jobs?lab_id=${selectedLabId}`)
    if (jobsError) {
      setStats(null)
      return
    }
    
    const allJobs = jobsData?.jobs || []
    const avgFixTime = 34
    const activeWorkers = new Set(
      allJobs
        .filter((j: any) => j.claimed_by_worker_id)
        .map((j: any) => j.claimed_by_worker_id)
    ).size
    
    setStats({
      tasks_created: allJobs.length,
      tasks_completed: allJobs.filter((j: any) => j.status === 'accepted').length,
      approval_rate: summaryData?.acceptance_rate || 0,
      avg_fix_time: avgFixTime,
      active_workers: activeWorkers
    })
  }

  const fetchPipelineStats = async () => {
    if (!selectedLabId) return
    
    const { data, error } = await apiFetch(`/api/jobs?lab_id=${selectedLabId}`)
    if (error) {
      setPipelineStats(null)
      return
    }
    
    const allJobs = data?.jobs || []
    setPipelineStats({
      uploaded: allJobs.filter((j: any) => j.status === 'open').length,
      in_review: allJobs.filter((j: any) => j.status === 'submitted').length,
      in_progress: allJobs.filter((j: any) => j.status === 'claimed').length,
      completed: allJobs.filter((j: any) => j.status === 'accepted').length,
      rejected: allJobs.filter((j: any) => j.status === 'rejected').length
    })
  }

  const fetchTasks = async () => {
    if (!selectedLabId) return
    
    let url = `/api/jobs?lab_id=${selectedLabId}`
    if (selectedStatus) {
      url += `&status=${selectedStatus}`
    }
    
    const { data, error } = await apiFetch(url)
    if (error) {
      setTasks([])
      return
    }
    
    const transformedTasks = (data?.jobs || []).map((job: any) => ({
      id: job.id,
      task_id: job.task_id,
      status: job.status,
      worker_id: job.claimed_by_worker_id,
      quality_score: 85,
      submitted_at: job.updated_at
    }))
    
    setTasks(transformedTasks)
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      open: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      claimed: 'bg-blue-50 text-blue-700 border-blue-200',
      submitted: 'bg-purple-50 text-purple-700 border-purple-200',
      accepted: 'bg-green-50 text-green-700 border-green-200',
      rejected: 'bg-red-50 text-red-700 border-red-200'
    }
    return colors[status] || 'bg-slate-50 text-slate-600 border-slate-200'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <AppShell type="lab">
      <ContentContainer>
        <ShellHeader 
          title="Overview"
          description="Monitor your dataset health"
          actions={
            <div className="flex items-center gap-3">
              {projects.length > 0 && (
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="bg-white border border-slate-300/60 rounded-lg px-3 py-1.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#8350e8]/20 focus:border-[#8350e8]"
                  style={{ fontFamily: "'Rethink Sans', sans-serif" }}
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              )}
              <span className="px-2.5 py-1 bg-green-50 text-green-700 border border-green-200 rounded-md text-xs font-medium" style={{ fontFamily: "'Archivo', sans-serif" }}>
                Active
              </span>
            <Link
              href="/lab/export"
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-medium transition-colors"
              style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '-0.02em' }}
            >
              Export
            </Link>
          </div>
          }
        />
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-5 gap-3 mb-5">
            <div className="bg-white border border-slate-200/60 rounded-lg p-4 hover:border-purple-300/60 transition-colors">
              <div className="text-2xl font-bold text-slate-900 mb-0.5" style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '-0.02em' }}>{stats.tasks_created}</div>
              <div className="text-xs text-slate-600" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>Tasks Created</div>
            </div>
            <div className="bg-white border border-slate-200/60 rounded-lg p-4 hover:border-purple-300/60 transition-colors">
              <div className="text-2xl font-bold text-slate-900 mb-0.5" style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '-0.02em' }}>{stats.tasks_completed}</div>
              <div className="text-xs text-slate-600" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>Tasks Completed</div>
            </div>
            <div className="bg-white border border-slate-200/60 rounded-lg p-4 hover:border-purple-300/60 transition-colors">
              <div className="text-2xl font-bold text-slate-900 mb-0.5" style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '-0.02em' }}>{stats.approval_rate.toFixed(1)}%</div>
              <div className="text-xs text-slate-600" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>Approval Rate</div>
            </div>
            <div className="bg-white border border-slate-200/60 rounded-lg p-4 hover:border-purple-300/60 transition-colors">
              <div className="text-2xl font-bold text-slate-900 mb-0.5" style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '-0.02em' }}>{stats.avg_fix_time}s</div>
              <div className="text-xs text-slate-600" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>Avg Fix Time</div>
            </div>
            <div className="bg-white border border-slate-200/60 rounded-lg p-4 hover:border-purple-300/60 transition-colors">
              <div className="text-2xl font-bold text-slate-900 mb-0.5" style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '-0.02em' }}>{stats.active_workers}</div>
              <div className="text-xs text-slate-600" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>Active Workers</div>
            </div>
          </div>
        )}

        {/* Pipeline */}
        {pipelineStats && (
          <div className="bg-white border border-slate-200/60 rounded-lg p-4 mb-5">
            <div className="grid grid-cols-5 gap-3">
              {[
                { key: 'uploaded', label: 'Uploaded', count: pipelineStats.uploaded },
                { key: 'in_review', label: 'In Review', count: pipelineStats.in_review },
                { key: 'in_progress', label: 'In Progress', count: pipelineStats.in_progress },
                { key: 'completed', label: 'Completed', count: pipelineStats.completed },
                { key: 'rejected', label: 'Rejected', count: pipelineStats.rejected }
              ].map((stage) => (
                <button
                  key={stage.key}
                  onClick={() => setSelectedStatus(stage.key === 'uploaded' ? 'open' : stage.key === 'in_review' ? 'submitted' : stage.key === 'in_progress' ? 'claimed' : stage.key === 'completed' ? 'accepted' : 'rejected')}
                  className="text-left p-3 bg-slate-50/50 border border-slate-200/60 rounded-lg hover:border-[#8350e8]/30 hover:bg-[#8350e8]/5 transition-colors"
                >
                  <div className="text-xl font-bold text-slate-900 mb-0.5" style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '-0.02em' }}>{stage.count}</div>
                  <div className="text-xs text-slate-600" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>{stage.label}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tasks Table */}
        <div className="bg-white border border-slate-200/60 rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-200/60 bg-slate-50/30">
            <h2 className="text-sm font-semibold text-slate-900" style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '-0.02em' }}>Live Tasks</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-600 uppercase tracking-wider" style={{ fontFamily: "'Archivo', sans-serif" }}>Task ID</th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-600 uppercase tracking-wider" style={{ fontFamily: "'Archivo', sans-serif" }}>Status</th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-600 uppercase tracking-wider" style={{ fontFamily: "'Archivo', sans-serif" }}>Worker ID</th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-600 uppercase tracking-wider" style={{ fontFamily: "'Archivo', sans-serif" }}>Quality</th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-600 uppercase tracking-wider" style={{ fontFamily: "'Archivo', sans-serif" }}>Submitted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60">
                {tasks.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-slate-500 text-sm" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>No tasks found</td>
                  </tr>
                ) : (
                  tasks.map((task) => (
                    <tr
                      key={task.id}
                      onClick={() => router.push(`/lab/tasks/${task.id}`)}
                      className="hover:bg-[#8350e8]/5 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-2.5 font-mono text-slate-900 text-sm" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>{task.task_id}</td>
                      <td className="px-4 py-2.5">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getStatusColor(task.status)}`} style={{ fontFamily: "'Archivo', sans-serif" }}>
                          {task.status}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-slate-600 text-sm" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>
                        {task.worker_id ? task.worker_id.slice(0, 8) : '-'}
                      </td>
                      <td className="px-4 py-2.5 text-slate-600 text-sm" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>{task.quality_score || '-'}</td>
                      <td className="px-4 py-2.5 text-slate-500 text-xs" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>
                        {task.submitted_at ? new Date(task.submitted_at).toLocaleString() : '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </ContentContainer>
    </AppShell>
  )
}
