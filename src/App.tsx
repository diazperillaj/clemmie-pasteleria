import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import DashboardLayout from './pages/DashboardLayout'
import DashboardHome from './pages/DashboardHome'
import DashboardProducts from './pages/DashboardProducts'
import DashboardGallery from './pages/DashboardGallery'
import DashboardMessages from './pages/DashboardMessages'
import DashboardSettings from './pages/DashboardSettings'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth */}
        <Route path="/dashboard/login" element={<LoginPage />} />

        {/* Dashboard (protected inside DashboardLayout) */}
        <Route
          path="/dashboard"
          element={
            <DashboardLayout>
              <DashboardHome />
            </DashboardLayout>
          }
        />
        <Route
          path="/dashboard/productos"
          element={
            <DashboardLayout>
              <DashboardProducts />
            </DashboardLayout>
          }
        />
        <Route
          path="/dashboard/galeria"
          element={
            <DashboardLayout>
              <DashboardGallery />
            </DashboardLayout>
          }
        />
        <Route
          path="/dashboard/mensajes"
          element={
            <DashboardLayout>
              <DashboardMessages />
            </DashboardLayout>
          }
        />
        <Route
          path="/dashboard/ajustes"
          element={
            <DashboardLayout>
              <DashboardSettings />
            </DashboardLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
