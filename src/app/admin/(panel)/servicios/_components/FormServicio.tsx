'use client'

import { useActionState, useEffect } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { guardarServicio } from '../actions'
import type { Servicio } from '@/lib/types'

interface Props {
  servicio?: Servicio
  onSuccess: () => void
}

export default function FormServicio({ servicio, onSuccess }: Props) {
  const [state, formAction, isPending] = useActionState(guardarServicio, null)

  useEffect(() => {
    if (state?.success) onSuccess()
  }, [state, onSuccess])

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {servicio?.id && <input type="hidden" name="id" value={servicio.id} />}

      <Input
        label="Nombre del servicio *"
        name="nombre"
        defaultValue={servicio?.nombre}
        error={state?.error}
        required
      />
      <div className="flex flex-col gap-1.5">
        <label className="text-13 font-semibold text-text-main">Descripción *</label>
        <textarea
          name="descripcion"
          rows={3}
          defaultValue={servicio?.descripcion}
          className="w-full px-3.5 py-3.5 rounded-md text-14 text-text-main
                     bg-background-surface border border-border outline-none resize-none
                     focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Precio (€) *"
          name="precio"
          type="number"
          min="0"
          step="0.01"
          defaultValue={servicio?.precio}
          required
        />
        <Input
          label="Duración (min) *"
          name="duracion_minutos"
          type="number"
          min="1"
          defaultValue={servicio?.duracion_minutos}
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-13 font-semibold text-text-main">Estado de publicación</label>
        <select
          name="publicado"
          defaultValue={servicio?.publicado ? 'true' : 'false'}
          className="h-btn px-3.5 rounded-md text-14 text-text-main
                     bg-background-surface border border-border outline-none
                     focus:ring-2 focus:ring-primary"
        >
          <option value="true">Publicado</option>
          <option value="false">Borrador</option>
        </select>
      </div>

      {state && !state.success && (
        <p role="alert" className="text-12 text-status-cancelled">{state.error}</p>
      )}

      <div className="flex gap-3 pt-2 border-t border-border">
        <Button type="submit" loading={isPending} disabled={isPending}>
          {servicio ? 'Guardar cambios' : 'Crear servicio'}
        </Button>
      </div>
    </form>
  )
}
