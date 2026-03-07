import { withAuthHeaders } from './auth'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001'

async function apiRequest(path, options = {}) {
  const headers = withAuthHeaders(options.headers || {})

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  })

  let data = null
  try {
    data = await res.json()
  } catch {
    data = null
  }

  if (!res.ok) {
    throw new Error(data?.error || 'Request failed')
  }

  return data
}

export async function loginUser({ email, password }) {
  return apiRequest('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
}

export async function signupUser({ email, password, businessName }) {
  return apiRequest('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, businessName }),
  })
}

export async function fetchBusinesses(params = {}) {
  const queryString = new URLSearchParams(
    Object.fromEntries(Object.entries(params).filter(([, v]) => v))
  ).toString()

  return apiRequest(`/api/businesses?${queryString}`)
}

export async function fetchBusiness(id) {
  return apiRequest(`/api/businesses/${id}`)
}

export async function fetchReviews(businessId) {
  return apiRequest(`/api/reviews/business/${businessId}`)
}

export async function postReview(reviewData) {
  return apiRequest('/api/reviews', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reviewData),
  })
}
