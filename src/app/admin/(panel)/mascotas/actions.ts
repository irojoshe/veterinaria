'use server'

import { revalidatePath, updateTag } from 'next/cache'
import { z } from 'zod'
import { getSession } from '@/lib/auth/session'
import { deleteMascota, upsertMascota } from '@/lib/services/mascotas'
import { mascotaSchema } from '@/lib/validations/mascota'
import type { Mascota } from '@/lib/types'

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
  try {
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
      foto_url: formData.get('foto_url') ?? '',
      imagekit_file_id: formData.get('imagekit_file_id') || null,
      sexo: formData.get('sexo') ?? '',
      fecha_nacimiento: formData.get('fecha_nacimiento') ?? '',
      precio: formData.get('precio'),
      historia: formData.get('historia') || null,
      estado_adopcion: formData.get('estado_adopcion') ?? 'disponible',
      vacunado: formData.get('vacunado') === 'on',
      esterilizado: formData.get('esterilizado') === 'on',
      microchip: formData.get('microchip') === 'on',
      compatible_ninos: formData.get('compatible_ninos') === 'on',
      compatible_mascotas: formData.get('compatible_mascotas') === 'on',
    })

    if (!parsed.success) {
      console.error(
        '[guardarMascota] Datos invalidos:',
        parsed.error.flatten().fieldErrors,
      )
      return {
        success: false,
        error:
          parsed.error.issues[0]?.message ?? 'Revisa los datos del formulario.',
      }
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

    console.info('[guardarMascota] Imagen recibida:', {
      foto_url: payload.foto_url,
      imagekit_file_id: payload.imagekit_file_id,
    })

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
  } catch (error) {
    console.error('[guardarMascota] Error inesperado:', error)
    return {
      success: false,
      error: 'Error inesperado al guardar la mascota. Revisa la consola del servidor.',
    }
  }
}

export async function eliminarMascota(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  try {
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
  } catch (error) {
    console.error('[eliminarMascota] Error inesperado:', error)
    return {
      success: false,
      error: 'Error inesperado al eliminar la mascota. Revisa la consola del servidor.',
    }
  }
}
