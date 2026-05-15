import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Rooms from './pages/Rooms'
import RoomDetail from './pages/RoomDetail'
import Restaurant from './pages/Restaurant'
import Delivery from './pages/Delivery'
import Reviews from './pages/Reviews'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0d0d1a]">
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}