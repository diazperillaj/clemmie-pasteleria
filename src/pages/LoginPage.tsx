import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { supabase } from '../lib/supabase'
import { Lock, Mail, Eye, EyeOff, AlertCircle } from 'lucide-react'

// ─── Validation schema ────────────────────────────────────────────────────────
// Strong validation to prevent injection and ensure safe inputs
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El correo es requerido')
    .max(120, 'Correo demasiado largo')
    .email('Correo inválido')
    // Block SQL injection patterns
    .refine((v) => !/['";\\<>]/.test(v), 'Caracteres no permitidos'),
  password: z
    .string()
    .min(6, 'Mínimo 6 caracteres')
    .max(72, 'Contraseña demasiado larga')
    // Block common injection chars
    .refine((v) => !/[<>\\]/.test(v), 'Caracteres no permitidos'),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const navigate = useNavigate()
  const [showPw, setShowPw] = useState(false)
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async ({ email, password }: LoginForm) => {
    setServerError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setServerError('Credenciales incorrectas. Verifica tu email y contraseña.')
      return
    }
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-soft via-brand-cream to-brand-blush/30 flex items-center justify-center p-5">
      {/* Background decorations */}
      <div className="fixed top-0 right-0 w-96 h-96 rounded-full bg-brand-blush/30 blur-3xl -z-10 animate-float" />
      <div className="fixed bottom-0 left-0 w-72 h-72 rounded-full bg-brand-rose/20 blur-3xl -z-10 animate-float [animation-delay:3s]" />

      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl font-black text-brand-dark">
            Clemmie
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-coral ml-0.5 mb-2 align-middle" />
          </h1>
          <p className="text-brand-dark/50 text-sm font-body mt-1">Panel de administración</p>
        </div>

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl shadow-brand-blush/30 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-brand-soft flex items-center justify-center">
              <Lock size={18} className="text-brand-red" />
            </div>
            <div>
              <h2 className="font-display font-bold text-xl text-brand-dark">Iniciar sesión</h2>
              <p className="text-brand-dark/40 text-xs font-body">Solo personal autorizado</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-brand-dark/60 uppercase tracking-wide mb-1.5">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-dark/30" />
                <input
                  {...register('email')}
                  type="email"
                  autoComplete="email"
                  placeholder="admin@clemmie.co"
                  className={`w-full pl-10 pr-4 py-3.5 rounded-xl border text-sm font-body text-brand-dark
                              placeholder:text-brand-dark/30 bg-white focus:outline-none focus:ring-2 focus:ring-brand-red/30
                              transition-all duration-200
                              ${errors.email ? 'border-red-400' : 'border-brand-blush/60 hover:border-brand-rose'}`}
                />
              </div>
              {errors.email && (
                <p className="flex items-center gap-1 text-red-500 text-xs mt-1">
                  <AlertCircle size={11} /> {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-brand-dark/60 uppercase tracking-wide mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-dark/30" />
                <input
                  {...register('password')}
                  type={showPw ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-11 py-3.5 rounded-xl border text-sm font-body text-brand-dark
                              placeholder:text-brand-dark/30 bg-white focus:outline-none focus:ring-2 focus:ring-brand-red/30
                              transition-all duration-200
                              ${errors.password ? 'border-red-400' : 'border-brand-blush/60 hover:border-brand-rose'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-dark/30 hover:text-brand-dark transition-colors"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="flex items-center gap-1 text-red-500 text-xs mt-1">
                  <AlertCircle size={11} /> {errors.password.message}
                </p>
              )}
            </div>

            {serverError && (
              <div className="flex items-center gap-2 p-3 bg-red-50 rounded-xl text-red-600 text-sm">
                <AlertCircle size={16} className="flex-shrink-0" />
                {serverError}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-brand-red text-white rounded-xl font-semibold text-sm
                         hover:bg-brand-coral transition-all duration-300 shadow-lg shadow-brand-red/30
                         hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100
                         flex items-center justify-center gap-2 mt-2"
            >
              {isSubmitting
                ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                : <Lock size={15} />
              }
              {isSubmitting ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>
        </div>

        <p className="text-center text-brand-dark/30 text-xs font-body mt-6">
          ¿Problemas para ingresar? Contacta al administrador del sistema.
        </p>
      </div>
    </div>
  )
}
