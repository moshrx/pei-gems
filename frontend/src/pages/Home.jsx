import { useMemo, useState } from 'react'
import SearchBar from '../components/SearchBar'
import BusinessCard from '../components/BusinessCard'

const mockBusinesses = [
  { id: '1', name: 'Blue Mussel Cafe', category: 'restaurant', location: 'Charlottetown', avgRating: 5 },
  { id: '2', name: 'North Shore Crafts', category: 'retail', location: 'Cavendish', avgRating: 4 },
  { id: '3', name: 'Island Trails Tours', category: 'tourism', location: 'Summerside', avgRating: 5 },
]

function Home() {
  const [query, setQuery] = useState('')

  const filteredBusinesses = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return mockBusinesses
    return mockBusinesses.filter((business) => {
      return (
        business.name.toLowerCase().includes(term) ||
        business.category.toLowerCase().includes(term) ||
        business.location.toLowerCase().includes(term)
      )
    })
  }, [query])

  return (
    <main>
      <h1 style={{ margin: '0 0 8px', fontSize: 30 }}>PEI Local</h1>
      <p style={{ margin: '0 0 16px', color: '#475569' }}>Discover and rate local businesses across Prince Edward Island.</p>
      <SearchBar value={query} onChange={setQuery} />

      <section style={{ marginTop: 16, display: 'grid', gap: 12 }}>
        {filteredBusinesses.map((business) => (
          <BusinessCard key={business.id} business={business} />
        ))}
      </section>
    </main>
  )
}

export default Home
