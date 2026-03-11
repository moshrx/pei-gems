import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { fetchBusiness, postReview } from '../utils/api'

export default function AddReview() {
  const { businessId } = useParams()
  const navigate = useNavigate()

  const [business, setBusiness] = useState(null)
  const [loadingBiz, setLoadingBiz] = useState(true)
  const [form, setForm] = useState({ author: '', email: '', rating: 0, text: '' })
  const [hoveredStar, setHoveredStar] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchBusiness(businessId)
      .then(setBusiness)
      .catch(() => setBusiness(null))
      .finally(() => setLoadingBiz(false))
  }, [businessId])

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.rating === 0) {
      setError('Please select a star rating.')
      return
    }
    if (!form.email.trim()) {
      setError('Email is required to connect your review.')
      return
    }
    setError('')
    setSubmitting(true)
    try {
      await postReview({ ...form, businessId })
      navigate(`/business/${businessId}?reviewed=1`)
    } catch (err) {
      setError(err.message || 'Failed to post review. Please try again.')
      setSubmitting(false)
    }
  }

  if (loadingBiz) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 border-[3px] border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 page-enter">
      {/* Back link */}
      <Link
        to={`/business/${businessId}`}
        className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to {business?.name || 'business'}
      </Link>

      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800 p-6 sm:p-8 shadow-xl shadow-black/5 dark:shadow-black/20">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-1">
            Write a Review
          </h1>
          {business && (
            <p className="text-sm text-gray-500 dark:text-neutral-400">
              Reviewing <span className="font-semibold text-gray-700 dark:text-neutral-200">{business.name}</span>
            </p>
          )}
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 dark:border-red-700/50 bg-red-50 dark:bg-red-600/10 px-4 py-3 text-sm text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Star rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
              Rating <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  onClick={() => setForm((f) => ({ ...f, rating: star }))}
                  className="p-0.5 transition-transform hover:scale-110"
                  aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                >
                  <svg
                    className={`w-9 h-9 transition-colors ${
                      star <= (hoveredStar || form.rating) ? 'text-amber-400' : 'text-gray-200 dark:text-neutral-700'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
              ))}
              {form.rating > 0 && (
                <span className="self-center ml-2 text-sm font-semibold text-amber-500">
                  {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][form.rating]}
                </span>
              )}
            </div>
          </div>

          {/* Name + Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1.5">
                Your name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={form.author}
                onChange={set('author')}
                placeholder="Jane Smith"
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-neutral-600 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1.5">
                Email address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={set('email')}
                placeholder="your@email.com"
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-neutral-600 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
              />
              <p className="text-xs text-gray-400 dark:text-neutral-600 mt-1">
                Used to connect and verify your review. Not displayed publicly.
              </p>
            </div>
          </div>

          {/* Review text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1.5">
              Your review <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={5}
              value={form.text}
              onChange={set('text')}
              placeholder="Share your experience — what did you love? What could be better?"
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-neutral-600 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition resize-none"
            />
          </div>

          {/* Submit */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 inline-flex items-center justify-center gap-2 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors shadow-lg shadow-red-600/20"
            >
              {submitting && (
                <span className="w-4 h-4 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
              )}
              {submitting ? 'Posting review…' : 'Post Review'}
            </button>
            <Link
              to={`/business/${businessId}`}
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-gray-50 dark:hover:bg-neutral-800 text-sm font-semibold text-gray-700 dark:text-neutral-200 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
