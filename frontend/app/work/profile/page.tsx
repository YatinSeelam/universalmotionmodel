'use client'

import { AppShell } from '@/components/app-shell/AppShell'
import { ContentContainer } from '@/components/app-shell/ContentContainer'
import { ShellHeader } from '@/components/app-shell/ShellHeader'

export default function WorkProfilePage() {
  return (
    <AppShell type="work">
      <ContentContainer>
      <ShellHeader 
        title="Profile"
        description="Manage your account settings"
      />
      <div className="bg-white border border-slate-200/60 rounded-lg p-8 text-center">
        <p className="text-slate-600" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>
          Profile page coming soon
        </p>
      </div>
      </ContentContainer>
    </AppShell>
  )
}

