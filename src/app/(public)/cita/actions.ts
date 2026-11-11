'use server'

import { redirect } from 'next/navigation'
import { citaSchema } from '@/lib/validations/cita'

export interface ActionResult {
  success: false
  error: string
}

export async function crearCita(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  // Bloquea bots: el honeypot debe estar vacío
  if (formData.get('_hp')) {
    return { success: false, error: 'Solicitud rechazada.' }
  }

  const raw = {
    nombre:            formData.get('nombre'),
    telefono:          formData.get('telefono'),
    email:             formData.get('email'),
    mascota_nombre:    formData.get('mascota_nombre'),
    especie:           formData.get('especie'),
    raza:              formData.get('raza') ?? '',
    sexo:              formData.get('sexo') ?? '',
    fecha_nacimiento:  formData.get('fecha_nacimiento') ?? '',
    microchip:         formData.get('microchip') ?? '',
    servicio:          formData.get('servicio'),
    fecha_preferida:   formData.get('fecha_preferida'),
    hora_preferida:    formData.get('hora_preferida'),
    motivo:            formData.get('motivo'),
    acepta_privacidad: formData.get('acepta_privacidad') === 'true',
    _hp:               String(formData.get('_hp') ?? ''),
  }

  const parsed = citaSchema.safeParse(raw)

  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message ?? 'Revisa los campos del formulario.'
    return { success: false, error: first }
  }

  // TODO: persistir en Supabase
  // const ref = await insertCita(parsed.data)

  // Genera referencia de ejemplo
  const ref = `HV-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000 + 1000)}`

  redirect(`/cita/confirmacion?ref=${ref}&nombre=${encodeURIComponent(parsed.data.nombre)}`)
}
