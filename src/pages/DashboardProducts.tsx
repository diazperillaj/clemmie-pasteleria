import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { supabase, type Product } from '../lib/supabase'
import { useProducts } from '../hooks'
import { Plus, Pencil, Trash2, X, Star, ToggleLeft, ToggleRight, AlertCircle, Upload } from 'lucide-react'

const schema = z.object({
  name:        z.string().min(2, 'Mínimo 2 caracteres').max(100),
  description: z.string().max(400).optional(),
  price:       z.number({ invalid_type_error: 'Ingresa un precio' }).positive('El precio debe ser positivo'),
  category:    z.string().min(1, 'Selecciona una categoría').max(50),
  image_url:   z.string().url('URL inválida').or(z.literal('')).optional(),
  featured:    z.boolean().optional(),
})

type FormData = z.infer<typeof schema>

const CATEGORIES = ['Tortas', 'Cupcakes', 'Macarons', 'Galletas', 'Tartas', 'Postres', 'Especiales', 'General']

function formatPrice(p: number) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(p)
}

export default function DashboardProducts() {
  const { products, loading, setProducts } = useProducts()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing]   = useState<Product | null>(null)
  const [saving, setSaving]     = useState(false)
  const [imgFile, setImgFile]   = useState<File | null>(null)
  const [imgPreview, setImgPreview] = useState('')

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { featured: false },
  })

  const featured = watch('featured')

  const openNew = () => {
    setEditing(null)
    reset({ featured: false })
    setImgFile(null)
    setImgPreview('')
    setShowForm(true)
  }

  const openEdit = (p: Product) => {
    setEditing(p)
    reset({
      name: p.name, description: p.description, price: p.price,
      category: p.category, image_url: p.image_url, featured: p.featured,
    })
    setImgFile(null)
    setImgPreview(p.image_url)
    setShowForm(true)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImgFile(file)
    setImgPreview(URL.createObjectURL(file))
  }

  const uploadImage = async (file: File): Promise<string> => {
    const ext  = file.name.split('.').pop()
    const path = `products/${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('clemmie-images').upload(path, file, { upsert: true })
    if (error) throw error
    const { data } = supabase.storage.from('clemmie-images').getPublicUrl(path)
    return data.publicUrl
  }

  const onSubmit = async (data: FormData) => {
    setSaving(true)
    try {
      let imageUrl = data.image_url ?? ''
      if (imgFile) imageUrl = await uploadImage(imgFile)

      const payload = {
        name:        data.name,
        description: data.description ?? '',
        price:       data.price,
        category:    data.category,
        image_url:   imageUrl,
        featured:    data.featured ?? false,
      }

      if (editing) {
        const { data: updated } = await supabase.from('products').update(payload).eq('id', editing.id).select().single()
        if (updated) setProducts(ps => ps.map(p => p.id === updated.id ? updated : p))
      } else {
        const { data: created } = await supabase.from('products').insert({ ...payload, active: true }).select().single()
        if (created) setProducts(ps => [created, ...ps])
      }
      setShowForm(false)
      reset()
    } finally {
      setSaving(false)
    }
  }

  const toggleActive = async (product: Product) => {
    const { data } = await supabase.from('products').update({ active: !product.active }).eq('id', product.id).select().single()
    if (data) setProducts(ps => ps.map(p => p.id === data.id ? data : p))
  }

  const deleteProduct = async (id: string) => {
    if (!confirm('¿Eliminar este producto?')) return
    await supabase.from('products').delete().eq('id', id)
    setProducts(ps => ps.filter(p => p.id !== id))
  }

  const inputCls = (err?: { message?: string }) =>
    `w-full px-4 py-3 rounded-xl border text-sm font-body text-brand-dark bg-white
     focus:outline-none focus:ring-2 focus:ring-brand-red/30 transition-all duration-200
     ${err ? 'border-red-400' : 'border-gray-200 hover:border-brand-rose/60'}`

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-brand-dark">Productos</h1>
          <p className="text-brand-dark/50 text-sm font-body mt-1">{products.length} productos en total</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-5 py-2.5 bg-brand-red text-white rounded-xl font-semibold text-sm
                     hover:bg-brand-coral transition-all duration-300 shadow-md shadow-brand-red/30 hover:scale-105"
        >
          <Plus size={18} /> Agregar producto
        </button>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => <div key={i} className="h-64 bg-white rounded-2xl animate-pulse" />)}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-brand-dark/30">
          <p className="font-display text-xl">No hay productos aún</p>
          <p className="text-sm mt-1">Agrega el primero haciendo clic en el botón de arriba</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(p => (
            <div key={p.id} className={`bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 ${!p.active ? 'opacity-60' : ''}`}>
              <div className="relative h-44 bg-brand-soft overflow-hidden">
                {p.image_url
                  ? <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-brand-blush text-4xl">🎂</div>
                }
                {p.featured && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 bg-brand-red text-white text-xs rounded-full flex items-center gap-1">
                    <Star size={10} fill="white" /> Destacado
                  </span>
                )}
                <div className="absolute top-2 right-2 flex gap-1.5">
                  <button onClick={() => openEdit(p)} className="w-8 h-8 bg-white/90 rounded-lg flex items-center justify-center hover:bg-brand-soft transition-colors shadow-sm">
                    <Pencil size={14} className="text-brand-dark" />
                  </button>
                  <button onClick={() => deleteProduct(p.id)} className="w-8 h-8 bg-white/90 rounded-lg flex items-center justify-center hover:bg-red-50 transition-colors shadow-sm">
                    <Trash2 size={14} className="text-red-400" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-display font-bold text-brand-dark text-sm leading-tight">{p.name}</h3>
                  <button onClick={() => toggleActive(p)} className="flex-shrink-0" title={p.active ? 'Desactivar' : 'Activar'}>
                    {p.active
                      ? <ToggleRight size={22} className="text-green-500" />
                      : <ToggleLeft  size={22} className="text-gray-300" />
                    }
                  </button>
                </div>
                <p className="text-brand-dark/50 text-xs mb-2 line-clamp-2 font-body">{p.description}</p>
                <div className="flex items-center justify-between">
                  <span className="font-display font-bold text-brand-red">{formatPrice(p.price)}</span>
                  <span className="text-xs px-2 py-0.5 bg-brand-soft text-brand-coral rounded-full">{p.category}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="font-display font-bold text-xl text-brand-dark">
                {editing ? 'Editar producto' : 'Nuevo producto'}
              </h2>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              {/* Image upload */}
              <div>
                <label className="block text-xs font-semibold text-brand-dark/60 uppercase tracking-wide mb-2">Imagen del producto</label>
                <div className="flex gap-3 items-start">
                  <div className="w-20 h-20 rounded-xl bg-brand-soft flex items-center justify-center overflow-hidden flex-shrink-0">
                    {imgPreview
                      ? <img src={imgPreview} alt="preview" className="w-full h-full object-cover" />
                      : <span className="text-3xl">🎂</span>
                    }
                  </div>
                  <div className="flex-1 space-y-2">
                    <label className="flex items-center gap-2 px-3 py-2.5 border-2 border-dashed border-brand-blush rounded-xl cursor-pointer hover:border-brand-rose hover:bg-brand-soft/30 transition-colors text-sm text-brand-dark/60">
                      <Upload size={16} />
                      <span>Subir imagen</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                    </label>
                    <p className="text-xs text-brand-dark/40">O pega una URL:</p>
                    <input {...register('image_url')} placeholder="https://..." className={inputCls(errors.image_url)} />
                    {errors.image_url && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle size={11} />{errors.image_url.message}</p>}
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-brand-dark/60 uppercase tracking-wide mb-1.5">Nombre *</label>
                  <input {...register('name')} className={inputCls(errors.name)} placeholder="Torta de fresas" />
                  {errors.name && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={11} />{errors.name.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-brand-dark/60 uppercase tracking-wide mb-1.5">Categoría *</label>
                  <select {...register('category')} className={inputCls(errors.category)}>
                    <option value="">Seleccionar...</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {errors.category && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={11} />{errors.category.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-dark/60 uppercase tracking-wide mb-1.5">Descripción</label>
                <textarea {...register('description')} rows={3} className={`${inputCls(errors.description)} resize-none`} placeholder="Descripción del producto..." />
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-dark/60 uppercase tracking-wide mb-1.5">Precio (COP) *</label>
                <input
                  type="number" step="500" min="0"
                  {...register('price', { valueAsNumber: true })}
                  className={inputCls(errors.price)}
                  placeholder="85000"
                />
                {errors.price && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={11} />{errors.price.message}</p>}
              </div>

              <label className="flex items-center gap-3 cursor-pointer select-none">
                <button type="button" onClick={() => setValue('featured', !featured)} className="flex-shrink-0">
                  {featured
                    ? <ToggleRight size={26} className="text-brand-red" />
                    : <ToggleLeft  size={26} className="text-gray-300" />
                  }
                </button>
                <span className="text-sm font-medium text-brand-dark">Marcar como destacado</span>
              </label>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-brand-dark/60 text-sm font-semibold hover:border-gray-300 hover:bg-gray-50 transition-all duration-200">
                  Cancelar
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 py-3 bg-brand-red text-white rounded-xl font-semibold text-sm
                             hover:bg-brand-coral transition-all duration-300 disabled:opacity-60 flex items-center justify-center gap-2">
                  {saving ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : null}
                  {saving ? 'Guardando...' : editing ? 'Guardar cambios' : 'Crear producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
