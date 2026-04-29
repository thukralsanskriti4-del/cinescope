import { useState, useEffect, useCallback } from 'react'
import { fetchTrending, fetchGenres, fetchMoviesByGenre } from '../utils/tmdb'
import MovieCard from '../components/MovieCard/MovieCard'
import { useInfiniteScroll } from '../hooks/useInfiniteScroll'

export default function HomePage() {
  const [movies, setMovies] = useState([])
  const [genres, setGenres] = useState([])
  const [selectedGenre, setSelectedGenre] = useState(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [sortBy, setSortBy] = useState('popularity')

  useEffect(() => {
    fetchGenres().then((r) => setGenres(r.data.genres)).catch(console.error)
  }, [])

  useEffect(() => {
    setMovies([])
    setPage(1)
    setHasMore(true)
  }, [selectedGenre, sortBy])

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        let res
        if (selectedGenre) {
          res = await fetchMoviesByGenre(selectedGenre, page)
        } else {
          res = await fetchTrending(page)
        }
        const results = res.data.results || []
        setMovies((prev) => page === 1 ? results : [...prev, ...results])
        setHasMore(page < (res.data.total_pages || 1) && page < 10)
      } catch (err) {
        console.error(err)
      }
      setLoading(false)
    }
    load()
  }, [selectedGenre, page])

  const loadMore = useCallback(() => {
    if (!loading && hasMore) setPage((p) => p + 1)
  }, [loading, hasMore])

  const loaderRef = useInfiniteScroll(loadMore, hasMore)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-white text-3xl font-bold mb-1">
          {selectedGenre ? genres.find((g) => g.id === selectedGenre)?.name : '🔥 Trending'} Movies
        </h1>
        <p className="text-gray-400 text-sm">Discover what's popular right now</p>
      </div>

      {/* Genre Filter */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide">
        <button
          onClick={() => setSelectedGenre(null)}
          className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            !selectedGenre ? 'bg-brand text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          All
        </button>
        {genres.map((g) => (
          <button
            key={g.id}
            onClick={() => setSelectedGenre(g.id)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedGenre === g.id ? 'bg-brand text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {g.name}
          </button>
        ))}
      </div>

      {/* Movie Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      {loading && (
        <div className="flex justify-center py-10">
          <div className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      <div ref={loaderRef} className="h-4" />

      {!hasMore && movies.length > 0 && (
        <p className="text-center text-gray-500 py-6 text-sm">You've seen it all! 🎉</p>
      )}
    </div>
  )
}
