import type { SiteConfig } from '../lib/supabase'

interface Props {
  config: SiteConfig | null
}

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1612809077096-e4e3c5f31929?w=1800&q=80'

export default function Hero({ config }: Props) {
  const heroImg = config?.hero_image_url || FALLBACK_IMG

  const whatsappNumber = config?.whatsapp_number?.replace(/\D/g, '') ?? ''
  const whatsappHref = whatsappNumber ? `https://wa.me/${whatsappNumber}` : '#contacto'

  return (
    <section className="relative h-screen min-h-[600px] overflow-hidden">
      {/* <img
        src={heroImg}
        alt="Hero"
        className="absolute inset-0 w-full h-full object-cover"
      /> */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Buttons at 3/4 from top — gap between them is the center point */}
      <div className="absolute left-1/2 top-3/4 -translate-x-1/2 -translate-y-1/2 flex gap-4">
        <button
          onClick={() => document.querySelector('#productos')?.scrollIntoView({ behavior: 'smooth' })}
          className="w-44 py-2 bg-brand-red border border-brand-red text-white rounded-md text-sm tracking-wide text-center
                     hover:bg-brand-red/90 transition-all duration-300 shadow-md hover:scale-105"
        >
          Ver productos
        </button>

        <a
          href={whatsappHref}
          target={whatsappNumber ? '_blank' : undefined}
          rel="noopener noreferrer"
          className="w-44 py-2 bg-white/70 border border-brand-red text-brand-red rounded-md text-sm tracking-wide text-center
                     hover:bg-brand-red hover:text-white transition-all duration-300 shadow-md hover:scale-105"
        >
          Pedir por WhatsApp
        </a>
      </div>
    </section>
  )
}
