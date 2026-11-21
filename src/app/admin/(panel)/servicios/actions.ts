'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { upsertServicio, deleteServicio } from '@/lib/services/servicios'

const servicioSchema = z.object({
  id:          z.string().optional(),
  nombre:      z.string().min(2, 'El nombre es obligatorio.'),
  descripcion: z.string().min(10, 'Añade una descripción.'),
  precio:      z.coerce.number().positive('El precio debe ser mayor que 0.'),
  duracion_minutos: z.coerce.number().int().positive('Indica la duración.'),
  publicado:   z.coerce.boolean(),
})

export interface ActionResult { success: boolean; error?: string }

export async function guardarServicio(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const parsed = servicioSchema.safeParse({
    id:               formData.get('id') || undefined,
    nombre:           formData.get('nombre'),
    descripcion:      formData.get('descripcion'),
    precio:           formData.get('precio'),
    duracion_minutos: formData.get('duracion_minutos'),
    publicado:        formData.get('publicado') === 'true',
  })

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message }
  }

  const result = await upsertServicio({
    ...parsed.data,
    imagen_url: null,
  })

  if (!result.success) return { success: false, error: 'No se pudo guardar el servicio.' }

  revalidatePath('/admin/servicios')
  revalidatePath('/servicios')
  return { success: true }
}

export async function eliminarServicio(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const id = formData.get('id')
  if (!id || typeof id !== 'string') return { success: false, error: 'ID inválido.' }

  const result = await deleteServicio(id)
  if (!result.success) return { success: false, error: 'No se pudo eliminar.' }

  revalidatePath('/admin/servicios')
  revalidatePath('/servicios')
  return { success: true }
}
