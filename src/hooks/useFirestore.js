import { useState, useEffect } from 'react'
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore'
import { db } from '../firebase'

export function useCollection(collectionName) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Try with ordering first, fall back to unordered if index missing
    let q
    try {
      q = query(
        collection(db, collectionName),
        orderBy('createdAt', 'desc')
      )
    } catch {
      q = collection(db, collectionName)
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
        setData(docs)
        setLoading(false)
        setError(null)
      },
      (err) => {
        console.warn(`Firestore (${collectionName}):`, err.message)
        // If orderBy fails (missing index), retry without ordering
        if (err.code === 'failed-precondition' || err.message.includes('index')) {
          const fallbackQ = collection(db, collectionName)
          onSnapshot(fallbackQ, (snapshot) => {
            const docs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
            setData(docs)
            setLoading(false)
          })
        } else {
          setError(err.message)
          setLoading(false)
        }
      }
    )
    return () => unsubscribe()
  }, [collectionName])

  const addDocument = async (docData) => {
    await addDoc(collection(db, collectionName), {
      ...docData,
      createdAt: serverTimestamp(),
    })
  }

  const deleteDocument = async (id) => {
    await deleteDoc(doc(db, collectionName, id))
  }

  return { data, loading, error, addDocument, deleteDocument }
}

// Alias for backward compatibility
export function useFirestore(collectionName) {
  return useCollection(collectionName)
}