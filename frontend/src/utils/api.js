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

export async function fetchMe() {
  return apiRequest('/api/auth/me')
}

export async function fetchMyBusiness() {
  return apiRequest('/api/businesses/owner/me')
}

export async function updateBusiness(id, data) {
  return apiRequest(`/api/businesses/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export async function respondToReview(reviewId, text) {
  return apiRequest(`/api/reviews/${reviewId}/response`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  })
}

export async function changePassword({ currentPassword, newPassword }) {
  return apiRequest('/api/auth/password', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ currentPassword, newPassword }),
  })
}

export async function changeEmail({ newEmail, password }) {
  return apiRequest('/api/auth/email', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ newEmail, password }),
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
