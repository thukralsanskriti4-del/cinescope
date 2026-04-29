import { useSelector } from 'react-redux'
import { useMemo, useEffect, useState } from 'react'
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts'
import { fetchGenres } from '../utils/tmdb'

const COLORS = ['#E50914', '#FF6B6B', '#FFE66D', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD']

export default function DashboardPage() {
  const watchlist = useSelector((s) => s.watchlist.items)
  const [genres, setGenres] = useState([])

  useEffect(() => {
    fetchGenres().then((r) => setGenres(r.data.genres)).catch(console.error)
  }, [])

  const stats = useMemo(() => {
    if (!watchlist.length) return null
    const avgRating = (watchlist.reduce((a, m) => a + (m.vote_average || 0), 0) / watchlist.length).toFixed(1)
    const years = watchlist.map((m) => m.release_date?.split('-')[0]).filter(Boolean)
    const yearCount = years.reduce((acc, y) => { acc[y] = (acc[y] || 0) + 1; return acc }, {})
    const yearData = Object.entries(yearCount).sort((a, b) => a[0] - b[0]).map(([year, count]) => ({ year, count }))
    const ratingBuckets = { '0-4': 0, '4-6': 0, '6-7': 0, '7-8': 0, '8-10': 0 }
    watchlist.forEach((m) => {
      const r = m.vote_average || 0
      if (r < 4) ratingBuckets['0-4']++
      else if (r < 6) ratingBuckets['4-6']++
      else if (r < 7) ratingBuckets['6-7']++
      else if (r < 8) ratingBuckets['7-8']++
      else ratingBuckets['8-10']++
    })
    const ratingData = Object.entries(ratingBuckets).map(([range, count]) => ({ range, count }))
    return { avgRating, yearData, ratingData }
  }, [watchlist])

  if (!watchlist.length) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="text-6xl mb-4">📊</div>
        <h2 className="text-white text-2xl font-bold mb-2">No Data Yet</h2>
        <p className="text-gray-400">Add movies to your watchlist to see analytics!</p>
      </div>
    )
  }

  const topRated = [...watchlist].sort((a, b) => b.vote_average - a.vote_average).slice(0, 5)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-white text-3xl font-bold mb-8">📊 Analytics Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Total Saved', value: watchlist.length, icon: '🎬' },
          { label: 'Avg Rating', value: stats?.avgRating, icon: '⭐' },
          { label: 'Highest Rated', value: Math.max(...watchlist.map((m) => m.vote_average || 0)).toFixed(1), icon: '🏆' },
          { label: 'Years Span', value: `${Math.min(...watchlist.map((m) => m.release_date?.split('-')[0]).filter(Boolean))} - ${Math.max(...watchlist.map((m) => m.release_date?.split('-')[0]).filter(Boolean))}`, icon: '📅' },
        ].map((s) => (
          <div key={s.label} className="bg-gray-900 rounded-xl p-5 border border-gray-800">
            <div className="text-3xl mb-2">{s.icon}</div>
            <div className="text-white text-2xl font-bold">{s.value}</div>
            <div className="text-gray-400 text-sm mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        {/* Rating Distribution */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h2 className="text-white font-semibold text-lg mb-4">Rating Distribution</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats?.ratingData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="range" stroke="#9CA3AF" tick={{ fontSize: 12 }} />
              <YAxis stroke="#9CA3AF" tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip contentStyle={{ background: '#1F2937', border: '1px solid #374151', borderRadius: 8 }} />
              <Bar dataKey="count" fill="#E50914" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Movies by Year */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h2 className="text-white font-semibold text-lg mb-4">Movies by Release Year</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats?.yearData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="year" stroke="#9CA3AF" tick={{ fontSize: 11 }} />
              <YAxis stroke="#9CA3AF" tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip contentStyle={{ background: '#1F2937', border: '1px solid #374151', borderRadius: 8 }} />
              <Bar dataKey="count" fill="#4ECDC4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Rated in Watchlist */}
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
        <h2 className="text-white font-semibold text-lg mb-4">🏆 Top Rated in Your Watchlist</h2>
        <div className="space-y-3">
          {topRated.map((m, i) => (
            <div key={m.id} className="flex items-center gap-4">
              <span className="text-gray-500 text-sm w-6 text-right">{i + 1}</span>
              <div className="flex-1 bg-gray-800 rounded-lg overflow-hidden h-3">
                <div
                  className="h-full bg-gradient-to-r from-brand to-yellow-500 rounded-lg transition-all duration-700"
                  style={{ width: `${(m.vote_average / 10) * 100}%` }}
                />
              </div>
              <span className="text-white text-sm font-medium w-32 truncate">{m.title}</span>
              <span className="text-yellow-400 text-sm font-bold w-10 text-right">⭐ {m.vote_average?.toFixed(1)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
