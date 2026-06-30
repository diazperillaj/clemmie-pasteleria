import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { supabase, type SiteConfig } from '../lib/supabase'
import { Save, CheckCircle, Upload, AlertCircle } from 'lucide-react'

const schema = z.object({
  title:             z.string().min(1).max(80),
  subtitle:          z.string().max(200).optional(),
  about_title:       z.string().min(1).max(100),
  about_description: z.string().max(2000).optional(),
  instagram_url:     z.string().url('URL inválida').or(z.literal('')).optional(),
  facebook_url:      z.string().url('URL inválida').or(z.literal('')).optional(),
  tiktok_url:        z.string().url('URL inválida').or(z.literal('')).optional(),
  whatsapp_number:   z.string().max(20).optional(),
  email:             z.string().email('Email inválido').or(z.literal('')).optional(),
  address:           z.string().max(200).optional(),
})

type FormData = z.infer<typeof schema>

export default function DashboardSettings() {
  const [config, setConfig]           = useState<SiteConfig | null>(null)
  const [loading, setLoading]         = useState(true)
  const [saved, setSaved]             = useState(false)
  const [heroFile, setHeroFile]       = useState<File | null>(null)
  const [heroPreview, setHeroPreview] = useState('')
  const [aboutFile, setAboutFile]     = useState<File | null>(null)
  const [aboutPreview, setAboutPreview] = useState('')

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('site_config').select('*').limit(1).single()
      setConfig(data)
      if (data) {
        reset({
          title: data.title, subtitle: data.subtitle,
          about_title: data.about_title, about_description: data.about_description,
          instagram_url: data.instagram_url, facebook_url: data.facebook_url,
          tiktok_url: data.tiktok_url, whatsapp_number: data.whatsapp_number,
          email: data.email, address: data.address,
        })
        setHeroPreview(data.hero_image_url)
        setAboutPreview(data.about_image_url)
      }
      setLoading(false)
    }
    load()
  }, [reset])

  const uploadImg = async (file: File, folder: string) => {
    const ext  = file.name.split('.').pop()
    const path = `${folder}/${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('clemmie-images').upload(path, file, { upsert: true })
    if (error) throw error
    return supabase.storage.from('clemmie-images').getPublicUrl(path).data.publicUrl
  }

  const onSubmit = async (data: FormData) => {
    if (!config) return
    let hero_image_url  = config.hero_image_url
    let about_image_url = config.about_image_url
    if (heroFile)  hero_image_url  = await uploadImg(heroFile,  'hero')
    if (aboutFile) about_image_url = await uploadImg(aboutFile, 'about')

    await supabase.from('site_config').update({
      ...data, hero_image_url, about_image_url, updated_at: new Date().toISOString(),
    }).eq('id', config.id)

    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const inputCls = (err?: { message?: string }) =>
    `w-full px-4 py-3 rounded-xl border text-sm font-body text-brand-dark bg-white
     focus:outline-none focus:ring-2 focus:ring-brand-red/30 transition-all duration-200
     ${err ? 'border-red-400' : 'border-gray-200 hover:border-brand-rose/60'}`

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h3 className="font-display font-bold text-lg text-brand-dark mb-4 pb-2 border-b border-gray-100">{children}</h3>
  )

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-2 border-brand-red/30 border-t-brand-red rounded-full animate-spin" />
    </div>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-brand-dark">Ajustes del sitio</h1>
          <p className="text-brand-dark/50 text-sm font-body mt-1">Edita el contenido de la landing page</p>
        </div>
        {saved && (
          <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-xl text-sm font-semibold">
            <CheckCircle size={16} /> Cambios guardados
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        {/* Hero section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <SectionTitle>Sección principal (Hero)</SectionTitle>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-brand-dark/60 uppercase tracking-wide mb-1.5">Título del sitio *</label>
              <input {...register('title')} className={inputCls(errors.title)} placeholder="Clemmie" />
              {errors.title && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={11}/>{errors.title.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-brand-dark/60 uppercase tracking-wide mb-1.5">Subtítulo</label>
              <input {...register('subtitle')} className={inputCls()} placeholder="Dulces momentos, memorias eternas" />
            </div>
            {/* Hero image */}
            <div>
              <label className="block text-xs font-semibold text-brand-dark/60 uppercase tracking-wide mb-2">Imagen de fondo del hero</label>
              <div className="flex gap-3 items-start">
                <div className="w-24 h-16 rounded-xl bg-brand-soft overflow-hidden flex-shrink-0">
                  {heroPreview
                    ? <img src={heroPreview} alt="hero preview" className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-brand-blush">🖼</div>
                  }
                </div>
                <label className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-brand-blush rounded-xl cursor-pointer hover:border-brand-rose hover:bg-brand-soft/20 transition-colors text-sm text-brand-dark/50">
                  <Upload size={16} /> Cambiar imagen
                  <input type="file" accept="image/*" className="hidden" onChange={e => {
                    const f = e.target.files?.[0]; if (!f) return
                    setHeroFile(f); setHeroPreview(URL.createObjectURL(f))
                  }} />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* About section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <SectionTitle>Sección "Sobre nosotros"</SectionTitle>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-brand-dark/60 uppercase tracking-wide mb-1.5">Título *</label>
              <input {...register('about_title')} className={inputCls(errors.about_title)} placeholder="Nuestra historia" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-brand-dark/60 uppercase tracking-wide mb-1.5">Descripción</label>
              <textarea {...register('about_description')} rows={5} className={`${inputCls()} resize-none`}
                placeholder="Cuéntales tu historia a tus clientes..." />
            </div>
            {/* About image */}
            <div>
              <label className="block text-xs font-semibold text-brand-dark/60 uppercase tracking-wide mb-2">Foto de la sección</label>
              <div className="flex gap-3 items-start">
                <div className="w-24 h-16 rounded-xl bg-brand-soft overflow-hidden flex-shrink-0">
                  {aboutPreview
                    ? <img src={aboutPreview} alt="about preview" className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-brand-blush">🖼</div>
                  }
                </div>
                <label className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-brand-blush rounded-xl cursor-pointer hover:border-brand-rose hover:bg-brand-soft/20 transition-colors text-sm text-brand-dark/50">
                  <Upload size={16} /> Cambiar imagen
                  <input type="file" accept="image/*" className="hidden" onChange={e => {
                    const f = e.target.files?.[0]; if (!f) return
                    setAboutFile(f); setAboutPreview(URL.createObjectURL(f))
                  }} />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Contact info */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <SectionTitle>Información de contacto</SectionTitle>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { name: 'whatsapp_number' as const, label: 'WhatsApp',  placeholder: '+57 300 000 0000' },
              { name: 'email'           as const, label: 'Email',     placeholder: 'hola@clemmie.co' },
              { name: 'address'         as const, label: 'Dirección', placeholder: 'Bogotá, Colombia' },
              { name: 'instagram_url'   as const, label: 'Instagram URL', placeholder: 'https://instagram.com/clemmie' },
              { name: 'facebook_url'    as const, label: 'Facebook URL',  placeholder: 'https://facebook.com/clemmie' },
              { name: 'tiktok_url'      as const, label: 'TikTok URL',    placeholder: 'https://tiktok.com/@clemmie' },
            ].map(({ name, label, placeholder }) => (
              <div key={name}>
                <label className="block text-xs font-semibold text-brand-dark/60 uppercase tracking-wide mb-1.5">{label}</label>
                <input {...register(name)} className={inputCls(errors[name])} placeholder={placeholder} />
                {errors[name] && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={11}/>{errors[name]?.message}</p>}
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto px-8 py-4 bg-brand-red text-white rounded-xl font-semibold
                     hover:bg-brand-coral transition-all duration-300 shadow-lg shadow-brand-red/30
                     hover:scale-[1.02] disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {isSubmitting ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <Save size={18} />}
          {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </form>
    </div>
  )
}
