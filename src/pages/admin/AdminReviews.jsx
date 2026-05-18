import { useState } from 'react'
import { useCollection } from '../../hooks/useFirestore'
import { deleteDoc, doc } from 'firebase/firestore'
import { db } from '../../firebase'
import { initialReviews } from '../../data/reviews'
import StarRating from '../../components/StarRating'
import toast from 'react-hot-toast'
import { FiTrash2, FiSearch, FiStar } from 'react-icons/fi'

export default function AdminReviews() {
  const { data: firestoreReviews, loading } = useCollection('reviews', { ordered: false })
  const [search, setSearch] = useState('')

  const allReviews = [...firestoreReviews, ...initialReviews]

  const filtered = allReviews.filter((r) =>
    !search ||
    r.name?.toLowerCase().includes(search.toLowerCase()) ||
    r.comment?.toLowerCase().includes(search.toLowerCase()) ||
    r.room?.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = async (id) => {
    // Only allow deleting Firestore reviews, not initial hardcoded ones
    if (initialReviews.find((r) => r.id === id)) {
      toast.error('Cannot delete default reviews')
      return
    }
    if (!confirm('Delete this review?')) return
    try {
      await deleteDoc(doc(db, 'reviews', id))
      toast.success('Review deleted')
    } catch {
      toast.error('Failed to delete review')
    }
  }

  const avgRating = allReviews.length
    ? (allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length).toFixed(1)
    : '0'

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-['Poppins'] text-text mb-2">Reviews</h1>
        <p className="text-muted">{allReviews.length} total review{allReviews.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Rating summary */}
      <div className="bg-card border border-border rounded-2xl p-5 mb-6 inline-flex items-center gap-4">
        <div className="w-14 h-14 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
          <FiStar size={24} />
        </div>
        <div>
          <p className="text-2xl font-bold text-text">{avgRating}</p>
          <StarRating rating={Math.round(Number(avgRating))} size="sm" />
          <p className="text-xs text-muted">Average rating</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <FiSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input
          type="text"
          placeholder="Search reviews..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-text placeholder-muted focus:outline-none focus:border-brand"
        />
      </div>

      {/* Reviews list */}
      <div className="space-y-3">
        {filtered.map((review) => {
          const isDefault = initialReviews.find((r) => r.id === review.id)

          return (
            <div key={review.id} className="bg-card border border-border rounded-2xl p-5 hover:border-brand/30 transition-all">
              <div className="flex items-start gap-4">
                {review.avatar ? (
                  <img src={review.avatar} alt="" className="w-10 h-10 rounded-full shrink-0" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-brand/20 flex items-center justify-center shrink-0">
                    <span className="text-brand text-sm font-bold">
                      {review.name?.charAt(0) || '?'}
                    </span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-text">{review.name}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <StarRating rating={review.rating} size="sm" />
                        {review.room && (
                          <span className="text-xs text-muted">{review.room}</span>
                        )}
                      </div>
                    </div>
                    {!isDefault && (
                      <button
                        onClick={() => handleDelete(review.id)}
                        className="p-1.5 hover:bg-red-500/10 hover:text-red-400 rounded-lg text-muted transition-colors shrink-0"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-text mt-2">{review.comment}</p>
                  <p className="text-xs text-muted mt-2">{review.date}</p>
                  {isDefault && (
                    <span className="inline-block text-xs bg-surface text-muted px-2 py-0.5 rounded-full mt-2">Default review</span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">⭐</p>
          <p className="text-muted">No reviews found</p>
        </div>
      )}
    </div>
  )
}
