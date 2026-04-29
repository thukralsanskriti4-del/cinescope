import { useState } from 'react'

export default function SearchBar({ onSearch, placeholder = 'Search movies...' }) {
  const [value, setValue] = useState('')

  const handleChange = (e) => {
    setValue(e.target.value)
    onSearch(e.target.value)
  }

  const handleClear = () => {
    setValue('')
    onSearch('')
  }

  return (
    <div className="relative w-full max-w-xl">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full bg-gray-800 text-white placeholder-gray-400 rounded-xl pl-12 pr-10 py-3 outline-none focus:ring-2 focus:ring-brand border border-gray-700 focus:border-brand transition-all"
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
        >
          ✕
        </button>
      )}
    </div>
  )
}
