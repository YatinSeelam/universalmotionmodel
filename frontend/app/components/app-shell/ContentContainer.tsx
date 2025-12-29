'use client'

import { ReactNode } from 'react'

interface ContentContainerProps {
  children: ReactNode
  className?: string
}

export function ContentContainer({ children, className = '' }: ContentContainerProps) {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  )
}
