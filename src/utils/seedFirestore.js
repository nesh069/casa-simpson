import { db } from '../firebase'
import {
  collection,
  doc,
  setDoc,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore'
import { rooms } from '../data/rooms'
import { menuItems } from '../data/menu'

export async function seedRooms() {
  try {
    const col = collection(db, 'rooms')
    const existing = await getDocs(col)
    if (existing.docs.length > 0) return
    for (const room of rooms) {
      await setDoc(doc(db, 'rooms', room.id), {
        ...room,
        createdAt: serverTimestamp(),
      })
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
      await setDoc(doc(db, 'menu', item.id), {
        ...item,
        createdAt: serverTimestamp(),
      })
    }
    console.log('✅ Menu seeded to Firestore')
  } catch (err) {
    console.error('Seed menu error:', err)
  }
}