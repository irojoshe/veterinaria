import Link from 'next/link'
import Button from '@/components/ui/Button'
import { getCitasHoy, getResumenEstadisticas } from '@/lib/services/dashboard'
import { formatCitaTime } from '@/lib/types'

export default async function AlertaPendientes() {
  const [stats, citas] = await Promise.all([
    getResumenEstadisticas(),
    getCitasHoy(),
  ])
  const pendingCita = citas.find((cita) => cita.estado === 'pendiente')
  const hasPending = stats.pendientes_revision > 0

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center
                    justify-between gap-4 bg-background-surface border border-border
                    rounded-lg p-5">
      <div className="flex flex-col gap-1">
        {hasPending && (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full
                             text-12 font-semibold bg-status-pending-bg text-status-pending">
              {stats.pendientes_revision} solicitudes pendientes
            </span>
          </div>
        )}
        <p className="text-14 text-text-muted">
          {pendingCita
            ? `La solicitud de ${pendingCita.mascota_nombre} para ${pendingCita.propietario_nombre} espera confirmación hoy a las ${formatCitaTime(pendingCita.hora)}.`
            : 'Sin citas pendientes por revisar'}
        </p>
      </div>
      {hasPending && (
        <Button asChild size="sm" variant="primary">
          <Link href="/admin/citas?estado=pendiente">Revisar solicitudes</Link>
        </Button>
      )}
    </div>
  )
}
