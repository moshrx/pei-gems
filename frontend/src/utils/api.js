const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001'

export async function fetchBusinesses(params = {}) {
  const queryString = new URLSearchParams(
    Object.fromEntries(Object.entries(params).filter(([, v]) => v))
  ).toString()
  const res = await fetch(`${API_URL}/api/businesses?${queryString}`)
  if (!res.ok) throw new Error('Failed to fetch businesses')
  return res.json()
}

export async function fetchBusiness(id) {
  const res = await fetch(`${API_URL}/api/businesses/${id}`)
  if (!res.ok) throw new Error('Business not found')
  return res.json()
}

export async function fetchReviews(businessId) {
  const res = await fetch(`${API_URL}/api/reviews/business/${businessId}`)
  if (!res.ok) throw new Error('Failed to fetch reviews')
  return res.json()
}

export async function postReview(reviewData) {
  const res = await fetch(`${API_URL}/api/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reviewData),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || 'Failed to post review')
  }
  return res.json()
}
