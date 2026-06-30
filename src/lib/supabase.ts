import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ─── Database Types ───────────────────────────────────────────────────────────

export interface SiteConfig {
  id: string
  title: string
  subtitle: string
  hero_image_url: string
  about_title: string
  about_description: string
  about_image_url: string
  instagram_url: string
  facebook_url: string
  tiktok_url: string
  whatsapp_number: string
  email: string
  address: string
  updated_at: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  image_url: string
  category: string
  active: boolean
  featured: boolean
  created_at: string
}

export interface GalleryImage {
  id: string
  image_url: string
  alt_text: string
  sort_order: number
  active: boolean
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  phone: string
  message: string
  read: boolean
  created_at: string
}
