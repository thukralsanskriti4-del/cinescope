import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toggleTheme } from '../../store/themeSlice'
import { logout } from '../../store/authSlice'

export default function Navbar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const dark = useSelector((s) => s.theme.dark)
  const { isAuthenticated, user } = useSelector((s) => s.auth)
  const watchlistCount = useSelector((s) => s.watchlist.items.length)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <nav className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur border-b border-gray-800 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-brand font-black text-2xl tracking-tight">🎬 CineScope</span>
        </Link>

        {isAuthenticated && (
          <div className="flex items-center gap-6">
            <Link to="/" className="text-gray-300 hover:text-white text-sm font-medium transition-colors">Home</Link>
            <Link to="/search" className="text-gray-300 hover:text-white text-sm font-medium transition-colors">Search</Link>
            <Link to="/dashboard" className="text-gray-300 hover:text-white text-sm font-medium transition-colors">Dashboard</Link>
            <Link to="/watchlist" className="relative text-gray-300 hover:text-white text-sm font-medium transition-colors">
              Watchlist
              {watchlistCount > 0 && (
                <span className="absolute -top-2 -right-4 bg-brand text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {watchlistCount}
                </span>
              )}
            </Link>
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            onClick={() => dispatch(toggleTheme())}
            className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-lg"
            title="Toggle theme"
          >
            {dark ? '☀️' : '🌙'}
          </button>
          {isAuthenticated && (
            <div className="flex items-center gap-3">
              <span className="text-gray-400 text-sm">Hi, {user?.name}</span>
              <button
                onClick={handleLogout}
                className="bg-brand hover:bg-brand-dark text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
