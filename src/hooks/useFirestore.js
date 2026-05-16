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
  getDocs,
} from 'firebase/firestore'
import { db } from '../firebase'

export function useCollection(collectionName, options = {}) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let unsubscribe = () => {}

    const setupListener = async () => {
      try {
        // Try ordered query first (for collections with createdAt)
        if (options.ordered !== false) {
          const orderedQuery = query(
            collection(db, collectionName),
            orderBy('createdAt', 'desc')
          )
          unsubscribe = onSnapshot(
            orderedQuery,
            (snapshot) => {
              setData(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })))
              setLoading(false)
              setError(null)
            },
            async (err) => {
              console.warn(`orderBy failed for ${collectionName}, falling back:`, err.message)
              // If orderBy fails (no createdAt field or missing index), fall back to unordered
              const fallback = query(collection(db, collectionName))
              unsubscribe = onSnapshot(
                fallback,
                (snapshot) => {
                  setData(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })))
                  setLoading(false)
                  setError(null)
                },
                (err2) => {
                  console.error(`Fallback also failed for ${collectionName}:`, err2.message)
                  setError(err2.message)
                  setLoading(false)
                }
              )
            }
          )
        } else {
          const fallback = query(collection(db, collectionName))
          unsubscribe = onSnapshot(
            fallback,
            (snapshot) => {
              setData(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })))
              setLoading(false)
              setError(null)
            },
            (err) => {
              console.error(`Snapshot error for ${collectionName}:`, err.message)
              setError(err.message)
              setLoading(false)
            }
          )
        }
      } catch (err) {
        console.error(`Setup error for ${collectionName}:`, err.message)
        setError(err.message)
        setLoading(false)
      }
    }

    setupListener()
    return () => unsubscribe()
  }, [collectionName, options.ordered])

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