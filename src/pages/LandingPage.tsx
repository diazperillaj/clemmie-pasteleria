import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import ProductCarousel from '../components/ProductCarousel'
import Gallery from '../components/Gallery'
import AboutUs from '../components/AboutUs'
import Contact from '../components/Contact'
import Footer from '../components/Footer'
import { useSiteConfig, useProducts, useGallery } from '../hooks'

export default function LandingPage() {
  const { config, loading: configLoading } = useSiteConfig()
  const { products, loading: productsLoading } = useProducts(true) // featured only
  const { images, loading: galleryLoading } = useGallery()

  return (
    <div className="font-body bg-brand-cream">
      <Navbar />
      <Hero config={configLoading ? null : config} />
      <ProductCarousel products={products} loading={productsLoading} />
      <Gallery images={images} loading={galleryLoading} />
      <AboutUs config={config} />
      <Contact config={config} />
      <Footer config={config} />
    </div>
  )
}
