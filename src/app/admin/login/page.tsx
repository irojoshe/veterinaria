import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import { getSession } from '@/lib/auth/session'
import LoginForm from './_components/LoginForm'

export const metadata: Metadata = {
  title: 'Acceso · Admin · Huella Vet',
  robots: { index: false, follow: false },
}

export default async function LoginPage() {
  // Si ya hay sesión activa, redirige directamente al admin
  const session = await getSession()
  if (session) redirect('/admin')

  return (
    <>
      {/* Columna izquierda — imagen y marca */}
      <div className="hidden lg:flex flex-col gap-9 w-panel-lg shrink-0
                      bg-primary-deeper p-12">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <span className="w-brand-icon h-brand-icon rounded-full bg-background-surface
                           flex items-center justify-center shrink-0">
            <PawIcon className="text-primary w-5 h-5" />
          </span>
          <span className="text-25 font-bold text-background-surface tracking-tight">
            huella vet
          </span>
        </div>

        {/* Imagen */}
        <div className="relative flex-1 rounded-2xl overflow-hidden min-h-0">
          <Image
            src="/images/admin-login.jpg"
            alt="Clínica Huella Vet"
            fill
            className="object-cover"
            priority
            sizes="650px"
          />
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-34 font-medium text-background-surface leading-snug">
            Más tiempo para cuidar.<br />Todo en su lugar.
          </p>
          <p className="text-13 text-border-muted">
            Espacio privado de administración · Huella Vet<br />
            Propuesta con datos de ejemplo.
          </p>
        </div>
      </div>

      {/* Columna derecha — formulario */}
      <div className="flex flex-col justify-center flex-1 px-8 md:px-18 py-12
                      max-w-xl mx-auto w-full">
        <div className="flex flex-col gap-8">
          {/* Encabezado */}
          <div className="flex flex-col gap-3">
            <span className="text-12 font-bold tracking-wide uppercase text-primary">
              Solo administración
            </span>
            <h1 className="text-32 font-semibold text-text-heading">
              Bienvenido de nuevo.
            </h1>
            <p className="text-15 text-text-muted">
              Accede para gestionar las citas y la información de la clínica.
            </p>
          </div>

          {/* Aviso de sesión expirada — informativo */}
          <div className="flex items-start gap-3 p-4 rounded-lg bg-accent-amber-light">
            <span className="text-16 shrink-0" aria-hidden="true">ℹ</span>
            <div className="flex flex-col gap-0.5">
              <p className="text-13 font-semibold text-text-main">
                Acceso no autorizado o sesión expirada
              </p>
              <p className="text-12 text-text-muted">
                Para proteger los datos, vuelve a iniciar sesión con una cuenta autorizada.
                No se ha mostrado información privada.
              </p>
            </div>
          </div>

          {/* Formulario */}
          <LoginForm />
        </div>
      </div>
    </>
  )
}

function PawIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="4" r="2" />
      <circle cx="18" cy="8" r="2" />
      <circle cx="4"  cy="8" r="2" />
      <circle cx="7"  cy="14" r="2" />
      <path d="M12 22c-3.87 0-7-1.57-7-4.5 0-1.5 1.14-2.96 3-3.5
               1.22-.35 2.16-1.09 2.8-2.09.5-.8 1.6-.8 2.1 0
               .64 1 1.58 1.74 2.8 2.09 1.86.54 3 2 3 3.5C19 20.43 15.87 22 12 22z" />
    </svg>
  )
}
