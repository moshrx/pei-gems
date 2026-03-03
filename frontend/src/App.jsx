import { useState } from 'react'
import SearchBar from './components/SearchBar'
import BusinessCard from './components/BusinessCard'
import './App.css'

function App() {
  const [businesses, setBusinesses] = useState([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    location: ''
  })

  const handleSearch = async (searchParams) => {
    setLoading(true)
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001'
      const queryString = new URLSearchParams(searchParams).toString()
      const response = await fetch(`${apiUrl}/api/businesses?${queryString}`)
      const data = await response.json()
      setBusinesses(data)
    } catch (error) {
      console.error('Error fetching businesses:', error)
      alert('Failed to load businesses. Make sure the backend is running!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold text-blue-600">PEI Local</h1>
          <p className="text-gray-600 text-lg">Discover authentic PEI businesses</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Search Section */}
        <SearchBar onSearch={handleSearch} />

        {/* Results */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Loading businesses...</p>
          </div>
        )}

        {!loading && businesses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Search for a business or browse by category to get started!
            </p>
          </div>
        )}

        {!loading && businesses.length > 0 && (
          <div>
            <p className="text-gray-600 mb-6">{businesses.length} businesses found</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {businesses.map(business => (
                <BusinessCard key={business._id} business={business} />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p>&copy; 2024 PEI Local. Supporting local businesses.</p>
        </div>
      </footer>
    </div>
  )
}

export default App
