'use client'

import { useState } from 'react'

import { apiFetch, API_URL } from '@/lib/api'

export default function LabsPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [org, setOrg] = useState('')
  const [useCase, setUseCase] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const { data, error } = await apiFetch('/api/lab_requests', {
        method: 'POST',
        body: JSON.stringify({ name, email, org, use_case: useCase }),
      })

      if (error) {
        alert(error || 'Failed to submit request')
      } else {
        setSubmitted(true)
        setName('')
        setEmail('')
        setOrg('')
        setUseCase('')
      }
    } catch (error) {
      console.error('Lab request error:', error)
      alert('Failed to submit request')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="text-4xl mb-4">✓</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Submitted</h2>
            <p className="text-gray-600 mb-2">
              We'll review your lab integration request and get back to you soon.
            </p>
            <p className="text-sm text-blue-600 mb-6">
              📧 Check your email for a confirmation message!
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="text-blue-600 hover:underline"
            >
              Submit another request
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Request Lab Integration</h1>
          <p className="text-gray-600 mb-8">
            Interested in using UMM Data Factory for your research? Let's talk.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Organization *
              </label>
              <input
                type="text"
                value={org}
                onChange={(e) => setOrg(e.target.value)}
                required
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="University / Lab / Company"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Use Case *
              </label>
              <textarea
                value={useCase}
                onChange={(e) => setUseCase(e.target.value)}
                required
                rows={5}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Tell us about your robot learning project and how you'd use UMM Data Factory..."
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
            >
              {submitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

