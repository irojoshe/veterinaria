'use server'

import { revalidatePath, updateTag } from 'next/cache'
import { z } from 'zod'
import { getSession } from '@/lib/auth/session'
import { actualizarNegocio as guardarNegocio } from '@/lib/services/negocio'
import type { Negocio } from '@/lib/types'

const optionalUrlSchema = z.union([
  z.literal(''),
  z.string().trim().url('Introduce una URL válida.'),
])

const negocioSchema = z.object({
  nombre: z.string().trim().min(2, 'El nombre es obligatorio.'),
  descripcion: z.string().trim().min(10, 'Añade una descripción.'),
  direccion: z.string().trim().min(5, 'Indica la dirección.'),
  telefono: z.string().trim().min(7, 'Indica un teléfono válido.'),
  email: z.string().trim().email('Introduce un email válido.'),
  whatsapp: z.string().trim().optional(),
  horario: z.string().trim().min(5, 'Indica el horario.'),
  mapa_url: optionalUrlSchema,
  logo_url: optionalUrlSchema,
  imagekit_file_id: z.string().nullable(),
})

export interface ActionResult {
  success: boolean
  error?: string
}

export async function actualizarNegocio(
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

  const parsed = negocioSchema.safeParse({
    nombre: formData.get('nombre'),
    descripcion: formData.get('descripcion'),
    direccion: formData.get('direccion'),
    telefono: formData.get('telefono'),
    email: formData.get('email'),
    whatsapp: formData.get('whatsapp') ?? undefined,
    horario: formData.get('horario'),
    mapa_url: formData.get('mapa_url') ?? '',
    logo_url: formData.get('logo_url') || '',
    imagekit_file_id: formData.get('imagekit_file_id') || null,
  })

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message }
  }

  const payload: Negocio = {
    nombre: parsed.data.nombre,
    descripcion: parsed.data.descripcion,
    direccion: parsed.data.direccion,
    telefono: parsed.data.telefono,
    email: parsed.data.email,
    whatsapp: parsed.data.whatsapp || null,
    horario: parsed.data.horario,
    mapa_url: parsed.data.mapa_url || null,
    logo_url: parsed.data.logo_url || null,
    imagekit_file_id: parsed.data.imagekit_file_id,
  }
  const result = await guardarNegocio(payload)

  if (!result.success) {
    return {
      success: false,
      error: result.error ?? 'No se pudo actualizar la información de la clínica.',
    }
  }

  updateTag('negocio')
  revalidatePath('/admin/negocio')
  revalidatePath('/')
  revalidatePath('/contacto')
  revalidatePath('/mascotas')
  revalidatePath('/privacidad')
  return { success: true }
}
