import { useSelector, useDispatch } from 'react-redux'
import { removeFromWatchlist } from '../store/watchlistSlice'
import { Link } from 'react-router-dom'
import { IMG_BASE } from '../utils/tmdb'

export default function WatchlistPage() {
  const dispatch = useDispatch()
  const items = useSelector((s) => s.watchlist.items)

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="text-6xl mb-4">🎬</div>
        <h2 className="text-white text-2xl font-bold mb-2">Your Watchlist is Empty</h2>
        <p className="text-gray-400 mb-6">Start adding movies you want to watch later!</p>
        <Link to="/" className="bg-brand hover:bg-brand-dark text-white px-6 py-3 rounded-lg font-medium transition-colors">
          Browse Movies
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white text-3xl font-bold">📋 My Watchlist</h1>
          <p className="text-gray-400 text-sm mt-1">{items.length} movie{items.length !== 1 ? 's' : ''} saved</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((movie) => (
          <div key={movie.id} className="flex gap-4 bg-gray-900 rounded-xl p-4 border border-gray-800 hover:border-gray-600 transition-colors">
            <Link to={`/movie/${movie.id}`}>
              <img
                src={movie.poster_path ? `${IMG_BASE}${movie.poster_path}` : 'https://via.placeholder.com/80x120?text=N/A'}
                alt={movie.title}
                className="w-20 h-28 object-cover rounded-lg shrink-0"
              />
            </Link>
            <div className="flex-1 min-w-0">
              <Link to={`/movie/${movie.id}`}>
                <h3 className="text-white font-semibold hover:text-brand transition-colors line-clamp-2">{movie.title}</h3>
              </Link>
              <p className="text-gray-500 text-sm mt-1">{movie.release_date?.split('-')[0]}</p>
              <p className="text-yellow-400 text-sm mt-1">⭐ {movie.vote_average?.toFixed(1)}</p>
              <p className="text-gray-400 text-xs mt-2 line-clamp-2">{movie.overview}</p>
              <button
                onClick={() => dispatch(removeFromWatchlist(movie.id))}
                className="mt-3 text-xs text-red-400 hover:text-red-300 font-medium transition-colors"
              >
                ✕ Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
