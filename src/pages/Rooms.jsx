import { useState, useMemo } from 'react'
import { useCollection } from '../hooks/useFirestore'
import RoomCard from '../components/RoomCard'

const TYPES = ['all', 'single', 'double', 'suite']

export default function Rooms() {
  const { data: rooms, loading } = useCollection('rooms', { ordered: false })
  const [activeType, setActiveType] = useState('all')
  const [maxPrice, setMaxPrice] = useState(1000)
  const [showAvailable, setShowAvailable] = useState(false)

  const filtered = useMemo(() =>
    rooms.filter((r) => {
      if (activeType !== 'all' && r.type !== activeType) return false
      if (r.price > maxPrice) return false
      if (showAvailable && !r.available) return false
      return true
    }),
    [rooms, activeType, maxPrice, showAvailable]
  )

  return (
    <div className="bg-page min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-bold font-['Poppins'] text-text mb-2">
            Our Rooms
          </h1>
          <p className="text-muted">
            {loading ? 'Loading...' : `${rooms.length} rooms available`}
          </p>
        </div>

        {/* Filters */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-8 flex flex-wrap gap-6 items-end">
          <div>
            <p className="text-sm font-semibold text-text mb-2">Room Type</p>
            <div className="flex gap-2 flex-wrap">
              {TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => setActiveType(type)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-all ${
                    activeType === type
                      ? 'bg-brand text-white shadow-[0_0_12px_rgba(255,71,87,0.4)]'
                      : 'bg-surface text-muted border border-border hover:border-brand/40 hover:text-text'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 min-w-50">
            <p className="text-sm font-semibold text-[#f1f2f6] mb-2">
              Max Price:{' '}
              <span className="text-accent">${maxPrice}</span>/night
            </p>
            <input
              type="range"
              min={25}
              max={1000}
              step={10}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-brand"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="available"
              checked={showAvailable}
              onChange={(e) => setShowAvailable(e.target.checked)}
              className="accent-brand w-4 h-4"
            />
            <label htmlFor="available" className="text-sm font-medium text-muted cursor-pointer">
              Available only
            </label>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-card rounded-2xl h-80 animate-pulse border border-border" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-muted">
            <p className="text-6xl mb-4">🔍</p>
            <p className="text-xl font-semibold text-text">No rooms found</p>
            <p className="text-sm mt-2">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}