import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchBusiness, fetchReviews } from '../utils/api'
import ReviewCard from '../components/ReviewCard'
import ReviewForm from '../components/ReviewForm'

const categoryLabels = {
  restaurant: 'Restaurant',
  retail: 'Retail',
  tourism: 'Tourism',
  service: 'Service',
  'food-producer': 'Food Producer',
}

const dayOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

export default function BusinessDetail() {
  const { id } = useParams()
  const [business, setBusiness] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadData = async () => {
    try {
      const [biz, revs] = await Promise.all([fetchBusiness(id), fetchReviews(id)])
      setBusiness(biz)
      setReviews(revs)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [id])

  const handleReviewPosted = () => loadData()

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 border-[3px] border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !business) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <p className="text-gray-500 dark:text-neutral-400 text-lg">{error || 'Business not found'}</p>
        <Link to="/" className="text-red-600 hover:text-red-700 font-medium text-sm">
          Back to home
        </Link>
      </div>
    )
  }

  const hasHours = business.hours && dayOrder.some(d => business.hours[d])

  return (
    <div className="bg-gray-50 dark:bg-neutral-950 transition-colors duration-300">
      {/* Hero Image */}
      <div className="relative h-64 sm:h-80 bg-neutral-200 dark:bg-neutral-900">
        {business.photos && business.photos.length > 0 ? (
          <>
            <img src={business.photos[0]} alt={business.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </>
        ) : (
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-900 dark:to-neutral-800">
            <svg className="w-20 h-20 text-neutral-300 dark:text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 -mt-16 relative z-10 pb-16 page-enter">
        {/* Business Info Card */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800 p-6 sm:p-8 mb-8 shadow-xl shadow-black/5 dark:shadow-black/20">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{business.name}</h1>
                {business.isVerified && (
                  <span className="bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Verified
                  </span>
                )}
              </div>
              <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 px-3 py-1.5 rounded-md border border-red-100 dark:border-red-500/20">
                {categoryLabels[business.category] || business.category}
              </span>
            </div>

            {/* Rating */}
            <div className="text-center sm:text-right bg-gray-50 dark:bg-neutral-800 rounded-xl p-4 sm:min-w-[140px]">
              <div className="text-3xl font-display font-bold text-gray-900 dark:text-white">
                {business.avgRating > 0 ? business.avgRating.toFixed(1) : '--'}
              </div>
              <div className="flex gap-0.5 justify-center sm:justify-end mt-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <svg
                    key={star}
                    className={`w-4 h-4 ${star <= Math.round(business.avgRating || 0) ? 'text-amber-400' : 'text-gray-200 dark:text-neutral-700'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-xs text-gray-500 dark:text-neutral-500 mt-1">{business.reviewCount || 0} reviews</p>
            </div>
          </div>

          {business.description && (
            <p className="mt-6 text-gray-600 dark:text-neutral-400 leading-relaxed">{business.description}</p>
          )}

          {/* Contact Info */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-neutral-400 p-3 rounded-xl bg-gray-50 dark:bg-neutral-800">
              <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {business.location}
            </div>

            {business.phone && (
              <a href={`tel:${business.phone}`} className="flex items-center gap-3 text-sm text-gray-600 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-400 transition-colors p-3 rounded-xl bg-gray-50 dark:bg-neutral-800">
                <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {business.phone}
              </a>
            )}

            {business.email && (
              <a href={`mailto:${business.email}`} className="flex items-center gap-3 text-sm text-gray-600 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-400 transition-colors p-3 rounded-xl bg-gray-50 dark:bg-neutral-800">
                <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {business.email}
              </a>
            )}

            {business.website && (
              <a href={business.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-gray-600 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-400 transition-colors p-3 rounded-xl bg-gray-50 dark:bg-neutral-800">
                <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                {business.website.replace(/^https?:\/\//, '')}
              </a>
            )}
          </div>

          {/* Hours */}
          {hasHours && (
            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-neutral-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-neutral-500 mb-3">Hours</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                {dayOrder.map(day => (
                  business.hours[day] && (
                    <div key={day} className="flex justify-between text-sm py-1.5 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors">
                      <span className="text-gray-500 dark:text-neutral-500 capitalize">{day}</span>
                      <span className="text-gray-900 dark:text-white font-medium">{business.hours[day]}</span>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Reviews Section */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Review List */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800 p-6">
              <h2 className="font-display text-lg font-bold text-gray-900 dark:text-white mb-1">
                Reviews <span className="text-gray-400 dark:text-neutral-600 font-normal">({reviews.length})</span>
              </h2>
              {reviews.length === 0 ? (
                <p className="text-gray-400 dark:text-neutral-600 text-sm py-10 text-center">
                  No reviews yet. Be the first to review!
                </p>
              ) : (
                <div>
                  {reviews.map(review => (
                    <ReviewCard key={review._id} review={review} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Review Form */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-24">
              <ReviewForm businessId={id} onReviewPosted={handleReviewPosted} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
