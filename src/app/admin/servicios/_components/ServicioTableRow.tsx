import Badge from '@/components/ui/Badge'
import type { Servicio } from '@/lib/types'

interface Props {
  servicio: Servicio
  esUltimo: boolean
  onEditar: () => void
  onEliminar: () => void
}

export default function ServicioTableRow({
  servicio,
  esUltimo,
  onEditar,
  onEliminar,
}: Props) {
  return (
    <div
      className={`grid grid-cols-[64px_1fr_80px_80px_100px_120px] gap-3.5
                  px-4 py-3.5 items-center text-13 bg-background-surface
                  ${esUltimo ? '' : 'border-b border-border'}`}
    >
      <div
        className="w-16 h-12 rounded-md bg-background-warm"
        aria-hidden="true"
      />
      <span className="font-semibold text-text-main">{servicio.nombre}</span>
      <span className="text-text-muted">{servicio.precio} €</span>
      <span className="text-text-muted">{servicio.duracion_minutos} min</span>
      <Badge variant={servicio.publicado ? 'confirmed' : 'neutral'}>
        {servicio.publicado ? 'Publicado' : 'Borrador'}
      </Badge>
      <div className="flex gap-3">
        <button
          onClick={onEditar}
          className="text-13 font-semibold text-primary hover:underline
                     focus-visible:outline-none focus-visible:ring-2
                     focus-visible:ring-primary rounded-sm"
        >
          Editar
        </button>
        <button
          onClick={onEliminar}
          className="text-13 font-semibold text-status-cancelled hover:underline
                     focus-visible:outline-none focus-visible:ring-2
                     focus-visible:ring-status-cancelled rounded-sm"
        >
          Eliminar
        </button>
      </div>
    </div>
  )
}
