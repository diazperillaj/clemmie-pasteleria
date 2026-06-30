import type { SiteConfig } from '../lib/supabase'

interface Props {
  config: SiteConfig | null
}

export default function AboutUs({ config: _config }: Props) {
  return (
    <section id="nosotros" className="py-16 bg-[#D9D9D9]">
      <div className="max-w-5xl mx-auto px-6">

        {/* Title */}
        <h2 className="text-3xl font-medium text-brand-dark text-center mb-10">
          Aprende con Nosotros
        </h2>

        {/* Top row: YouTube + Patreon */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-0 my-24">

          {/* YouTube */}
          <div className="relative overflow-hidden rounded-xl shadow-md" style={{ aspectRatio: '16/9' }}>
            <img
              src="https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800&q=80"
              alt="Canal de YouTube"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="#E20530" className="w-6 h-6 ml-0.5">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
            <div className="absolute bottom-3 right-3">
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-1.5 bg-brand-red text-white rounded-md text-xs tracking-wide
                           hover:bg-brand-red/90 transition-all duration-200 shadow-md"
              >
                Ir a YouTube
              </a>
            </div>
          </div>

          {/* Patreon */}
          <div className="relative overflow-hidden rounded-xl shadow-md" style={{ aspectRatio: '16/9' }}>
            <img
              src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80"
              alt="Patreon"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/10" />
            <div className="absolute bottom-3 right-3">
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-1.5 bg-brand-red text-white rounded-md text-xs tracking-wide
                           hover:bg-brand-red/90 transition-all duration-200 shadow-md"
              >
                Hacerse mecena
              </a>
            </div>
          </div>
        </div>

        {/* Description — 150% more vertical padding */}
        <div className="py-16">
          <p className="text-brand-dark/65 text-sm leading-relaxed tracking-wide">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
            ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
            fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
            mollit anim id est laborum.
          </p>
        </div>

      </div>
    </section>
  )
}
