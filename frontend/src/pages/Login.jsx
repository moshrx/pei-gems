import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser } from '../utils/api'
import { saveToken } from '../utils/auth'

export default function Login({ onAuthSuccess }) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Email and password are required.')
      return
    }

    setLoading(true)
    try {
      const data = await loginUser({ email, password })
      saveToken(data.token)
      onAuthSuccess?.()
      navigate('/')
    } catch (err) {
      setError(err.message || 'Failed to log in.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24 page-enter">
      <div className="max-w-md mx-auto bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800 p-6 sm:p-8 shadow-xl shadow-black/5 dark:shadow-black/20">
        <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white">Welcome back</h1>
        <p className="text-sm text-gray-500 dark:text-neutral-400 mt-2">Log in to manage your PEI Gems account.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Enter your password"
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
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-sm text-gray-500 dark:text-neutral-400 mt-6 text-center">
          Don&apos;t have account?{' '}
          <Link to="/signup" className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-semibold">
            Sign up
          </Link>
        </p>
      </div>
    </section>
  )
}
