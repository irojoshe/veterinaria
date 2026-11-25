'use client'

import { useActionState } from 'react'
import Button from '@/components/ui/Button'
import { cambiarEstadoCita, type ActionResult } from '../actions'
import type { EstadoCita } from '@/lib/types'

const TRANSICIONES: Record<EstadoCita, EstadoCita[]> = {
  pendiente:  ['confirmada', 'cancelada'],
  confirmada: ['atendida',   'cancelada'],
  atendida:   [],
  cancelada:  [],
}

const LABEL_ACCION: Record<EstadoCita, string> = {
  confirmada: 'Confirmar cita',
  atendida:   'Marcar como atendida',
  cancelada:  'Cancelar cita',
  pendiente:  'Volver a pendiente',
}

interface Props { citaId: string; estadoActual: EstadoCita }

export default function AccionesEstado({ citaId, estadoActual }: Props) {
  const [state, formAction, isPending] = useActionState<ActionResult | null, FormData>(
    cambiarEstadoCita, null
  )

  const acciones = TRANSICIONES[estadoActual]

  if (acciones.length === 0) {
    return (
      <p className="text-13 text-text-muted border-t border-border pt-3">
        Esta cita está en estado final y no puede modificarse.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-3 pt-2 border-t border-border">
      <p className="text-13 text-text-muted">
        Confirma solo después de revisar la disponibilidad.
      </p>
      {state && !state.success && (
        <p role="alert" className="text-12 text-status-cancelled">{state.error}</p>
      )}
      {state?.success && (
        <p role="status" className="text-12 text-status-confirmed">
          Estado actualizado correctamente.
        </p>
      )}
      <div className="flex gap-3 flex-wrap">
        {acciones.map((nuevoEstado) => (
          <form key={nuevoEstado} action={formAction}>
            <input type="hidden" name="id"     value={citaId} />
            <input type="hidden" name="estado" value={nuevoEstado} />
            <Button
              type="submit"
              size="sm"
              variant={nuevoEstado === 'cancelada' ? 'danger' : 'primary'}
              loading={isPending}
              disabled={isPending}
            >
              {LABEL_ACCION[nuevoEstado]}
            </Button>
          </form>
        ))}
      </div>
    </div>
  )
}
