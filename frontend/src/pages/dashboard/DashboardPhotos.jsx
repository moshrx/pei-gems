import { useEffect, useMemo, useState } from 'react'
import {
  addBusinessPhoto,
  deleteBusinessPhoto,
  fetchMyBusiness,
  reorderBusinessPhotos,
  fetchSubscription,
} from '../../utils/api'

const MAX_PHOTOS = 10
const MAX_IMAGE_BYTES = 5 * 1024 * 1024
const CLOUDINARY_WIDGET_URL = 'https://widget.cloudinary.com/v2.0/global/all.js'

function getThumbnailUrl(url) {
  if (!url || !url.includes('/upload/')) return url
  return url.replace('/upload/', '/upload/f_auto,q_auto,w_640,h_360,c_fill/')
}

function loadCloudinaryScript() {
  return new Promise((resolve, reject) => {
    if (window.cloudinary) {
      resolve(window.cloudinary)
      return
    }

    const existing = document.querySelector('script[data-cloudinary-widget="true"]')
    if (existing) {
      existing.addEventListener('load', () => resolve(window.cloudinary))
      existing.addEventListener('error', () => reject(new Error('Failed to load Cloudinary widget.')))
      return
    }

    const script = document.createElement('script')
    script.src = CLOUDINARY_WIDGET_URL
    script.async = true
    script.dataset.cloudinaryWidget = 'true'
    script.onload = () => resolve(window.cloudinary)
    script.onerror = () => reject(new Error('Failed to load Cloudinary widget.'))
    document.body.appendChild(script)
  })
}

