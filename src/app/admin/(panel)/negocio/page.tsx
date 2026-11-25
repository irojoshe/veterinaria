import type { Metadata } from 'next'
import { getNegocio } from '@/lib/services/negocio'
import FormNegocio from './_components/FormNegocio'

export const metadata: Metadata = { title: 'Negocio' }

export default async function NegocioAdminPage() {
  const negocio = await getNegocio()

  return (
    <div className="px-4 py-6 md:px-9 md:py-9 flex flex-col gap-6 max-w-page">
      <div className="flex flex-col gap-1">
        <p className="text-13 text-text-muted">Administración / Negocio</p>
        <h1 className="text-32 font-semibold text-text-heading">Negocio</h1>
        <p className="text-15 text-text-muted">
          Mantén actualizados los datos públicos y los datos de contacto de la clínica.
        </p>
      </div>

      <div className="flex gap-3 flex-wrap">
        <span className="inline-flex items-center px-3 py-1.5 rounded-full
                         text-12 font-semibold bg-accent-green-light text-primary">
          Perfil público · 1
        </span>
        <span className="inline-flex items-center px-3 py-1.5 rounded-full
                         text-12 font-semibold bg-background border border-border text-text-muted">
          Visible en la web
        </span>
      </div>

      <FormNegocio negocio={negocio} />

      <p className="text-11 text-text-muted">
        Los cambios actualizan las páginas públicas que muestran la información de la clínica.
      </p>
    </div>
  )
}
