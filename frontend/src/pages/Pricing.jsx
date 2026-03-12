import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createCheckoutSession, fetchMyBusiness } from '../utils/api'
import { getToken } from '../utils/auth'

const TIERS = [
  {
    key: 'free',
    name: 'Free',
    price: '$0',
    period: '/month',
    description: 'Get your business listed on PEI Gems.',
    cta: 'Get Started Free',
    ctaAction: 'free',
    features: [
      'Business profile listing',
      'Receive customer reviews',
      'Basic contact info display',
      'Up to 3 photos',
    ],
    missing: ['Priority placement', 'Analytics dashboard', 'Promotional badges', 'Dedicated support'],
    highlight: false,
  },
  {
    key: 'basic',
    name: 'Basic',
    price: '$19',
    period: '/month',
    description: 'Perfect for growing local businesses.',
    cta: 'Upgrade to Basic',
    ctaAction: 'basic',
    features: [
      'Everything in Free',
      'Up to 10 photos',
      'Priority in search results',
      'Monthly analytics report',
      'Verified badge',
    ],
    missing: ['Promotional badges', 'Dedicated support'],
    highlight: false,
  },
  {
    key: 'pro',
    name: 'Pro',
    price: '$79',
    period: '/month',
    description: 'The full package for serious businesses.',
    cta: 'Upgrade to Pro',
    ctaAction: 'pro',
    features: [
      'Everything in Basic',
      'Top placement in search',
      'Promotional homepage badge',
      'Full analytics dashboard',
      'Priority email support',
      'Custom business highlights',
    ],
    missing: [],
    highlight: true,
  },
]

function CheckIcon() {
  return (
    <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg className="w-4 h-4 text-gray-300 dark:text-neutral-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

export default function Pricing() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState('')
  const [error, setError] = useState('')

  const handleUpgrade = async (plan) => {
    if (plan === 'free') {
      navigate('/signup')
      return
    }

    if (!getToken()) {
      navigate('/login')
      return
    }

    // Check that the user has a business before checkout
    try {
      await fetchMyBusiness()
    } catch {
      navigate('/dashboard/create-business')
      return
    }

    setError('')
    setLoading(plan)
    try {
      const { url } = await createCheckoutSession({ plan })
      window.location.href = url
    } catch (err) {
      setError(err.message || 'Failed to start checkout. Please try again.')
      setLoading('')
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20 page-enter">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-display font-bold text-gray-900 dark:text-white mb-4">
          Simple, transparent pricing
        </h1>
        <p className="text-lg text-gray-500 dark:text-neutral-400 max-w-xl mx-auto">
          Choose the plan that fits your business. Upgrade or cancel anytime.
        </p>
      </div>

      {error && (
        <div className="max-w-md mx-auto mb-8 rounded-xl border border-red-200 dark:border-red-700/50 bg-red-50 dark:bg-red-600/10 px-4 py-3 text-sm text-red-700 dark:text-red-300 text-center">
          {error}
        </div>
      )}

      {/* Tier cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {TIERS.map((tier) => (
          <div
            key={tier.key}
            className={`relative rounded-2xl border p-6 flex flex-col shadow-xl ${
              tier.highlight
                ? 'bg-red-600 border-red-500 shadow-red-600/20'
                : 'bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800 shadow-black/5 dark:shadow-black/20'
            }`}
          >
            {tier.highlight && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-white text-red-600 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-lg">
                  Most Popular
                </span>
              </div>
            )}

            <div className="mb-6">
              <h2 className={`text-lg font-display font-bold mb-1 ${tier.highlight ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                {tier.name}
              </h2>
              <div className="flex items-end gap-1 mb-2">
                <span className={`text-4xl font-display font-bold ${tier.highlight ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                  {tier.price}
                </span>
                <span className={`text-sm mb-1.5 ${tier.highlight ? 'text-red-200' : 'text-gray-400 dark:text-neutral-500'}`}>
                  {tier.period}
                </span>
              </div>
              <p className={`text-sm ${tier.highlight ? 'text-red-100' : 'text-gray-500 dark:text-neutral-400'}`}>
                {tier.description}
              </p>
            </div>

            <ul className="space-y-2.5 mb-8 flex-1">
              {tier.features.map((f) => (
                <li key={f} className="flex items-center gap-2.5">
                  {tier.highlight ? (
                    <svg className="w-4 h-4 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <CheckIcon />
                  )}
                  <span className={`text-sm ${tier.highlight ? 'text-white' : 'text-gray-700 dark:text-neutral-300'}`}>{f}</span>
                </li>
              ))}
              {tier.missing.map((f) => (
                <li key={f} className="flex items-center gap-2.5 opacity-50">
                  <XIcon />
                  <span className={`text-sm ${tier.highlight ? 'text-red-200' : 'text-gray-400 dark:text-neutral-500'}`}>{f}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleUpgrade(tier.ctaAction)}
              disabled={loading === tier.key}
              className={`w-full py-3 rounded-xl text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
                tier.highlight
                  ? 'bg-white text-red-600 hover:bg-red-50'
                  : tier.key === 'free'
                  ? 'bg-gray-100 dark:bg-neutral-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-neutral-700'
                  : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            >
              {loading === tier.key ? (
                <span className="inline-flex items-center gap-2 justify-center">
                  <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Loading…
                </span>
              ) : (
                tier.cta
              )}
            </button>
          </div>
        ))}
      </div>

      {/* FAQ strip */}
      <div className="text-center">
        <p className="text-sm text-gray-500 dark:text-neutral-400">
          Have questions?{' '}
          <a href="mailto:hello@peigems.ca" className="text-red-600 dark:text-red-400 font-medium hover:underline">
            hello@peigems.ca
          </a>
        </p>
        <p className="text-xs text-gray-400 dark:text-neutral-500 mt-2">
          All paid plans include a 7-day free trial. Cancel anytime — no hidden fees.
        </p>
      </div>
    </div>
  )
}
