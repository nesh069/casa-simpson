export const USD_TO_KES = 129.50

export const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)

export const formatKES = (amount) =>
  `KES ${Math.round(amount * USD_TO_KES).toLocaleString('en-KE')}`

export const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

export const generateBookingRef = () =>
  'CS-' + Math.random().toString(36).substring(2, 8).toUpperCase()

export const getRatingLabel = (rating) => {
  const labels = {
    5: 'Exceptional',
    4: 'Very Good',
    3: 'Good',
    2: 'Fair',
    1: 'Poor',
  }
  return labels[rating] || ''
}

export const getNights = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0
  return Math.max(
    0,
    Math.ceil(
      (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)
    )
  )
}
