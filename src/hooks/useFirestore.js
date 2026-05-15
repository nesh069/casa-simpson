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
    let q
    try {
      q = options.ordered === false
        ? query(collection(db, collectionName))
        : query(collection(db, collectionName), orderBy('createdAt', 'desc'))
    } catch {
      q = query(collection(db, collectionName))
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
        setData(docs)
        setLoading(false)
      },
      (err) => {
        setError(err.message)
        setLoading(false)
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