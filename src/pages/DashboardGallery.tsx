import { useState } from 'react'
import { supabase, type GalleryImage } from '../lib/supabase'
import { useGallery } from '../hooks'
import { Plus, Trash2, Upload, X, MoveUp, MoveDown } from 'lucide-react'

export default function DashboardGallery() {
  const { images, loading, setImages } = useGallery()
  const [showForm, setShowForm] = useState(false)
  const [imgFile, setImgFile]   = useState<File | null>(null)
  const [preview, setPreview]   = useState('')
  const [altText, setAltText]   = useState('')
  const [saving, setSaving]     = useState(false)
  const [error, setError]       = useState('')

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return
    setImgFile(f)
    setPreview(URL.createObjectURL(f))
    setError('')
  }

  const uploadAndSave = async () => {
    if (!imgFile && !preview.startsWith('http')) { setError('Selecciona una imagen o pega una URL'); return }
    setSaving(true); setError('')
    try {
      let url = preview
      if (imgFile) {
        const ext  = imgFile.name.split('.').pop()
        const path = `gallery/${Date.now()}.${ext}`
        const { error: upErr } = await supabase.storage.from('clemmie-images').upload(path, imgFile, { upsert: true })
        if (upErr) throw upErr
        url = supabase.storage.from('clemmie-images').getPublicUrl(path).data.publicUrl
      }
      const nextOrder = (images.at(-1)?.sort_order ?? 0) + 1
      const { data, error: dbErr } = await supabase
        .from('gallery_images')
        .insert({ image_url: url, alt_text: altText.trim(), sort_order: nextOrder, active: true })
        .select().single()
      if (dbErr) throw dbErr
      if (data) setImages(imgs => [...imgs, data])
      setShowForm(false); setImgFile(null); setPreview(''); setAltText('')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error al guardar')
    } finally { setSaving(false) }
  }

  const deleteImage = async (id: string) => {
    if (!confirm('¿Eliminar esta foto?')) return
    await supabase.from('gallery_images').delete().eq('id', id)
    setImages(imgs => imgs.filter(i => i.id !== id))
  }

  const move = async (img: GalleryImage, dir: 'up' | 'down') => {
    const idx = images.findIndex(i => i.id === img.id)
    const swapIdx = dir === 'up' ? idx - 1 : idx + 1
    if (swapIdx < 0 || swapIdx >= images.length) return
    const other = images[swapIdx]
    await Promise.all([
      supabase.from('gallery_images').update({ sort_order: other.sort_order }).eq('id', img.id),
      supabase.from('gallery_images').update({ sort_order: img.sort_order }).eq('id', other.id),
    ])
    const newImgs = [...images]
    newImgs[idx]     = { ...img,   sort_order: other.sort_order }
    newImgs[swapIdx] = { ...other, sort_order: img.sort_order }
    setImages(newImgs.sort((a,b) => a.sort_order - b.sort_order))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-brand-dark">Galería</h1>
          <p className="text-brand-dark/50 text-sm font-body mt-1">{images.length} fotos publicadas</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-brand-red text-white rounded-xl font-semibold text-sm
                     hover:bg-brand-coral transition-all duration-300 shadow-md shadow-brand-red/30 hover:scale-105"
        >
          <Plus size={18} /> Agregar foto
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-44 bg-white rounded-2xl animate-pulse" />)}
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-20 text-brand-dark/30">
          <p className="font-display text-xl">Sin fotos aún</p>
          <p className="text-sm mt-1">Agrega la primera foto de la galería</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img, idx) => (
            <div key={img.id} className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
              <img src={img.image_url} alt={img.alt_text} className="w-full h-44 object-cover" />
              {/* Order badge */}
              <div className="absolute top-2 left-2 w-6 h-6 bg-brand-dark/60 text-white text-xs rounded-full flex items-center justify-center font-bold backdrop-blur-sm">
                {idx + 1}
              </div>
              {/* Actions overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                <button onClick={() => move(img, 'up')} disabled={idx === 0}
                  className="w-8 h-8 bg-white/90 rounded-lg flex items-center justify-center hover:bg-brand-soft disabled:opacity-30 transition-colors">
                  <MoveUp size={14} />
                </button>
                <button onClick={() => move(img, 'down')} disabled={idx === images.length - 1}
                  className="w-8 h-8 bg-white/90 rounded-lg flex items-center justify-center hover:bg-brand-soft disabled:opacity-30 transition-colors">
                  <MoveDown size={14} />
                </button>
                <button onClick={() => deleteImage(img.id)}
                  className="w-8 h-8 bg-white/90 rounded-lg flex items-center justify-center hover:bg-red-50 transition-colors">
                  <Trash2 size={14} className="text-red-400" />
                </button>
              </div>
              {img.alt_text && (
                <div className="px-3 py-2 border-t border-gray-100">
                  <p className="text-xs text-brand-dark/50 truncate font-body">{img.alt_text}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add photo modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="font-display font-bold text-xl text-brand-dark">Agregar foto</h2>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Drop zone */}
              <div>
                <label className="block text-xs font-semibold text-brand-dark/60 uppercase tracking-wide mb-2">Imagen</label>
                <label className={`flex flex-col items-center justify-center h-40 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200
                                   ${preview ? 'border-brand-rose' : 'border-brand-blush hover:border-brand-rose hover:bg-brand-soft/20'} overflow-hidden relative`}>
                  {preview
                    ? <img src={preview} alt="preview" className="w-full h-full object-cover" />
                    : (
                      <div className="flex flex-col items-center gap-2 text-brand-dark/40">
                        <Upload size={28} />
                        <p className="text-sm">Haz clic para subir</p>
                        <p className="text-xs">PNG, JPG, WEBP</p>
                      </div>
                    )
                  }
                  <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-dark/60 uppercase tracking-wide mb-1.5">URL externa (opcional)</label>
                <input
                  type="url" value={imgFile ? '' : preview}
                  onChange={e => { if (!imgFile) { setPreview(e.target.value); setError('') }}}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-red/30 hover:border-brand-rose/60 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-dark/60 uppercase tracking-wide mb-1.5">Texto alternativo / descripción</label>
                <input
                  value={altText} onChange={e => setAltText(e.target.value)}
                  placeholder="Torta de chocolate con fresas"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-red/30 hover:border-brand-rose/60 transition-colors"
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-brand-dark/60 text-sm font-semibold hover:bg-gray-50 transition-colors">
                  Cancelar
                </button>
                <button onClick={uploadAndSave} disabled={saving}
                  className="flex-1 py-3 bg-brand-red text-white rounded-xl font-semibold text-sm hover:bg-brand-coral transition-all duration-300 disabled:opacity-60 flex items-center justify-center gap-2">
                  {saving && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
                  {saving ? 'Guardando...' : 'Guardar foto'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
