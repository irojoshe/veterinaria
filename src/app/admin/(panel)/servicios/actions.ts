'use server'

import { revalidatePath, updateTag } from 'next/cache'
import { z } from 'zod'
import { getSession } from '@/lib/auth/session'
import { deleteServicio, upsertServicio } from '@/lib/services/servicios'
import type { Servicio } from '@/lib/types'

const optionalUrlSchema = z.union([
  z.literal(''),
  z.string().trim().url('Introduce una URL válida.'),
])

const servicioSchema = z.object({
  id: z.string().optional(),
  nombre: z.string().trim().min(2, 'El nombre es obligatorio.'),
  descripcion: z.string().trim().min(10, 'Añade una descripción.'),
  precio: z.coerce.number().positive('El precio debe ser mayor que 0.'),
  duracion_minutos: z.coerce.number().int().positive('Indica la duración.'),
  publicado: z.boolean(),
  imagen_url: optionalUrlSchema,
  imagekit_file_id: z.string().nullable(),
})

const idSchema = z.object({
  id: z.string().min(1, 'ID inválido.'),
})

export interface ActionResult {
  success: boolean
  error?: string
}

export async function guardarServicio(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const session = await getSession()
  if (!session) {
    return {
      success: false,
      error: 'Tu sesión expiró. Inicia sesión nuevamente para continuar.',
    }
  }

  const parsed = servicioSchema.safeParse({
    id: formData.get('id') || undefined,
    nombre: formData.get('nombre'),
    descripcion: formData.get('descripcion'),
    precio: formData.get('precio'),
    duracion_minutos: formData.get('duracion_minutos'),
    publicado: formData.get('publicado') === 'true',
    imagen_url: formData.get('imagen_url') || '',
    imagekit_file_id: formData.get('imagekit_file_id') || null,
  })

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message }
  }

  const payload: Servicio = {
    id: parsed.data.id,
    nombre: parsed.data.nombre,
    descripcion: parsed.data.descripcion,
    precio: parsed.data.precio,
    duracion_minutos: parsed.data.duracion_minutos,
    imagen_url: parsed.data.imagen_url || null,
    imagekit_file_id: parsed.data.imagekit_file_id,
    publicado: parsed.data.publicado,
  }
  const result = await upsertServicio(payload)

  if (!result.success) {
    return {
      success: false,
      error: result.error ?? 'No se pudo guardar el servicio.',
    }
  }

  updateTag('servicios')
  revalidatePath('/admin/servicios')
  revalidatePath('/servicios')
  return { success: true }
}

export async function eliminarServicio(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const session = await getSession()
  if (!session) {
    return {
      success: false,
      error: 'Tu sesión expiró. Inicia sesión nuevamente para continuar.',
    }
  }

  const parsed = idSchema.safeParse({ id: formData.get('id') })
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message }
  }

  const result = await deleteServicio(parsed.data.id)
  if (!result.success) {
    return {
      success: false,
      error: result.error ?? 'No se pudo eliminar el servicio.',
    }
  }

  updateTag('servicios')
  revalidatePath('/admin/servicios')
  revalidatePath('/servicios')
  return { success: true }
}
