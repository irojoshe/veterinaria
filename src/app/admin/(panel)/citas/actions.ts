'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { updateEstadoCita } from '@/lib/services/citas'
import type { EstadoCita } from '@/lib/types'

const schema = z.object({
  id:     z.string().min(1),
  estado: z.enum(['pendiente', 'confirmada', 'atendida', 'cancelada']),
})

export interface ActionResult {
  success: boolean
  error?: string
}

export async function cambiarEstadoCita(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const parsed = schema.safeParse({
    id:     formData.get('id'),
    estado: formData.get('estado'),
  })

  if (!parsed.success) {
    return { success: false, error: 'Datos inválidos.' }
  }

  const result = await updateEstadoCita(
    parsed.data.id,
    parsed.data.estado as EstadoCita
  )

  if (!result.success) {
    return { success: false, error: 'No se pudo actualizar el estado.' }
  }

  revalidatePath('/admin/citas')
  revalidatePath('/admin')

  return { success: true }
}
