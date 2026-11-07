'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { upsertMascota, deleteMascota } from '@/lib/services/mascotas'

const mascotaSchema = z.object({
  id:          z.string().optional(),
  nombre:      z.string().min(1, 'El nombre es obligatorio.'),
  especie:     z.string().min(1, 'Indica la especie.'),
  raza:        z.string().optional().default(''),
  publica:     z.coerce.boolean(),
  propietario: z.string().optional(),
})

export interface ActionResult { success: boolean; error?: string }

export async function guardarMascota(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const parsed = mascotaSchema.safeParse({
    id:          formData.get('id') || undefined,
    nombre:      formData.get('nombre'),
    especie:     formData.get('especie'),
    raza:        formData.get('raza') ?? '',
    publica:     formData.get('publica') === 'true',
    propietario: formData.get('propietario') ?? undefined,
  })

  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message }
  }

  const result = await upsertMascota({
    ...parsed.data,
    foto_url: null,
    slug: parsed.data.nombre.toLowerCase().replace(/\s+/g, '-'),
  })

  if (!result.success) return { success: false, error: 'No se pudo guardar.' }

  revalidatePath('/admin/mascotas')
  revalidatePath('/mascotas')
  return { success: true }
}

export async function eliminarMascota(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const id = formData.get('id')
  if (!id || typeof id !== 'string') return { success: false, error: 'ID inválido.' }

  const result = await deleteMascota(id)
  if (!result.success) return { success: false, error: 'No se pudo eliminar.' }

  revalidatePath('/admin/mascotas')
  revalidatePath('/mascotas')
  return { success: true }
}
