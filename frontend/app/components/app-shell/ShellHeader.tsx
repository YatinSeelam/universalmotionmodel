'use client'

import { ReactNode } from 'react'

interface ShellHeaderProps {
  title: string
  description?: string
  actions?: ReactNode
}

export function ShellHeader({ title, description, actions }: ShellHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 
          className="text-2xl font-medium text-slate-900 mb-1.5"
          style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '-0.02em' }}
        >
          {title}
        </h1>
        {description && (
          <p 
            className="text-sm text-slate-600"
            style={{ fontFamily: "'Rethink Sans', sans-serif" }}
          >
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2">
          {actions}
        </div>
      )}
    </div>
  )
}


