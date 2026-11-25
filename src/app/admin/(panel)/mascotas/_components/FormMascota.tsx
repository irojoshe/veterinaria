'use client'

import { useActionState, useEffect, useState, useTransition } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import SubirFoto from '@/components/admin/SubirFoto'
import CamposMascota, { type CamposMascotaValues } from './CamposMascota'
import { guardarMascota } from '../actions'
import { mascotaSchema } from '@/lib/validations/mascota'
import type { Mascota } from '@/lib/types'

const ESPECIES = ['Perro', 'Gato', 'Conejo', 'Ave', 'Otro']

interface Props { mascota?: Mascota; onSuccess: () => void }

interface FormState {
  nombre: string
  especie: string
  raza: string
  publicado: string
  foto_url: string
  imagekit_file_id: string
  sexo: string
  fecha_nacimiento: string
  precio: number
  historia: string
  estado_adopcion: string
  vacunado: boolean
  esterilizado: boolean
  microchip: boolean
  compatible_ninos: boolean
  compatible_mascotas: boolean
}

export default function FormMascota({ mascota, onSuccess }: Props) {
  const [state, formAction, isPending] = useActionState(guardarMascota, null)
  const [form, setForm] = useState<FormState>({
    nombre: mascota?.nombre ?? '',
    especie: mascota?.especie ?? '',
    raza: mascota?.raza ?? '',
    publicado: mascota?.publicado ? 'true' : 'false',
    foto_url: mascota?.foto_url ?? '',
    imagekit_file_id: mascota?.imagekit_file_id ?? '',
    sexo: mascota?.sexo ?? '',
    fecha_nacimiento: mascota?.fecha_nacimiento ?? '',
    precio: mascota?.precio ?? 0,
    historia: mascota?.historia ?? '',
    estado_adopcion: mascota?.estado_adopcion ?? 'disponible',
    vacunado: mascota?.vacunado ?? true,
    esterilizado: mascota?.esterilizado ?? false,
    microchip: mascota?.microchip ?? true,
    compatible_ninos: mascota?.compatible_ninos ?? true,
    compatible_mascotas: mascota?.compatible_mascotas ?? true,
  })
  const [isUploading, setIsUploading] = useState(false)
  const [eliminarFoto, setEliminarFoto] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isPendingTransition, startTransition] = useTransition()

  useEffect(() => {
    if (state?.success) onSuccess()
  }, [state, onSuccess])

  const update = (field: keyof FormState, value: string | number | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => {
      if (!prev[field]) return prev
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  const camposValues: CamposMascotaValues = {
    sexo: form.sexo,
    fecha_nacimiento: form.fecha_nacimiento,
    precio: form.precio,
    historia: form.historia,
    estado_adopcion: form.estado_adopcion,
    vacunado: form.vacunado,
    esterilizado: form.esterilizado,
    microchip: form.microchip,
    compatible_ninos: form.compatible_ninos,
    compatible_mascotas: form.compatible_mascotas,
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const parsed = mascotaSchema.safeParse({
      id: mascota?.id,
      nombre: form.nombre,
      especie: form.especie,
      raza: form.raza,
      publicado: form.publicado === 'true',
      foto_url: form.foto_url,
      imagekit_file_id: form.imagekit_file_id || null,
      sexo: form.sexo,
      fecha_nacimiento: form.fecha_nacimiento,
      precio: form.precio,
      historia: form.historia || null,
      estado_adopcion: form.estado_adopcion,
      vacunado: form.vacunado,
      esterilizado: form.esterilizado,
      microchip: form.microchip,
      compatible_ninos: form.compatible_ninos,
      compatible_mascotas: form.compatible_mascotas,
    })
    if (!parsed.success) {
      const flat = parsed.error.flatten().fieldErrors
      const next: Record<string, string> = {}
      for (const [k, v] of Object.entries(flat)) {
        if (v && v.length) next[k] = v[0]
      }
      setErrors(next)
      return
    }
    setErrors({})
    startTransition(() => {
      formAction(new FormData(e.currentTarget))
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {mascota?.id && <input type="hidden" name="id" value={mascota.id} />}
      <input type="hidden" name="foto_url" value={form.foto_url} readOnly />
      <input type="hidden" name="imagekit_file_id" value={form.imagekit_file_id} readOnly />
      <input type="hidden" name="eliminar_foto" value={eliminarFoto ? 'true' : 'false'} readOnly />

      <Input
        label="Nombre *"
        name="nombre"
        value={form.nombre}
        onChange={(e) => update('nombre', e.target.value)}
        error={errors.nombre}
        required
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-13 font-semibold text-text-main">Especie *</label>
          <select
            name="especie"
            value={form.especie}
            onChange={(e) => update('especie', e.target.value)}
            className="h-btn px-3.5 rounded-md text-14 text-text-main
                       bg-background-surface border border-border outline-none
                       focus:ring-2 focus:ring-primary"
          >
            <option value="">Selecciona</option>
            {ESPECIES.map((e) => (
              <option key={e} value={e}>{e}</option>
            ))}
          </select>
          {errors.especie && (
            <p className="text-12 text-status-cancelled">{errors.especie}</p>
          )}
        </div>
        <Input
          label="Raza"
          name="raza"
          placeholder="Ej. Golden retriever"
          value={form.raza}
          onChange={(e) => update('raza', e.target.value)}
          error={errors.raza}
        />
      </div>

      <CamposMascota
        values={camposValues}
        onChange={(field, value) => update(field as keyof FormState, value)}
        errors={errors}
      />

      <SubirFoto
        label="Foto de la mascota"
        currentUrl={form.foto_url}
        onUploaded={(url, fileId) => {
          update('foto_url', url)
          update('imagekit_file_id', fileId)
        }}
        onUploadingChange={setIsUploading}
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-13 font-semibold text-text-main">Visibilidad</label>
        <select
          name="publicado"
          value={form.publicado}
          onChange={(e) => update('publicado', e.target.value)}
          className="h-btn px-3.5 rounded-md text-14 text-text-main
                     bg-background-surface border border-border outline-none
                     focus:ring-2 focus:ring-primary"
        >
          <option value="false">Privada</option>
          <option value="true">Pública (autorizada)</option>
        </select>
      </div>

      {state && !state.success && !Object.keys(errors).length && (
        <p role="alert" className="text-12 text-status-cancelled">{state.error}</p>
      )}

      <div className="flex gap-3 pt-2 border-t border-border">
        <Button
          type="submit"
          loading={isPending || isPendingTransition || isUploading}
          disabled={isPending || isPendingTransition || isUploading}
        >
          {isUploading
            ? 'Subiendo foto...'
            : mascota
              ? 'Guardar cambios'
              : 'Crear mascota'}
        </Button>
      </div>
    </form>
  )
}
