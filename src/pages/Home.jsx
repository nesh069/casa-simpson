import { Link } from 'react-router-dom'
import { useCollection } from '../hooks/useFirestore'
import { initialReviews } from '../data/reviews'
import RoomCard from '../components/RoomCard'
import ReviewCard from '../components/ReviewCard'
import StarRating from '../components/StarRating'

export default function Home() {
  const { data: rooms, loading: roomsLoading } = useCollection('rooms', { ordered: false })
  const { data: firestoreReviews } = useCollection('reviews')
  const allReviews = [...initialReviews, ...firestoreReviews]

  const avgRating = allReviews.length
    ? (allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length).toFixed(1)
    : '4.9'

  return (
    <div className="bg-page">
      {/* Hero */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1600"
          alt="Casa Simpson Hotel"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/50 to-page" />
        <div className="relative text-center text-white px-4 max-w-3xl mx-auto">
          <p className="text-brand font-semibold tracking-widest uppercase text-sm mb-4">
            Welcome to
          </p>
          <h1 className="text-5xl md:text-7xl font-bold font-['Poppins'] mb-6 leading-tight text-white">
            Casa{' '}
            <span
              className="text-brand"
              style={{ textShadow: '0 0 30px rgba(255,71,87,0.5)' }}
            >
              Simpson
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted mb-10 leading-relaxed">
            Where luxury meets home. Experience world-class hospitality,
            fine dining, and unforgettable stays.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/rooms"
              className="bg-brand hover:bg-brand-hover text-white font-bold px-8 py-4 rounded-xl transition-all text-lg hover:shadow-[0_0_25px_rgba(255,71,87,0.5)]"
            >
              Book a Room
            </Link>
            <Link
              to="/restaurant"
              className="bg-white/10 hover:bg-white/20 backdrop-blur text-white font-bold px-8 py-4 rounded-xl transition-all text-lg border border-white/20"
            >
              View Menu
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-[#0d0d1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold font-['Poppins'] text-[#f1f2f6] mb-3">
              Everything You Need
            </h2>
            <p className="text-muted max-w-xl mx-auto">
              One platform for your entire stay — rooms, dining, delivery, and more.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '🛏️', title: 'Luxury Rooms', desc: 'Browse and book from our curated collection of rooms and suites.', to: '/rooms' },
              { icon: '🍽️', title: 'Fine Dining', desc: 'Restaurant and bar with world-class menu crafted by expert chefs.', to: '/restaurant' },
              { icon: '🚚', title: 'Room Delivery', desc: 'Order food and drinks delivered directly to your room or address.', to: '/delivery' },
              { icon: '⭐', title: 'Guest Reviews', desc: 'Read verified guest experiences and share your own.', to: '/reviews' },
            ].map((f) => (
              <Link
                key={f.title}
                to={f.to}
                className="bg-card border border-border hover:border-brand/40 rounded-2xl p-6 text-center transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,71,87,0.1)] group block"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {f.icon}
                </div>
                <h3 className="font-bold text-[#f1f2f6] text-lg mb-2">{f.title}</h3>
                <p className="text-[#a4b0be] text-sm leading-relaxed">{f.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Rooms — from Firestore */}
      <section className="py-20 bg-[#12122a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold font-['Poppins'] text-[#f1f2f6] mb-2">
                Featured Rooms
              </h2>
              <p className="text-[#a4b0be]">Handpicked for an exceptional stay</p>
            </div>
            <Link
              to="/rooms"
              className="text-[#ff4757] font-semibold hover:underline hidden sm:block"
            >
              View all →
            </Link>
          </div>

          {roomsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-[#1a1a2e] rounded-2xl h-80 animate-pulse border border-[#2a2a3e]" />
              ))}
            </div>
          ) : rooms.length === 0 ? (
            <div className="text-center py-12 text-[#a4b0be]">
              <p className="text-4xl mb-3">🏨</p>
              <p>Loading rooms...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.slice(0, 3).map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          )}

          <div className="text-center mt-8 sm:hidden">
            <Link to="/rooms" className="text-[#ff4757] font-semibold hover:underline">
              View all rooms →
            </Link>
          </div>
        </div>
      </section>

      {/* Live Stats */}
      <section className="py-16 bg-[#0d0d1a] border-y border-[#2a2a3e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: `${rooms.length || 12}+`, label: 'Luxury Rooms' },
              { value: `${avgRating}★`, label: 'Average Rating' },
              { value: `${allReviews.length * 50}+`, label: 'Happy Guests' },
              { value: '24/7', label: 'Room Service' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl md:text-4xl font-bold text-[#ff4757] font-['Poppins']">
                  {stat.value}
                </p>
                <p className="text-[#a4b0be] text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-20 bg-[#0d0d1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold font-['Poppins'] text-[#f1f2f6] mb-3">
              What Our Guests Say
            </h2>
            <div className="flex items-center justify-center gap-3 mt-3">
              <StarRating rating={Math.round(Number(avgRating))} size="md" />
              <span className="text-[#ffa502] font-bold text-xl">{avgRating}</span>
              <span className="text-[#a4b0be] text-sm">
                ({allReviews.length} reviews)
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {allReviews.slice(0, 3).map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              to="/reviews"
              className="inline-flex bg-[#ff4757] hover:bg-[#ff6b81] text-white font-semibold px-8 py-3 rounded-xl transition-all hover:shadow-[0_0_20px_rgba(255,71,87,0.4)]"
            >
              Read All Reviews
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-20 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #2d1a2e 100%)' }}
      >
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 bg-[#ff4757] rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-[#ffa502] rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-3xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold font-['Poppins'] text-[#f1f2f6] mb-4">
            Ready for an Unforgettable Stay?
          </h2>
          <p className="text-[#a4b0be] mb-8 text-lg">
            Book your room today and experience the Casa Simpson difference.
          </p>
          <Link
            to="/rooms"
            className="inline-flex bg-[#ff4757] hover:bg-[#ff6b81] text-white font-bold px-10 py-4 rounded-xl transition-all text-lg hover:shadow-[0_0_30px_rgba(255,71,87,0.5)]"
          >
            Reserve Your Room
          </Link>
        </div>
      </section>
    </div>
  )
}