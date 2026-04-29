import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { addToWatchlist, removeFromWatchlist } from '../../store/watchlistSlice'
import { IMG_BASE } from '../../utils/tmdb'
import { memo } from 'react'

const MovieCard = memo(function MovieCard({ movie }) {
  const dispatch = useDispatch()
  const watchlist = useSelector((s) => s.watchlist.items)
  const isInWatchlist = watchlist.some((i) => i.id === movie.id)

  const toggle = (e) => {
    e.preventDefault()
    if (isInWatchlist) dispatch(removeFromWatchlist(movie.id))
    else dispatch(addToWatchlist(movie))
  }

  const poster = movie.poster_path
    ? `${IMG_BASE}${movie.poster_path}`
    : 'https://via.placeholder.com/300x450?text=No+Image'

  return (
    <Link to={`/movie/${movie.id}`} className="group relative block rounded-xl overflow-hidden bg-gray-900 hover:scale-105 transition-transform duration-300 shadow-lg">
      <img
        src={poster}
        alt={movie.title}
        className="w-full aspect-[2/3] object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
        <p className="text-white font-semibold text-sm line-clamp-2">{movie.title}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-yellow-400 text-xs">⭐ {movie.vote_average?.toFixed(1)}</span>
          <button
            onClick={toggle}
            className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
              isInWatchlist
                ? 'bg-brand text-white'
                : 'bg-white/20 text-white hover:bg-brand'
            }`}
          >
            {isInWatchlist ? '✓ Saved' : '+ Watchlist'}
          </button>
        </div>
      </div>
      <div className="p-2">
        <p className="text-gray-300 text-xs font-medium truncate">{movie.title}</p>
        <p className="text-gray-500 text-xs">{movie.release_date?.split('-')[0]}</p>
      </div>
    </Link>
  )
})

export default MovieCard
