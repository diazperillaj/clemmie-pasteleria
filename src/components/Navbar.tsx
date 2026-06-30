import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useScrollDirection, useSiteConfig } from '../hooks'
import { Menu, X } from 'lucide-react'

const links = [
  { href: '#productos', label: 'Productos',           red: false },
  { href: '#galeria',   label: 'Galería',             red: false },
  { href: '#nosotros',  label: 'Aprende con nosotros', red: true  },
]

export default function Navbar() {
  const { scrolled, hidden } = useScrollDirection()
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const isDashboard = location.pathname.startsWith('/dashboard')
  const { config } = useSiteConfig()

  if (isDashboard) return null

  const whatsappNumber = config?.whatsapp_number?.replace(/\D/g, '') ?? ''
  const whatsappHref = whatsappNumber
    ? `https://wa.me/${whatsappNumber}`
    : '#contacto'

  const scrollTo = (id: string) => {
    setOpen(false)
    const el = document.querySelector(id)
    el?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header
      className={[
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        scrolled ? 'bg-white shadow-sm' : 'bg-transparent',
        hidden ? '-translate-y-full' : 'translate-y-0',
      ].join(' ')}
    >
      <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src="/logos/clemmie_logo.png"
            alt="Clemmie"
            className="h-10 w-auto transition-all duration-500"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map(({ href, label }) => (
            <button
              key={href}
              onClick={() => scrollTo(href)}
              className="text-sm font-medium tracking-wide transition-colors duration-300 relative group text-[#e20530] hover:text-[#e20530]/80"
            >
              {label}
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-brand-red transition-all duration-300 group-hover:w-full" />
            </button>
          ))}

          {/* WhatsApp outline button */}
          <a
            href={whatsappHref}
            target={whatsappNumber ? '_blank' : undefined}
            rel="noopener noreferrer"
            className="ml-2 px-5 py-2 rounded-md text-sm font-semibold border-2 border-[#e20530] text-[#e20530]
                       hover:bg-[#e20530] hover:text-white transition-all duration-300 hover:scale-105"
          >
            Pedir por WhatsApp
          </a>
        </nav>

        {/* Mobile menu btn */}
        <button
          className={`md:hidden p-2 rounded-lg transition-colors duration-300 ${scrolled ? 'text-brand-dark' : 'text-white'}`}
          onClick={() => setOpen(!open)}
          aria-label="Menú"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        className={`md:hidden transition-all duration-400 overflow-hidden ${
          open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        } bg-brand-cream/95 backdrop-blur-md border-t border-brand-blush/30`}
      >
        <nav className="px-5 py-4 flex flex-col gap-1">
          {links.map(({ href, label }) => (
            <button
              key={href}
              onClick={() => scrollTo(href)}
              className="text-left py-3 px-2 font-medium hover:bg-brand-soft/50 rounded-lg transition-colors duration-200 text-[#e20530]"
            >
              {label}
            </button>
          ))}
          <a
            href={whatsappHref}
            target={whatsappNumber ? '_blank' : undefined}
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="mt-2 py-3 px-4 border-2 border-[#e20530] text-[#e20530] rounded-full font-semibold
                       text-center hover:bg-[#e20530] hover:text-white transition-colors duration-200"
          >
            Pedir por WhatsApp
          </a>
        </nav>
      </div>
    </header>
  )
}
