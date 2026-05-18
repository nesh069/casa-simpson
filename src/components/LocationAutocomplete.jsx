import { useState, useEffect } from 'react'
import usePlacesAutocomplete from 'use-places-autocomplete'
import { FiMapPin } from 'react-icons/fi'

export default function LocationAutocomplete({ value, onChange, onSelect, placeholder }) {
  const [mapsReady, setMapsReady] = useState(
    () => typeof window.google?.maps?.places !== 'undefined'
  )
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    if (mapsReady) return

    const onLoad = () => setMapsReady(true)
    window.addEventListener('google-maps-loaded', onLoad)

    const check = setInterval(() => {
      if (typeof window.google?.maps?.places !== 'undefined') {
        setMapsReady(true)
        clearInterval(check)
      }
    }, 500)

    setTimeout(() => {
      if (!mapsReady) setLoadError(true)
      clearInterval(check)
    }, 15000)

    return () => {
      window.removeEventListener('google-maps-loaded', onLoad)
      clearInterval(check)
    }
  }, [mapsReady])

  if (loadError) {
    return (
      <div className="text-sm text-red-400">
        Failed to load location search. Please type your address manually.
      </div>
    )
  }

  if (!mapsReady) {
    return (
      <div className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-muted animate-pulse">
        Loading location search...
      </div>
    )
  }

  return (
    <AutocompleteInput
      value={value}
      onChange={onChange}
      onSelect={onSelect}
      placeholder={placeholder}
    />
  )
}

function AutocompleteInput({ value, onChange, onSelect, placeholder }) {
  const {
    ready,
    value: inputValue,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    defaultValue: value || '',
    debounce: 300,
  })

  const handleInput = (e) => {
    setValue(e.target.value)
    if (onChange) onChange(e.target.value)
  }

  const handleSelect = ({ description }) => {
    setValue(description, false)
    clearSuggestions()
    if (onSelect) onSelect(description)
  }

  return (
    <div className="relative">
      <div className="relative">
        <FiMapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand" />
        <input
          type="text"
          value={inputValue}
          onChange={handleInput}
          disabled={!ready}
          placeholder={placeholder || 'Search for your address...'}
          className="w-full bg-surface border border-border rounded-xl pl-10 pr-4 py-3 text-sm text-text placeholder-muted focus:outline-none focus:border-brand transition-colors"
        />
      </div>

      {status === 'OK' && (
        <ul className="absolute z-50 w-full mt-1 bg-card border border-border rounded-xl shadow-xl overflow-hidden">
          {data.map(({ place_id, description }) => (
            <li
              key={place_id}
              onClick={() => handleSelect({ description })}
              className="px-4 py-2.5 text-sm text-text hover:bg-surface cursor-pointer transition-colors border-b border-border last:border-0 flex items-center gap-2"
            >
              <FiMapPin size={14} className="text-muted shrink-0" />
              {description}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
