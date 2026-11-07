import type { Servicio } from '@/lib/types'

/**
 * Devuelve todos los servicios publicados.
 * TODO: reemplazar con consulta real a Supabase.
 */
export async function getServicios(): Promise<Servicio[]> {
  return getServiciosPublicos()
}

export async function upsertServicio(
  data: Omit<Servicio, 'id' | 'slug'> & { id?: string }
): Promise<{ success: boolean }> {
  console.log('[mock] upsertServicio', data)
  return { success: true }
}

export async function deleteServicio(id: string): Promise<{ success: boolean }> {
  console.log('[mock] deleteServicio', id)
  return { success: true }
}

export async function getServiciosPublicos(): Promise<Servicio[]> {
  return [
    {
      id: '1', slug: 'consulta-general',
      nombre: 'Consulta general',
      descripcion: 'Una valoración completa para resolver dudas y cuidar su bienestar en cada etapa.',
      precio: 35, duracion_minutos: 30,
      imagen_url: null, publicado: true,
    },
    {
      id: '2', slug: 'vacunacion',
      nombre: 'Vacunación',
      descripcion: 'Revisamos sus necesidades y te orientamos sobre una pauta de protección adecuada.',
      precio: 28, duracion_minutos: 20,
      imagen_url: null, publicado: true,
    },
    {
      id: '3', slug: 'medicina-preventiva',
      nombre: 'Medicina preventiva',
      descripcion: 'Hábitos, revisiones y acompañamiento para anticiparnos a lo que necesita.',
      precio: 40, duracion_minutos: 40,
      imagen_url: null, publicado: true,
    },
    {
      id: '4', slug: 'orientacion-nutricional',
      nombre: 'Orientación nutricional',
      descripcion: 'Una alimentación adaptada a su edad, rutina y características individuales.',
      precio: 30, duracion_minutos: 30,
      imagen_url: null, publicado: true,
    },
    {
      id: '5', slug: 'cuidado-e-higiene',
      nombre: 'Cuidado e higiene',
      descripcion: 'Revisión de piel, oídos y cuidados cotidianos con un trato amable.',
      precio: 25, duracion_minutos: 25,
      imagen_url: null, publicado: true,
    },
    {
      id: '6', slug: 'consulta-pequenos-mamiferos',
      nombre: 'Consulta de pequeños mamíferos',
      descripcion: 'Atención y orientación de cuidados para conejos y pequeños compañeros.',
      precio: 42, duracion_minutos: 40,
      imagen_url: null, publicado: true,
    },
  ]
}
