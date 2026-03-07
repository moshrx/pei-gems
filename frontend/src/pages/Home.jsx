import { useState, useEffect } from 'react'
import SearchBar from '../components/SearchBar'
import BusinessCard from '../components/BusinessCard'
import { fetchBusinesses } from '../utils/api'

const quickCategories = [
  { value: 'restaurant', label: 'Restaurants', icon: '🍽' },
  { value: 'retail', label: 'Retail', icon: '🛍' },
  { value: 'tourism', label: 'Tourism', icon: '🏖' },
  { value: 'service', label: 'Services', icon: '🔧' },
  { value: 'food-producer', label: 'Food Producers', icon: '🥧' },
]

export default function Home() {
  const [businesses, setBusinesses] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = async (params) => {
    setLoading(true)
    setSearched(true)
    try {
      const data = await fetchBusinesses(params)
      setBusinesses(data)
    } catch {
      setBusinesses([])
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryClick = (category) => {
    handleSearch({ category })
  }

  useEffect(() => {
    handleSearch({})
  }, [])

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[520px] sm:min-h-[600px] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1499092346589-b9b6be3e94b2?w=1920&q=80"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-red-950/40 to-transparent" />
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

        <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-600/20 backdrop-blur-sm rounded-full border border-red-500/20 mb-6">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
              <span className="text-xs font-medium text-red-200 tracking-wide uppercase">Prince Edward Island</span>
            </div>

            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-5 tracking-tight leading-[1.1]">
              Discover Local
              <br />
              <span className="text-red-500">Hidden Gems</span>
            </h1>

            <p className="text-neutral-300 text-lg sm:text-xl max-w-xl mb-10 leading-relaxed">
              Your go-to directory for finding and supporting authentic businesses across PEI.
            </p>

            <SearchBar onSearch={handleSearch} />
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-50 dark:from-neutral-950 to-transparent" />
      </section>

      {/* Quick Categories */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 -mt-4 relative z-10">
        <div className="flex gap-2.5 overflow-x-auto pb-2 no-scrollbar">
          {quickCategories.map(cat => (
            <button
              key={cat.value}
              onClick={() => handleCategoryClick(cat.value)}
              className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-neutral-900 rounded-full shadow-sm border border-gray-200 dark:border-neutral-800 hover:border-red-300 dark:hover:border-red-800 hover:shadow-md text-sm font-medium text-gray-700 dark:text-neutral-300 hover:text-red-600 dark:hover:text-red-400 transition-all whitespace-nowrap"
            >
              <span className="text-base">{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Results */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-8 h-8 border-[3px] border-red-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-400 dark:text-neutral-500">Loading businesses...</p>
          </div>
        )}

        {!loading && businesses.length === 0 && searched && (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gray-100 dark:bg-neutral-900 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-300 dark:text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-gray-500 dark:text-neutral-400 text-lg font-medium">No businesses found</p>
            <p className="text-gray-400 dark:text-neutral-600 text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        )}

        {!loading && businesses.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white">Browse Businesses</h2>
                <p className="text-sm text-gray-500 dark:text-neutral-500 mt-1">
                  <span className="font-semibold text-gray-900 dark:text-white">{businesses.length}</span> results found
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {businesses.map(business => (
                <BusinessCard key={business._id} business={business} />
              ))}
            </div>
          </>
        )}
      </section>
    </>
  )
}
