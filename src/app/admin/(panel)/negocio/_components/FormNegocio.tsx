'use client'

import { useActionState, useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { actualizarNegocio, type ActionResult } from '../actions'
import type { Negocio } from '@/lib/types'

interface Props {
  negocio: Negocio
}

export default function FormNegocio({ negocio }: Props) {
  const [state, formAction, isPending] = useActionState<ActionResult | null, FormData>(
    actualizarNegocio,
    null,
  )
  const [guardado, setGuardado] = useState(false)

  useEffect(() => {
    if (state?.success) setGuardado(true)
    if (state && !state.success) setGuardado(false)
  }, [state])

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <Input
        label="Nombre de la clínica *"
        name="nombre"
        defaultValue={negocio.nombre}
        required
      />

      <TextareaField
        id="descripcion-negocio"
        label="Descripción *"
        name="descripcion"
        defaultValue={negocio.descripcion}
        rows={4}
      />

      <TextareaField
        id="horario-negocio"
        label="Horario *"
        name="horario"
        defaultValue={negocio.horario}
        rows={3}
        helperText="Incluye el horario de cada día en una sola línea."
      />

      <TextareaField
        id="direccion-negocio"
        label="Dirección *"
        name="direccion"
        defaultValue={negocio.direccion}
        rows={2}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Teléfono *"
          name="telefono"
          type="tel"
          defaultValue={negocio.telefono}
          required
        />
        <Input
          label="Email *"
          name="email"
          type="email"
          defaultValue={negocio.email}
          required
        />
        <Input
          label="WhatsApp (opcional)"
          name="whatsapp"
          type="tel"
          defaultValue={negocio.whatsapp ?? ''}
        />
        <Input
          label="URL del mapa (opcional)"
          name="mapa_url"
          type="url"
          placeholder="https://maps.google.com/..."
          defaultValue={negocio.mapa_url ?? ''}
        />
      </div>

      {state && !state.success && (
        <p role="alert" className="text-12 text-status-cancelled">
          {state.error}
        </p>
      )}

      {guardado && (
        <p role="status" className="text-12 text-status-confirmed">
          La información de la clínica se actualizó correctamente.
        </p>
      )}

      <div className="flex gap-3 pt-2 border-t border-border">
        <Button type="submit" loading={isPending} disabled={isPending}>
          Guardar cambios
        </Button>
      </div>
    </form>
  )
}

function TextareaField({
  id,
  label,
  name,
  defaultValue,
  rows,
  helperText,
}: {
  id: string
  label: string
  name: string
  defaultValue: string
  rows: number
  helperText?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-13 font-semibold text-text-main">
        {label}
      </label>
      <textarea
        id={id}
        name={name}
        rows={rows}
        defaultValue={defaultValue}
        className="w-full px-3.5 py-3 rounded-md text-14 text-text-main
                   bg-background-surface border border-border outline-none resize-y
                   focus:ring-2 focus:ring-primary"
      />
      {helperText && <p className="text-11 text-text-muted">{helperText}</p>}
    </div>
  )
}
