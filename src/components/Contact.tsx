import { Instagram, Facebook, MessageCircle } from 'lucide-react'
import type { SiteConfig } from '../lib/supabase'

interface Props { config: SiteConfig | null }

function TikTokIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/>
    </svg>
  )
}

export default function Contact({ config }: Props) {
  const whatsappNumber = config?.whatsapp_number?.replace(/\D/g, '') ?? ''
  const whatsappHref   = whatsappNumber ? `https://wa.me/${whatsappNumber}` : '#'

  const socials = [
    { icon: Instagram,     href: config?.instagram_url || '#', label: 'Instagram' },
    { icon: Facebook,      href: config?.facebook_url  || '#', label: 'Facebook'  },
    { icon: MessageCircle, href: whatsappHref,                 label: 'WhatsApp'  },
    { icon: TikTokIcon,    href: config?.tiktok_url    || '#', label: 'TikTok'    },
  ]

  return (
    <section id="contacto" className="bg-[#e8e8e8]">

      {/* Pide por WhatsApp */}
      <div className="py-16 text-center">
        <h2 className="text-2xl text-brand-dark font-medium mb-8 tracking-widest uppercase">
          Pide por WhatsApp
        </h2>
        <a
          href={whatsappHref}
          target={whatsappNumber ? '_blank' : undefined}
          rel="noopener noreferrer"
          className="inline-block px-6 py-2.5 bg-[#25D366] text-white rounded-md text-sm tracking-wide
                     hover:bg-[#1ebe5d] transition-all duration-200 shadow-sm hover:scale-105"
        >
          Hacer un pedido
        </a>
      </div>

      {/* Síguenos en nuestras redes — 2×2 grid */}
      <div className="max-w-5xl mx-auto px-6 pb-16">

        {/* Row 1: full-width title */}
        <h3 className="text-2xl text-brand-dark text-center mb-8 tracking-widest uppercase">
          Síguenos en nuestras redes
        </h3>

        {/* Row 2: two columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">

          {/* Col 1: description (left-aligned, unchanged) */}
          <div>
            <p className="text-brand-dark/65 text-sm leading-relaxed tracking-wide">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
              ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
              fugiat nulla pariatur.
            </p>
          </div>

          {/* Col 2: social icons — icon on the right, everything right-aligned */}
          <div className="flex flex-col gap-3 items-end">
            {socials.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 group"
              >
                <span className="text-sm text-brand-dark/65 tracking-wide group-hover:text-brand-red transition-colors duration-200">
                  {label}
                </span>
                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-brand-dark
                                group-hover:bg-brand-red group-hover:text-white transition-all duration-200 shadow-sm flex-shrink-0">
                  <Icon size={18} />
                </div>
              </a>
            ))}
          </div>

        </div>
      </div>

    </section>
  )
}
