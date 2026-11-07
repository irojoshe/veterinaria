import type { Metadata } from 'next'
import { SupabaseProvider } from '@/lib/supabase/provider'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: {
    template: '%s · Huella Vet',
    default: 'Huella Vet — Clínica veterinaria cercana',
  },
  description:
    'Atención veterinaria cercana, tiempo para escuchar y cuidado en cada etapa de su vida.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        <SupabaseProvider>
          {children}
        </SupabaseProvider>
      </body>
    </html>
  )
}
