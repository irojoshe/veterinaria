'use client'

import { useActionState, useEffect } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { guardarMascota } from '../actions'
import type { Mascota } from '@/lib/types'

const ESPECIES = ['Perro', 'Gato', 'Conejo', 'Ave', 'Otro']

interface Props { mascota?: Mascota; onSuccess: () => void }

export default function FormMascota({ mascota, onSuccess }: Props) {
  const [state, formAction, isPending] = useActionState(guardarMascota, null)

  useEffect(() => {
    if (state?.success) onSuccess()
  }, [state, onSuccess])

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {mascota?.id && <input type="hidden" name="id" value={mascota.id} />}

      <Input
        label="Nombre *"
        name="nombre"
        defaultValue={mascota?.nombre}
        required
      />

      <div className="grid grid-cols-2 gap-4">
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

      <Input
        label="Propietario"
        name="propietario"
        placeholder="Nombre del propietario"
        defaultValue={mascota?.propietario}
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-13 font-semibold text-text-main">Visibilidad</label>
        <select
          name="publica"
          defaultValue={mascota?.publica ? 'true' : 'false'}
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
        <Button type="submit" loading={isPending} disabled={isPending}>
          {mascota ? 'Guardar cambios' : 'Crear mascota'}
        </Button>
      </div>
    </form>
  )
}
