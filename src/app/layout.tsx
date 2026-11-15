import type { Metadata } from 'next'
import { DM_Sans } from 'next/font/google'
import { SupabaseProvider } from '@/lib/supabase/provider'
import '@/styles/globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

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
    <html lang="es" className={dmSans.variable}>
      <body>
        <SupabaseProvider>
          {children}
        </SupabaseProvider>
      </body>
    </html>
  )
}
