import type { Metadata } from 'next'
import { getServicios } from '@/lib/services/servicios'
import TablaServicios from './_components/TablaServicios'

export const metadata: Metadata = { title: 'Servicios' }

export default async function ServiciosAdminPage() {
  const servicios = await getServicios()
  const publicados = servicios.filter((s) => s.publicado).length

  return (
    <div className="px-9 py-9 flex flex-col gap-6 max-w-page">
      <div className="flex flex-col gap-1">
        <p className="text-13 text-text-muted">Administración / Servicios</p>
        <h1 className="text-32 font-semibold text-text-heading">Servicios</h1>
        <p className="text-15 text-text-muted">
          Organiza la oferta de la clínica y decide qué se muestra en la web.
        </p>
      </div>

      <div className="flex gap-3 flex-wrap">
        <span className="inline-flex items-center px-3 py-1.5 rounded-full
                         text-12 font-semibold bg-accent-green-light text-primary">
          Todos · {servicios.length}
        </span>
        <span className="inline-flex items-center px-3 py-1.5 rounded-full
                         text-12 font-semibold bg-background border border-border text-text-muted">
          Publicados · {publicados}
        </span>
        <span className="inline-flex items-center px-3 py-1.5 rounded-full
                         text-12 font-semibold bg-background border border-border text-text-muted">
          Borradores · {servicios.length - publicados}
        </span>
      </div>

      <TablaServicios servicios={servicios} />

      <p className="text-11 text-text-muted">
        Los borradores no son visibles en la web.
      </p>
    </div>
  )
}
