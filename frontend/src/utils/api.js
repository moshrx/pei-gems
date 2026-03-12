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

export async function signupUser({ email, password }) {
  return apiRequest('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
}

export async function fetchMe() {
  return apiRequest('/api/auth/me')
}

export async function fetchMyBusiness() {
  return apiRequest('/api/businesses/owner/me')
}

export async function createMyBusiness(data) {
  return apiRequest('/api/businesses/mine', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export async function addBusinessPhoto(businessId, imageUrl) {
  return apiRequest(`/api/businesses/${businessId}/photos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageUrl }),
  })
}

export async function deleteBusinessPhoto(businessId, photoId) {
  return apiRequest(`/api/businesses/${businessId}/photos/${photoId}`, {
    method: 'DELETE',
  })
}

export async function reorderBusinessPhotos(businessId, photos) {
  return apiRequest(`/api/businesses/${businessId}/photos/reorder`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ photos }),
  })
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

export async function createCheckoutSession({ plan }) {
  return apiRequest('/api/billing/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ plan }),
  })
}

export async function fetchSubscription() {
  return apiRequest('/api/billing/subscription')
}

export async function cancelSubscription() {
  return apiRequest('/api/billing/subscription', { method: 'DELETE' })
}

export async function importGoogleReviews(businessId) {
  return apiRequest(`/api/businesses/${businessId}/import-reviews`, { method: 'POST' })
}
