import { useEffect, useState, type ReactNode } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import {
  LayoutDashboard, Package, ImageIcon, Settings,
  MessageSquare, LogOut, Menu, X, ChevronRight
} from 'lucide-react'

const navItems = [
  { path: '/dashboard',          icon: LayoutDashboard, label: 'Resumen' },
  { path: '/dashboard/productos', icon: Package,         label: 'Productos' },
  { path: '/dashboard/galeria',   icon: ImageIcon,       label: 'Galería' },
  { path: '/dashboard/mensajes',  icon: MessageSquare,   label: 'Mensajes' },
  { path: '/dashboard/ajustes',   icon: Settings,        label: 'Ajustes del sitio' },
]

interface Props { children: ReactNode }

export default function DashboardLayout({ children }: Props) {
  const navigate = useNavigate()
  const location = useLocation()
  const [checking, setChecking] = useState(true)
  const [userEmail, setUserEmail] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) { navigate('/dashboard/login'); return }
      setUserEmail(data.session.user.email ?? '')
      setChecking(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) navigate('/dashboard/login')
    })
    return () => subscription.unsubscribe()
  }, [navigate])

  const logout = async () => {
    await supabase.auth.signOut()
    navigate('/dashboard/login')
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-red/30 border-t-brand-red rounded-full animate-spin" />
      </div>
    )
  }

  const Sidebar = ({ mobile = false }) => (
    <aside className={`${mobile ? 'flex' : 'hidden md:flex'} flex-col h-full bg-brand-dark text-white`}>
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/10">
        <Link to="/" className="font-display text-2xl font-black flex items-baseline gap-0.5">
          Clemmie
          <span className="w-1.5 h-1.5 rounded-full bg-brand-coral mb-1 inline-block" />
        </Link>
        <p className="text-white/30 text-xs font-body mt-0.5">Panel de administración</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ path, icon: Icon, label }) => {
          const active = location.pathname === path
          return (
            <Link
              key={path}
              to={path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group
                ${active
                  ? 'bg-brand-red text-white shadow-lg shadow-brand-red/30'
                  : 'text-white/50 hover:text-white hover:bg-white/10'}`}
            >
              <Icon size={18} />
              {label}
              {active && <ChevronRight size={14} className="ml-auto opacity-70" />}
            </Link>
          )
        })}
      </nav>

      {/* User / logout */}
      <div className="px-3 pb-4 border-t border-white/10 pt-4">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 mb-2">
          <div className="w-8 h-8 rounded-full bg-brand-red/30 flex items-center justify-center text-brand-coral font-bold text-sm">
            {userEmail[0]?.toUpperCase()}
          </div>
          <p className="text-white/60 text-xs truncate font-body flex-1">{userEmail}</p>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/40
                     hover:text-white hover:bg-white/10 transition-all duration-200"
        >
          <LogOut size={17} /> Cerrar sesión
        </button>
      </div>
    </aside>
  )

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Desktop sidebar */}
      <div className="hidden md:block w-60 flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="w-60 flex-shrink-0 h-full">
            <Sidebar mobile />
          </div>
          <div
            className="flex-1 bg-black/50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar (mobile) */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-brand-dark text-white border-b border-white/10">
          <Link to="/" className="font-display text-xl font-black">
            Clemmie<span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-coral mb-1 ml-0.5" />
          </Link>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-5 md:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
