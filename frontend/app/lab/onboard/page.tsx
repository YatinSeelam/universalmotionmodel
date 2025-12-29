'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

import { apiFetch } from '@/lib/api'

const USE_CASES = ['Warehouse', 'Manipulation', 'Navigation', 'Medical', 'Other']
const ROBOT_TYPES = ['Arm', 'Mobile', 'Simulation', 'Other']
const TASK_TYPES = ['Trajectory Correction', 'Failure Labeling', 'Teleop Replay']

export default function LabOnboardPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  
  const [labName, setLabName] = useState('')
  const [useCase, setUseCase] = useState('')
  const [projectName, setProjectName] = useState('')
  const [robotType, setRobotType] = useState('')
  const [labId, setLabId] = useState<string | null>(null)
  const [taskType, setTaskType] = useState('')
  
  const handleCreateLab = async () => {
    if (!labName || !useCase) return
    setLoading(true)
    try {
      const { data, error } = await apiFetch('/api/labs', {
        method: 'POST',
        body: JSON.stringify({ name: labName, use_case: useCase })
      })
      
      // Allow to proceed even if API fails in MVP
      setLabId(data?.lab?.id || '00000000-0000-0000-0000-000000000001')
      setStep(2)
    } catch (error) {
      console.error('Failed to create lab:', error)
      setLabId('00000000-0000-0000-0000-000000000001')
      setStep(2)
    } finally {
      setLoading(false)
    }
  }
  
  const handleCreateProject = async () => {
    if (!projectName || !robotType) return
    setLoading(true)
    try {
      const { data, error } = await apiFetch('/api/projects', {
        method: 'POST',
        body: JSON.stringify({ lab_id: labId, name: projectName, robot_type: robotType, task_type: taskType })
      })
      // Allow to proceed even if API fails in MVP
      setStep(3)
    } catch (error) {
      console.error('Failed to create project:', error)
      setStep(3)
    } finally {
      setLoading(false)
    }
  }
  
  const handleComplete = () => {
    router.push('/lab/dashboard')
  }
  
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-xl mx-auto px-6 py-10">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                  s < step ? 'bg-green-600 text-white' : s === step ? 'bg-[#8350e8] text-white' : 'bg-slate-200 text-slate-400'
                }`} style={{ fontFamily: "'Archivo', sans-serif" }}>
                  {s < step ? '✓' : s}
                </div>
                {s < 3 && (
                  <div className={`flex-1 h-0.5 mx-2 ${
                    s < step ? 'bg-green-600' : 'bg-slate-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Step 1: Create Lab */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-medium text-slate-900" style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '-0.02em' }}>Create Lab</h2>
            
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5" style={{ fontFamily: "'Archivo', sans-serif" }}>Lab Name</label>
              <input
                type="text"
                value={labName}
                onChange={(e) => setLabName(e.target.value)}
                placeholder="Stanford Robotics Lab"
                className="w-full px-4 py-2.5 border border-slate-300/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8350e8]/20 focus:border-[#8350e8] text-slate-900"
                style={{ fontFamily: "'Rethink Sans', sans-serif" }}
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5" style={{ fontFamily: "'Archivo', sans-serif" }}>Use Case</label>
              <select
                value={useCase}
                onChange={(e) => setUseCase(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-300/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-slate-900 bg-white"
                style={{ fontFamily: "'Rethink Sans', sans-serif" }}
              >
                <option value="">Select...</option>
                {USE_CASES.map((uc) => (
                  <option key={uc} value={uc}>{uc}</option>
                ))}
              </select>
            </div>
            
            <button
              onClick={handleCreateLab}
              disabled={!labName || !useCase || loading}
              className="w-full px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '-0.02em' }}
            >
              {loading ? 'Creating...' : 'Continue'}
            </button>
          </div>
        )}
        
        {/* Step 2: Create Project */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-medium text-slate-900" style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '-0.02em' }}>Create Project</h2>
            
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5" style={{ fontFamily: "'Archivo', sans-serif" }}>Project Name</label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Bin Picking v1"
                className="w-full px-4 py-2.5 border border-slate-300/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8350e8]/20 focus:border-[#8350e8] text-slate-900"
                style={{ fontFamily: "'Rethink Sans', sans-serif" }}
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5" style={{ fontFamily: "'Archivo', sans-serif" }}>Robot Type</label>
              <select
                value={robotType}
                onChange={(e) => setRobotType(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-300/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-slate-900 bg-white"
                style={{ fontFamily: "'Rethink Sans', sans-serif" }}
              >
                <option value="">Select...</option>
                {ROBOT_TYPES.map((rt) => (
                  <option key={rt} value={rt}>{rt}</option>
                ))}
              </select>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
                style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '-0.02em' }}
              >
                Back
              </button>
              <button
                onClick={handleCreateProject}
                disabled={!projectName || !robotType || loading}
                className="flex-1 px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '-0.02em' }}
              >
                {loading ? 'Creating...' : 'Continue'}
              </button>
            </div>
          </div>
        )}
        
        {/* Step 3: Task Type */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-medium text-slate-900" style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '-0.02em' }}>Task Type</h2>
            
            <div className="space-y-2">
              {TASK_TYPES.map((tt) => (
                <button
                  key={tt}
                  onClick={() => setTaskType(tt)}
                  className={`w-full px-4 py-3 border-2 rounded-lg text-left transition-all ${
                    taskType === tt
                      ? 'border-[#8350e8] bg-[#8350e8]/5'
                      : 'border-slate-200/60 hover:border-[#8350e8]/30 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-900" style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '-0.02em' }}>{tt}</span>
                    {taskType === tt && (
                      <span className="text-[#8350e8]">✓</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="flex-1 px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
                style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '-0.02em' }}
              >
                Back
              </button>
              <button
                onClick={handleComplete}
                disabled={!taskType}
                className="flex-1 px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '-0.02em' }}
              >
                Complete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
