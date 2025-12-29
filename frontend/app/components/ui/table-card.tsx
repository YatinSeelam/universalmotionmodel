'use client'

import { ReactNode } from 'react'
import { FiUploadCloud } from 'react-icons/fi'

interface TableCardRootProps {
  children: ReactNode
  className?: string
}

export function TableCardRoot({ children, className = '' }: TableCardRootProps) {
  return (
    <div className={`bg-white border border-slate-200/60 rounded-lg overflow-hidden ${className}`}>
      {children}
    </div>
  )
}

interface TableCardHeaderProps {
  title: string
  contentTrailing?: ReactNode
}

export function TableCardHeader({ title, contentTrailing }: TableCardHeaderProps) {
  return (
    <div className="px-4 py-3 border-b border-slate-200/60 bg-slate-50/30 flex items-center justify-between">
      <h2 
        className="text-sm font-semibold text-slate-900"
        style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '-0.02em' }}
      >
        {title}
      </h2>
      {contentTrailing && (
        <div className="flex items-center">
          {contentTrailing}
        </div>
      )}
    </div>
  )
}

// Compound component pattern
export const TableCard = {
  Root: TableCardRoot,
  Header: TableCardHeader,
}

