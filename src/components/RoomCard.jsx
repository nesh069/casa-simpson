import { useNavigate } from 'react-router-dom'
import { formatCurrency } from '../utils/helpers'

export default function RoomCard({ room }) {
  const navigate = useNavigate()

  const typeColor = {
    single: 'bg-brand/20 text-brand',
    double: 'bg-accent/20 text-accent',
    suite: 'bg-gold/20 text-gold',
  }

  return (
    <div className="bg-card rounded-2xl overflow-hidden border border-border hover:border-brand/40 hover:shadow-[0_0_20px_rgba(255,71,87,0.15)] transition-all duration-300 flex flex-col group">
      <div className="relative overflow-hidden">
        <img
          src={room.image}
          alt={room.name}
          className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {!room.available && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <span className="text-white font-semibold text-lg tracking-wide">
              Not Available
            </span>
          </div>
        )}
        <span className={`absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide ${typeColor[room.type]}`}>
          {room.type}
        </span>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-text mb-1">{room.name}</h3>
        <p className="text-muted text-sm mb-3 flex-1 leading-relaxed">
          {room.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {room.amenities.slice(0, 4).map((a) => (
            <span
              key={a}
              className="text-xs bg-surface text-muted border border-border px-2 py-1 rounded-full"
            >
              {a}
            </span>
          ))}
          {room.amenities.length > 4 && (
            <span className="text-xs bg-surface text-muted border border-border px-2 py-1 rounded-full">
              +{room.amenities.length - 4} more
            </span>
          )}
        </div>

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
          <div>
            <span className="text-2xl font-bold text-text">
              {formatCurrency(room.price)}
            </span>
            <span className="text-muted text-sm"> / night</span>
          </div>
          <button
            onClick={() => navigate(`/rooms/${room.id}`)}
            disabled={!room.available}
            className="bg-brand hover:bg-brand-hover disabled:bg-border disabled:text-muted disabled:cursor-not-allowed text-white font-semibold px-4 py-2 rounded-xl transition-all duration-200 hover:shadow-[0_0_15px_rgba(255,71,87,0.4)]"
          >
            {room.available ? 'View Room' : 'Unavailable'}
          </button>
        </div>
      </div>
    </div>
  )
}