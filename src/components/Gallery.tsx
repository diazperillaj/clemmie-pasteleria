import { useState } from 'react'
import { X } from 'lucide-react'
import type { GalleryImage } from '../lib/supabase'

const PLACEHOLDER_IMAGES: GalleryImage[] = [
  { id: '1', image_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80', alt_text: 'Torta de chocolate',  sort_order: 1, active: true },
  { id: '2', image_url: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=800&q=80', alt_text: 'Cupcakes decorados',  sort_order: 2, active: true },
  { id: '3', image_url: 'https://images.unsplash.com/photo-1559181567-c3190100191d?w=800&q=80', alt_text: 'Macarons coloridos',   sort_order: 3, active: true },
  { id: '4', image_url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80', alt_text: 'Donuts glaseados',    sort_order: 4, active: true },
  { id: '5', image_url: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=800&q=80', alt_text: 'Galletas decoradas',  sort_order: 5, active: true },
  { id: '6', image_url: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&q=80', alt_text: 'Pastel de boda',      sort_order: 6, active: true },
  { id: '7', image_url: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80', alt_text: 'Torta de fresas',     sort_order: 7, active: true },
  { id: '8', image_url: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=800&q=80', alt_text: 'Cupcakes rosas',      sort_order: 8, active: true },
]

interface Props {
  images: GalleryImage[]
  loading: boolean
}

export default function Gallery({ images, loading }: Props) {
  const [lightbox, setLightbox] = useState<GalleryImage | null>(null)

  const raw = /*images.length > 0 ? images :*/ PLACEHOLDER_IMAGES
  const items: (GalleryImage | null)[] = Array.from({ length: 8 }, (_, i) => raw[i] ?? null)

  const cols = [
    [items[0], items[1]],
    [items[2], items[3]],
    [items[4], items[5]],
    [items[6], items[7]],
  ]

  const topFlex    = (colIdx: number) => colIdx % 2 === 0 ? 'flex-[3]' : 'flex-[2]'
  const bottomFlex = (colIdx: number) => colIdx % 2 === 0 ? 'flex-[2]' : 'flex-[3]'

  return (
    <section id="galeria" className="py-16 bg-[#e8e8e8]">
      <div className="max-w-6xl mx-auto px-6">

        {/* Title */}
        <h2 className="text-3xl font-medium text-brand-dark text-center mb-10">
          Galería
        </h2>

        {loading ? (
          <div className="flex gap-2 h-[520px]">
            {[0,1,2,3].map(i => (
              <div key={i} className="flex-1 flex flex-col gap-2">
                <div className={`${i % 2 === 0 ? 'flex-[3]' : 'flex-[2]'} bg-white/30 rounded-2xl animate-pulse`} />
                <div className={`${i % 2 === 0 ? 'flex-[2]' : 'flex-[3]'} bg-white/30 rounded-2xl animate-pulse`} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex my-24 gap-2 h-[520px]">
            {cols.map((col, colIdx) => (
              <div key={colIdx} className="flex-1 flex flex-col gap-2">
                {col.map((img, rowIdx) => {
                  const flexClass = rowIdx === 0 ? topFlex(colIdx) : bottomFlex(colIdx)
                  if (!img) return <div key={rowIdx} className={`${flexClass} rounded-2xl bg-white/10`} />
                  return (
                    <div
                      key={img.id}
                      className={`${flexClass} relative overflow-hidden rounded-2xl cursor-pointer group`}
                      onClick={() => setLightbox(img)}
                    >
                      <img
                        src={img.image_url}
                        alt={img.alt_text}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'
                        }}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox with fade-in animation */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
          style={{ backgroundColor: 'rgba(0,0,0,0.82)' }}
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-5 right-5 w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center text-white
                       hover:bg-white/40 transition-colors"
            onClick={() => setLightbox(null)}
          >
            <X size={22} />
          </button>
          <img
            src={lightbox.image_url}
            alt={lightbox.alt_text}
            className="max-w-full max-h-[85vh] rounded-2xl object-contain animate-fade-up"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  )
}
