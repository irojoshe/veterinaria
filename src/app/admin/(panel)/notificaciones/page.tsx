import type { Metadata } from 'next'
import { getNotificaciones } from '@/lib/services/notificaciones'
import TablaNotificaciones from './_components/TablaNotificaciones'

export const metadata: Metadata = { title: 'Notificaciones' }

export default async function NotificacionesAdminPage() {
  const notificaciones = await getNotificaciones()
  const enviadas = notificaciones.filter(
    (notificacion) => notificacion.estado.trim().toLowerCase() === 'enviada',
  ).length
  const conError = notificaciones.filter(
    (notificacion) => notificacion.estado.trim().toLowerCase() === 'error',
  ).length

  return (
    <div className="px-4 py-6 md:px-9 md:py-9 flex flex-col gap-6 max-w-page">
      <div className="flex flex-col gap-1">
        <p className="text-13 text-text-muted">Administración / Notificaciones</p>
        <h1 className="text-32 font-semibold text-text-heading">Notificaciones</h1>
        <p className="text-15 text-text-muted">
          Revisa los mensajes enviados y los errores registrados por el sistema.
        </p>
      </div>

      <div className="flex gap-3 flex-wrap">
        <span className="inline-flex items-center px-3 py-1.5 rounded-full
                         text-12 font-semibold bg-accent-green-light text-primary">
          Total · {notificaciones.length}
        </span>
        <span className="inline-flex items-center px-3 py-1.5 rounded-full
                         text-12 font-semibold bg-background border border-border text-text-muted">
          Enviadas · {enviadas}
        </span>
        <span className="inline-flex items-center px-3 py-1.5 rounded-full
                         text-12 font-semibold bg-status-cancelled-bg text-status-cancelled">
          Con error · {conError}
        </span>
      </div>

      <TablaNotificaciones notificaciones={notificaciones} />

      <p className="text-11 text-text-muted">
        Los estados y sus conteos se construyen a partir de los datos registrados.
      </p>
    </div>
  )
}
