import { useState, useEffect } from 'react'
import { supabase, type SiteConfig, type Product, type GalleryImage } from '../lib/supabase'

// ─── useSiteConfig ────────────────────────────────────────────────────────────
export function useSiteConfig() {
  const [config, setConfig] = useState<SiteConfig | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from('site_config')
        .select('*')
        .limit(1)
        .single()
      setConfig(data)
      setLoading(false)
    }
    fetch()
  }, [])

  return { config, loading }
}

// ─── useProducts ─────────────────────────────────────────────────────────────
export function useProducts(featuredOnly = false) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      let query = supabase
        .from('products')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: false })

      if (featuredOnly) query = query.eq('featured', true)

      const { data } = await query
      setProducts(data ?? [])
      setLoading(false)
    }
    fetch()
  }, [featuredOnly])

  return { products, loading, setProducts }
}

// ─── useGallery ───────────────────────────────────────────────────────────────
export function useGallery() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from('gallery_images')
        .select('*')
        .eq('active', true)
        .order('sort_order', { ascending: true })
      setImages(data ?? [])
      setLoading(false)
    }
    fetch()
  }, [])

  return { images, loading, setImages }
}

// ─── useScrollDirection ───────────────────────────────────────────────────────
export function useScrollDirection() {
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [lastY, setLastY] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 50)
      setHidden(y > lastY && y > 120)
      setLastY(y)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [lastY])

  return { scrolled, hidden }
}
