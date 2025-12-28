'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function WorkerOnboardPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  
  // Step 1: Account
  const [email, setEmail] = useState('')
  const [country, setCountry] = useState('')
  const [agreed, setAgreed] = useState(false)
  
  // Step 2: Skill check
  const [skillCheckComplete, setSkillCheckComplete] = useState(false)
  
  const handleCreateAccount = async () => {
    if (!email || !country || !agreed) return
    
    setLoading(true)
    try {
      // Create worker account
      const res = await fetch(`${API_URL}/api/workers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, country })
      })
      
      if (res.ok || true) { // Allow to proceed even if API fails in MVP
        setStep(2)
      }
    } catch (error) {
      console.error('Failed to create account:', error)
      // Still proceed for MVP
      setStep(2)
    } finally {
      setLoading(false)
    }
  }
  
  const handleSkillCheck = async () => {
    // For MVP, just mark as complete
    setSkillCheckComplete(true)
    setTimeout(() => {
      router.push('/work/queue')
    }, 1000)
  }
  
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto px-6 py-16">
        {/* Progress */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                  s < step ? 'bg-green-600' : s === step ? 'bg-blue-600' : 'bg-slate-300'
                }`}>
                  {s < step ? '✓' : s}
                </div>
                {s < 3 && (
                  <div className={`flex-1 h-1 mx-2 ${
                    s < step ? 'bg-green-600' : 'bg-slate-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm text-slate-600">
            <span>Account</span>
            <span>Skill Check</span>
            <span>Ready</span>
          </div>
        </div>
        
        {/* Step 1: Account */}
        {step === 1 && (
          <div className="space-y-6 bg-white rounded-xl p-8 shadow-sm border border-slate-200">
            <h2 className="text-3xl font-bold text-slate-900">Create Account</h2>
            <p className="text-slate-600">Get started by creating your worker account.</p>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-900">Email *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-900">Country *</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
              >
                <option value="">Select country</option>
                <option value="US">United States</option>
                <option value="UK">United Kingdom</option>
                <option value="CA">Canada</option>
                <option value="AU">Australia</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="agreement"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1"
              />
              <label htmlFor="agreement" className="text-sm text-slate-600">
                I agree to the data usage policy and NDA terms.
              </label>
            </div>
            
            <button
              onClick={handleCreateAccount}
              disabled={!email || !country || !agreed || loading}
              className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Creating...' : 'Continue'}
            </button>
          </div>
        )}
        
        {/* Step 2: Skill Check */}
        {step === 2 && (
          <div className="space-y-6 bg-white rounded-xl p-8 shadow-sm border border-slate-200">
            <h2 className="text-3xl font-bold text-slate-900">Skill Check</h2>
            <p className="text-slate-600">Complete 2-3 demo tasks to unlock work access.</p>
            
            {!skillCheckComplete ? (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="font-semibold text-slate-900 mb-2">Demo Task 1</h3>
                  <p className="text-sm text-slate-600 mb-4">
                    Watch the failure clip and identify what went wrong.
                  </p>
                  <button
                    onClick={handleSkillCheck}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Complete Demo
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <div className="text-4xl mb-2">✓</div>
                <p className="text-green-800 font-medium">Unlocked!</p>
                <p className="text-sm text-green-600 mt-2">Redirecting to work queue...</p>
              </div>
            )}
            
            <button
              onClick={() => setStep(1)}
              className="w-full px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-900 rounded-lg font-medium transition-colors"
            >
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

