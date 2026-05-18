import { db } from '../firebase'
import { doc, setDoc } from 'firebase/firestore'

const ADMIN_UID = 'YOUR_UID_HERE'

export async function setAdminRole() {
  if (ADMIN_UID === 'YOUR_UID_HERE') {
    console.error('❌ Edit src/utils/setAdmin.js and replace YOUR_UID_HERE with your Firebase UID')
    return
  }
  await setDoc(doc(db, 'users', ADMIN_UID), { role: 'admin' }, { merge: true })
  console.log('✅ Admin role set for', ADMIN_UID)
}
