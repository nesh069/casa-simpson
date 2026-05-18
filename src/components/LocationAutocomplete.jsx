import { FiMapPin } from 'react-icons/fi'

export default function LocationAutocomplete({ value, onChange, placeholder }) {
  return (
    <div className="relative">
      <FiMapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand pointer-events-none" />
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || 'Enter your delivery address...'}
        className="w-full bg-surface border border-border rounded-xl pl-10 pr-4 py-3 text-sm text-text placeholder-muted focus:outline-none focus:border-brand transition-colors"
      />
    </div>
  )
}
