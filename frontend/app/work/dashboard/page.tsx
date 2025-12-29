'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AppShell } from '@/components/app-shell/AppShell'
import { ContentContainer } from '@/components/app-shell/ContentContainer'
import { ShellHeader } from '@/components/app-shell/ShellHeader'
import { FiTarget } from 'react-icons/fi'

import { apiFetch } from '@/lib/api'

interface WorkerStats {
  earnings_today: number
  quality_score: number
  tasks_completed: number
  jobs_available?: number
}

export default function WorkerDashboardPage() {
  const [stats, setStats] = useState<WorkerStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
    fetchJobCount()
  }, [])

  const fetchStats = async () => {
    try {
      setStats({
        earnings_today: 24.50,
        quality_score: 92,
        tasks_completed: 47
      })
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchJobCount = async () => {
    const { data, error } = await apiFetch('/api/jobs?status=open')
    if (error) {
      setStats(prev => prev ? { ...prev, jobs_available: 0 } : null)
      return
    }
    setStats(prev => prev ? { ...prev, jobs_available: data?.jobs?.length || 0 } : null)
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
        title="Dashboard"
        description="Track your earnings and performance"
      />

      {/* Primary Action Card */}
      <div className="bg-[#8350e8]/5 border border-[#8350e8]/20 rounded-lg p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-[#8350e8]/10 rounded-lg flex items-center justify-center">
              <FiTarget className="w-6 h-6 text-[#8350e8]" />
            </div>
            <div>
              <h2 
                className="text-xl font-semibold text-slate-900 mb-1"
                style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '-0.02em' }}
              >
                Start Fixing
              </h2>
              <p 
                className="text-sm text-slate-600 mb-4"
                style={{ fontFamily: "'Rethink Sans', sans-serif" }}
              >
                {stats?.jobs_available || 0} jobs available in queue
              </p>
              <Link
                href="/work/queue"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#8350e8] hover:bg-[#8350e8]/90 text-white rounded-lg font-medium transition-colors"
                style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '-0.02em' }}
              >
                View Queue →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white border border-slate-200/60 rounded-lg p-4 hover:border-[#8350e8]/30 transition-colors">
            <div className="text-xs text-slate-600 mb-1" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>Earnings Today</div>
            <div className="text-2xl font-bold text-slate-900" style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '-0.02em' }}>${stats.earnings_today.toFixed(2)}</div>
          </div>
          <div className="bg-white border border-slate-200/60 rounded-lg p-4 hover:border-[#8350e8]/30 transition-colors">
            <div className="text-xs text-slate-600 mb-1" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>Quality Score</div>
            <div className="text-2xl font-bold text-slate-900" style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '-0.02em' }}>{stats.quality_score}</div>
          </div>
          <div className="bg-white border border-slate-200/60 rounded-lg p-4 hover:border-[#8350e8]/30 transition-colors">
            <div className="text-xs text-slate-600 mb-1" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>Tasks Completed</div>
            <div className="text-2xl font-bold text-slate-900" style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '-0.02em' }}>{stats.tasks_completed}</div>
          </div>
        </div>
      )}

      {/* Recent Activity - Collapsible */}
      <details className="bg-white border border-slate-200/60 rounded-lg">
        <summary 
          className="px-4 py-3 cursor-pointer text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          style={{ fontFamily: "'Archivo', sans-serif" }}
        >
          Recent Activity
        </summary>
        <div className="px-4 py-3 border-t border-slate-200/60">
          <p className="text-sm text-slate-600" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>
            Recent activity will appear here
          </p>
        </div>
      </details>
      </ContentContainer>
    </AppShell>
  )
}
