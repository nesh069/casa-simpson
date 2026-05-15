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
    <div className="bg-[#0d0d1a] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-bold font-['Poppins'] text-[#f1f2f6] mb-2">
            Our Rooms
          </h1>
          <p className="text-[#a4b0be]">
            {loading ? 'Loading...' : `${rooms.length} rooms available`}
          </p>
        </div>

        {/* Filters */}
        <div className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-2xl p-6 mb-8 flex flex-wrap gap-6 items-end">
          <div>
            <p className="text-sm font-semibold text-[#f1f2f6] mb-2">Room Type</p>
            <div className="flex gap-2 flex-wrap">
              {TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => setActiveType(type)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-all ${
                    activeType === type
                      ? 'bg-[#ff4757] text-white shadow-[0_0_12px_rgba(255,71,87,0.4)]'
                      : 'bg-[#12122a] text-[#a4b0be] border border-[#2a2a3e] hover:border-[#ff4757]/40 hover:text-[#f1f2f6]'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 min-w-[200px]">
            <p className="text-sm font-semibold text-[#f1f2f6] mb-2">
              Max Price:{' '}
              <span className="text-[#ffa502]">${maxPrice}</span>/night
            </p>
            <input
              type="range"
              min={80}
              max={1000}
              step={10}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#ff4757]"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="available"
              checked={showAvailable}
              onChange={(e) => setShowAvailable(e.target.checked)}
              className="accent-[#ff4757] w-4 h-4"
            />
            <label htmlFor="available" className="text-sm font-medium text-[#a4b0be] cursor-pointer">
              Available only
            </label>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-[#1a1a2e] rounded-2xl h-80 animate-pulse border border-[#2a2a3e]" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-[#a4b0be]">
            <p className="text-6xl mb-4">🔍</p>
            <p className="text-xl font-semibold text-[#f1f2f6]">No rooms found</p>
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