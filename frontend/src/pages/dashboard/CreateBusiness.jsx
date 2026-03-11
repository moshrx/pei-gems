import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createMyBusiness } from '../../utils/api'

const CATEGORIES = [
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'retail', label: 'Retail' },
  { value: 'tourism', label: 'Tourism' },
  { value: 'service', label: 'Service' },
  { value: 'food-producer', label: 'Food Producer' },
  { value: 'other', label: 'Other' },
]

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

export default function CreateBusiness() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    category: '',
    location: '',
    phone: '',
    email: '',
    website: '',
    description: '',
    hours: { monday: '', tuesday: '', wednesday: '', thursday: '', friday: '', saturday: '', sunday: '' },
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const updateField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }))
  const updateHour = (day, value) => setForm((prev) => ({ ...prev, hours: { ...prev.hours, [day]: value } }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.name.trim()) {
      setError('Business name is required.')
      return
    }
    if (!form.category) {
      setError('Please select a category.')
      return
    }
    if (!form.location.trim()) {
      setError('Location is required.')
      return
    }

    setLoading(true)
    try {
      await createMyBusiness(form)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Failed to create business.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = 'w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm'

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Set Up Your Business</h1>
        <p className="text-sm text-gray-500 dark:text-neutral-400 mt-2">Tell us about your business to get started on PEI Gems.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800 p-6 shadow-xl shadow-black/5 dark:shadow-black/20 space-y-5">
        {/* Required fields */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1.5">Business Name *</label>
          <input type="text" value={form.name} onChange={(e) => updateField('name', e.target.value)} className={inputClass} placeholder="e.g. Island Bakery" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1.5">Category *</label>
            <select value={form.category} onChange={(e) => updateField('category', e.target.value)} className={inputClass}>
              <option value="">Select a category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1.5">Location *</label>
            <input type="text" value={form.location} onChange={(e) => updateField('location', e.target.value)} className={inputClass} placeholder="e.g. Charlottetown" />
          </div>
        </div>

        {/* Optional fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1.5">Phone</label>
            <input type="tel" value={form.phone} onChange={(e) => updateField('phone', e.target.value)} className={inputClass} placeholder="(902) 555-1234" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1.5">Email</label>
            <input type="email" value={form.email} onChange={(e) => updateField('email', e.target.value)} className={inputClass} placeholder="hello@business.com" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1.5">Website</label>
          <input type="url" value={form.website} onChange={(e) => updateField('website', e.target.value)} className={inputClass} placeholder="https://yourbusiness.com" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1.5">Description</label>
          <textarea rows={4} value={form.description} onChange={(e) => updateField('description', e.target.value)} className={inputClass + ' resize-none'} placeholder="Tell visitors what makes your business special..." />
        </div>

        {/* Hours */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-3">Business Hours</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {DAYS.map((day) => (
              <div key={day} className="flex items-center gap-3">
                <span className="text-sm text-gray-500 dark:text-neutral-400 w-24 capitalize">{day}</span>
                <input type="text" value={form.hours[day]} onChange={(e) => updateHour(day, e.target.value)} className={inputClass} placeholder="9:00 AM - 5:00 PM" />
              </div>
            ))}
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl px-3 py-2">{error}</p>
        )}

        <button type="submit" disabled={loading} className="w-full inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold rounded-xl px-6 py-2.5 transition-colors text-sm">
          {loading && <span className="w-4 h-4 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />}
          {loading ? 'Creating Business...' : 'Create Business'}
        </button>
      </form>
    </div>
  )
}
