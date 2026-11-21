import Badge from '@/components/ui/Badge'
import type { Mascota } from '@/lib/types'

interface Props {
  mascota: Mascota
  esUltimo: boolean
  onEditar: () => void
  onEliminar: () => void
}

export default function MascotaTableRow({
  mascota,
  esUltimo,
  onEditar,
  onEliminar,
}: Props) {
  return (
    <div
      className={`grid grid-cols-[56px_1fr_1fr_1fr_100px_120px] gap-3.5
                  px-4 py-3.5 items-center text-13 bg-background-surface
                  ${esUltimo ? '' : 'border-b border-border'}`}
    >
      <div
        className="w-14 h-photo-sm rounded-lg bg-background-warm shrink-0"
        aria-hidden="true"
      />

      <span className="font-semibold text-text-main">{mascota.nombre}</span>

      <span className="text-text-muted">
        {mascota.especie} · {mascota.raza || '—'}
      </span>

      <span className="text-text-muted">{mascota.propietario ?? '—'}</span>

      <Badge variant={mascota.publica ? 'public' : 'private'}>
        {mascota.publica ? 'Pública' : 'Privada'}
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
