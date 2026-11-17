import { unstable_cache } from 'next/cache'
import {
  createSupabasePublicServerClient,
  createSupabaseServerClient,
} from '@/lib/supabase/server'
import type { Servicio, ServicioPublico } from '@/lib/types'

/**
 * Columnas del catálogo de servicios: exactamente las que consume la UI.
 * Ni una más (SELECT *) ni una menos (la UI leería undefined).
 * Ver docs/patterns/data-fetching.md.
 */
const COLUMNAS_SERVICIO =
  'id, nombre, descripcion, precio, imagen_url, slug, duracion_minutos'

/**
 * Catálogo público de servicios.
 *
 * Lectura cacheada con `unstable_cache`: es información pública y estable.
 * Usa el cliente sin cookies porque dentro de un scope de cache Next.js 16
 * lanza un error al leer cookies o headers.
 */
export const getServiciosPublicos = unstable_cache(
  async (): Promise<ServicioPublico[]> => {
    try {
      const supabase = createSupabasePublicServerClient()

      const { data, error } = await supabase
        .from('servicios')
        .select(COLUMNAS_SERVICIO)
        .eq('publicado', true)
        .order('nombre')

      if (error) {
        console.error(
          '[servicios] Error al leer servicios publicados:',
          error.message,
        )
        return []
      }

      return (data ?? []) as ServicioPublico[]
    } catch (error) {
      console.error(
        '[servicios] Error inesperado al leer servicios publicados:',
        error,
      )
      return []
    }
  },
  ['servicios-publicos'],
  { revalidate: 300, tags: ['servicios'] },
)

/**
 * Servicios para el panel de administración.
 *
 * Sin caché: el administrador necesita ver los cambios al instante.
 * Usa el cliente con cookies (sesión del usuario) y no filtra por `publicado`.
 */
export async function getServicios(): Promise<Servicio[]> {
  try {
    const supabase = await createSupabaseServerClient()

    const { data, error } = await supabase
      .from('servicios')
      .select(`${COLUMNAS_SERVICIO}, publicado`)
      .order('nombre')

    if (error) {
      console.error('[servicios] Error al leer servicios (admin):', error.message)
      return []
    }

    return (data ?? []) as Servicio[]
  } catch (error) {
    console.error('[servicios] Error inesperado al leer servicios (admin):', error)
    return []
  }
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
