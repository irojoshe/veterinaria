import type { Metadata } from 'next'
import { getMascotas } from '@/lib/services/mascotas'
import TablaMascotas from './_components/TablaMascotas'

export const metadata: Metadata = { title: 'Mascotas' }

export default async function MascotasAdminPage() {
  const mascotas = await getMascotas()
  const publicas = mascotas.filter((m) => m.publica).length

  return (
    <div className="px-9 py-9 flex flex-col gap-6 max-w-page">
      <div className="flex flex-col gap-1">
        <p className="text-13 text-text-muted">Administración / Mascotas</p>
        <h1 className="text-32 font-semibold text-text-heading">Mascotas</h1>
        <p className="text-15 text-text-muted">
          Datos identificativos y publicaciones autorizadas, en un mismo lugar.
        </p>
      </div>

      <div className="flex gap-3 flex-wrap">
        <span className="inline-flex items-center px-3 py-1.5 rounded-full
                         text-12 font-semibold bg-accent-green-light text-primary">
          Registradas · {mascotas.length}
        </span>
        <span className="inline-flex items-center px-3 py-1.5 rounded-full
                         text-12 font-semibold bg-background border border-border text-text-muted">
          Públicas · {publicas}
        </span>
        <span className="inline-flex items-center px-3 py-1.5 rounded-full
                         text-12 font-semibold bg-background border border-border text-text-muted">
          Privadas · {mascotas.length - publicas}
        </span>
      </div>

      <TablaMascotas mascotas={mascotas} />

      <div className="flex items-start gap-3 p-4 rounded-lg bg-accent-green-light">
        <span className="text-16 shrink-0" aria-hidden="true">✓</span>
        <p className="text-13 text-text-muted">
          Privada por defecto, pública solo con autorización. El propietario y
          sus datos de contacto nunca se publican en la web.
        </p>
      </div>

      <p className="text-11 text-text-muted">Datos de ejemplo · Solo administración</p>
    </div>
  )
}
