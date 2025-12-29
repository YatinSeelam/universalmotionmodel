'use client'

import { ReactNode } from 'react'
import { Sidebar, workerSidebarItems, labSidebarItems } from './Sidebar'

interface AppShellProps {
  children: ReactNode
  type: 'work' | 'lab'
}

export function AppShell({ children, type }: AppShellProps) {
  const items = type === 'work' ? workerSidebarItems : labSidebarItems
  const title = type === 'work' ? 'Work Portal' : 'Lab Portal'

  return (
    <div className="h-screen bg-slate-100 overflow-hidden">
      {/* Sidebar - fixed, outside the container */}
      <Sidebar items={items} title={title} />
      
      {/* Main content area with unified container */}
      <div className="ml-60 h-full pt-2 pr-1 pb-2">
        <div className="w-full h-full max-w-[calc(100vw-253px)] mx-auto bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-200">
          <main className="h-full overflow-y-auto bg-white" id="main-content">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
