import { useEffect, useState } from 'react'
import { supabase, type ContactMessage } from '../lib/supabase'
import { Mail, MailOpen, Trash2, Phone, Clock, RefreshCw } from 'lucide-react'

export default function DashboardMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading]   = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)

  const fetchMessages = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })
    setMessages(data ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchMessages() }, [])

  const markRead = async (msg: ContactMessage) => {
    if (msg.read) return
    await supabase.from('contact_messages').update({ read: true }).eq('id', msg.id)
    setMessages(ms => ms.map(m => m.id === msg.id ? { ...m, read: true } : m))
  }

  const toggleExpand = (id: string) => {
    setExpanded(prev => prev === id ? null : id)
    const msg = messages.find(m => m.id === id)
    if (msg && !msg.read) markRead(msg)
  }

  const deleteMsg = async (id: string) => {
    if (!confirm('¿Eliminar este mensaje?')) return
    await supabase.from('contact_messages').delete().eq('id', id)
    setMessages(ms => ms.filter(m => m.id !== id))
  }

  const unread = messages.filter(m => !m.read).length

  const fmt = (iso: string) =>
    new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso))

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-brand-dark">Mensajes</h1>
          <p className="text-brand-dark/50 text-sm font-body mt-1">
            {messages.length} mensajes — {unread > 0 ? <span className="text-brand-red font-semibold">{unread} sin leer</span> : 'todos leídos'}
          </p>
        </div>
        <button onClick={fetchMessages} className="flex items-center gap-2 px-4 py-2.5 border-2 border-gray-200 text-brand-dark/60 rounded-xl text-sm font-semibold hover:border-gray-300 hover:bg-gray-50 transition-all duration-200">
          <RefreshCw size={15} /> Actualizar
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-20 bg-white rounded-2xl animate-pulse" />)}
        </div>
      ) : messages.length === 0 ? (
        <div className="text-center py-20 text-brand-dark/30">
          <Mail size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-display text-xl">Sin mensajes aún</p>
          <p className="text-sm mt-1">Aquí aparecerán los formularios de contacto de la página</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`bg-white rounded-2xl shadow-sm overflow-hidden transition-all duration-300 ${!msg.read ? 'border-l-4 border-brand-red' : ''}`}
            >
              <div
                className="flex items-center gap-4 p-5 cursor-pointer hover:bg-gray-50/80 transition-colors duration-200"
                onClick={() => toggleExpand(msg.id)}
              >
                {/* Icon */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${msg.read ? 'bg-gray-100 text-gray-400' : 'bg-brand-soft text-brand-red'}`}>
                  {msg.read ? <MailOpen size={18} /> : <Mail size={18} />}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className={`font-semibold text-sm ${msg.read ? 'text-brand-dark/70' : 'text-brand-dark'}`}>
                      {msg.name}
                    </p>
                    {!msg.read && (
                      <span className="px-2 py-0.5 bg-brand-red text-white text-xs rounded-full font-semibold">Nuevo</span>
                    )}
                  </div>
                  <p className="text-brand-dark/50 text-xs truncate font-body">{msg.email}</p>
                </div>

                {/* Date & delete */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-brand-dark/30 text-xs hidden sm:flex items-center gap-1 font-body">
                    <Clock size={12} /> {fmt(msg.created_at)}
                  </span>
                  <button
                    onClick={e => { e.stopPropagation(); deleteMsg(msg.id) }}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              {/* Expanded content */}
              {expanded === msg.id && (
                <div className="px-5 pb-5 border-t border-gray-100 pt-4 space-y-3">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs font-semibold text-brand-dark/40 uppercase tracking-wide mb-1">Email</p>
                      <a href={`mailto:${msg.email}`} className="text-brand-red text-sm hover:underline font-body">{msg.email}</a>
                    </div>
                    {msg.phone && (
                      <div>
                        <p className="text-xs font-semibold text-brand-dark/40 uppercase tracking-wide mb-1">Teléfono</p>
                        <a href={`tel:${msg.phone}`} className="text-brand-dark text-sm font-body flex items-center gap-1">
                          <Phone size={13} />{msg.phone}
                        </a>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-brand-dark/40 uppercase tracking-wide mb-2">Mensaje</p>
                    <p className="text-brand-dark text-sm leading-relaxed font-body bg-gray-50 rounded-xl p-4 whitespace-pre-wrap">
                      {msg.message}
                    </p>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <a
                      href={`mailto:${msg.email}?subject=Re: Tu mensaje en Clemmie`}
                      className="flex items-center gap-2 px-4 py-2 bg-brand-red text-white rounded-xl text-sm font-semibold hover:bg-brand-coral transition-colors"
                    >
                      <Mail size={14} /> Responder
                    </a>
                    {msg.phone && (
                      <a
                        href={`https://wa.me/${msg.phone.replace(/\D/g,'')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl text-sm font-semibold hover:bg-green-600 transition-colors"
                      >
                        <Phone size={14} /> WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
