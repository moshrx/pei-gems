import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { cancelSubscription, createCheckoutSession, fetchSubscription } from '../../utils/api'

const PLAN_LABELS = {
  free: 'Free',
  basic: 'Basic',
  pro: 'Pro',
}

const PLAN_COLORS = {
  free: 'bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-neutral-300',
  basic: 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300',
  pro: 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400',
}

function formatDate(dateStr) {
  if (!dateStr) return null
  return new Date(dateStr).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function DashboardBilling() {
  const [sub, setSub] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [cancelling, setCancelling] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [upgrading, setUpgrading] = useState('')

  useEffect(() => {
    fetchSubscription()
      .then(setSub)
      .catch((err) => setError(err.message || 'Failed to load subscription.'))
      .finally(() => setLoading(false))
  }, [])

  const handleCancel = async () => {
    setError('')
    setMessage('')
    setCancelling(true)
    try {
      await cancelSubscription()
      setSub((prev) => ({ ...prev, plan: 'free', currentPeriodEnd: null }))
      setMessage('Subscription cancelled. Your plan has been reverted to Free.')
    } catch (err) {
      setError(err.message || 'Failed to cancel subscription.')
    } finally {
      setCancelling(false)
      setShowConfirm(false)
    }
  }

  const handleUpgrade = async (plan) => {
    setError('')
    setUpgrading(plan)
    try {
      const { url } = await createCheckoutSession({ plan })
      window.location.href = url
    } catch (err) {
      setError(err.message || 'Failed to start checkout.')
      setUpgrading('')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const plan = sub?.plan || 'free'
  const isPaid = plan === 'basic' || plan === 'pro'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Billing</h1>
        <p className="text-sm text-gray-500 dark:text-neutral-400 mt-1">Manage your subscription plan</p>
      </div>

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

      {/* Current plan card */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800 p-6 shadow-xl shadow-black/5 dark:shadow-black/20">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-neutral-400 mb-1">Current plan</p>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white">
                {PLAN_LABELS[plan]} Plan
              </h2>
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${PLAN_COLORS[plan]}`}>
                {PLAN_LABELS[plan]}
              </span>
            </div>
          </div>
          {isPaid && sub?.currentPeriodEnd && (
            <div className="text-right">
              <p className="text-xs text-gray-400 dark:text-neutral-500">Renews</p>
              <p className="text-sm font-semibold text-gray-700 dark:text-neutral-200">
                {formatDate(sub.currentPeriodEnd)}
              </p>
            </div>
          )}
        </div>

        {plan === 'free' && (
          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <button
              onClick={() => handleUpgrade('basic')}
              disabled={!!upgrading}
              className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-gray-50 dark:hover:bg-neutral-800 disabled:opacity-60 text-sm font-semibold text-gray-700 dark:text-neutral-200 transition-colors"
            >
              {upgrading === 'basic' ? <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" /> : null}
              Upgrade to Basic — $19/mo
            </button>
            <button
              onClick={() => handleUpgrade('pro')}
              disabled={!!upgrading}
              className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white text-sm font-semibold transition-colors"
            >
              {upgrading === 'pro' ? <span className="w-4 h-4 border-2 border-white/60 border-t-transparent rounded-full animate-spin" /> : null}
              Upgrade to Pro — $79/mo
            </button>
          </div>
        )}

        {plan === 'basic' && (
          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <button
              onClick={() => handleUpgrade('pro')}
              disabled={!!upgrading}
              className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white text-sm font-semibold transition-colors"
            >
              {upgrading === 'pro' ? <span className="w-4 h-4 border-2 border-white/60 border-t-transparent rounded-full animate-spin" /> : null}
              Upgrade to Pro — $79/mo
            </button>
          </div>
        )}
      </div>

      {/* Plan features */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800 p-6 shadow-xl shadow-black/5 dark:shadow-black/20">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Your plan includes</h3>
        <ul className="space-y-2">
          {plan === 'free' && ['Business profile listing', 'Receive customer reviews', 'Up to 3 photos'].map((f) => (
            <li key={f} className="flex items-center gap-2 text-sm text-gray-600 dark:text-neutral-400">
              <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {f}
            </li>
          ))}
          {plan === 'basic' && ['Everything in Free', 'Up to 10 photos', 'Priority in search results', 'Monthly analytics', 'Verified badge'].map((f) => (
            <li key={f} className="flex items-center gap-2 text-sm text-gray-600 dark:text-neutral-400">
              <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {f}
            </li>
          ))}
          {plan === 'pro' && ['Everything in Basic', 'Top placement in search', 'Promotional homepage badge', 'Full analytics', 'Priority support'].map((f) => (
            <li key={f} className="flex items-center gap-2 text-sm text-gray-600 dark:text-neutral-400">
              <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {f}
            </li>
          ))}
        </ul>
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-neutral-800">
          <Link to="/pricing" className="text-sm text-red-600 dark:text-red-400 font-medium hover:underline">
            Compare all plans →
          </Link>
        </div>
      </div>

      {/* Cancel subscription */}
      {isPaid && (
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800 p-6 shadow-xl shadow-black/5 dark:shadow-black/20">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Cancel subscription</h3>
          <p className="text-sm text-gray-500 dark:text-neutral-400 mb-4">
            Cancelling will revert your account to the Free plan at the end of your billing period.
          </p>
          {!showConfirm ? (
            <button
              onClick={() => setShowConfirm(true)}
              className="text-sm text-red-600 dark:text-red-400 font-medium hover:underline"
            >
              Cancel subscription
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white text-sm font-semibold transition-colors"
              >
                {cancelling && <span className="w-3.5 h-3.5 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />}
                Confirm cancellation
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="text-sm text-gray-500 dark:text-neutral-400 hover:text-gray-700 dark:hover:text-white"
              >
                Keep plan
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
