import { useState } from 'react'
import { useCollection } from '../../hooks/useFirestore'
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../firebase'
import toast from 'react-hot-toast'
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi'

const defaultItem = {
  name: '', category: 'starters', price: '', description: '', image: '',
}

export default function AdminMenu() {
  const { data: menuItems, loading } = useCollection('menu', { ordered: false })
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(defaultItem)
  const [filter, setFilter] = useState('all')

  const resetForm = () => {
    setForm(defaultItem)
    setEditing(null)
    setShowForm(false)
  }

  const openEdit = (item) => {
    setForm({
      name: item.name,
      category: item.category,
      price: String(item.price),
      description: item.description || '',
      image: item.image || '',
    })
    setEditing(item.id)
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
      category: form.category,
      price: Number(form.price),
      description: form.description.trim(),
      image: form.image.trim() || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
    }

    try {
      if (editing) {
        await updateDoc(doc(db, 'menu', editing), data)
        toast.success('Menu item updated')
      } else {
        await addDoc(collection(db, 'menu'), { ...data, createdAt: serverTimestamp() })
        toast.success('Menu item created')
      }
      resetForm()
    } catch {
      toast.error('Failed to save menu item')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this menu item permanently?')) return
    try {
      await deleteDoc(doc(db, 'menu', id))
      toast.success('Menu item deleted')
    } catch {
      toast.error('Failed to delete menu item')
    }
  }

  const categories = ['all', 'starters', 'mains', 'desserts', 'drinks']
  const filtered = filter === 'all' ? menuItems : menuItems.filter((i) => i.category === filter)

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
          <h1 className="text-3xl font-bold font-['Poppins'] text-text mb-2">Manage Menu</h1>
          <p className="text-muted">{menuItems.length} item{menuItems.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true) }}
          className="flex items-center gap-2 bg-brand hover:bg-brand-hover text-white font-semibold px-4 py-2.5 rounded-xl transition-all text-sm"
        >
          <FiPlus size={16} />
          Add Item
        </button>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1.5 rounded-xl text-sm font-medium capitalize transition-all ${
              filter === cat
                ? 'bg-brand text-white'
                : 'bg-card text-muted hover:text-text border border-border'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-lg font-bold text-text">
                {editing ? 'Edit Menu Item' : 'Add Menu Item'}
              </h2>
              <button onClick={resetForm} className="p-1.5 hover:bg-surface rounded-lg text-muted">
                <FiX size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted mb-1">Name</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-surface border border-border rounded-xl px-3 py-2.5 text-sm text-text focus:outline-none focus:border-brand" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted mb-1">Category</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full bg-surface border border-border rounded-xl px-3 py-2.5 text-sm text-text focus:outline-none focus:border-brand">
                    <option value="starters">Starters</option>
                    <option value="mains">Mains</option>
                    <option value="desserts">Desserts</option>
                    <option value="drinks">Drinks</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted mb-1">Price (USD)</label>
                  <input type="number" min="1" step="0.5" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full bg-surface border border-border rounded-xl px-3 py-2.5 text-sm text-text focus:outline-none focus:border-brand" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2}
                  className="w-full bg-surface border border-border rounded-xl px-3 py-2.5 text-sm text-text resize-none focus:outline-none focus:border-brand" />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted mb-1">Image URL</label>
                <input type="url" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })}
                  className="w-full bg-surface border border-border rounded-xl px-3 py-2.5 text-sm text-text focus:outline-none focus:border-brand" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit"
                  className="flex-1 bg-brand hover:bg-brand-hover text-white font-bold py-3 rounded-xl transition-all text-sm">
                  {editing ? 'Update Item' : 'Create Item'}
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

      {/* Items grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <div key={item.id} className="bg-card border border-border rounded-2xl overflow-hidden group hover:border-brand/30 transition-all">
            <div className="h-32 bg-surface overflow-hidden">
              {item.image ? (
                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted">No image</div>
              )}
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-text">{item.name}</h3>
                  <span className="text-xs text-muted capitalize">{item.category}</span>
                </div>
                <p className="text-lg font-bold text-accent">${item.price}</p>
              </div>
              {item.description && (
                <p className="text-xs text-muted mb-3 line-clamp-2">{item.description}</p>
              )}
              <div className="flex gap-2 pt-3 border-t border-border">
                <button onClick={() => openEdit(item)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 text-sm bg-surface hover:bg-border text-muted hover:text-text rounded-xl transition-colors">
                  <FiEdit2 size={14} /> Edit
                </button>
                <button onClick={() => handleDelete(item.id)}
                  className="flex items-center justify-center gap-1.5 py-2 px-4 text-sm bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-colors">
                  <FiTrash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">🍽️</p>
          <p className="text-muted">No menu items found</p>
        </div>
      )}
    </div>
  )
}
