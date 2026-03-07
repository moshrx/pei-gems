import { useState } from 'react'

const categories = [
  { value: '', label: 'All Categories' },
  { value: 'restaurant', label: 'Restaurants' },
  { value: 'retail', label: 'Retail' },
  { value: 'tourism', label: 'Tourism' },
  { value: 'service', label: 'Services' },
  { value: 'food-producer', label: 'Food Producers' },
]

const locations = [
  { value: '', label: 'All Locations' },
  { value: 'Charlottetown', label: 'Charlottetown' },
  { value: 'Summerside', label: 'Summerside' },
  { value: 'Stratford', label: 'Stratford' },
  { value: 'Cornwall', label: 'Cornwall' },
]

export default function SearchBar({ onSearch, variant = 'hero' }) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [location, setLocation] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch({ search, category, location })
  }

  if (variant === 'compact') {
    return (
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search businesses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2.5 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-2.5 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl text-sm text-gray-700 dark:text-neutral-300 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
        >
          {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
        <button
          type="submit"
          className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors text-sm"
        >
          Search
        </button>
      </form>
    )
  }

  // Hero variant - glassmorphic on dark background
  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-3 border border-white/10">
        {/* Main search input */}
        <div className="relative mb-3">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search restaurants, shops, services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white/10 border border-white/10 rounded-xl text-white placeholder-neutral-400 focus:ring-2 focus:ring-red-500 focus:border-transparent focus:bg-white/15 outline-none transition text-sm"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="flex-1 px-4 py-3 bg-white/10 border border-white/10 rounded-xl text-neutral-200 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition [&>option]:text-gray-900"
          >
            {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>

          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="flex-1 px-4 py-3 bg-white/10 border border-white/10 rounded-xl text-neutral-200 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition [&>option]:text-gray-900"
          >
            {locations.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
          </select>

          <button
            type="submit"
            className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-red-600/30 text-sm active:scale-[0.98]"
          >
            Search
          </button>
        </div>
      </div>
    </form>
  )
}
