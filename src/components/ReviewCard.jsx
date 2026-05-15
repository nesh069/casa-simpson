import StarRating from './StarRating'
import { formatDate } from '../utils/helpers'

export default function ReviewCard({ review }) {
  return (
    <div className="bg-card rounded-2xl p-6 border border-border hover:border-brand/30 transition-all duration-300">
      <div className="flex items-center gap-3 mb-3">
        <img
          src={review.avatar}
          alt={review.name}
          className="w-11 h-11 rounded-full object-cover border-2 border-border"
        />
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-text">{review.name}</span>
            {review.verified && (
              <span className="text-xs bg-success/20 text-success border border-success/30 px-2 py-0.5 rounded-full font-medium">
                ✓ Verified
              </span>
            )}
          </div>
          <span className="text-xs text-muted">{formatDate(review.date)}</span>
        </div>
      </div>
      <StarRating rating={review.rating} size="sm" />
      <p className="text-muted text-sm mt-2 leading-relaxed">{review.comment}</p>
      {review.room && (
        <p className="text-xs text-muted/60 mt-3 border-t border-border pt-2">
          Stayed in: {review.room}
        </p>
      )}
    </div>
  )
}