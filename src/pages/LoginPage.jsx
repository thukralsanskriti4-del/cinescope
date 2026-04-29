import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { login } from '../store/authSlice'

const MOCK_USERS = [
  { email: 'admin@cinescope.com', password: 'admin123', name: 'Admin', role: 'admin' },
  { email: 'user@cinescope.com', password: 'user123', name: 'User', role: 'user' },
]

export default function LoginPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setTimeout(() => {
      const found = MOCK_USERS.find(
        (u) => u.email === form.email && u.password === form.password
      )
      if (found) {
        dispatch(login(found))
        navigate('/')
      } else {
        setError('Invalid email or password.')
      }
      setLoading(false)
    }, 800)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-brand font-black text-4xl">🎬 CineScope</h1>
          <p className="text-gray-400 mt-2">Your personal OTT dashboard</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-gray-900 rounded-2xl p-8 border border-gray-800 shadow-2xl">
          <h2 className="text-white text-2xl font-bold mb-6">Sign In</h2>
          {error && (
            <div className="bg-red-900/40 border border-red-500 text-red-300 rounded-lg px-4 py-3 mb-4 text-sm">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-brand border border-gray-700 focus:border-brand transition-all"
                placeholder="admin@cinescope.com"
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Password</label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-brand border border-gray-700 focus:border-brand transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-brand hover:bg-brand-dark disabled:opacity-60 text-white py-3 rounded-lg font-bold text-lg transition-colors"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
          <div className="mt-4 p-3 bg-gray-800 rounded-lg text-xs text-gray-400">
            <p className="font-semibold text-gray-300 mb-1">Demo credentials:</p>
            <p>admin@cinescope.com / admin123</p>
            <p>user@cinescope.com / user123</p>
          </div>
        </form>
      </div>
    </div>
  )
}
