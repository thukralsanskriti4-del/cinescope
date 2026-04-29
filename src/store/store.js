import { configureStore } from '@reduxjs/toolkit'
import watchlistReducer from './watchlistSlice'
import themeReducer from './themeSlice'
import authReducer from './authSlice'

export const store = configureStore({
  reducer: {
    watchlist: watchlistReducer,
    theme: themeReducer,
    auth: authReducer,
  },
})
