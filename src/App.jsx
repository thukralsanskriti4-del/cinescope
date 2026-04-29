import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Navbar from './components/Navbar/Navbar'
import HomePage from './pages/HomePage'
import SearchPage from './pages/SearchPage'
import WatchlistPage from './pages/WatchlistPage'
import DashboardPage from './pages/DashboardPage'
import MovieDetailPage from './pages/MovieDetailPage'
import LoginPage from './pages/LoginPage'
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary'

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useSelector((s) => s.auth)
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

export default function App() {
  const dark = useSelector((s) => s.theme.dark)

  return (
    <div className={dark ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-950 dark:bg-gray-950 text-white transition-colors duration-300">
        <BrowserRouter>
          <ErrorBoundary>
            <Navbar />
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
              <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
              <Route path="/watchlist" element={<ProtectedRoute><WatchlistPage /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
              <Route path="/movie/:id" element={<ProtectedRoute><MovieDetailPage /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ErrorBoundary>
        </BrowserRouter>
      </div>
    </div>
  )
}
