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
    let unsubscribe

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
            },
            async () => {
              // If orderBy fails (no createdAt field), fall back to unordered
              const fallback = query(collection(db, collectionName))
              unsubscribe = onSnapshot(
                fallback,
                (snapshot) => {
                  setData(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })))
                  setLoading(false)
                },
                (err) => {
                  setError(err.message)
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
            },
            (err) => {
              setError(err.message)
              setLoading(false)
            }
          )
        }
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }

    setupListener()
    return () => unsubscribe && unsubscribe()
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