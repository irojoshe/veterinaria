import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/layout/AdminSidebar'
import AdminTopbar from '@/components/layout/AdminTopbar'
import { getSession } from '@/lib/auth/session'

export const metadata: Metadata = {
  title: {
    template: '%s · Admin · Huella Vet',
    default: 'Administración · Huella Vet',
  },
  robots: { index: false, follow: false },
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  if (!session) {
    redirect('/admin/login')
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      {/* Área de trabajo */}
      <div className="flex flex-col flex-1 min-w-0">
        <AdminTopbar />
        <main
          id="admin-main"
          className="flex-1 overflow-y-auto"
          aria-label="Contenido principal de administración"
        >
          {children}
        </main>

        {/* Aviso de datos de ejemplo */}
        <footer className="px-9 py-2 border-t border-border bg-background-surface">
          <p className="text-11 text-text-muted">
            Huella Vet · Datos ilustrativos · Sin conexión a servicios reales
          </p>
        </footer>
      </div>
    </div>
  )
}
