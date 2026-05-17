import { db } from '../firebase'
import { collection, doc, setDoc, getDocs, deleteDoc } from 'firebase/firestore'
import { rooms } from '../data/rooms'
import { menuItems } from '../data/menu'

export async function seedRooms() {
  try {
    const col = collection(db, 'rooms')
    const existing = await getDocs(col)

    // If count matches we already seeded
    if (existing.docs.length === rooms.length) return

    // Clear old docs first
    for (const d of existing.docs) {
      await deleteDoc(doc(db, 'rooms', d.id))
    }

    // Seed fresh
    for (const room of rooms) {
      await setDoc(doc(db, 'rooms', room.id), room)
    }
    console.log('✅ Rooms seeded')
  } catch (err) {
    console.error('Seed rooms error:', err)
  }
}

export async function seedMenu() {
  try {
    const col = collection(db, 'menu')
    const existing = await getDocs(col)

    if (existing.docs.length === menuItems.length) return

    for (const d of existing.docs) {
      await deleteDoc(doc(db, 'menu', d.id))
    }

    for (const item of menuItems) {
      await setDoc(doc(db, 'menu', item.id), item)
    }
    console.log('✅ Menu seeded')
  } catch (err) {
    console.error('Seed menu error:', err)
  }
}
