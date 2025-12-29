const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ data: T | null; error: string | null }> {
  // Only run on client side
  if (typeof window === 'undefined') {
    return { data: null, error: 'Server-side rendering not supported' }
  }

  try {
    const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint}`
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    
    // Don't set Content-Type for FormData (browser will set it with boundary)
    const headers = options.body instanceof FormData 
      ? (options.headers as Record<string, string> || {})
      : { ...defaultHeaders, ...(options.headers as Record<string, string> || {}) }
    
    const res = await fetch(url, {
      method: options.method || 'GET',
      headers: headers as HeadersInit,
      ...options,
    }).catch((fetchError) => {
      console.warn(`Network error fetching ${endpoint}:`, fetchError)
      throw new Error('Backend server may not be running. Please ensure the backend is started on http://localhost:8000')
    })

    if (!res.ok) {
      const errorText = await res.text().catch(() => 'Unknown error')
      let errorMessage = `HTTP error! status: ${res.status}`
      try {
        if (errorText) {
          const errorJson = JSON.parse(errorText)
          errorMessage = errorJson.detail || errorMessage
        }
      } catch {
        errorMessage = errorText || errorMessage
      }
      throw new Error(errorMessage)
    }

    // Handle blob responses (for file downloads)
    const contentType = res.headers.get('content-type')
    if (contentType?.includes('application/zip') || contentType?.includes('application/octet-stream')) {
      const blob = await res.blob().catch(() => null)
      if (!blob) {
        throw new Error('Failed to download file')
      }
      return { data: blob as any, error: null }
    }

    // Try to parse JSON, but handle empty responses
    const text = await res.text().catch(() => '')
    if (!text) {
      return { data: null, error: null }
    }
    
    try {
      const data = JSON.parse(text)
      return { data, error: null }
    } catch (parseError) {
      console.error(`Failed to parse JSON from ${endpoint}:`, parseError)
      return { data: null, error: 'Invalid JSON response' }
    }
  } catch (error) {
    console.error(`Failed to fetch ${endpoint}:`, error)
    return { 
      data: null, 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

export { API_URL }

