'use client'

import { useActionState, useState } from 'react'
import Link from 'next/link'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { loginAdmin, type LoginResult } from '../actions'

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState<LoginResult | null, FormData>(
    loginAdmin,
    null
  )
  const [showPassword, setShowPassword] = useState(false)

  return (
    <form
      action={formAction}
      noValidate
      aria-label="Formulario de acceso"
      className="flex flex-col gap-5"
    >
      {/* Error del servidor */}
      {state && !state.success && (
        <div
          role="alert"
          className="flex items-start gap-3 p-4 rounded-lg
                     bg-status-cancelled-bg text-status-cancelled"
        >
          <span className="text-16 shrink-0" aria-hidden="true">⚠</span>
          <div className="flex flex-col gap-0.5">
            <p className="text-13 font-semibold">No pudimos iniciar sesión</p>
            <p className="text-12">{state.error}</p>
          </div>
        </div>
      )}

      <Input
        label="Correo de administrador"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="administracion@huellavet.example"
        required
      />

      {/* Campo contraseña con toggle de visibilidad */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-13 font-semibold text-text-main">
          Contraseña
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            required
            placeholder="••••••••••••"
            className="w-full h-btn pl-3.5 pr-12 rounded-md text-14 text-text-main
                       bg-background-surface border border-border outline-none
                       focus:ring-2 focus:ring-primary placeholder:text-text-muted
                       transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            className="absolute right-3 top-1/2 -translate-y-1/2
                       text-text-muted hover:text-text-main transition-colors
                       focus-visible:outline-none focus-visible:ring-2
                       focus-visible:ring-primary rounded-sm"
          >
            {showPassword ? <IconEyeOff /> : <IconEye />}
          </button>
        </div>
      </div>

      <Button
        type="submit"
        fullWidth
        size="lg"
        loading={isPending}
        disabled={isPending}
      >
        {isPending ? 'Iniciando sesión…' : 'Iniciar sesión'}
      </Button>

      <p className="text-12 text-text-muted text-center">
        No hay registro público de administradores. Si necesitas acceso,
        contacta con la persona responsable de la clínica.
      </p>

      <Link
        href="/"
        className="text-13 text-primary hover:underline text-center
                   focus-visible:outline-none focus-visible:ring-2
                   focus-visible:ring-primary rounded-sm"
      >
        ← Volver al sitio público
      </Link>
    </form>
  )
}

function IconEye() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function IconEyeOff() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8
               a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4
               c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07
               a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  )
}
