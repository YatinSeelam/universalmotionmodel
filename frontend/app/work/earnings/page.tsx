'use client'

import { AppShell } from '@/components/app-shell/AppShell'
import { ContentContainer } from '@/components/app-shell/ContentContainer'
import { ShellHeader } from '@/components/app-shell/ShellHeader'

export default function WorkEarningsPage() {
  return (
    <AppShell type="work">
      <ContentContainer>
      <ShellHeader 
        title="Earnings"
        description="Track your payments"
      />
      <div className="bg-white border border-slate-200/60 rounded-lg p-8 text-center">
        <p className="text-slate-600" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>
          Earnings page coming soon
        </p>
      </div>
      </ContentContainer>
    </AppShell>
  )
}

