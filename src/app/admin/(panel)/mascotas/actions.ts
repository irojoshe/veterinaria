'use server'

import { revalidatePath, updateTag } from 'next/cache'
import { z } from 'zod'
import { getSession } from '@/lib/auth/session'
import { deleteMascota, upsertMascota } from '@/lib/services/mascotas'
import type { Mascota } from '@/lib/types'

const optionalUrlSchema = z.union([
  z.literal(''),
  z.string().trim().url('Introduce una URL válida.'),
])

const mascotaSchema = z.object({
  id: z.string().optional(),
  nombre: z.string().trim().min(1, 'El nombre es obligatorio.'),
  especie: z.string().trim().min(1, 'Indica la especie.'),
  raza: z.string().optional().default(''),
  publicado: z.boolean(),
  foto_url: optionalUrlSchema,
  imagekit_file_id: z.string().nullable(),
  sexo: z.string(),
  fecha_nacimiento: z.string().nullable(),
  precio: z.coerce.number().nonnegative('El precio no puede ser negativo.'),
  historia: z.string().nullable(),
  estado_adopcion: z.string().min(1, 'Indica el estado de adopción.'),
  vacunado: z.boolean(),
  esterilizado: z.boolean(),
  microchip: z.boolean(),
  compatible_ninos: z.boolean(),
  compatible_mascotas: z.boolean(),
})

const idSchema = z.object({
  id: z.string().min(1, 'ID inválido.'),
})

export interface ActionResult {
  success: boolean
  error?: string
}

export async function guardarMascota(
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

  const parsed = mascotaSchema.safeParse({
    id: formData.get('id') || undefined,
    nombre: formData.get('nombre'),
    especie: formData.get('especie'),
    raza: formData.get('raza') ?? '',
    publicado: formData.get('publicado') === 'true',
    foto_url: formData.get('foto_url') || '',
    imagekit_file_id: formData.get('imagekit_file_id') || null,
    sexo: formData.get('sexo') ?? '',
    fecha_nacimiento: formData.get('fecha_nacimiento') || null,
    precio: formData.get('precio'),
    historia: formData.get('historia') || null,
    estado_adopcion: formData.get('estado_adopcion') ?? 'disponible',
    vacunado: formData.get('vacunado') === 'true',
    esterilizado: formData.get('esterilizado') === 'true',
    microchip: formData.get('microchip') === 'true',
    compatible_ninos: formData.get('compatible_ninos') === 'true',
    compatible_mascotas: formData.get('compatible_mascotas') === 'true',
  })

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message }
  }

  const payload: Mascota = {
    id: parsed.data.id,
    nombre: parsed.data.nombre,
    especie: parsed.data.especie,
    raza: parsed.data.raza,
    sexo: parsed.data.sexo,
    fecha_nacimiento: parsed.data.fecha_nacimiento,
    foto_url: parsed.data.foto_url || null,
    imagekit_file_id: parsed.data.imagekit_file_id,
    publicado: parsed.data.publicado,
    precio: parsed.data.precio,
    historia: parsed.data.historia,
    estado_adopcion: parsed.data.estado_adopcion,
    vacunado: parsed.data.vacunado,
    esterilizado: parsed.data.esterilizado,
    microchip: parsed.data.microchip,
    compatible_ninos: parsed.data.compatible_ninos,
    compatible_mascotas: parsed.data.compatible_mascotas,
  }
  const result = await upsertMascota(payload)

  if (!result.success) {
    return {
      success: false,
      error: result.error ?? 'No se pudo guardar la mascota.',
    }
  }

  updateTag('mascotas')
  revalidatePath('/admin/mascotas')
  revalidatePath('/mascotas')
  return { success: true }
}

export async function eliminarMascota(
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

  const result = await deleteMascota(parsed.data.id)
  if (!result.success) {
    return {
      success: false,
      error: result.error ?? 'No se pudo eliminar la mascota.',
    }
  }

  updateTag('mascotas')
  revalidatePath('/admin/mascotas')
  revalidatePath('/mascotas')
  return { success: true }
}
