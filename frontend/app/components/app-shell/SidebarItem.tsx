'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

interface SidebarItemProps {
  href: string
  icon: ReactNode
  label: string
  collapsed?: boolean
}

export function SidebarItem({ href, icon, label, collapsed = false }: SidebarItemProps) {
  const pathname = usePathname()
  const isActive = pathname === href || pathname.startsWith(`${href}/`)

  return (
    <Link
      href={href}
      className={`
        flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors
        ${isActive 
          ? 'bg-slate-200 text-slate-900' 
          : 'text-slate-700 hover:bg-slate-50'
        }
      `}
    >
      <span className={`flex-shrink-0 w-6 h-6 ${isActive ? 'text-slate-900' : 'text-slate-600'}`}>
        {icon}
      </span>
      <span 
        className="text-lg font-medium"
        style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '-0.02em' }}
      >
        {label}
      </span>
    </Link>
  )
}

