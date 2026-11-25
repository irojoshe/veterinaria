'use client'

import { useEffect, useMemo, useRef } from 'react'
import Badge, { type BadgeVariant } from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import { formatCitaDate, formatCitaTime } from '@/lib/types'
import type { Cita, Cliente, EstadoCita } from '@/lib/types'

const ESTADO_VARIANT: Record<EstadoCita, BadgeVariant> = {
  pendiente: 'pending',
  confirmada: 'confirmed',
  atendida: 'attended',
  cancelada: 'cancelled',
}

interface Props {
  cliente: Cliente | null
  citas: Cita[]
  onClose: () => void
}

export default function DetalleClienteModal({ cliente, citas, onClose }: Props) {
  const contenidoRef = useRef<HTMLDivElement>(null)
  const email = cliente?.email

  const historial = useMemo(
    () => (email ? citas.filter((cita) => cita.propietario_email === email) : []),
    [citas, email],
  )

  useEffect(() => {
    if (email) contenidoRef.current?.focus()
  }, [email])

  if (!cliente) return null

  return (
    <Modal
      open={Boolean(cliente)}
      onClose={onClose}
      title={cliente.nombre}
      description={cliente.email}
      size="lg"
      className="w-[calc(100vw-2rem)] max-w-2xl [&>div:last-child]:p-4 sm:[&>div:last-child]:p-6"
    >
      <div ref={contenidoRef} tabIndex={-1} className="flex flex-col gap-6 outline-none">
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
          <DataRow label="Email" value={cliente.email} />
          <DataRow label="Teléfono" value={cliente.telefono} />
          <DataRow label="Citas registradas" value={String(cliente.total_citas)} />
          <DataRow
            label="Última cita"
            value={cliente.ultima_cita ? formatCitaDate(cliente.ultima_cita) : '—'}
          />
        </dl>

        <section className="flex flex-col gap-3">
          <h3 className="text-16 font-semibold text-text-heading">Historial de citas</h3>

          {historial.length === 0 ? (
            <p className="text-14 text-text-muted bg-background rounded-md px-4 py-5">
              Sin citas registradas
            </p>
          ) : (
            historial.map((cita) => (
              <article
                key={cita.id}
                className="flex flex-col gap-3 rounded-md border border-border bg-background p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-13 font-semibold text-text-main">
                    {formatCitaDate(cita.fecha)} · {formatCitaTime(cita.hora)}
                  </span>
                  <Badge variant={ESTADO_VARIANT[cita.estado]}>
                    {capitalizar(cita.estado)}
                  </Badge>
                </div>

                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                  <DataRow label="Mascota" value={cita.mascota_nombre} />
                  <DataRow label="Servicio" value={cita.servicios?.nombre ?? '—'} />
                </dl>

                <div className="flex flex-col gap-1">
                  <dt className="text-12 text-text-muted">Motivo</dt>
                  <dd className="text-13 text-text-main">{cita.motivo}</dd>
                </div>
              </article>
            ))
          )}
        </section>
      </div>
    </Modal>
  )
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-12 text-text-muted">{label}</dt>
      <dd className="text-13 font-semibold text-text-main break-words">{value}</dd>
    </div>
  )
}

function capitalizar(valor: string) {
  return valor.charAt(0).toUpperCase() + valor.slice(1)
}
