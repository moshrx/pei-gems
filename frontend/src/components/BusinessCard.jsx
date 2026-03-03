import { useState } from 'react'

export default function BusinessCard({ business }) {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer">
      {/* Image */}
      <div className="bg-gray-200 h-48 flex items-center justify-center">
        {business.photos && business.photos.length > 0 ? (
          <img
            src={business.photos[0]}
            alt={business.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-gray-400 text-4xl">📷</span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900">{business.name}</h3>
        
        <div className="flex items-center mt-2">
          <span className="text-yellow-500">{'⭐'.repeat(Math.floor(business.avgRating))}</span>
          <span className="text-gray-600 ml-2">
            {business.avgRating.toFixed(1)} ({business.reviewCount} reviews)
          </span>
        </div>

        <p className="text-gray-600 text-sm mt-2">
          <span className="font-semibold">Category:</span> {business.category}
        </p>

        <p className="text-gray-600 text-sm">
          <span className="font-semibold">Location:</span> {business.location}
        </p>

        {business.phone && (
          <p className="text-gray-600 text-sm">
            <span className="font-semibold">Phone:</span> {business.phone}
          </p>
        )}

        {business.website && (
          <a
            href={business.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 text-sm mt-3 inline-block"
          >
            Visit Website →
          </a>
        )}

        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full mt-4 bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold py-2 rounded transition"
        >
          {showDetails ? 'Hide Details' : 'View Details'}
        </button>

        {showDetails && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-gray-700">{business.description}</p>
          </div>
        )}
      </div>
    </div>
  )
}
