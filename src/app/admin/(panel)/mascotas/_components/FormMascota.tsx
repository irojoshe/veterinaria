'use client'

import { useActionState, useEffect, useState } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import SubirFoto from '@/components/admin/SubirFoto'
import CamposMascota from './CamposMascota'
import { guardarMascota } from '../actions'
import type { Mascota } from '@/lib/types'

const ESPECIES = ['Perro', 'Gato', 'Conejo', 'Ave', 'Otro']

interface Props { mascota?: Mascota; onSuccess: () => void }

export default function FormMascota({ mascota, onSuccess }: Props) {
  const [state, formAction, isPending] = useActionState(guardarMascota, null)
  const [fotoUrl, setFotoUrl] = useState(mascota?.foto_url ?? '')
  const [imagekitFileId, setImagekitFileId] = useState(
    mascota?.imagekit_file_id ?? '',
  )
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    if (state?.success) onSuccess()
  }, [state, onSuccess])

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {mascota?.id && <input type="hidden" name="id" value={mascota.id} />}
      <input type="hidden" name="foto_url" value={fotoUrl} readOnly />
      <input
        type="hidden"
        name="imagekit_file_id"
        value={imagekitFileId}
        readOnly
      />

      <Input
        label="Nombre *"
        name="nombre"
        defaultValue={mascota?.nombre}
        required
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-13 font-semibold text-text-main">Especie *</label>
          <select
            name="especie"
            defaultValue={mascota?.especie ?? ''}
            className="h-btn px-3.5 rounded-md text-14 text-text-main
                       bg-background-surface border border-border outline-none
                       focus:ring-2 focus:ring-primary"
          >
            <option value="">Selecciona</option>
            {ESPECIES.map((e) => (
              <option key={e} value={e}>{e}</option>
            ))}
          </select>
        </div>
        <Input
          label="Raza"
          name="raza"
          placeholder="Ej. Golden retriever"
          defaultValue={mascota?.raza}
        />
      </div>

      <CamposMascota mascota={mascota} />

      <SubirFoto
        label="Foto de la mascota"
        currentUrl={fotoUrl}
        onUploaded={(url, fileId) => {
          setFotoUrl(url)
          setImagekitFileId(fileId)
        }}
        onUploadingChange={setIsUploading}
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-13 font-semibold text-text-main">Visibilidad</label>
        <select
          name="publicado"
          defaultValue={mascota?.publicado ? 'true' : 'false'}
          className="h-btn px-3.5 rounded-md text-14 text-text-main
                     bg-background-surface border border-border outline-none
                     focus:ring-2 focus:ring-primary"
        >
          <option value="false">Privada</option>
          <option value="true">Pública (autorizada)</option>
        </select>
        <p className="text-12 text-text-muted">
          Solo hacer pública con autorización expresa del propietario.
        </p>
      </div>

      {state && !state.success && (
        <p role="alert" className="text-12 text-status-cancelled">{state.error}</p>
      )}

      <div className="flex gap-3 pt-2 border-t border-border">
        <Button
          type="submit"
          loading={isPending}
          disabled={isPending || isUploading}
        >
          {mascota ? 'Guardar cambios' : 'Crear mascota'}
        </Button>
      </div>
    </form>
  )
}
