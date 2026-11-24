'use client'

import { useActionState, useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { actualizarNegocio, type ActionResult } from '../actions'
import SubirFoto from '@/components/admin/SubirFoto'
import TextareaField from './TextareaField'
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
  const [logoUrl, setLogoUrl] = useState(negocio.logo_url ?? '')
  const [imagekitFileId, setImagekitFileId] = useState(
    negocio.imagekit_file_id ?? '',
  )

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

      <input type="hidden" name="logo_url" value={logoUrl} />
      <input type="hidden" name="imagekit_file_id" value={imagekitFileId} />

      <SubirFoto
        label="Logo de la clínica"
        currentUrl={logoUrl}
        onUploaded={(url, fileId) => {
          setLogoUrl(url)
          setImagekitFileId(fileId)
        }}
      />

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
