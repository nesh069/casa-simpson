export default function StarRating({ rating, onRate, size = 'md' }) {
  const sizes = { sm: 'text-sm', md: 'text-xl', lg: 'text-3xl' }
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onRate && onRate(star)}
          className={`${sizes[size]} transition-transform ${
            star <= rating ? 'text-accent' : 'text-border'
          } ${onRate ? 'cursor-pointer hover:scale-125' : 'cursor-default'}`}
        >
          ★
        </button>
      ))}
    </div>
  )
}