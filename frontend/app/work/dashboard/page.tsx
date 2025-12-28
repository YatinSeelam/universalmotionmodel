'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { WorkerDashboardNav } from '@/components/DashboardNav'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface WorkerStats {
  earnings_today: number
  quality_score: number
  tasks_completed: number
}

export default function WorkerDashboardPage() {
  const [stats, setStats] = useState<WorkerStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
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

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <WorkerDashboardNav />
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>Loading...</p>
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
          <h1 className="text-2xl font-medium text-slate-900 mb-1.5" style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '-0.02em' }}>Worker Dashboard</h1>
          <p className="text-sm text-slate-600" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>Track your earnings and performance.</p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-3 gap-3 mb-5">
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

        {/* Quick Actions */}
        <div className="bg-white border border-slate-200/60 rounded-lg p-4">
          <Link
            href="/work/queue"
            className="block w-full px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium text-center transition-colors"
            style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '-0.02em' }}
          >
            View Work Queue
          </Link>
        </div>
      </div>
    </div>
  )
}
