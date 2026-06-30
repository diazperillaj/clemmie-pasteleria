import type { SiteConfig } from '../lib/supabase'

interface Props { config: SiteConfig | null }

export default function Footer({ config: _config }: Props) {
  return (
    <footer className="bg-[#E20530] py-20">
      <div className="max-w-5xl mx-auto px-6 flex flex-col items-center justify-center gap-6 text-center">
        <img
          src="/logos/clemmie_logo.png"
          alt="Clemmie"
          className="h-16 w-auto brightness-0 invert"
        />
        <p className="text-white/70 text-base font-body max-w-sm">
          Pastelería artesanal hecha con amor.
        </p>
        <p className="text-white/50 text-sm font-body">
          © {new Date().getFullYear()} Clemmie Pastelería. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  )
}
