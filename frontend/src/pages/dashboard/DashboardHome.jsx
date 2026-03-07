import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchMyBusiness, fetchReviews } from '../../utils/api'

export default function DashboardHome() {
  const [business, setBusiness] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800 p-8 text-center shadow-xl shadow-black/5 dark:shadow-black/20">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-2">No Business Linked</h2>
        <p className="text-gray-500 dark:text-neutral-400 text-sm">{error}</p>
        <p className="text-gray-400 dark:text-neutral-500 text-xs mt-2">Contact support to link a business to your account.</p>
      </div>
    )
  }

  const recentReviews = reviews.slice(0, 3)

  const stats = [
    { label: 'Avg Rating', value: business.avgRating?.toFixed(1) || '0.0', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z', color: 'text-amber-500' },
    { label: 'Reviews', value: business.reviewCount || 0, icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z', color: 'text-blue-500' },
    { label: 'Photos', value: business.photos?.length || 0, icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', color: 'text-emerald-500' },
    { label: 'Status', value: business.isVerified ? 'Verified' : 'Pending', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', color: business.isVerified ? 'text-emerald-500' : 'text-amber-500' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800 p-6 shadow-xl shadow-black/5 dark:shadow-black/20">
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{business.name}</h1>
        <p className="text-sm text-gray-500 dark:text-neutral-400 mt-1">{business.category} &middot; {business.location}</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800 p-4 shadow-xl shadow-black/5 dark:shadow-black/20">
            <div className="flex items-center gap-2 mb-2">
              <svg className={`w-5 h-5 ${stat.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d={stat.icon} />
              </svg>
              <span className="text-xs text-gray-500 dark:text-neutral-400 font-medium">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { to: '/dashboard/profile', label: 'Edit Profile', desc: 'Update business info', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
          { to: '/dashboard/reviews', label: 'View Reviews', desc: 'Read & respond', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
          { to: '/dashboard/photos', label: 'Upload Photos', desc: 'Add business images', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
        ].map((action) => (
          <Link key={action.to} to={action.to} className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800 p-5 shadow-xl shadow-black/5 dark:shadow-black/20 hover:border-red-300 dark:hover:border-red-500/30 transition-colors group">
            <svg className="w-6 h-6 text-gray-400 dark:text-neutral-500 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d={action.icon} />
            </svg>
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{action.label}</h3>
            <p className="text-xs text-gray-500 dark:text-neutral-400 mt-0.5">{action.desc}</p>
          </Link>
        ))}
      </div>

      {/* Recent reviews */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800 p-6 shadow-xl shadow-black/5 dark:shadow-black/20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-gray-900 dark:text-white">Recent Reviews</h2>
          {reviews.length > 3 && (
            <Link to="/dashboard/reviews" className="text-sm text-red-600 dark:text-red-400 font-medium hover:underline">View all</Link>
          )}
        </div>
        {recentReviews.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-neutral-400">No reviews yet.</p>
        ) : (
          <div className="space-y-4">
            {recentReviews.map((review) => (
              <div key={review._id} className="flex gap-3 pb-4 border-b border-gray-100 dark:border-neutral-800 last:border-0 last:pb-0">
                <div className="w-9 h-9 rounded-full bg-red-100 dark:bg-red-500/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-red-600 dark:text-red-400">{review.author?.[0]?.toUpperCase() || '?'}</span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{review.author}</span>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <svg key={s} className={`w-3.5 h-3.5 ${s <= review.rating ? 'text-amber-400' : 'text-gray-200 dark:text-neutral-700'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-neutral-300 mt-0.5 line-clamp-2">{review.text}</p>
                  <p className="text-xs text-gray-400 dark:text-neutral-500 mt-1">{new Date(review.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
