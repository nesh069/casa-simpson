import StarRating from './StarRating'
import { formatDate } from '../utils/helpers'

export default function ReviewCard({ review }) {
  return (
    <div className="bg-[#1a1a2e] rounded-2xl p-6 border border-[#2a2a3e] hover:border-[#ff4757]/30 transition-all duration-300">
      <div className="flex items-center gap-3 mb-3">
        <img
          src={review.avatar}
          alt={review.name}
          className="w-11 h-11 rounded-full object-cover border-2 border-[#2a2a3e]"
        />
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-[#f1f2f6]">{review.name}</span>
            {review.verified && (
              <span className="text-xs bg-[#2ed573]/20 text-[#2ed573] border border-[#2ed573]/30 px-2 py-0.5 rounded-full font-medium">
                ✓ Verified
              </span>
            )}
          </div>
          <span className="text-xs text-[#a4b0be]">{formatDate(review.date)}</span>
        </div>
      </div>
      <StarRating rating={review.rating} size="sm" />
      <p className="text-[#a4b0be] text-sm mt-2 leading-relaxed">{review.comment}</p>
      {review.room && (
        <p className="text-xs text-[#a4b0be]/60 mt-3 border-t border-[#2a2a3e] pt-2">
          Stayed in: {review.room}
        </p>
      )}
    </div>
  )
}