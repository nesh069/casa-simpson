import { db } from '../firebase'
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore'
import { rooms } from '../data/rooms'
import { menuItems } from '../data/menu'

export async function seedRooms() {
  const col = collection(db, 'rooms')
  const existing = await getDocs(col)
  if (existing.docs.length > 0) return
  for (const room of rooms) {
    await addDoc(col, room)
  }
  console.log('Rooms seeded')
}

export async function seedMenu() {
  const col = collection(db, 'menu')
  const existing = await getDocs(col)
  if (existing.docs.length > 0) return
  for (const item of menuItems) {
    await addDoc(col, item)
  }
  console.log('Menu seeded')
}