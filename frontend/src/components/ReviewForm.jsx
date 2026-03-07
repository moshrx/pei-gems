import { useState } from 'react'
import { postReview } from '../utils/api'

export default function ReviewForm({ businessId, onReviewPosted }) {
  const [form, setForm] = useState({ author: '', email: '', rating: 0, text: '' })
  const [hoveredStar, setHoveredStar] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.rating === 0) {
      setError('Please select a rating')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      await postReview({ ...form, businessId })
      setSuccess(true)
      setForm({ author: '', email: '', rating: 0, text: '' })
      onReviewPosted?.()
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800 p-6">
      <h3 className="font-display text-lg font-bold text-gray-900 dark:text-white mb-5">Write a Review</h3>

      {success && (
        <div className="mb-4 p-4 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-xl text-green-700 dark:text-green-400 text-sm">
          Your review has been posted successfully!
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-red-700 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Star Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Rating</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(0)}
                onClick={() => setForm(f => ({ ...f, rating: star }))}
                className="p-0.5 transition-transform hover:scale-110"
              >
                <svg
                  className={`w-8 h-8 transition-colors ${
                    star <= (hoveredStar || form.rating) ? 'text-amber-400' : 'text-gray-200 dark:text-neutral-700'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1.5">Name</label>
            <input
              type="text"
              required
              value={form.author}
              onChange={(e) => setForm(f => ({ ...f, author: e.target.value }))}
              placeholder="Your name"
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-neutral-600 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1.5">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="your@email.com"
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-neutral-600 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1.5">Your Review</label>
          <textarea
            required
            rows={4}
            value={form.text}
            onChange={(e) => setForm(f => ({ ...f, text: e.target.value }))}
            placeholder="Share your experience..."
            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-neutral-600 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 dark:disabled:bg-neutral-800 text-white font-semibold rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-red-600/20"
        >
          {submitting ? 'Posting...' : 'Post Review'}
        </button>
      </form>
    </div>
  )
}
