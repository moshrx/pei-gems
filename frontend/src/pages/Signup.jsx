import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signupUser } from '../utils/api'
import { saveToken } from '../utils/auth'

export default function Signup({ onAuthSuccess }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    businessName: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const updateForm = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.email || !form.password) {
      setError('Email and password are required.')
      return
    }

    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      const data = await signupUser({
        email: form.email,
        password: form.password,
        businessName: form.businessName,
      })
      saveToken(data.token)
      onAuthSuccess?.()
      navigate('/')
    } catch (err) {
      setError(err.message || 'Failed to create account.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24 page-enter">
      <div className="max-w-md mx-auto bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800 p-6 sm:p-8 shadow-xl shadow-black/5 dark:shadow-black/20">
        <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white">Create account</h1>
        <p className="text-sm text-gray-500 dark:text-neutral-400 mt-2">Sign up to start managing your PEI Gems listing.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => updateForm('email', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1.5">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={form.password}
              onChange={(e) => updateForm('password', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Minimum 8 characters"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1.5">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={(e) => updateForm('confirmPassword', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Re-enter password"
            />
          </div>

          <div>
            <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1.5">
              Business name (optional)
            </label>
            <input
              id="businessName"
              type="text"
              value={form.businessName}
              onChange={(e) => updateForm('businessName', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Your business"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold rounded-xl px-4 py-2.5 transition-colors"
          >
            {loading && <span className="w-4 h-4 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />}
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-sm text-gray-500 dark:text-neutral-400 mt-6 text-center">
          Already have account?{' '}
          <Link to="/login" className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-semibold">
            Login
          </Link>
        </p>
      </div>
    </section>
  )
}
