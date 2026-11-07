import type { Negocio } from '@/lib/types'

/**
 * Devuelve la información pública de la clínica.
 * TODO: reemplazar con consulta real a Supabase.
 */
export async function getNegocio(): Promise<Negocio> {
  return {
    nombre:           'Huella Vet',
    descripcion:      'Atención veterinaria cercana, tiempo para escuchar y cuidado en cada etapa de su vida.',
    telefono:         '+34 900 123 456',
    email:            'hola@huellavet.example',
    direccion:        'Calle del Olivo, 24 · Madrid',
    horario_semana:   '09:00–19:00',
    horario_sabado:   '10:00–14:00',
    horario_domingo:  'Cerrado',
    whatsapp:         '+34900123456',
  }
}
