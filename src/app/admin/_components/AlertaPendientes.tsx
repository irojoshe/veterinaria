import Link from 'next/link'
import Button from '@/components/ui/Button'
import { getResumenEstadisticas } from '@/lib/services/dashboard'

export default async function AlertaPendientes() {
  const stats = await getResumenEstadisticas()

  if (stats.pendientes_revision === 0) return null

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center
                    justify-between gap-4 bg-background-surface border border-border
                    rounded-lg p-5">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full
                           text-12 font-semibold bg-status-pending-bg text-status-pending">
            {stats.pendientes_revision} solicitudes pendientes
          </span>
        </div>
        <p className="text-14 text-text-muted">
          La solicitud de Lucía para Luna espera confirmación para el 18 nov a las 10:30.
        </p>
      </div>
      <Button asChild size="sm" variant="primary">
        <Link href="/admin/citas?estado=pendiente">Revisar solicitudes</Link>
      </Button>
    </div>
  )
}
