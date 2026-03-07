import { useState } from 'react'
import { changePassword, changeEmail } from '../../utils/api'

export default function DashboardSettings() {
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [emailForm, setEmailForm] = useState({ newEmail: '', password: '' })
  const [pwLoading, setPwLoading] = useState(false)
  const [emailLoading, setEmailLoading] = useState(false)
  const [pwError, setPwError] = useState('')
  const [pwSuccess, setPwSuccess] = useState('')
  const [emailError, setEmailError] = useState('')
  const [emailSuccess, setEmailSuccess] = useState('')

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setPwError('')
    setPwSuccess('')

    if (!pwForm.currentPassword || !pwForm.newPassword) {
      setPwError('Both fields are required.')
      return
    }
    if (pwForm.newPassword.length < 8) {
      setPwError('New password must be at least 8 characters.')
      return
    }
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwError('New passwords do not match.')
      return
    }

    setPwLoading(true)
    try {
      const res = await changePassword({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword })
      setPwSuccess(res.message)
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setTimeout(() => setPwSuccess(''), 3000)
    } catch (err) {
      setPwError(err.message)
    } finally {
      setPwLoading(false)
    }
  }

  const handleEmailChange = async (e) => {
    e.preventDefault()
    setEmailError('')
    setEmailSuccess('')

    if (!emailForm.newEmail || !emailForm.password) {
      setEmailError('Both fields are required.')
      return
    }

    setEmailLoading(true)
    try {
      const res = await changeEmail({ newEmail: emailForm.newEmail, password: emailForm.password })
      setEmailSuccess(res.message)
      setEmailForm({ newEmail: '', password: '' })
      setTimeout(() => setEmailSuccess(''), 3000)
    } catch (err) {
      setEmailError(err.message)
    } finally {
      setEmailLoading(false)
    }
  }

  const inputClass = 'w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-sm text-gray-500 dark:text-neutral-400 mt-1">Manage your account settings.</p>
      </div>

      {/* Change Password */}
      <form onSubmit={handlePasswordChange} className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800 p-6 shadow-xl shadow-black/5 dark:shadow-black/20 space-y-4">
        <h2 className="font-display font-bold text-gray-900 dark:text-white">Change Password</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1.5">Current Password</label>
          <input type="password" value={pwForm.currentPassword} onChange={(e) => setPwForm((p) => ({ ...p, currentPassword: e.target.value }))} className={inputClass} placeholder="Enter current password" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1.5">New Password</label>
          <input type="password" value={pwForm.newPassword} onChange={(e) => setPwForm((p) => ({ ...p, newPassword: e.target.value }))} className={inputClass} placeholder="Minimum 8 characters" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1.5">Confirm New Password</label>
          <input type="password" value={pwForm.confirmPassword} onChange={(e) => setPwForm((p) => ({ ...p, confirmPassword: e.target.value }))} className={inputClass} placeholder="Re-enter new password" />
        </div>

        {pwError && <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl px-3 py-2">{pwError}</p>}
        {pwSuccess && <p className="text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-xl px-3 py-2">{pwSuccess}</p>}

        <button type="submit" disabled={pwLoading} className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold rounded-xl px-6 py-2.5 transition-colors text-sm">
          {pwLoading && <span className="w-4 h-4 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />}
          {pwLoading ? 'Updating...' : 'Update Password'}
        </button>
      </form>

      {/* Change Email */}
      <form onSubmit={handleEmailChange} className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800 p-6 shadow-xl shadow-black/5 dark:shadow-black/20 space-y-4">
        <h2 className="font-display font-bold text-gray-900 dark:text-white">Change Email</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1.5">New Email</label>
          <input type="email" value={emailForm.newEmail} onChange={(e) => setEmailForm((p) => ({ ...p, newEmail: e.target.value }))} className={inputClass} placeholder="newemail@example.com" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1.5">Confirm Password</label>
          <input type="password" value={emailForm.password} onChange={(e) => setEmailForm((p) => ({ ...p, password: e.target.value }))} className={inputClass} placeholder="Enter your password to confirm" />
        </div>

        {emailError && <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl px-3 py-2">{emailError}</p>}
        {emailSuccess && <p className="text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-xl px-3 py-2">{emailSuccess}</p>}

        <button type="submit" disabled={emailLoading} className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold rounded-xl px-6 py-2.5 transition-colors text-sm">
          {emailLoading && <span className="w-4 h-4 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />}
          {emailLoading ? 'Updating...' : 'Update Email'}
        </button>
      </form>
    </div>
  )
}
