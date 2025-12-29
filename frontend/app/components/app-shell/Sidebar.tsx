'use client'

import { ReactNode } from 'react'
import { SidebarItem } from './SidebarItem'
import { 
  FiHome, 
  FiList, 
  FiCheckCircle, 
  FiDollarSign, 
  FiSettings,
  FiBarChart2,
  FiUpload,
  FiFolder,
  FiEye,
  FiDownload
} from 'react-icons/fi'

interface SidebarNavItem {
  href: string
  icon: ReactNode
  label: string
}

interface SidebarProps {
  items: SidebarNavItem[]
  title: string
}

export function Sidebar({ items, title }: SidebarProps) {
  return (
    <aside className="w-60 flex-shrink-0 flex flex-col fixed left-0 top-0 h-screen z-40 bg-slate-100 overflow-hidden">
      {/* Logo/Header Section */}
      <div className="px-4 py-5 border-b border-slate-200/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#8350e8] rounded-md flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-base" style={{ fontFamily: "'Archivo', sans-serif" }}>U</span>
          </div>
          <h2 
            className="text-lg font-semibold text-slate-900"
            style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '-0.02em' }}
          >
            {title}
          </h2>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
        {items.map((item) => (
          <SidebarItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            collapsed={false}
          />
        ))}
      </nav>
    </aside>
  )
}

// Worker sidebar items
export const workerSidebarItems: SidebarNavItem[] = [
  {
    href: '/work/dashboard',
    icon: <FiHome className="w-5 h-5" />,
    label: 'Dashboard',
  },
  {
    href: '/work/queue',
    icon: <FiList className="w-5 h-5" />,
    label: 'Work Queue',
  },
  {
    href: '/work/history',
    icon: <FiCheckCircle className="w-5 h-5" />,
    label: 'History',
  },
  {
    href: '/work/earnings',
    icon: <FiDollarSign className="w-5 h-5" />,
    label: 'Earnings',
  },
  {
    href: '/work/profile',
    icon: <FiSettings className="w-5 h-5" />,
    label: 'Profile',
  },
]

// Lab sidebar items
export const labSidebarItems: SidebarNavItem[] = [
  {
    href: '/lab/dashboard',
    icon: <FiBarChart2 className="w-5 h-5" />,
    label: 'Overview',
  },
  {
    href: '/lab/upload',
    icon: <FiUpload className="w-5 h-5" />,
    label: 'Upload Episode',
  },
  {
    href: '/lab/dataset',
    icon: <FiFolder className="w-5 h-5" />,
    label: 'Dataset',
  },
  {
    href: '/lab/review',
    icon: <FiEye className="w-5 h-5" />,
    label: 'Review / Fixes',
  },
  {
    href: '/lab/export',
    icon: <FiDownload className="w-5 h-5" />,
    label: 'Export',
  },
  {
    href: '/lab/settings',
    icon: <FiSettings className="w-5 h-5" />,
    label: 'Settings',
  },
]
