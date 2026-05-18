import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import AdminLayout from './components/AdminLayout'
import Home from './pages/Home'
import Login from './pages/Login'
import Rooms from './pages/Rooms'
import RoomDetail from './pages/RoomDetail'
import Restaurant from './pages/Restaurant'
import Delivery from './pages/Delivery'
import Reviews from './pages/Reviews'
import MyBookings from './pages/MyBookings'
import BookingConfirmation from './pages/BookingConfirmation'
import NotFound from './pages/NotFound'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminRooms from './pages/admin/AdminRooms'
import AdminMenu from './pages/admin/AdminMenu'
import AdminBookings from './pages/admin/AdminBookings'
import AdminOrders from './pages/admin/AdminOrders'
import AdminReviews from './pages/admin/AdminReviews'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-page">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/rooms/:id" element={<RoomDetail />} />
          <Route
            path="/restaurant"
            element={<ProtectedRoute><Restaurant /></ProtectedRoute>}
          />
          <Route
            path="/delivery"
            element={<ProtectedRoute><Delivery /></ProtectedRoute>}
          />
          <Route path="/reviews" element={<Reviews />} />
          <Route
            path="/bookings"
            element={<ProtectedRoute><MyBookings /></ProtectedRoute>}
          />
          <Route
            path="/booking-confirmation"
            element={<ProtectedRoute><BookingConfirmation /></ProtectedRoute>}
          />
          <Route path="*" element={<NotFound />} />

          {/* Admin routes */}
          <Route
            path="/admin"
            element={<AdminRoute><AdminLayout><AdminDashboard /></AdminLayout></AdminRoute>}
          />
          <Route
            path="/admin/rooms"
            element={<AdminRoute><AdminLayout><AdminRooms /></AdminLayout></AdminRoute>}
          />
          <Route
            path="/admin/menu"
            element={<AdminRoute><AdminLayout><AdminMenu /></AdminLayout></AdminRoute>}
          />
          <Route
            path="/admin/bookings"
            element={<AdminRoute><AdminLayout><AdminBookings /></AdminLayout></AdminRoute>}
          />
          <Route
            path="/admin/orders"
            element={<AdminRoute><AdminLayout><AdminOrders /></AdminLayout></AdminRoute>}
          />
          <Route
            path="/admin/reviews"
            element={<AdminRoute><AdminLayout><AdminReviews /></AdminLayout></AdminRoute>}
          />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}