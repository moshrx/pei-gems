import { Link } from 'react-router-dom'

export default function CheckoutSuccess() {
  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-20 text-center page-enter">
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800 p-10 shadow-xl shadow-black/5 dark:shadow-black/20">
        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-2">
          Payment successful!
        </h1>
        <p className="text-gray-500 dark:text-neutral-400 mb-8">
          Your subscription is now active. Your business listing has been upgraded and you now have access to all your plan's features.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/dashboard/billing"
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors"
          >
            View subscription
          </Link>
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-gray-50 dark:hover:bg-neutral-800 text-sm font-semibold text-gray-700 dark:text-neutral-200 transition-colors"
          >
            Go to dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
