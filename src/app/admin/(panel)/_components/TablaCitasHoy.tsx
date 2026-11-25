import Link from 'next/link'
import Badge from '@/components/ui/Badge'
import { getCitasHoy } from '@/lib/services/dashboard'
import { formatCitaDate, formatCitaTime, getCitaReference } from '@/lib/types'
import type { EstadoCita } from '@/lib/types'

const ESTADO_VARIANT: Record<EstadoCita, 'pending' | 'confirmed' | 'attended' | 'cancelled'> = {
  pendiente:  'pending',
  confirmada: 'confirmed',
  atendida:   'attended',
  cancelada:  'cancelled',
}

export default async function TablaCitasHoy() {
  const citas = await getCitasHoy()

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-18 font-semibold text-text-heading">Citas de hoy</h2>
        <Link
          href="/admin/citas"
          className="text-13 font-semibold text-primary hover:underline
                     focus-visible:outline-none focus-visible:ring-2
                     focus-visible:ring-primary rounded-sm"
        >
          Ver todas las citas →
        </Link>
      </div>

      <div className="border border-border rounded-lg overflow-x-auto">
        <div className="min-w-[900px]">
          {/* Cabecera */}
          <div className="grid grid-cols-[1fr_1fr_1fr_auto_auto_auto] gap-3.5
                          px-4 py-3 bg-accent-green-light
                          text-11 font-bold text-text-muted uppercase tracking-wide">
            <span>Fecha / hora</span>
            <span>Propietario / mascota</span>
            <span>Servicio</span>
            <span>Estado</span>
            <span>Referencia</span>
            <span>Acciones</span>
          </div>

          {/* Filas */}
          {citas.map((cita, i) => (
            <div
              key={cita.id}
              className={`grid grid-cols-[1fr_1fr_1fr_auto_auto_auto] gap-3.5
                          px-4 py-3.5 items-center text-13
                          ${i < citas.length - 1 ? 'border-b border-border' : ''}
                          bg-background-surface`}
            >
              <div className="flex flex-col gap-0.5">
                <span className="font-semibold text-text-main">
                  {formatCitaTime(cita.hora)}
                </span>
                <span className="text-12 text-text-muted">
                  {formatCitaDate(cita.fecha)}
                </span>
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
              <Link
                href={`/admin/citas/${cita.id}`}
                className="text-13 font-semibold text-primary hover:underline
                           focus-visible:outline-none focus-visible:ring-2
                           focus-visible:ring-primary rounded-sm whitespace-nowrap"
              >
                Ver / Editar ↗
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
