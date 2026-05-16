import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { readFileSync } from 'fs'

// Initialize with service account (download from Firebase Console → Project Settings → Service Accounts)
const serviceAccount = JSON.parse(readFileSync('./serviceAccountKey.json', 'utf8'))

initializeApp({
  credential: cert(serviceAccount),
})

const db = getFirestore()

const rooms = [
  {
    id: 'executive-suite',
    name: 'Executive Suite',
    type: 'Suite',
    price: 350,
    capacity: 2,
    description: 'Luxurious suite with panoramic city views, king-size bed, and private jacuzzi.',
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
    amenities: ['WiFi', 'Jacuzzi', 'Mini Bar', 'Room Service', 'Smart TV'],
    available: true,
  },
  {
    id: 'deluxe-double',
    name: 'Deluxe Double',
    type: 'Double',
    price: 220,
    capacity: 2,
    description: 'Spacious double room with modern furnishings and garden views.',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
    amenities: ['WiFi', 'Garden View', 'Mini Bar', 'Room Service'],
    available: true,
  },
  {
    id: 'garden-villa',
    name: 'Garden Villa',
    type: 'Suite',
    price: 500,
    capacity: 4,
    description: 'Private villa with own pool, garden, and butler service.',
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800',
    amenities: ['Private Pool', 'Garden', 'Butler', 'WiFi', 'Kitchen', 'Smart TV'],
    available: true,
  },
  {
    id: 'single-room',
    name: 'Single Room',
    type: 'Single',
    price: 120,
    capacity: 1,
    description: 'Cozy single room perfect for business travelers.',
    image: 'https://images.unsplash.com/photo-1590490360182-c33d770e6c4d?w=800',
    amenities: ['WiFi', 'Work Desk', 'Smart TV'],
    available: true,
  },
]

const menuItems = [
  {
    id: 'bruschetta',
    name: 'Bruschetta',
    description: 'Grilled bread with tomatoes, garlic, and fresh basil.',
    price: 8.00,
    image: 'https://images.unsplash.com/photo-1572695157369-31f5b0c044e5?w=400',
    category: 'Starters',
  },
  {
    id: 'soup-of-the-day',
    name: 'Soup of the Day',
    description: "Chef's daily soup served with artisan bread.",
    price: 7.00,
    image: 'https://images.unsplash.com/photo-1547592166-23acbe3a624b?w=400',
    category: 'Starters',
  },
  {
    id: 'calamari',
    name: 'Calamari',
    description: 'Crispy fried calamari with lemon aioli.',
    price: 12.00,
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400',
    category: 'Starters',
  },
  {
    id: 'caesar-salad',
    name: 'Caesar Salad',
    description: 'Crisp romaine, parmesan, croutons, and house Caesar.',
    price: 10.00,
    image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400',
    category: 'Starters',
  },
  {
    id: 'grilled-salmon',
    name: 'Grilled Salmon',
    description: 'Atlantic salmon with herb butter and seasonal vegetables.',
    price: 28.00,
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400',
    category: 'Mains',
  },
  {
    id: 'ribeye-steak',
    name: 'Ribeye Steak',
    description: '12oz ribeye with roasted garlic mashed potatoes.',
    price: 35.00,
    image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400',
    category: 'Mains',
  },
  {
    id: 'tiramisu',
    name: 'Tiramisu',
    description: 'Classic Italian dessert with espresso-soaked ladyfingers.',
    price: 9.00,
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400',
    category: 'Desserts',
  },
  {
    id: 'cocktail-mojito',
    name: 'Classic Mojito',
    description: 'Fresh mint, lime, sugar, and white rum.',
    price: 12.00,
    image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400',
    category: 'Drinks',
  },
]

async function seed() {
  console.log('Starting Firestore seed...')

  // Seed rooms
  for (const room of rooms) {
    await db.collection('rooms').doc(room.id).set(room)
    console.log(`✅ Room seeded: ${room.name}`)
  }

  // Seed menu
  for (const item of menuItems) {
    await db.collection('menu').doc(item.id).set(item)
    console.log(`✅ Menu item seeded: ${item.name}`)
  }

  console.log('\n🎉 Firestore seed complete!')
  console.log(`📊 Seeded ${rooms.length} rooms and ${menuItems.length} menu items.`)
  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})