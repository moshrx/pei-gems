import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom'
import { useTheme } from './utils/ThemeContext'
import { clearToken, getToken } from './utils/auth'
import Home from './pages/Home'
import BusinessDetail from './pages/BusinessDetail'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Signup from './pages/Signup'

function ThemeToggle() {
  const { dark, toggle } = useTheme()
  return (
    <button
      onClick={toggle}
      className="relative w-14 h-7 rounded-full bg-gray-200 dark:bg-neutral-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900"
      aria-label="Toggle theme"
    >
      <div className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white dark:bg-neutral-900 shadow-md flex items-center justify-center transition-transform duration-300 ${dark ? 'translate-x-7' : 'translate-x-0'}`}>
        {dark ? (
          <svg className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        ) : (
          <svg className="w-3.5 h-3.5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
          </svg>
        )}
      </div>
    </button>
  )
}

function Layout({ children, isAuthenticated, onLogout }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    onLogout()
    navigate('/')
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-neutral-950 transition-colors duration-300">
      {/* Nav */}
      <nav className="glass sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center group-hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-xl font-display font-bold text-gray-900 dark:text-white">
              PEI <span className="text-red-600">Gems</span>
            </span>
          </Link>
          <div className="flex items-center gap-4 sm:gap-5">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-neutral-400 dark:hover:text-white transition-colors hidden sm:block"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm font-semibold text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="text-sm font-semibold text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-neutral-950 dark:bg-black border-t border-neutral-800 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-7 h-7 bg-red-600 rounded-lg flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
                  </svg>
                </div>
                <span className="text-lg font-display font-bold text-white">
                  PEI <span className="text-red-500">Gems</span>
                </span>
              </div>
              <p className="text-sm text-neutral-500 leading-relaxed">
                Prince Edward Island's local business directory. Discover, review, and support your community.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider mb-3">Explore</h4>
              <div className="space-y-2">
                <Link to="/" className="block text-sm text-neutral-500 hover:text-white transition-colors">Restaurants</Link>
                <Link to="/" className="block text-sm text-neutral-500 hover:text-white transition-colors">Retail</Link>
                <Link to="/" className="block text-sm text-neutral-500 hover:text-white transition-colors">Tourism</Link>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider mb-3">Company</h4>
              <div className="space-y-2">
                <a href="https://peigems.ca" className="block text-sm text-neutral-500 hover:text-white transition-colors">About</a>
                <a href="mailto:hello@peigems.ca" className="block text-sm text-neutral-500 hover:text-white transition-colors">Contact</a>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-neutral-600">
              &copy; {new Date().getFullYear()} PEI Gems. All rights reserved.
            </p>
            <p className="text-xs text-neutral-600">
              Made with care on Prince Edward Island
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function ProtectedRoute({ isAuthenticated, children }) {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

function PublicOnlyRoute({ isAuthenticated, children }) {
  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return children
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(getToken()))

  useEffect(() => {
    const onStorage = () => setIsAuthenticated(Boolean(getToken()))
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const handleAuthSuccess = () => setIsAuthenticated(true)
  const handleLogout = () => {
    clearToken()
    setIsAuthenticated(false)
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout isAuthenticated={isAuthenticated} onLogout={handleLogout}>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Layout isAuthenticated={isAuthenticated} onLogout={handleLogout}>
                <Dashboard onLogout={handleLogout} />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicOnlyRoute isAuthenticated={isAuthenticated}>
              <Layout isAuthenticated={isAuthenticated} onLogout={handleLogout}>
                <Login onAuthSuccess={handleAuthSuccess} />
              </Layout>
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicOnlyRoute isAuthenticated={isAuthenticated}>
              <Layout isAuthenticated={isAuthenticated} onLogout={handleLogout}>
                <Signup onAuthSuccess={handleAuthSuccess} />
              </Layout>
            </PublicOnlyRoute>
          }
        />
        <Route path="/business/:id" element={<BusinessDetail />} />
      </Routes>
    </BrowserRouter>
  )
}
