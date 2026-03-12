function timeAgo(dateStr) {
  const now = new Date()
  const date = new Date(dateStr)
  const seconds = Math.floor((now - date) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months}mo ago`
  return `${Math.floor(months / 12)}y ago`
}

export default function ReviewCard({ review }) {
  return (
    <div className="py-5 border-b border-gray-100 dark:border-neutral-800 last:border-0">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          {review.googleAuthorPhotoUrl ? (
            <img
              src={review.googleAuthorPhotoUrl}
              alt={review.author}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 font-bold flex items-center justify-center text-sm">
              {review.author.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <p className="font-medium text-gray-900 dark:text-white text-sm">{review.author}</p>
            <p className="text-xs text-gray-400 dark:text-neutral-600">{timeAgo(review.createdAt)}</p>
          </div>
        </div>
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map(star => (
            <svg
              key={star}
              className={`w-3.5 h-3.5 ${star <= review.rating ? 'text-amber-400' : 'text-gray-200 dark:text-neutral-700'}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
      </div>
      <p className="mt-3 text-sm text-gray-600 dark:text-neutral-400 leading-relaxed">{review.text}</p>

      {review.source === 'google' && (
        <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-400 dark:text-neutral-500">
          <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Review from Google
        </div>
      )}

      {review.businessResponse?.text && (
        <div className="mt-3 ml-6 p-3 bg-gray-50 dark:bg-neutral-800 rounded-xl border-l-2 border-red-400">
          <p className="text-[10px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400 mb-1">Business Response</p>
          <p className="text-sm text-gray-600 dark:text-neutral-400">{review.businessResponse.text}</p>
        </div>
      )}
    </div>
  )
}
