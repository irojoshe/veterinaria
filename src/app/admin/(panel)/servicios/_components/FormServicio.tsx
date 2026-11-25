'use client'

import { useActionState, useEffect, useState, useTransition } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import SubirFoto from '@/components/admin/SubirFoto'
import { guardarServicio } from '../actions'
import { servicioSchema } from '@/lib/validations/servicio'
import type { Servicio } from '@/lib/types'

interface Props {
  servicio?: Servicio
  onSuccess: () => void
}

interface FormState {
  nombre: string
  descripcion: string
  precio: string
  duracion_minutos: string
  publicado: string
  imagen_url: string
  imagekit_file_id: string
}

export default function FormServicio({ servicio, onSuccess }: Props) {
  const [state, formAction, isPending] = useActionState(guardarServicio, null)
  const [form, setForm] = useState<FormState>({
    nombre: servicio?.nombre ?? '',
    descripcion: servicio?.descripcion ?? '',
    precio: servicio?.precio != null ? String(servicio.precio) : '',
    duracion_minutos: servicio?.duracion_minutos != null ? String(servicio.duracion_minutos) : '',
    publicado: servicio?.publicado ? 'true' : 'false',
    imagen_url: servicio?.imagen_url ?? '',
    imagekit_file_id: servicio?.imagekit_file_id ?? '',
  })
  const [isUploading, setIsUploading] = useState(false)
  const [eliminarFoto, setEliminarFoto] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isPendingTransition, startTransition] = useTransition()

  useEffect(() => {
    if (state?.success) onSuccess()
  }, [state, onSuccess])

  const update = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => {
      if (!prev[field]) return prev
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const parsed = servicioSchema.safeParse({
      id: servicio?.id,
      nombre: form.nombre,
      descripcion: form.descripcion,
      precio: form.precio,
      duracion_minutos: form.duracion_minutos,
      publicado: form.publicado === 'true',
      imagen_url: form.imagen_url,
      imagekit_file_id: form.imagekit_file_id || null,
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
      {servicio?.id && <input type="hidden" name="id" value={servicio.id} />}
      <input type="hidden" name="imagen_url" value={form.imagen_url} readOnly />
      <input
        type="hidden"
        name="imagekit_file_id"
        value={form.imagekit_file_id}
        readOnly
      />

      <Input
        label="Nombre del servicio *"
        name="nombre"
        value={form.nombre}
        onChange={(e) => update('nombre', e.target.value)}
        error={errors.nombre}
        required
      />
      <div className="flex flex-col gap-1.5">
        <label className="text-13 font-semibold text-text-main">Descripción *</label>
        <textarea
          name="descripcion"
          rows={3}
          value={form.descripcion}
          onChange={(e) => update('descripcion', e.target.value)}
          className="w-full px-3.5 py-3.5 rounded-md text-14 text-text-main
                     bg-background-surface border border-border outline-none resize-none
                     focus:ring-2 focus:ring-primary"
        />
        {errors.descripcion && (
          <p className="text-12 text-status-cancelled">{errors.descripcion}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Precio (€) *"
          name="precio"
          type="number"
          min="0"
          step="0.01"
          value={form.precio}
          onChange={(e) => update('precio', e.target.value)}
          error={errors.precio}
          required
        />
        <Input
          label="Duración (min) *"
          name="duracion_minutos"
          type="number"
          min="1"
          value={form.duracion_minutos}
          onChange={(e) => update('duracion_minutos', e.target.value)}
          error={errors.duracion_minutos}
          required
        />
      </div>

      <SubirFoto
        label="Imagen del servicio"
        currentUrl={form.imagen_url}
        onUploaded={(url, fileId) => {
          update('imagen_url', url)
          update('imagekit_file_id', fileId)
        }}
        onUploadingChange={setIsUploading}
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-13 font-semibold text-text-main">Estado de publicación</label>
        <select
          name="publicado"
          value={form.publicado}
          onChange={(e) => update('publicado', e.target.value)}
          className="h-btn px-3.5 rounded-md text-14 text-text-main
                     bg-background-surface border border-border outline-none
                     focus:ring-2 focus:ring-primary"
        >
          <option value="true">Publicado</option>
          <option value="false">Borrador</option>
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
            : servicio
              ? 'Guardar cambios'
              : 'Crear servicio'}
        </Button>
      </div>
    </form>
  )
}
