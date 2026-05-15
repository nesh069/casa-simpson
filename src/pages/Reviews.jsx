import { useState } from 'react'
import { useCollection } from '../hooks/useFirestore'
import { initialReviews } from '../data/reviews'
import ReviewCard from '../components/ReviewCard'
import StarRating from '../components/StarRating'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function Reviews() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { data: firestoreReviews, addDocument } = useCollection('reviews')
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [room, setRoom] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const allReviews = [...initialReviews, ...firestoreReviews]
  const avgRating = allReviews.length
    ? (allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length).toFixed(1)
    : '0'

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) { navigate('/login'); return }
    if (!comment.trim()) { toast.error('Please write a comment'); return }
    setSubmitting(true)
    try {
      await addDocument({
        name: user.displayName || user.email?.split('@')[0],
        avatar: user.photoURL || `https://i.pravatar.cc/60?u=${user.uid}`,
        rating,
        comment,
        room,
        date: new Date().toISOString().split('T')[0],
        verified: true,
        userId: user.uid,
      })
      toast.success('Review submitted! Thank you.')
      setComment('')
      setRoom('')
      setRating(5)
    } catch {
      toast.error('Failed to submit review.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-page min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-bold font-['Poppins'] text-text mb-4">
            Guest Reviews
          </h1>
          <div className="flex items-center gap-4 bg-card border border-border rounded-2xl p-5 w-fit">
            <span className="text-5xl font-bold text-accent font-['Poppins']">
              {avgRating}
            </span>
            <div>
              <StarRating rating={Math.round(Number(avgRating))} size="md" />
              <p className="text-muted text-sm mt-1">
                Based on {allReviews.length} review{allReviews.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {allReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </div>

          <div>
            <div className="bg-card border border-border rounded-2xl p-6 sticky top-24">
              <h2 className="text-xl font-bold text-text mb-5">
                {user ? 'Leave a Review' : 'Sign In to Review'}
              </h2>

              {!user ? (
                <div className="text-center py-8">
                  <p className="text-5xl mb-4">✍️</p>
                  <p className="text-muted text-sm mb-5">
                    Sign in to share your experience with future guests.
                  </p>
                  <button
                    onClick={() => navigate('/login')}
                    className="bg-brand hover:bg-brand-hover text-white font-semibold px-6 py-2.5 rounded-xl transition-all hover:shadow-[0_0_15px_rgba(255,71,87,0.4)]"
                  >
                    Sign In
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-muted mb-2">
                      Your Rating
                    </label>
                    <StarRating rating={rating} onRate={setRating} size="lg" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted mb-1">
                      Room (optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Deluxe Double"
                      value={room}
                      onChange={(e) => setRoom(e.target.value)}
                      className="w-full bg-surface border border-border rounded-xl px-3 py-2.5 text-sm text-text placeholder-muted focus:outline-none focus:border-brand transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted mb-1">
                      Your Review
                    </label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={4}
                      placeholder="Tell us about your experience..."
                      required
                      className="w-full bg-surface border border-border rounded-xl px-3 py-2.5 text-sm text-text placeholder-muted focus:outline-none focus:border-brand resize-none transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-brand hover:bg-brand-hover disabled:bg-border disabled:text-muted text-white font-bold py-3 rounded-xl transition-all hover:shadow-[0_0_20px_rgba(255,71,87,0.4)]"
                  >
                    {submitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}