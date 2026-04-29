import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMovieDetail, fetchMovieCredits, fetchSimilarMovies, fetchMovieVideos, IMG_BASE, IMG_ORIGINAL } from '../utils/tmdb'
import { addToWatchlist, removeFromWatchlist } from '../store/watchlistSlice'
import MovieCard from '../components/MovieCard/MovieCard'

export default function MovieDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [movie, setMovie] = useState(null)
  const [credits, setCredits] = useState(null)
  const [similar, setSimilar] = useState([])
  const [trailer, setTrailer] = useState(null)
  const [loading, setLoading] = useState(true)

  const watchlist = useSelector((s) => s.watchlist.items)
  const isInWatchlist = watchlist.some((i) => i.id === Number(id))

  useEffect(() => {
    window.scrollTo(0, 0)
    setLoading(true)
    Promise.all([
      fetchMovieDetail(id),
      fetchMovieCredits(id),
      fetchSimilarMovies(id),
      fetchMovieVideos(id),
    ]).then(([m, c, s, v]) => {
      setMovie(m.data)
      setCredits(c.data)
      setSimilar(s.data.results?.slice(0, 6) || [])
      const yt = v.data.results?.find((v) => v.type === 'Trailer' && v.site === 'YouTube')
      setTrailer(yt)
    }).catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!movie) return <div className="text-center py-20 text-gray-400">Movie not found.</div>

  const backdrop = movie.backdrop_path ? `${IMG_ORIGINAL}${movie.backdrop_path}` : null
  const poster = movie.poster_path ? `${IMG_BASE}${movie.poster_path}` : null
  const cast = credits?.cast?.slice(0, 8) || []

  return (
    <div>
      {/* Hero */}
      <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        {backdrop && <img src={backdrop} alt={movie.title} className="w-full h-full object-cover object-top" />}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent" />
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 bg-black/50 hover:bg-black/80 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors backdrop-blur"
        >
          ← Back
        </button>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 -mt-32 relative z-10 pb-16">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          {poster && (
            <img src={poster} alt={movie.title} className="w-48 md:w-64 rounded-xl shadow-2xl shrink-0 self-start" />
          )}

          {/* Info */}
          <div className="flex-1">
            <h1 className="text-white text-4xl font-black">{movie.title}</h1>
            {movie.tagline && <p className="text-gray-400 italic mt-2">{movie.tagline}</p>}

            <div className="flex flex-wrap gap-3 mt-4">
              <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-sm font-bold">
                ⭐ {movie.vote_average?.toFixed(1)} / 10
              </span>
              <span className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm">
                📅 {movie.release_date?.split('-')[0]}
              </span>
              <span className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm">
                ⏱ {movie.runtime} min
              </span>
              {movie.genres?.map((g) => (
                <span key={g.id} className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm">{g.name}</span>
              ))}
            </div>

            <p className="text-gray-300 mt-5 leading-relaxed max-w-2xl">{movie.overview}</p>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => isInWatchlist ? dispatch(removeFromWatchlist(movie.id)) : dispatch(addToWatchlist(movie))}
                className={`px-6 py-3 rounded-xl font-bold text-sm transition-colors ${
                  isInWatchlist ? 'bg-brand hover:bg-brand-dark text-white' : 'bg-gray-800 hover:bg-gray-700 text-white'
                }`}
              >
                {isInWatchlist ? '✓ In Watchlist' : '+ Add to Watchlist'}
              </button>
              {trailer && (
                <a
                  href={`https://www.youtube.com/watch?v=${trailer.key}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-red-700 hover:bg-red-600 text-white rounded-xl font-bold text-sm transition-colors"
                >
                  ▶ Watch Trailer
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Cast */}
        {cast.length > 0 && (
          <div className="mt-12">
            <h2 className="text-white text-2xl font-bold mb-4">🎭 Cast</h2>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-4">
              {cast.map((c) => (
                <div key={c.id} className="text-center">
                  <img
                    src={c.profile_path ? `${IMG_BASE}${c.profile_path}` : 'https://via.placeholder.com/100x150?text=?'}
                    alt={c.name}
                    className="w-full aspect-square object-cover object-top rounded-full mb-2"
                  />
                  <p className="text-white text-xs font-medium truncate">{c.name}</p>
                  <p className="text-gray-500 text-xs truncate">{c.character}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Similar */}
        {similar.length > 0 && (
          <div className="mt-12">
            <h2 className="text-white text-2xl font-bold mb-4">🎬 Similar Movies</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {similar.map((m) => <MovieCard key={m.id} movie={m} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
