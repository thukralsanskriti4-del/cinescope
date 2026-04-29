import { useState, useEffect } from 'react'
import { searchMovies, fetchTrending } from '../utils/tmdb'
import { useDebounce } from '../hooks/useDebounce'
import MovieCard from '../components/MovieCard/MovieCard'
import SearchBar from '../components/SearchBar/SearchBar'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [movies, setMovies] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [sortBy, setSortBy] = useState('popularity')
  const [minRating, setMinRating] = useState(0)
  const debouncedQuery = useDebounce(query, 500)

  useEffect(() => {
    setPage(1)
  }, [debouncedQuery, sortBy, minRating])

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        let res
        if (debouncedQuery.trim()) {
          res = await searchMovies(debouncedQuery, page)
        } else {
          res = await fetchTrending(page)
        }
        let results = res.data.results || []
        if (minRating > 0) results = results.filter((m) => m.vote_average >= minRating)
        if (sortBy === 'rating') results.sort((a, b) => b.vote_average - a.vote_average)
        else if (sortBy === 'newest') results.sort((a, b) => new Date(b.release_date) - new Date(a.release_date))
        else if (sortBy === 'oldest') results.sort((a, b) => new Date(a.release_date) - new Date(b.release_date))
        setMovies(page === 1 ? results : (prev) => [...prev, ...results])
        setTotalPages(res.data.total_pages || 1)
      } catch (err) { console.error(err) }
      setLoading(false)
    }
    load()
  }, [debouncedQuery, page, sortBy, minRating])

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-white text-3xl font-bold mb-6">🔍 Search Movies</h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <SearchBar onSearch={setQuery} placeholder="Search for a movie..." />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-gray-800 text-white rounded-xl px-4 py-3 border border-gray-700 outline-none focus:ring-2 focus:ring-brand"
        >
          <option value="popularity">Sort: Popularity</option>
          <option value="rating">Sort: Rating</option>
          <option value="newest">Sort: Newest</option>
          <option value="oldest">Sort: Oldest</option>
        </select>
        <select
          value={minRating}
          onChange={(e) => setMinRating(Number(e.target.value))}
          className="bg-gray-800 text-white rounded-xl px-4 py-3 border border-gray-700 outline-none focus:ring-2 focus:ring-brand"
        >
          <option value={0}>Min Rating: Any</option>
          <option value={5}>5+</option>
          <option value={6}>6+</option>
          <option value={7}>7+</option>
          <option value={8}>8+</option>
        </select>
      </div>

      {loading && page === 1 ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin" />
        </div>
      ) : movies.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <div className="text-5xl mb-4">🎭</div>
          <p>No movies found. Try a different search!</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
          </div>
          <div className="flex justify-center gap-4 mt-8">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-6 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-40 text-white rounded-lg font-medium transition-colors"
            >
              ← Prev
            </button>
            <span className="text-gray-400 py-2 text-sm">Page {page} of {Math.min(totalPages, 500)}</span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-6 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-40 text-white rounded-lg font-medium transition-colors"
            >
              Next →
            </button>
          </div>
        </>
      )}
    </div>
  )
}
