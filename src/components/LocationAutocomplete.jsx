import { useState, useEffect, useRef, useCallback } from 'react'
import { FiMapPin } from 'react-icons/fi'

const API_KEY = 'AIzaSyDZbzjGlkuB_yv8vohkhHmC3yWhsiQqM1I'

export default function LocationAutocomplete({ value, onChange, onSelect, placeholder }) {
  const [suggestions, setSuggestions] = useState([])
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState(value || '')
  const debounceRef = useRef(null)
  const abortRef = useRef(null)

  const fetchSuggestions = useCallback(async (query) => {
    if (abortRef.current) abortRef.current.abort()
    if (!query.trim()) { setSuggestions([]); return }

    const controller = new AbortController()
    abortRef.current = controller

    try {
      const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': API_KEY,
          'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.id',
        },
        body: JSON.stringify({ textQuery: query, maxResultCount: 5 }),
        signal: controller.signal,
      })

      if (!res.ok) return
      const data = await res.json()
      setSuggestions(data.places || [])
    } catch {
      // aborted or network error
    }
  }, [])

  const handleInput = (e) => {
    const val = e.target.value
    setInput(val)
    if (onChange) onChange(val)

    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 300)
  }

  const handleSelect = (place) => {
    const addr = place.formattedAddress || place.displayName?.text || ''
    setInput(addr)
    setOpen(false)
    if (onSelect) onSelect(addr)
  }

  const handleFocus = () => {
    if (suggestions.length > 0) setOpen(true)
  }

  useEffect(() => {
    return () => {
      clearTimeout(debounceRef.current)
      if (abortRef.current) abortRef.current.abort()
    }
  }, [])

  return (
    <div className="relative">
      <div className="relative">
        <FiMapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand" />
        <input
          type="text"
          value={input}
          onChange={handleInput}
          onFocus={handleFocus}
          placeholder={placeholder || 'Search for your address...'}
          className="w-full bg-surface border border-border rounded-xl pl-10 pr-4 py-3 text-sm text-text placeholder-muted focus:outline-none focus:border-brand transition-colors"
        />
      </div>

      {open && suggestions.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 bg-card border border-border rounded-xl shadow-xl overflow-hidden">
          {suggestions.map((place) => (
            <li
              key={place.id}
              onClick={() => handleSelect(place)}
              className="px-4 py-2.5 text-sm text-text hover:bg-surface cursor-pointer transition-colors border-b border-border last:border-0 flex items-center gap-2"
            >
              <FiMapPin size={14} className="text-muted shrink-0" />
              <span>{place.displayName?.text}</span>
              {place.formattedAddress && (
                <span className="text-muted text-xs ml-1">— {place.formattedAddress}</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
