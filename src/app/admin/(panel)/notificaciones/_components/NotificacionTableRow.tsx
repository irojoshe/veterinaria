import Badge, { type BadgeVariant } from '@/components/ui/Badge'
import type { Notificacion } from '@/lib/types'

const DATE_FORMATTER = new Intl.DateTimeFormat('es-ES', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

interface Props {
  notificacion: Notificacion
  esUltimo: boolean
  mostrarError: boolean
}

export default function NotificacionTableRow({
  notificacion,
  esUltimo,
  mostrarError,
}: Props) {
  const gridTemplateColumns = mostrarError
    ? '1fr 1.5fr 100px 1.4fr 150px minmax(180px, 1.5fr)'
    : '1fr 1.5fr 100px 1.4fr 150px'

  return (
    <div
      className={`grid gap-3.5 px-4 py-3.5 items-center text-13 bg-background-surface
                  ${esUltimo ? '' : 'border-b border-border'}`}
      style={{ gridTemplateColumns }}
    >
      <span className="font-semibold text-text-main">
        {humanizar(notificacion.tipo)}
      </span>
      <span className="text-text-muted break-all">
        {notificacion.destinatario_email}
      </span>
      <Badge variant={estadoVariant(notificacion.estado)}>
        {capitalizar(notificacion.estado)}
      </Badge>
      <span className="text-text-muted">
        {notificacion.citas
          ? `${notificacion.citas.mascota_nombre} · ${notificacion.citas.propietario_nombre}`
          : 'Cita eliminada'}
      </span>
      <span className="text-text-muted whitespace-nowrap">
        {formatCreatedDate(notificacion.created_at)} ·{' '}
        {formatCreatedTime(notificacion.created_at)}
      </span>
      {mostrarError && (
        <span className="text-status-cancelled break-words">
          {notificacion.error}
        </span>
      )}
    </div>
  )
}

function estadoVariant(estado: string): BadgeVariant {
  const normalized = estado.trim().toLowerCase()
  if (normalized === 'enviada') return 'confirmed'
  if (normalized === 'error') return 'cancelled'
  return 'neutral'
}

function formatCreatedDate(value: string): string {
  const [datePart] = value.split('T')
  const [year, month, day] = datePart.split('-').map(Number)

  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
    return value
  }

  return DATE_FORMATTER.format(new Date(year, month - 1, day))
}

function formatCreatedTime(value: string): string {
  const [, timePart] = value.split('T')
  return timePart?.slice(0, 5) ?? '—'
}

function humanizar(valor: string): string {
  return capitalizar(valor.replace(/_/g, ' '))
}

function capitalizar(valor: string): string {
  return valor.charAt(0).toUpperCase() + valor.slice(1)
}
