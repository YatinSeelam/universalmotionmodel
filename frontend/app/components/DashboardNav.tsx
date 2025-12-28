'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function LabDashboardNav() {
  const pathname = usePathname()
  
  const navItems = [
    { href: '/lab/dashboard', label: 'Dashboard' },
    { href: '/lab/upload', label: 'Upload' },
    { href: '/lab/dataset', label: 'Dataset' },
    { href: '/lab/export', label: 'Export' },
  ]
  
  return (
    <nav className="bg-white border-b border-slate-200/60 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-8">
          <Link href="/lab" className="py-3.5 text-base font-semibold text-slate-900" style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '-0.02em' }}>
            Lab Portal
          </Link>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`py-3.5 text-sm font-medium transition-colors ${
                pathname === item.href
                  ? 'text-[#8350e8] border-b-2 border-[#8350e8]'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '-0.02em' }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}

export function WorkerDashboardNav() {
  const pathname = usePathname()
  
  const navItems = [
    { href: '/work/dashboard', label: 'Dashboard' },
    { href: '/work/queue', label: 'Queue' },
  ]
  
  return (
    <nav className="bg-white border-b border-slate-200/60 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-8">
          <Link href="/work" className="py-3.5 text-base font-semibold text-slate-900" style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '-0.02em' }}>
            Work Portal
          </Link>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`py-3.5 text-sm font-medium transition-colors ${
                pathname === item.href
                  ? 'text-[#8350e8] border-b-2 border-[#8350e8]'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '-0.02em' }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
