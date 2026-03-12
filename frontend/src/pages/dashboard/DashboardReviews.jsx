import { useEffect, useState } from 'react'
import { fetchMyBusiness, fetchReviews, importGoogleReviews, respondToReview } from '../../utils/api'

export default function DashboardReviews() {
  const [reviews, setReviews] = useState([])
  const [business, setBusiness] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [respondingTo, setRespondingTo] = useState(null)
  const [responseText, setResponseText] = useState('')
  const [sending, setSending] = useState(false)
  const [importing, setImporting] = useState(false)
  const [importMessage, setImportMessage] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const biz = await fetchMyBusiness()
        setBusiness(biz)
        const revs = await fetchReviews(biz._id)
        setReviews(revs)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleImport = async () => {
    if (!business) return
    setImporting(true)
    setImportMessage('')
    setError('')
    try {
      const result = await importGoogleReviews(business._id)
      if (result.imported > 0) {
        setImportMessage(`Imported ${result.imported} new review${result.imported !== 1 ? 's' : ''} from Google (${result.total} found).`)
        // Reload reviews
        const revs = await fetchReviews(business._id)
        setReviews(revs)
      } else {
        setImportMessage(`No new reviews to import (${result.total} found on Google, all already imported).`)
      }
    } catch (err) {
      setError(err.message || 'Failed to import Google reviews.')
    } finally {
      setImporting(false)
    }
  }

  const handleRespond = async (reviewId) => {
    if (!responseText.trim()) return
    setSending(true)
    try {
      const updated = await respondToReview(reviewId, responseText.trim())
      setReviews((prev) => prev.map((r) => (r._id === reviewId ? updated : r)))
      setRespondingTo(null)
      setResponseText('')
    } catch (err) {
      setError(err.message)
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!business) {
    return (
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800 p-8 text-center">
        <p className="text-gray-500 dark:text-neutral-400">{error || 'No business found.'}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Reviews</h1>
          <p className="text-sm text-gray-500 dark:text-neutral-400 mt-1">{reviews.length} review{reviews.length !== 1 ? 's' : ''} for {business.name}</p>
        </div>
        <button
          onClick={handleImport}
          disabled={importing}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-gray-50 dark:hover:bg-neutral-800 disabled:opacity-60 disabled:cursor-not-allowed text-sm font-semibold text-gray-700 dark:text-neutral-200 transition-colors"
        >
          {importing ? (
            <>
              <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              Importing…
            </>
          ) : (
            <>
              <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Import from Google
            </>
          )}
        </button>
      </div>

      {importMessage && (
        <div className="rounded-xl border border-emerald-200 dark:border-emerald-700/50 bg-emerald-50 dark:bg-emerald-600/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300">
          {importMessage}
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl px-3 py-2">{error}</p>
      )}

      {reviews.length === 0 ? (
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800 p-8 text-center">
          <p className="text-gray-500 dark:text-neutral-400">No reviews yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review._id} className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800 p-5 shadow-xl shadow-black/5 dark:shadow-black/20">
              {/* Review header */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-500/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-red-600 dark:text-red-400">{review.author?.[0]?.toUpperCase() || '?'}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-gray-900 dark:text-white text-sm">{review.author}</span>
                    <span className="text-xs text-gray-400 dark:text-neutral-500 flex-shrink-0">{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex gap-0.5 mt-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <svg key={s} className={`w-4 h-4 ${s <= review.rating ? 'text-amber-400' : 'text-gray-200 dark:text-neutral-700'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-neutral-300 mt-2">{review.text}</p>
                </div>
              </div>

              {/* Business response */}
              {review.businessResponse?.text ? (
                <div className="mt-4 ml-13 pl-4 border-l-2 border-red-200 dark:border-red-500/30">
                  <p className="text-xs font-semibold text-red-600 dark:text-red-400 mb-1">Your Response</p>
                  <p className="text-sm text-gray-600 dark:text-neutral-300">{review.businessResponse.text}</p>
                  <p className="text-xs text-gray-400 dark:text-neutral-500 mt-1">{new Date(review.businessResponse.date).toLocaleDateString()}</p>
                </div>
              ) : respondingTo === review._id ? (
                <div className="mt-4 ml-13 space-y-3">
                  <textarea
                    rows={3}
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm resize-none"
                    placeholder="Write your response..."
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRespond(review._id)}
                      disabled={sending || !responseText.trim()}
                      className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold rounded-xl px-4 py-2 transition-colors text-sm"
                    >
                      {sending && <span className="w-3.5 h-3.5 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />}
                      {sending ? 'Sending...' : 'Send Response'}
                    </button>
                    <button
                      onClick={() => { setRespondingTo(null); setResponseText('') }}
                      className="text-sm text-gray-500 dark:text-neutral-400 hover:text-gray-700 dark:hover:text-white font-medium px-4 py-2 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-3 ml-13">
                  <button
                    onClick={() => setRespondingTo(review._id)}
                    className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium transition-colors"
                  >
                    Reply to this review
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