export default function DashboardPhotos() {
  const [business, setBusiness] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [photoLimit, setPhotoLimit] = useState(MAX_PHOTOS)

  const [photos, setPhotos] = useState([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [deletingIndex, setDeletingIndex] = useState(-1)
  const [savingOrder, setSavingOrder] = useState(false)

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

  const hasUnsavedOrder = useMemo(() => {
    if (!business) return false
    return JSON.stringify(photos) !== JSON.stringify(business.photos || [])
  }, [photos, business])

  useEffect(() => {
    const load = async () => {
      try {
        const [biz, sub] = await Promise.all([fetchMyBusiness(), fetchSubscription()])
        setBusiness(biz)
        setPhotos(biz.photos || [])
        const plan = sub?.plan || 'free'
        setPhotoLimit(plan === 'free' ? 3 : MAX_PHOTOS)
      } catch (err) {
        setError(err.message || 'Failed to load business data.')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const refreshBusiness = (updatedBusiness) => {
    setBusiness(updatedBusiness)
    setPhotos(updatedBusiness.photos || [])
  }

  const openUploadWidget = async () => {
    setError('')
    setMessage('')

    if (!business) return
    if (photos.length >= photoLimit) {
      setError(`You can upload up to ${photoLimit} photos only.`)
      return
    }

    if (!cloudName || !uploadPreset) {
      setError('Cloudinary is not configured. Please set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET.')
      return
    }

    try {
      const cloudinary = await loadCloudinaryScript()

      const widget = cloudinary.createUploadWidget(
        {
          cloudName,
          uploadPreset,
          folder: 'pei-gems/business-photos',
          sources: ['local'],
          multiple: false,
          maxFiles: 1,
          clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
          maxFileSize: MAX_IMAGE_BYTES,
          resourceType: 'image',
          showAdvancedOptions: false,
          showSkipCropButton: true,
          singleUploadAutoClose: true,
          cropping: false,
        },
        async (widgetError, result) => {
          if (widgetError) {
            setUploading(false)
            setUploadProgress(0)
            setError(widgetError.message || 'Upload failed.')
            return
          }

          if (!result) return

          if (result.event === 'upload-added') {
            setUploading(true)
            setUploadProgress(0)
          }

          if (result.event === 'upload-progress') {
            const progress = Number(result.info?.progress || 0)
            setUploadProgress(Number.isFinite(progress) ? progress : 0)
          }

          if (result.event === 'success') {
            try {
              setUploading(true)
              setUploadProgress(100)
              const updated = await addBusinessPhoto(business._id, result.info.secure_url)
              refreshBusiness(updated)
              setMessage('Photo uploaded successfully.')
            } catch (err) {
              setError(err.message || 'Failed to save photo to business.')
            } finally {
              setUploading(false)
              setUploadProgress(0)
            }
          }

          if (result.event === 'close') {
            setUploading(false)
            setUploadProgress(0)
          }
        }
      )

      widget.open()
    } catch (err) {
      setError(err.message || 'Unable to open upload widget.')
    }
  }

  const handleDelete = async (index) => {
    if (!business) return

    setError('')
    setMessage('')
    setDeletingIndex(index)

    try {
      const updated = await deleteBusinessPhoto(business._id, index)
      refreshBusiness(updated)
      setMessage('Photo deleted.')
    } catch (err) {
      setError(err.message || 'Failed to delete photo.')
    } finally {
      setDeletingIndex(-1)
    }
  }

  const movePhoto = (index, direction) => {
    const nextIndex = direction === 'up' ? index - 1 : index + 1
    if (nextIndex < 0 || nextIndex >= photos.length) return

    setPhotos((prev) => {
      const reordered = [...prev]
      const temp = reordered[index]
      reordered[index] = reordered[nextIndex]
      reordered[nextIndex] = temp
      return reordered
    })
  }

  const saveOrder = async () => {
    if (!business || !hasUnsavedOrder) return

    setError('')
    setMessage('')
    setSavingOrder(true)

    try {
      const updated = await reorderBusinessPhotos(business._id, photos)
      refreshBusiness(updated)
      setMessage('Photo order updated.')
    } catch (err) {
      setError(err.message || 'Failed to save photo order.')
    } finally {
      setSavingOrder(false)
    }
  }

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Photos</h1>
          <p className="text-sm text-gray-500 dark:text-neutral-400 mt-1">
            Manage your gallery ({photos.length}/{photoLimit})
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={openUploadWidget}
            disabled={uploading || photos.length >= photoLimit}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors"
          >
            {uploading ? (
              <span className="w-4 h-4 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            )}
            Upload photo
          </button>

          <button
            onClick={saveOrder}
            disabled={!hasUnsavedOrder || savingOrder}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-gray-50 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold text-gray-700 dark:text-neutral-200 transition-colors"
          >
            {savingOrder && <span className="w-4 h-4 border-2 border-gray-500/60 border-t-transparent rounded-full animate-spin" />}
            Save order
          </button>
        </div>
      </div>

      {uploading && (
        <div className="glass rounded-2xl border border-gray-200 dark:border-neutral-800 p-4">
          <div className="flex items-center justify-between text-sm text-gray-700 dark:text-neutral-300 mb-2">
            <span>Uploading photo...</span>
            <span>{Math.round(uploadProgress)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-neutral-800 rounded-full h-2 overflow-hidden">
            <div className="h-full bg-red-600 transition-all duration-200" style={{ width: `${Math.min(100, Math.max(0, uploadProgress))}%` }} />
          </div>
        </div>
      )}

      {message && (
        <div className="rounded-xl border border-emerald-200 dark:border-emerald-700/50 bg-emerald-50 dark:bg-emerald-600/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300">
          {message}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 dark:border-red-700/50 bg-red-50 dark:bg-red-600/10 px-4 py-3 text-sm text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      {photos.length === 0 ? (
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800 p-8 text-center shadow-xl shadow-black/5 dark:shadow-black/20">
          <div className="w-16 h-16 bg-gray-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400 dark:text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-lg font-display font-bold text-gray-900 dark:text-white mb-1">No photos yet</h2>
          <p className="text-sm text-gray-500 dark:text-neutral-400">Upload your first photo to showcase your business.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {photos.map((url, i) => (
            <div key={`${url}-${i}`} className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800 overflow-hidden shadow-xl shadow-black/5 dark:shadow-black/20">
              <div className="aspect-video bg-gray-100 dark:bg-neutral-800">
                <img
                  src={getThumbnailUrl(url)}
                  alt={`Business photo ${i + 1}`}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-3">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-semibold tracking-wide uppercase text-gray-500 dark:text-neutral-400">
                    Photo {i + 1}
                  </span>
                  <button
                    onClick={() => handleDelete(i)}
                    disabled={deletingIndex === i || savingOrder || uploading}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deletingIndex === i ? (
                      <span className="w-3.5 h-3.5 border-2 border-red-500/60 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-7 0h8m-9 0a1 1 0 01-1-1V5a1 1 0 011-1h2a1 1 0 011-1h4a1 1 0 011 1h2a1 1 0 011 1v1a1 1 0 01-1 1" />
                      </svg>
                    )}
                    Delete
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => movePhoto(i, 'up')}
                    disabled={i === 0 || uploading || savingOrder}
                    className="inline-flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs font-semibold text-gray-600 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                    </svg>
                    Up
                  </button>
                  <button
                    onClick={() => movePhoto(i, 'down')}
                    disabled={i === photos.length - 1 || uploading || savingOrder}
                    className="inline-flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs font-semibold text-gray-600 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                    Down
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-500 dark:text-neutral-500">
        Allowed formats: JPG, PNG, WEBP. Maximum size: 5MB per image. Maximum {photoLimit} photos.
      </p>
    </div>
  )
}
