import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 bg-page">
      <p className="text-8xl mb-6">🏨</p>
      <h1 className="text-7xl font-bold text-brand mb-3 font-['Poppins']">404</h1>
      <p className="text-text text-xl font-semibold mb-2">Page Not Found</p>
      <p className="text-muted mb-8 max-w-sm">
        This page doesn't exist. Let's get you back to the hotel.
      </p>
      <Link
        to="/"
        className="bg-brand hover:bg-brand-hover text-white font-semibold px-8 py-3 rounded-xl transition-all hover:shadow-[0_0_20px_rgba(255,71,87,0.4)]"
      >
        Back to Home
      </Link>
    </div>
  )
}