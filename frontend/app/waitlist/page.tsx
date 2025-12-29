'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { SparklesDemo } from "@/components/ui/sparkles-demo"
import { GridBackground } from "@/components/ui/grid-background"
import { CustomSelect } from "@/components/ui/custom-select"

import { apiFetch } from '@/lib/api'

export default function WaitlistPage() {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<'operator' | 'lab' | 'student' | 'other'>('operator')
  const [name, setName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const { data, error } = await apiFetch('/api/waitlist', {
        method: 'POST',
        body: JSON.stringify({ email, role, name }),
      })

      if (error) {
        alert(error || 'Failed to join waitlist')
      } else {
        setSubmitted(true)
        setEmail('')
        setName('')
      }
    } catch (error) {
      console.error('Waitlist error:', error)
      alert('Failed to join waitlist')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-white w-full">
        <section className="relative pt-[0.9vh] pb-[0.5vh] sm:pt-[0.9vh] sm:pb-[0.5vh] lg:pt-[0.9vh] lg:pb-[0.5vh] overflow-visible bg-white flex items-start w-full hero-glow-bottom">
          <div className="w-full mx-auto px-1 sm:px-1 lg:px-1">
            <div className="w-[99.6%] mx-auto bg-gradient-hero rounded-[2rem] p-10 sm:p-12 lg:p-14 xl:p-16 h-[98.2vh] flex flex-col justify-center relative z-10 noise-overlay overflow-hidden">
              {/* Fuzzy circular gradient at bottom center */}
              <div className="absolute bottom-[-20px] left-1/2 transform -translate-x-1/2 w-[1200px] h-[500px] bg-radial-gradient-purple pointer-events-none z-0"></div>

              {/* Additional fuzzy overlay for bottom quarter */}
              <div className="absolute bottom-0 left-0 right-0 h-[25%] pointer-events-none z-0" style={{
                background: 'radial-gradient(ellipse 120% 80% at center bottom, rgba(196, 181, 253, 0.7) 0%, rgba(167, 139, 250, 0.6) 20%, rgba(139, 92, 246, 0.5) 40%, rgba(109, 40, 217, 0.4) 60%, rgba(91, 33, 182, 0.3) 80%, transparent 100%)',
                filter: 'blur(120px)',
                WebkitFilter: 'blur(120px)'
              }}></div>

              {/* Sparkles at bottom */}
              <div className="absolute bottom-0 left-0 right-0 z-[3] overflow-visible" style={{ paddingTop: '100px' }}>
                <SparklesDemo />
              </div>

              {/* Success Content */}
              <div className="text-center max-w-2xl mx-auto px-4 relative z-10" style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '-0.02em' }}>
                <div className="text-5xl sm:text-6xl mb-6 text-white">✓</div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-white mb-4">You're on the list!</h2>
                <p className="text-base sm:text-lg text-white/70 mb-4">
                  We'll notify you when UMM Data Factory is ready.
                </p>
                <p className="text-sm sm:text-base text-white/80 mb-8">
                  📧 Check your email for a welcome message!
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-white/90 hover:text-white underline text-sm sm:text-base"
                >
                  Join another email
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white w-full">
      <section className="relative pt-[0.9vh] pb-[0.5vh] sm:pt-[0.9vh] sm:pb-[0.5vh] lg:pt-[0.9vh] lg:pb-[0.5vh] overflow-visible bg-white flex items-start w-full hero-glow-bottom">
        <div className="w-full mx-auto px-1 sm:px-1 lg:px-1">
          <div className="w-[99.6%] mx-auto bg-gradient-hero rounded-[2rem] p-10 sm:p-12 lg:p-14 xl:p-16 h-[98.2vh] flex flex-col justify-center relative z-10 noise-overlay overflow-hidden">
            {/* Grid Background */}
            <GridBackground className="absolute inset-0 rounded-[2rem]" />
            
            {/* Fuzzy circular gradient at bottom center */}
            <div className="absolute bottom-[-20px] left-1/2 transform -translate-x-1/2 w-[1200px] h-[500px] bg-radial-gradient-purple pointer-events-none z-0"></div>

            {/* Additional fuzzy overlay for bottom quarter */}
            <div className="absolute bottom-0 left-0 right-0 h-[25%] pointer-events-none z-0" style={{
              background: 'radial-gradient(ellipse 120% 80% at center bottom, rgba(196, 181, 253, 0.7) 0%, rgba(167, 139, 250, 0.6) 20%, rgba(139, 92, 246, 0.5) 40%, rgba(109, 40, 217, 0.4) 60%, rgba(91, 33, 182, 0.3) 80%, transparent 100%)',
              filter: 'blur(120px)',
              WebkitFilter: 'blur(120px)'
            }}></div>

            {/* Sparkles at bottom */}
            <div className="absolute bottom-0 left-0 right-0 z-[3] overflow-visible" style={{ paddingTop: '100px' }}>
              <SparklesDemo />
            </div>

            {/* Form Content */}
            <div className="max-w-xl mx-auto px-4 relative z-10" style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '-0.02em' }}>
              {/* Container with backdrop - enhanced styling */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 sm:p-7 shadow-2xl relative overflow-visible" style={{
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
              }}>
                {/* Shine effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none rounded-2xl"></div>
                <div className="relative z-10">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 mb-6">
                  {/* Square Logo */}
                  <div className="flex-shrink-0 bg-white/10 rounded-xl overflow-hidden" style={{ 
                    width: 'clamp(55px, 7.5vw, 75px)',
                    height: 'clamp(55px, 7.5vw, 75px)',
                    border: '3px solid rgba(255, 255, 255, 0.4)',
                    boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.2)'
                  }}>
                    <Image
                      src="/logo1.png"
                      alt="Logo"
                      width={75}
                      height={75}
                      className="w-full h-full object-cover"
                      style={{ 
                        objectPosition: 'center',
                        transform: 'scale(1.6)'
                      }}
                    />
                  </div>
                  
                  {/* Title Section */}
                  <div className="flex-1 text-center sm:text-left">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-medium text-white mb-0.5 leading-tight whitespace-nowrap">
                      Join the Waitlist
                    </h1>
                    <p className="text-xs sm:text-sm lg:text-base text-white/70 uppercase tracking-tight leading-tight">
                      Early access to Universal Motion Model
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 text-left">
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    Name (optional)
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/40 focus:ring-2 focus:ring-white/50 focus:border-white/40 focus:outline-none transition-all hover:bg-white/15 hover:border-white/30"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/40 focus:ring-2 focus:ring-white/50 focus:border-white/40 focus:outline-none transition-all hover:bg-white/15 hover:border-white/30"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    I am a... *
                  </label>
                  <CustomSelect
                    value={role}
                    onChange={(value) => setRole(value as any)}
                    required
                    options={[
                      { value: 'operator', label: 'Robot Operator / Worker' },
                      { value: 'lab', label: 'Research Lab' },
                      { value: 'student', label: 'Student / Researcher' },
                      { value: 'other', label: 'Other' },
                    ]}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full px-6 sm:px-7 py-3 sm:py-3.5 bg-white text-black text-sm sm:text-base font-medium rounded-full hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50"
                >
                  {submitting ? 'Joining...' : 'Join Waitlist'}
                </button>
              </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
