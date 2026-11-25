import { formatCitaDate } from '@/lib/types'
import type { Cliente } from '@/lib/types'

interface Props {
  cliente: Cliente
  esUltimo: boolean
  onVerHistorial: () => void
}

export default function ClienteTableRow({
  cliente,
  esUltimo,
  onVerHistorial,
}: Props) {
  return (
    <div
      className={`grid grid-cols-[1.2fr_1.5fr_1.1fr_80px_130px_110px] gap-3.5
                  px-4 py-3.5 items-center text-13 bg-background-surface
                  ${esUltimo ? '' : 'border-b border-border'}`}
    >
      <span className="font-semibold text-text-main">{cliente.nombre}</span>
      <span className="text-text-muted break-all">{cliente.email}</span>
      <span className="text-text-muted">{cliente.telefono}</span>
      <span className="text-text-muted">{cliente.total_citas}</span>
      <span className="text-text-muted">
        {cliente.ultima_cita ? formatCitaDate(cliente.ultima_cita) : '—'}
      </span>
      <button
        type="button"
        onClick={onVerHistorial}
        className="text-left text-13 font-semibold text-primary hover:underline
                   focus-visible:outline-none focus-visible:ring-2
                   focus-visible:ring-primary rounded-sm"
      >
        Ver historial
      </button>
    </div>
  )
}
