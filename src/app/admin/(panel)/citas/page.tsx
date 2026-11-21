import type { Metadata } from 'next'
import { getCitas } from '@/lib/services/citas'
import TablaCitas from './_components/TablaCitas'

export const metadata: Metadata = { title: 'Citas' }

export default async function CitasAdminPage() {
  const citas = await getCitas()

  const pendientes = citas.filter((c) => c.estado === 'pendiente').length

  return (
    <div className="px-9 py-9 flex flex-col gap-6 max-w-page">
      {/* Encabezado */}
      <div className="flex flex-col gap-1">
        <p className="text-13 text-text-muted">Administración / Citas</p>
        <h1 className="text-32 font-semibold text-text-heading">Citas</h1>
        <p className="text-15 text-text-muted">
          Revisa solicitudes y gestiona las visitas de la clínica.
        </p>
      </div>

      {/* Resumen rápido */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="inline-flex items-center px-3 py-1.5 rounded-full
                         text-12 font-semibold bg-accent-green-light text-primary">
          {citas.length} citas
        </span>
        {pendientes > 0 && (
          <span className="inline-flex items-center px-3 py-1.5 rounded-full
                           text-12 font-semibold bg-status-pending-bg text-status-pending">
            {pendientes} pendientes
          </span>
        )}
      </div>

      {/* Tabla con filtros y modal — Client Component */}
      <TablaCitas citas={citas} />

      {/* Aviso */}
      <div className="flex items-start gap-3 p-4 rounded-lg
                      bg-accent-green-light">
        <span className="text-16 shrink-0" aria-hidden="true">✓</span>
        <div className="flex flex-col gap-1">
          <p className="text-13 font-semibold text-text-main">
            Una solicitud pendiente no es una cita confirmada
          </p>
          <p className="text-12 text-text-muted">
            Al cambiar estado, revisa el aviso al cliente antes de guardar.
            Puedes consultar los envíos desde el detalle de cada cita.
          </p>
        </div>
      </div>

      <p className="text-11 text-text-muted">
        Datos de ejemplo · Solo administración
      </p>
    </div>
  )
}
