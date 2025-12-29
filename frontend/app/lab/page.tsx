'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { AnimatedVideoPlaceholder } from '@/components/ui/animated-video-placeholder'

import { apiFetch } from '@/lib/api'

interface Lab {
  id: string
  name: string
}

interface LabSummary {
  lab_id: string
  total_episodes: number
  accepted_episodes: number
  edge_cases: number
  fixes_submitted: number
  fixes_accepted: number
  acceptance_rate: number
}

interface Episode {
  id: string
  task_id: string
  success: boolean
  duration_sec: number
  quality_score: number
  created_at: string
}

export default function LabDashboardPage() {
  const [labs, setLabs] = useState<Lab[]>([])
  const [selectedLabId, setSelectedLabId] = useState<string>('')
  const [summary, setSummary] = useState<LabSummary | null>(null)
  const [recentEpisodes, setRecentEpisodes] = useState<Episode[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLabs()
  }, [])

  useEffect(() => {
    if (selectedLabId) {
      fetchSummary()
      fetchRecentEpisodes()
    }
  }, [selectedLabId])

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

  const fetchSummary = async () => {
    if (!selectedLabId) return
    const { data, error } = await apiFetch(`/api/labs/${selectedLabId}/summary`)
    if (error) {
      setSummary(null)
      return
    }
    setSummary(data)
  }

  const fetchRecentEpisodes = async () => {
    if (!selectedLabId) return
    const { data, error } = await apiFetch(`/api/labs/${selectedLabId}/episodes`)
    if (error) {
      setRecentEpisodes([])
      return
    }
    setRecentEpisodes(data?.episodes?.slice(0, 5) || [])
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-[1396px] mx-auto px-6 sm:px-8 lg:px-12 py-12">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-600" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>Loading lab dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const selectedLab = labs.find(l => l.id === selectedLabId)

  return (
    <div className="min-h-screen bg-white w-full">
      <main className="flex-1 relative z-10 w-full">
        {/* Hero Section with Container */}
        <section className="relative pt-[0.9vh] pb-[0.5vh] sm:pt-[0.9vh] sm:pb-[0.5vh] lg:pt-[0.9vh] lg:pb-[0.5vh] overflow-visible bg-white flex items-start w-full hero-glow-bottom">
          <div className="w-full mx-auto px-1 sm:px-1 lg:px-1">
            {/* Hero Container with Curved Sides and Gradient - Almost Full Page */}
            <div className="w-[99.6%] mx-auto bg-gradient-hero rounded-[2rem] p-10 sm:p-12 lg:p-14 xl:p-16 h-[98.2vh] flex flex-col justify-center relative z-10 noise-overlay overflow-hidden">
              {/* Fuzzy circular gradient at bottom center - contained within container */}
              <div className="absolute bottom-[-20px] left-1/2 transform -translate-x-1/2 w-[1200px] h-[500px] bg-radial-gradient-purple pointer-events-none z-0"></div>

              {/* Additional fuzzy overlay for bottom quarter - contained within container */}
              <div className="absolute bottom-0 left-0 right-0 h-[25%] pointer-events-none z-0" style={{
                background: 'radial-gradient(ellipse 120% 80% at center bottom, rgba(196, 181, 253, 0.7) 0%, rgba(167, 139, 250, 0.6) 20%, rgba(139, 92, 246, 0.5) 40%, rgba(109, 40, 217, 0.4) 60%, rgba(91, 33, 182, 0.3) 80%, transparent 100%)',
                filter: 'blur(120px)',
                WebkitFilter: 'blur(120px)'
              }}></div>

              {/* Embedded Navigation */}
              <div className="absolute top-4 left-4 right-4 sm:top-10 sm:left-10 sm:right-10 flex flex-row justify-between items-center z-20" style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '-0.02em' }}>
                <Link href="/" className="flex items-center gap-2 sm:gap-3 text-sm sm:text-lg font-medium text-white hover:opacity-80 transition-opacity">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded overflow-hidden" style={{
                    border: '2px solid rgba(255, 255, 255, 0.4)'
                  }}>
                    <Image
                      src="/logo1.png"
                      alt="Motion Logo"
                      width={32}
                      height={32}
                      className="w-full h-full object-cover"
                      style={{ 
                        objectPosition: 'center',
                        transform: 'scale(1.6)'
                      }}
                    />
                  </div>
                  <span>Motion</span>
                </Link>
                <nav className="flex items-center gap-4 sm:gap-6">
                  {/* Labs Dropdown */}
                  <div className="hidden sm:block relative group">
                    <button className="text-white text-sm font-medium hover:bg-white/10 px-3 py-1.5 rounded-md transition-all">
                      Labs
                    </button>
                    <div className="absolute top-full left-0 mt-2 w-40 backdrop-blur-md rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-white/30">
                      <Link
                        href="/lab"
                        className="block px-4 py-2.5 text-sm text-white hover:bg-white/20 transition-colors first:rounded-t-lg"
                      >
                        About
                      </Link>
                      <Link
                        href="/lab/upload"
                        className="block px-4 py-2.5 text-sm text-white hover:bg-white/20 transition-colors last:rounded-b-lg"
                      >
                        Try Labs
                      </Link>
                    </div>
                  </div>

                  {/* Work Dropdown */}
                  <div className="hidden sm:block relative group">
                    <button className="text-white text-sm font-medium hover:bg-white/10 px-3 py-1.5 rounded-md transition-all">
                      Work
                    </button>
                    <div className="absolute top-full left-0 mt-2 w-40 backdrop-blur-md rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-white/30">
                      <Link
                        href="/work"
                        className="block px-4 py-2.5 text-sm text-white hover:bg-white/20 transition-colors first:rounded-t-lg"
                      >
                        About
                      </Link>
                      <Link
                        href="/work/queue"
                        className="block px-4 py-2.5 text-sm text-white hover:bg-white/20 transition-colors last:rounded-b-lg"
                      >
                        Work Now
                      </Link>
                    </div>
                  </div>

                  <Link
                    href="/waitlist"
                    className="px-4 py-2 bg-white text-black rounded-full hover:bg-gray-100 transition-all text-sm font-medium"
                  >
                    Join Waitlist
                  </Link>
                </nav>
              </div>

              {/* Hero Content */}
              <div className="text-center max-w-4xl mx-auto mb-12 sm:mb-16 px-4 pt-32 sm:pt-40" style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '-0.02em' }}>
                {/* Main Headline */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-medium mb-4 leading-tight px-4">
                  <span className="text-white drop-shadow-2xl">Turn robot failures into training datasets.</span>
                </h1>

                {/* Subtitle */}
                <p className="text-sm sm:text-base lg:text-lg text-white/70 mb-3 sm:mb-4 max-w-2xl mx-auto leading-relaxed font-normal drop-shadow-xl px-4">
                  Upload episodes. We detect failures and route them to workers for correction.
                </p>

                {/* CTA Button */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-6 sm:mb-8">
                  <Link
                    href="/lab/upload"
                    className="inline-block px-5 sm:px-6 py-1.5 sm:py-2 bg-white text-black text-sm sm:text-base font-medium rounded-full hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 w-full sm:w-auto text-center"
                  >
                    Upload Episode
                  </Link>
                </div>

                {/* Demo Video Placeholder */}
                <AnimatedVideoPlaceholder />
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="relative pt-16 sm:pt-24 md:pt-32 lg:pt-40 pb-4 sm:pb-6 overflow-visible bg-white">
          <div className="max-w-[1396px] mx-auto px-6 sm:px-8 lg:px-12">
            <div className="text-left">
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium mb-6 leading-tight" style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '-0.02em' }}>
                <span className="text-slate-900">What you get</span>
              </h2>
              <p className="text-lg sm:text-xl text-slate-600 max-w-2xl leading-relaxed" style={{ fontFamily: "'Rethink Sans', sans-serif", letterSpacing: '-0.02em' }}>
                Clean, curated training data from human-corrected robot failures.
              </p>
            </div>
          </div>
        </section>

        {/* Process Steps */}
        <section className="relative pt-8 sm:pt-10 lg:pt-12 pb-20 sm:pb-28 lg:pb-32 overflow-visible bg-white">
          <div className="max-w-[1396px] mx-auto px-6 sm:px-8 lg:px-12">
            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {/* Step 1 */}
              <div className="bg-white rounded-2xl border border-slate-300 p-6 sm:p-8 lg:p-12">
                <div className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-4" style={{ fontFamily: "'Archivo', sans-serif" }}>
                  Step 1
                </div>
                <h3 className="text-3xl sm:text-4xl font-medium mb-4 text-slate-900" style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '-0.02em' }}>
                  Upload episodes
                </h3>
                <p className="text-base sm:text-lg text-slate-600 leading-relaxed" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>
                  Upload robot runs from your experiments. We automatically detect failures and edge cases.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-white rounded-2xl border border-slate-300 p-6 sm:p-8 lg:p-12">
                <div className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-4" style={{ fontFamily: "'Archivo', sans-serif" }}>
                  Step 2
                </div>
                <h3 className="text-3xl sm:text-4xl font-medium mb-4 text-slate-900" style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '-0.02em' }}>
                  Workers fix failures
                </h3>
                <p className="text-base sm:text-lg text-slate-600 leading-relaxed" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>
                  Failures are routed to workers who provide corrected trajectories. Each fix is reviewed and validated.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-white rounded-2xl border border-slate-300 p-6 sm:p-8 lg:p-12">
                <div className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-4" style={{ fontFamily: "'Archivo', sans-serif" }}>
                  Step 3
                </div>
                <h3 className="text-3xl sm:text-4xl font-medium mb-4 text-slate-900" style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '-0.02em' }}>
                  Export datasets
                </h3>
                <p className="text-base sm:text-lg text-slate-600 leading-relaxed" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>
                  Download curated datasets with accepted runs and human corrections, ready for training.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Dashboard Section */}
        <section className="relative pt-8 sm:pt-10 lg:pt-12 pb-20 sm:pb-28 lg:pb-32 overflow-visible bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
                <h2 className="text-3xl font-heading font-bold text-slate-900 mb-2">Lab Dashboard</h2>
            {selectedLab && (
                  <p className="text-slate-600">{selectedLab.name}</p>
            )}
          </div>
          {labs.length > 1 && (
            <select
              value={selectedLabId}
              onChange={(e) => setSelectedLabId(e.target.value)}
                  className="border border-slate-300 rounded-lg px-4 py-2 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            >
              {labs.map((lab) => (
                <option key={lab.id} value={lab.id}>
                  {lab.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Stats Grid */}
        {summary && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                <div className="bg-white border border-slate-300 rounded-xl p-5">
                  <div className="text-2xl font-bold text-slate-900 mb-1">{summary.total_episodes}</div>
                  <div className="text-sm text-slate-600">Total Episodes</div>
            </div>
                <div className="bg-white border border-slate-300 rounded-xl p-5">
                  <div className="text-2xl font-bold text-yellow-600 mb-1">{summary.edge_cases}</div>
                  <div className="text-sm text-slate-600">Edge Cases</div>
            </div>
                <div className="bg-white border border-slate-300 rounded-xl p-5">
                  <div className="text-2xl font-bold text-green-600 mb-1">{summary.accepted_episodes}</div>
                  <div className="text-sm text-slate-600">Accepted</div>
            </div>
                <div className="bg-white border border-slate-300 rounded-xl p-5">
                  <div className="text-2xl font-bold text-blue-600 mb-1">{summary.fixes_accepted}</div>
                  <div className="text-sm text-slate-600">Fixes Accepted</div>
            </div>
                <div className="bg-white border border-slate-300 rounded-xl p-5">
                  <div className="text-2xl font-bold text-purple-600 mb-1">{summary.acceptance_rate}%</div>
                  <div className="text-sm text-slate-600">Acceptance Rate</div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Link
            href="/lab/upload"
            className="bg-white border border-slate-300 rounded-xl p-6 hover:border-purple-500/40 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-900" style={{ fontFamily: "'Archivo', sans-serif" }}>Upload Run</h3>
            </div>
            <p className="text-sm text-slate-600" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>Upload a new robot episode</p>
          </Link>
          <Link
            href="/lab/dataset"
            className="bg-white border border-slate-300 rounded-xl p-6 hover:border-purple-500/40 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-900" style={{ fontFamily: "'Archivo', sans-serif" }}>View Dataset</h3>
            </div>
            <p className="text-sm text-slate-600" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>Browse accepted data and edge cases</p>
          </Link>
          <Link
            href="/lab/export"
            className="bg-white border border-slate-300 rounded-xl p-6 hover:border-purple-500/40 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-900" style={{ fontFamily: "'Archivo', sans-serif" }}>Export</h3>
            </div>
            <p className="text-sm text-slate-600" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>Download curated dataset</p>
          </Link>
          <Link
            href="/lab/integration"
            className="bg-white border border-slate-300 rounded-xl p-6 hover:border-purple-500/40 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-900" style={{ fontFamily: "'Archivo', sans-serif" }}>Integration</h3>
            </div>
            <p className="text-sm text-slate-600" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>API documentation and guides</p>
          </Link>
        </div>

        {/* Recent Episodes */}
            <div className="bg-white border border-slate-300 rounded-xl p-6">
              <h2 className="text-xl font-heading font-semibold mb-4 text-slate-900">Recent Uploads</h2>
          {recentEpisodes.length === 0 ? (
                <p className="text-slate-600 text-sm">No episodes yet. Upload your first run!</p>
          ) : (
            <div className="space-y-2">
              {recentEpisodes.map((episode) => (
                    <div key={episode.id} className="flex items-center justify-between py-3 border-b border-slate-200 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2.5 py-1 rounded-md font-medium ${
                      episode.success 
                            ? 'bg-green-100 text-green-800 border border-green-200' 
                        : 'bg-red-100 text-red-800 border border-red-200'
                    }`}>
                      {episode.success ? 'Success' : 'Failed'}
                    </span>
                        <span className="text-sm text-slate-900">{episode.task_id}</span>
                        <span className="text-xs text-slate-600">{episode.duration_sec.toFixed(1)}s</span>
                  </div>
                      <div className="text-xs text-slate-600">
                    Quality: {episode.quality_score}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
        </section>
      </main>
    </div>
  )
}
