import { Link } from 'react-router-dom'

const categoryColors = {
  restaurant: 'bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400',
  retail: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400',
  tourism: 'bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400',
  service: 'bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400',
  'food-producer': 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400',
  other: 'bg-gray-50 text-gray-600 dark:bg-neutral-800 dark:text-neutral-400',
}

const categoryLabels = {
  restaurant: 'Restaurant',
  retail: 'Retail',
  tourism: 'Tourism',
  service: 'Service',
  'food-producer': 'Food Producer',
  other: 'Other',
}

function StarRating({ rating, count }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(star => (
          <svg
            key={star}
            className={`w-3.5 h-3.5 ${star <= Math.round(rating) ? 'text-amber-400' : 'text-gray-200 dark:text-neutral-700'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="text-xs text-gray-500 dark:text-neutral-500">
        {rating > 0 ? rating.toFixed(1) : 'New'} ({count})
      </span>
    </div>
  )
}

export default function BusinessCard({ business }) {
  const colorClass = categoryColors[business.category] || categoryColors.other
  const label = categoryLabels[business.category] || business.category

  return (
    <Link
      to={`/business/${business._id}`}
      className="group bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800 overflow-hidden hover:border-red-200 dark:hover:border-red-900/50 hover:shadow-xl hover:shadow-red-600/5 dark:hover:shadow-red-600/5 transition-all duration-300"
    >
      {/* Image */}
      <div className="relative h-44 bg-gray-100 dark:bg-neutral-800 overflow-hidden">
        {business.photos && business.photos.length > 0 ? (
          <img
            src={business.photos[0]}
            alt={business.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <svg className="w-10 h-10 text-gray-300 dark:text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        {business.isVerified && (
          <div className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md flex items-center gap-1 shadow-lg">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Verified
          </div>
        )}
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <h3 className="font-display font-semibold text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-1">
            {business.name}
          </h3>
          <span className={`shrink-0 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md ${colorClass}`}>
            {label}
          </span>
        </div>

        <StarRating rating={business.avgRating || 0} count={business.reviewCount || 0} />

        <div className="mt-3 flex items-center gap-1.5 text-sm text-gray-500 dark:text-neutral-500">
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {business.location}
        </div>

        {business.description && (
          <p className="mt-2.5 text-sm text-gray-400 dark:text-neutral-600 line-clamp-2 leading-relaxed">{business.description}</p>
        )}

        {/* View arrow */}
        <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-red-600 dark:text-red-400 opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-1 transition-all duration-300">
          View Details
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  )
}
