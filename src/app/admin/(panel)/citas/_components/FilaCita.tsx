import Badge from '@/components/ui/Badge'
import { formatCitaDate, formatCitaTime, getCitaReference } from '@/lib/types'
import type { Cita, EstadoCita } from '@/lib/types'

const ESTADO_VARIANT: Record<EstadoCita, 'pending'|'confirmed'|'attended'|'cancelled'> = {
  pendiente:  'pending',
  confirmada: 'confirmed',
  atendida:   'attended',
  cancelada:  'cancelled',
}

interface FilaCitaProps {
  cita: Cita
  ultimo: boolean
  onClick: () => void
}

export default function FilaCita({ cita, ultimo, onClick }: FilaCitaProps) {
  return (
    <div
      role="row"
      className={`grid grid-cols-6 gap-3.5 px-4 py-3.5 items-center text-13
                  bg-background-surface cursor-pointer hover:bg-background
                  transition-colors focus-visible:outline-none
                  focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary
                  ${!ultimo ? 'border-b border-border' : ''}`}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      tabIndex={0}
      aria-label={`Ver cita ${getCitaReference(cita.id)}`}
    >
      <div className="flex flex-col gap-0.5">
        <span className="font-semibold text-text-main">{formatCitaTime(cita.hora)}</span>
        <span className="text-12 text-text-muted">{formatCitaDate(cita.fecha)}</span>
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-text-main">{cita.propietario_nombre}</span>
        <span className="text-text-muted">{cita.mascota_nombre}</span>
      </div>
      <span className="text-text-muted">{cita.servicios?.nombre ?? '—'}</span>
      <Badge variant={ESTADO_VARIANT[cita.estado]}>
        {cita.estado.charAt(0).toUpperCase() + cita.estado.slice(1)}
      </Badge>
      <span className="text-text-muted">{getCitaReference(cita.id)}</span>
      <button
        onClick={(e) => { e.stopPropagation(); onClick() }}
        className="text-13 font-semibold text-primary hover:underline text-left
                   focus-visible:outline-none focus-visible:ring-2
                   focus-visible:ring-primary rounded-sm"
        aria-label={`Ver detalle de ${getCitaReference(cita.id)}`}
      >
        Ver / Editar ↗
      </button>
    </div>
  )
}
