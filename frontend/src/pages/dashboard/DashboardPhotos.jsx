import { useEffect, useState } from 'react'
import { fetchMyBusiness } from '../../utils/api'

export default function DashboardPhotos() {
  const [business, setBusiness] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const biz = await fetchMyBusiness()
        setBusiness(biz)
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

  if (!business) {
    return (
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800 p-8 text-center">
        <p className="text-gray-500 dark:text-neutral-400">{error || 'No business found.'}</p>
      </div>
    )
  }

  const photos = business.photos || []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Photos</h1>
        <p className="text-sm text-gray-500 dark:text-neutral-400 mt-1">Manage your business photos.</p>
      </div>

      {/* Current photos */}
      {photos.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {photos.map((url, i) => (
            <div key={i} className="aspect-video rounded-xl overflow-hidden border border-gray-200 dark:border-neutral-800">
              <img src={url} alt={`Business photo ${i + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800 p-8 text-center shadow-xl shadow-black/5 dark:shadow-black/20">
          <div className="w-16 h-16 bg-gray-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400 dark:text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-lg font-display font-bold text-gray-900 dark:text-white mb-1">No Photos Yet</h2>
          <p className="text-sm text-gray-500 dark:text-neutral-400">Photo uploads coming in Phase 4.</p>
        </div>
      )}

      {/* Upload placeholder */}
      <div className="border-2 border-dashed border-gray-300 dark:border-neutral-700 rounded-2xl p-8 text-center">
        <svg className="w-10 h-10 text-gray-300 dark:text-neutral-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        <p className="text-sm font-medium text-gray-500 dark:text-neutral-400">Photo upload coming soon</p>
        <p className="text-xs text-gray-400 dark:text-neutral-500 mt-1">Cloudinary integration planned for Phase 4</p>
      </div>
    </div>
  )
}
