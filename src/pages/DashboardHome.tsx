import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Package, ImageIcon, MessageSquare, Eye } from 'lucide-react'
import { Link } from 'react-router-dom'

interface Stats {
  products: number
  gallery: number
  messages: number
  unread: number
}

export default function DashboardHome() {
  const [stats, setStats] = useState<Stats>({ products: 0, gallery: 0, messages: 0, unread: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      const [p, g, m, u] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact', head: true }).eq('active', true),
        supabase.from('gallery_images').select('id', { count: 'exact', head: true }).eq('active', true),
        supabase.from('contact_messages').select('id', { count: 'exact', head: true }),
        supabase.from('contact_messages').select('id', { count: 'exact', head: true }).eq('read', false),
      ])
      setStats({
        products: p.count ?? 0,
        gallery:  g.count ?? 0,
        messages: m.count ?? 0,
        unread:   u.count ?? 0,
      })
      setLoading(false)
    }
    fetchStats()
  }, [])

  const cards = [
    { icon: Package,      label: 'Productos activos', value: stats.products, href: '/dashboard/productos', color: 'bg-brand-soft text-brand-red' },
    { icon: ImageIcon,    label: 'Fotos en galería',  value: stats.gallery,  href: '/dashboard/galeria',   color: 'bg-brand-blush/40 text-brand-coral' },
    { icon: MessageSquare, label: 'Mensajes totales', value: stats.messages, href: '/dashboard/mensajes',  color: 'bg-purple-50 text-purple-500' },
    { icon: Eye,          label: 'Sin leer',          value: stats.unread,   href: '/dashboard/mensajes',  color: 'bg-amber-50 text-amber-500' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-brand-dark">Resumen</h1>
        <p className="text-brand-dark/50 font-body mt-1 text-sm">Bienvenida al panel de Clemmie 🎂</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {cards.map(({ icon: Icon, label, value, href, color }) => (
          <Link
            key={label}
            to={href}
            className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 group"
          >
            <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3`}>
              <Icon size={20} />
            </div>
            {loading
              ? <div className="h-8 w-16 bg-gray-100 animate-pulse rounded-lg mb-1" />
              : <p className="font-display text-3xl font-bold text-brand-dark">{value}</p>
            }
            <p className="text-brand-dark/50 text-xs font-body mt-0.5 group-hover:text-brand-dark/70 transition-colors">{label}</p>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="font-display font-bold text-lg text-brand-dark mb-5">Acciones rápidas</h2>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { label: 'Agregar producto',   href: '/dashboard/productos', emoji: '🍰' },
            { label: 'Subir foto galería', href: '/dashboard/galeria',   emoji: '📸' },
            { label: 'Ver mensajes',       href: '/dashboard/mensajes',  emoji: '💌' },
          ].map(({ label, href, emoji }) => (
            <Link
              key={href}
              to={href}
              className="flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 border-brand-blush/40
                         hover:border-brand-red/40 hover:bg-brand-soft/30 transition-all duration-200 group"
            >
              <span className="text-2xl">{emoji}</span>
              <span className="text-sm font-medium text-brand-dark/70 group-hover:text-brand-dark">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
