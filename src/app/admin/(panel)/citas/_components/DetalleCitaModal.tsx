import Modal from '@/components/ui/Modal'
import Badge from '@/components/ui/Badge'
import AccionesEstado from './AccionesEstado'
import type { Cita, EstadoCita } from '@/lib/types'

const ESTADO_VARIANT: Record<EstadoCita, 'pending'|'confirmed'|'attended'|'cancelled'> = {
  pendiente:  'pending',
  confirmada: 'confirmed',
  atendida:   'attended',
  cancelada:  'cancelled',
}

interface Props { cita: Cita | null; onClose: () => void }

export default function DetalleCitaModal({ cita, onClose }: Props) {
  if (!cita) return null

  return (
    <Modal
      open={Boolean(cita)}
      onClose={onClose}
      title={`Solicitud ${cita.referencia}`}
      description={`${cita.propietario_nombre} · ${cita.mascota_nombre} · Recibida el ${formatFecha(cita.created_at)}`}
      size="md"
    >
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-2">
          <span className="text-13 text-text-muted">Estado actual:</span>
          <Badge variant={ESTADO_VARIANT[cita.estado]}>
            {capitalizar(cita.estado)}
          </Badge>
        </div>

        <dl className="grid grid-cols-2 gap-x-6 gap-y-3">
          <DataRow label="Mascota"     value={cita.mascota_nombre} />
          <DataRow label="Servicio"    value={cita.servicio_nombre} />
          <DataRow label="Preferencia" value={`${cita.fecha_preferida} · ${cita.hora_preferida}`} />
          <DataRow label="Propietario" value={cita.propietario_nombre} />
          <DataRow label="Teléfono"    value={cita.propietario_telefono} />
          <DataRow label="Email"       value={cita.propietario_email} />
        </dl>

        <div className="flex flex-col gap-1">
          <dt className="text-12 text-text-muted">Motivo</dt>
          <dd className="text-14 text-text-main bg-background rounded-md px-3 py-2.5">
            {cita.motivo}
          </dd>
        </div>

        <AccionesEstado citaId={cita.id} estadoActual={cita.estado} />
      </div>
    </Modal>
  )
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-12 text-text-muted">{label}</dt>
      <dd className="text-13 font-semibold text-text-main">{value}</dd>
    </div>
  )
}

function formatFecha(iso: string) {
  return new Date(iso).toLocaleDateString('es-ES', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

function capitalizar(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}
