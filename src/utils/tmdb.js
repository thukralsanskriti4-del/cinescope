import axios from 'axios'

const API_KEY = 'c9e06fe42ef38501e3d70624cd641649' // Replace with your TMDB API key from themoviedb.org
const BASE_URL = 'https://api.themoviedb.org/3'
export const IMG_BASE = 'https://image.tmdb.org/t/p/w500'
export const IMG_ORIGINAL = 'https://image.tmdb.org/t/p/original'

const tmdb = axios.create({
  baseURL: BASE_URL,
  params: { api_key: API_KEY, language: 'en-US' },
})

export const fetchTrending = (page = 1) =>
  tmdb.get('/trending/movie/week', { params: { page } })

export const fetchMoviesByGenre = (genreId, page = 1) =>
  tmdb.get('/discover/movie', { params: { with_genres: genreId, sort_by: 'popularity.desc', page } })

export const fetchGenres = () => tmdb.get('/genre/movie/list')

export const searchMovies = (query, page = 1) =>
  tmdb.get('/search/movie', { params: { query, page } })

export const fetchMovieDetail = (id) => tmdb.get(`/movie/${id}`)

export const fetchMovieCredits = (id) => tmdb.get(`/movie/${id}/credits`)

export const fetchSimilarMovies = (id) => tmdb.get(`/movie/${id}/similar`)

export const fetchMovieVideos = (id) => tmdb.get(`/movie/${id}/videos`)

export const fetchTopRated = (page = 1) =>
  tmdb.get('/movie/top_rated', { params: { page } })

export const fetchNowPlaying = (page = 1) =>
  tmdb.get('/movie/now_playing', { params: { page } })
