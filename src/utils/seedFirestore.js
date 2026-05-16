import { db } from '../firebase'
import {
  collection,
  doc,
  setDoc,
  getDocs,
} from 'firebase/firestore'
import { rooms } from '../data/rooms'
import { menuItems } from '../data/menu'

export async function seedRooms() {
  try {
    const col = collection(db, 'rooms')
    const existing = await getDocs(col)
    if (existing.docs.length > 0) return
    for (const room of rooms) {
      // Use the room's own id as the Firestore document ID
      await setDoc(doc(db, 'rooms', room.id), room)
    }
    console.log('✅ Rooms seeded to Firestore')
  } catch (err) {
    console.error('Seed rooms error:', err)
  }
}

export async function seedMenu() {
  try {
    const col = collection(db, 'menu')
    const existing = await getDocs(col)
    if (existing.docs.length > 0) return
    for (const item of menuItems) {
      // Use the item's own id as the Firestore document ID
      await setDoc(doc(db, 'menu', item.id), item)
    }
    console.log('✅ Menu seeded to Firestore')
  } catch (err) {
    console.error('Seed menu error:', err)
  }
}