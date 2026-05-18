import admin from 'firebase-admin'
import { readFileSync } from 'fs'
import { createRequire } from 'module'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const serviceAccount = JSON.parse(
  readFileSync(path.resolve(__dirname, '..', 'serviceAccountKey.json'), 'utf-8')
)

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) })

const email = process.argv[2]

if (!email) {
  console.error('Usage: node scripts/setAdmin.js <email>')
  process.exit(1)
}

const user = await admin.auth().getUserByEmail(email)
await admin.firestore().doc(`users/${user.uid}`).set({ role: 'admin' }, { merge: true })
console.log(`✅ Admin role set for ${email} (UID: ${user.uid})`)
process.exit(0)
