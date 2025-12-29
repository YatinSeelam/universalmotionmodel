'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AppShell } from '@/components/app-shell/AppShell'
import { ContentContainer } from '@/components/app-shell/ContentContainer'
import { ShellHeader } from '@/components/app-shell/ShellHeader'

import { apiFetch, API_URL } from '@/lib/api'

interface Task {
  id: string
  name: string
}

interface Lab {
  id: string
  name: string
}

export default function LabUploadPage() {
  const router = useRouter()
  const [labs, setLabs] = useState<Lab[]>([])
  const [selectedLabId, setSelectedLabId] = useState('')
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedTask, setSelectedTask] = useState('')
  const [success, setSuccess] = useState(false)
  const [failureReason, setFailureReason] = useState('')
  const [failureTimeSec, setFailureTimeSec] = useState<number | null>(null)
  const [durationSec, setDurationSec] = useState(10)
  const [hz, setHz] = useState(20)
  const [video, setVideo] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  const steps = Math.round(durationSec * hz)

  useEffect(() => {
    fetchLabs()
    fetchTasks()
  }, [])

  useEffect(() => {
    if (selectedLabId) {
      fetchTasks()
    }
  }, [selectedLabId])

  const fetchLabs = async () => {
    const { data, error } = await apiFetch('/api/labs')
    if (error) {
      setLabs([])
      return
    }
    setLabs(data?.labs || [])
    if (data?.labs && data.labs.length > 0) {
      setSelectedLabId(data.labs[0].id)
    }
  }

  const fetchTasks = async () => {
    const url = selectedLabId 
      ? `/api/tasks?lab_id=${selectedLabId}`
      : '/api/tasks'
    const { data, error } = await apiFetch(url)
    if (error) {
      setTasks([])
      return
    }
    setTasks(data?.tasks || [])
    if (data?.tasks && data.tasks.length > 0) {
      setSelectedTask(data.tasks[0].id)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)

    try {
      const meta: any = {
        task_id: selectedTask,
        hz: hz,
        steps: steps,
        duration_sec: durationSec,
        success: success,
      }

      if (!success) {
        if (failureReason) {
          meta.failure_reason = failureReason
        }
        if (failureTimeSec !== null) {
          meta.failure_time_sec = failureTimeSec
        }
      }

      const meta_json = JSON.stringify(meta)

      const formData = new FormData()
      formData.append('meta_json', meta_json)
      if (selectedLabId) {
        formData.append('lab_id', selectedLabId)
      }
      if (video) {
        formData.append('video', video)
      }

      try {
        const res = await fetch(`${API_URL}/api/episodes/upload`, {
          method: 'POST',
          body: formData,
        })

        if (res.ok) {
          const data = await res.json()
          if (data.job_id) {
            alert(`Episode uploaded! Job created: ${data.job_id}`)
            router.push(`/work/jobs/${data.job_id}`)
          } else {
            alert('Episode uploaded! (No edge case detected)')
            router.push('/work/queue')
          }
        } else {
          const errorData = await res.json().catch(() => ({}))
          alert(errorData.detail || 'Upload failed')
        }
      } catch (fetchError) {
        console.error('Upload error:', fetchError)
        alert('Upload failed')
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <AppShell type="lab">
      <ContentContainer>
        <ShellHeader 
          title="Upload Episode"
          description="Add a new robot run"
        />

        {/* Form */}
        <div className="bg-white border border-slate-200/60 rounded-lg p-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2" style={{ fontFamily: "'Archivo', sans-serif" }}>
                    Lab
                  </label>
                  <select
                    value={selectedLabId}
                    onChange={(e) => setSelectedLabId(e.target.value)}
                    className="w-full border border-slate-300/60 rounded-lg px-4 py-2.5 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#8350e8]/20 focus:border-[#8350e8] transition-all"
                    style={{ fontFamily: "'Rethink Sans', sans-serif" }}
                  >
                    {labs.map((lab) => (
                      <option key={lab.id} value={lab.id}>
                        {lab.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2" style={{ fontFamily: "'Archivo', sans-serif" }}>
                    Task <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedTask}
                    onChange={(e) => setSelectedTask(e.target.value)}
                    required
                    className="w-full border border-slate-300/60 rounded-lg px-4 py-2.5 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#8350e8]/20 focus:border-[#8350e8] transition-all"
                    style={{ fontFamily: "'Rethink Sans', sans-serif" }}
                  >
                    {tasks.map((task) => (
                      <option key={task.id} value={task.id}>
                        {task.name} ({task.id})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-2">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={success}
                      onChange={(e) => setSuccess(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-[#8350e8] focus:ring-[#8350e8]"
                    />
                    <span className="text-sm font-medium text-slate-700" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>
                      Episode succeeded
                    </span>
                  </label>
                </div>

                {!success && (
                  <>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2" style={{ fontFamily: "'Archivo', sans-serif" }}>
                        Failure Reason
                      </label>
                      <select
                        value={failureReason}
                        onChange={(e) => setFailureReason(e.target.value)}
                        className="w-full border border-slate-300/60 rounded-lg px-4 py-2.5 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#8350e8]/20 focus:border-[#8350e8] transition-all"
                        style={{ fontFamily: "'Rethink Sans', sans-serif" }}
                      >
                        <option value="">Select...</option>
                        <option value="slip_after_grasp">Slip After Grasp</option>
                        <option value="missed_grasp">Missed Grasp</option>
                        <option value="timeout">Timeout</option>
                        <option value="collision_spike">Collision Spike</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2" style={{ fontFamily: "'Archivo', sans-serif" }}>
                        Failure Time (s)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        value={failureTimeSec || ''}
                        onChange={(e) => setFailureTimeSec(e.target.value ? parseFloat(e.target.value) : null)}
                        className="w-full border border-slate-300/60 rounded-lg px-4 py-2.5 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#8350e8]/20 focus:border-[#8350e8] transition-all"
                        style={{ fontFamily: "'Rethink Sans', sans-serif" }}
                        placeholder="8.2"
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2" style={{ fontFamily: "'Archivo', sans-serif" }}>
                    Duration (s) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={durationSec}
                    onChange={(e) => setDurationSec(parseFloat(e.target.value) || 10)}
                    required
                    className="w-full border border-slate-300/60 rounded-lg px-4 py-2.5 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#8350e8]/20 focus:border-[#8350e8] transition-all"
                    style={{ fontFamily: "'Rethink Sans', sans-serif" }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2" style={{ fontFamily: "'Archivo', sans-serif" }}>
                    Control Frequency (Hz) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={hz}
                    onChange={(e) => setHz(parseInt(e.target.value) || 20)}
                    required
                    className="w-full border border-slate-300/60 rounded-lg px-4 py-2.5 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#8350e8]/20 focus:border-[#8350e8] transition-all"
                    style={{ fontFamily: "'Rethink Sans', sans-serif" }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2" style={{ fontFamily: "'Archivo', sans-serif" }}>
                    Steps
                  </label>
                  <div className="w-full border border-slate-300/60 rounded-lg px-4 py-2.5 bg-slate-50/50 text-slate-600 text-sm" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>
                    {steps}
                  </div>
                  <p className="text-xs text-slate-500 mt-1.5" style={{ fontFamily: "'Rethink Sans', sans-serif" }}>
                    {durationSec} × {hz} = {steps}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2" style={{ fontFamily: "'Archivo', sans-serif" }}>
                    Video (optional)
                  </label>
                  <input
                    type="file"
                    accept="video/mp4"
                    onChange={(e) => setVideo(e.target.files?.[0] || null)}
                    className="w-full border border-slate-300/60 rounded-lg px-4 py-2.5 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
                    style={{ fontFamily: "'Rethink Sans', sans-serif" }}
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-slate-200/60">
              <button
                type="submit"
                disabled={uploading || !selectedTask}
                className="w-full px-6 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors flex items-center justify-center gap-2"
                style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '-0.02em' }}
              >
                {uploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span>Upload Episode</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </ContentContainer>
    </AppShell>
  )
}
