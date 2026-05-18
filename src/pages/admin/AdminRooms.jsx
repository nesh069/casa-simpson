import { useState } from 'react'
import { useCollection } from '../../hooks/useFirestore'
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../firebase'
import toast from 'react-hot-toast'
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi'

const defaultRoom = {
  name: '', type: 'single', price: '', description: '',
  amenities: '', image: '', available: true,
}

export default function AdminRooms() {
  const { data: rooms, loading } = useCollection('rooms', { ordered: false })
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(defaultRoom)

  const resetForm = () => {
    setForm(defaultRoom)
    setEditing(null)
    setShowForm(false)
  }

  const openEdit = (room) => {
    setForm({
      name: room.name,
      type: room.type,
      price: String(room.price),
      description: room.description,
      amenities: (room.amenities || []).join(', '),
      image: room.image || '',
      available: room.available,
    })
    setEditing(room.id)
    setShowForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.price) {
      toast.error('Name and price are required')
      return
    }

    const data = {
      name: form.name.trim(),
      type: form.type,
      price: Number(form.price),
      description: form.description.trim(),
      amenities: form.amenities.split(',').map((a) => a.trim()).filter(Boolean),
      image: form.image.trim() || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
      available: form.available,
    }

    try {
      if (editing) {
        await updateDoc(doc(db, 'rooms', editing), data)
        toast.success('Room updated')
      } else {
        await addDoc(collection(db, 'rooms'), { ...data, createdAt: serverTimestamp() })
        toast.success('Room created')
      }
      resetForm()
    } catch (err) {
      toast.error('Failed to save room')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this room permanently?')) return
    try {
      await deleteDoc(doc(db, 'rooms', id))
      toast.success('Room deleted')
    } catch {
      toast.error('Failed to delete room')
    }
  }

  const typeColor = {
    single: 'bg-blue-500/10 text-blue-400',
    double: 'bg-green-500/10 text-green-400',
    suite: 'bg-purple-500/10 text-purple-400',
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-['Poppins'] text-text mb-2">Manage Rooms</h1>
          <p className="text-muted">{rooms.length} room{rooms.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true) }}
          className="flex items-center gap-2 bg-brand hover:bg-brand-hover text-white font-semibold px-4 py-2.5 rounded-xl transition-all text-sm"
        >
          <FiPlus size={16} />
          Add Room
        </button>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-lg font-bold text-text">
                {editing ? 'Edit Room' : 'Add Room'}
              </h2>
              <button onClick={resetForm} className="p-1.5 hover:bg-surface rounded-lg text-muted">
                <FiX size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted mb-1">Name</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-surface border border-border rounded-xl px-3 py-2.5 text-sm text-text placeholder-muted focus:outline-none focus:border-brand" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted mb-1">Type</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full bg-surface border border-border rounded-xl px-3 py-2.5 text-sm text-text focus:outline-none focus:border-brand">
                    <option value="single">Single</option>
                    <option value="double">Double</option>
                    <option value="suite">Suite</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted mb-1">Price (USD)</label>
                  <input type="number" min="1" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full bg-surface border border-border rounded-xl px-3 py-2.5 text-sm text-text placeholder-muted focus:outline-none focus:border-brand" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3}
                  className="w-full bg-surface border border-border rounded-xl px-3 py-2.5 text-sm text-text placeholder-muted focus:outline-none focus:border-brand resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted mb-1">Amenities (comma-separated)</label>
                <input type="text" value={form.amenities} onChange={(e) => setForm({ ...form, amenities: e.target.value })}
                  placeholder="WiFi, AC, TV, En-suite"
                  className="w-full bg-surface border border-border rounded-xl px-3 py-2.5 text-sm text-text placeholder-muted focus:outline-none focus:border-brand" />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted mb-1">Image URL</label>
                <input type="url" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })}
                  className="w-full bg-surface border border-border rounded-xl px-3 py-2.5 text-sm text-text placeholder-muted focus:outline-none focus:border-brand" />
              </div>
              <label className="flex items-center gap-3">
                <input type="checkbox" checked={form.available} onChange={(e) => setForm({ ...form, available: e.target.checked })}
                  className="w-4 h-4 rounded border-border bg-surface text-brand focus:ring-brand" />
                <span className="text-sm text-text">Available for booking</span>
              </label>
              <div className="flex gap-3 pt-2">
                <button type="submit"
                  className="flex-1 bg-brand hover:bg-brand-hover text-white font-bold py-3 rounded-xl transition-all text-sm">
                  {editing ? 'Update Room' : 'Create Room'}
                </button>
                <button type="button" onClick={resetForm}
                  className="px-6 text-muted hover:text-text text-sm py-3 transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Rooms list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms.map((room) => (
          <div key={room.id} className="bg-card border border-border rounded-2xl overflow-hidden group hover:border-brand/30 transition-all">
            <div className="h-36 bg-surface overflow-hidden">
              {room.image ? (
                <img src={room.image} alt={room.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted">No image</div>
              )}
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-text">{room.name}</h3>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full inline-block mt-1 capitalize ${typeColor[room.type] || 'bg-surface text-muted'}`}>
                    {room.type}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-accent">${room.price}</p>
                  <p className="text-xs text-muted">/night</p>
                </div>
              </div>
              <p className="text-xs text-muted mb-3 line-clamp-2">{room.description}</p>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full ${room.available ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                  {room.available ? 'Available' : 'Unavailable'}
                </span>
              </div>
              <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                <button onClick={() => openEdit(room)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 text-sm bg-surface hover:bg-border text-muted hover:text-text rounded-xl transition-colors">
                  <FiEdit2 size={14} /> Edit
                </button>
                <button onClick={() => handleDelete(room.id)}
                  className="flex items-center justify-center gap-1.5 py-2 px-4 text-sm bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-colors">
                  <FiTrash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
