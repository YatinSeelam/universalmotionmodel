'use client'

import { ReactNode } from 'react'
import { FiUploadCloud, FiPlus } from 'react-icons/fi'

interface EmptyStateProps {
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
}

export function EmptyState({ size = 'md', children }: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center ${size === 'sm' ? 'gap-3' : size === 'lg' ? 'gap-6' : 'gap-4'}`}>
      {children}
    </div>
  )
}

interface EmptyStateHeaderProps {
  pattern?: 'grid' | 'dots'
  children: ReactNode
}

export function EmptyStateHeader({ pattern, children }: EmptyStateHeaderProps) {
  return (
    <div className="relative">
      {pattern === 'grid' && (
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full" style={{
            backgroundImage: 'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}></div>
        </div>
      )}
      <div className="relative">
        {children}
      </div>
    </div>
  )
}

interface EmptyStateIllustrationProps {
  type?: 'cloud' | 'folder' | 'document'
  children?: ReactNode
}

export function EmptyStateIllustration({ type = 'cloud', children }: EmptyStateIllustrationProps) {
  const iconSize = 'w-12 h-12'
  const iconColor = 'text-slate-400'
  
  return (
    <div className={`${iconSize} ${iconColor} mb-4`}>
      {children || (
        type === 'cloud' ? <FiUploadCloud className="w-full h-full" /> :
        type === 'folder' ? <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg> :
        <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )}
    </div>
  )
}

interface EmptyStateContentProps {
  children: ReactNode
}

export function EmptyStateContent({ children }: EmptyStateContentProps) {
  return (
    <div className="text-center">
      {children}
    </div>
  )
}

interface EmptyStateTitleProps {
  children: ReactNode
}

export function EmptyStateTitle({ children }: EmptyStateTitleProps) {
  return (
    <h3 
      className="text-base font-semibold text-slate-900 mb-1.5"
      style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '-0.02em' }}
    >
      {children}
    </h3>
  )
}

interface EmptyStateDescriptionProps {
  children: ReactNode
}

export function EmptyStateDescription({ children }: EmptyStateDescriptionProps) {
  return (
    <p 
      className="text-sm text-slate-600 leading-relaxed"
      style={{ fontFamily: "'Rethink Sans', sans-serif" }}
    >
      {children}
    </p>
  )
}

interface EmptyStateFooterProps {
  children: ReactNode
}

export function EmptyStateFooter({ children }: EmptyStateFooterProps) {
  return (
    <div className="mt-4">
      {children}
    </div>
  )
}

// Compound component pattern
EmptyState.Header = EmptyStateHeader
EmptyState.Illustration = EmptyStateIllustration
EmptyState.Content = EmptyStateContent
EmptyState.Title = EmptyStateTitle
EmptyState.Description = EmptyStateDescription
EmptyState.Footer = EmptyStateFooter

