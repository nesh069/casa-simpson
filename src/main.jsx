import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { BookingProvider } from './context/BookingContext'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <AuthProvider>
        <CartProvider>
          <BookingProvider>
            <App />
            <Toaster />
          </BookingProvider>
        </CartProvider>
      </AuthProvider>
    </HashRouter>
  </StrictMode>
)