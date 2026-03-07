import { useEffect, useState } from 'react'
import { fetchMyBusiness, updateBusiness } from '../../utils/api'

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

export default function DashboardProfile() {
  const [business, setBusiness] = useState(null)
  const [form, setForm] = useState({
    name: '', phone: '', email: '', website: '', description: '',
    hours: { monday: '', tuesday: '', wednesday: '', thursday: '', friday: '', saturday: '', sunday: '' },
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const biz = await fetchMyBusiness()
        setBusiness(biz)
        setForm({
          name: biz.name || '',
          phone: biz.phone || '',
          email: biz.email || '',
          website: biz.website || '',
          description: biz.description || '',
          hours: {
            monday: biz.hours?.monday || '',
            tuesday: biz.hours?.tuesday || '',
            wednesday: biz.hours?.wednesday || '',
            thursday: biz.hours?.thursday || '',
            friday: biz.hours?.friday || '',
            saturday: biz.hours?.saturday || '',
            sunday: biz.hours?.sunday || '',
          },
        })
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!form.name.trim()) {
      setError('Business name is required.')
      return
    }

    setSaving(true)
    try {
      const updated = await updateBusiness(business._id, form)
      setBusiness(updated)
      setSuccess('Profile updated successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const updateField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }))
  const updateHour = (day, value) => setForm((prev) => ({ ...prev, hours: { ...prev.hours, [day]: value } }))

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!business) {
    return (
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800 p-8 text-center">
        <p className="text-gray-500 dark:text-neutral-400">{error || 'No business found.'}</p>
      </div>
    )
  }

  const inputClass = 'w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Edit Profile</h1>
        <p className="text-sm text-gray-500 dark:text-neutral-400 mt-1">Update your business information.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800 p-6 shadow-xl shadow-black/5 dark:shadow-black/20 space-y-5">
        {/* Basic info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1.5">Business Name *</label>
            <input type="text" value={form.name} onChange={(e) => updateField('name', e.target.value)} className={inputClass} placeholder="Your business name" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1.5">Phone</label>
            <input type="tel" value={form.phone} onChange={(e) => updateField('phone', e.target.value)} className={inputClass} placeholder="(902) 555-1234" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1.5">Email</label>
            <input type="email" value={form.email} onChange={(e) => updateField('email', e.target.value)} className={inputClass} placeholder="hello@business.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1.5">Website</label>
            <input type="url" value={form.website} onChange={(e) => updateField('website', e.target.value)} className={inputClass} placeholder="https://yourbusiness.com" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1.5">Description</label>
          <textarea rows={4} value={form.description} onChange={(e) => updateField('description', e.target.value)} className={inputClass + ' resize-none'} placeholder="Tell visitors about your business..." />
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

        {/* Messages */}
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl px-3 py-2">{error}</p>
        )}
        {success && (
          <p className="text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-xl px-3 py-2">{success}</p>
        )}

        <button type="submit" disabled={saving} className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold rounded-xl px-6 py-2.5 transition-colors text-sm">
          {saving && <span className="w-4 h-4 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}
