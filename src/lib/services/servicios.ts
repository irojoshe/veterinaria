import { unstable_cache } from 'next/cache'
import {
  createSupabasePublicServerClient,
  createSupabaseServerClient,
} from '@/lib/supabase/server'
import {
  deleteReplacedImageKitFile,
  getPreviousImageKitFileId,
} from '@/lib/imagekit/server'
import type { Servicio, ServicioPublico, ServicioRow } from '@/lib/types'

const COLUMNAS_SERVICIO =
  'id, nombre, descripcion, precio, imagen_url, imagekit_file_id, slug, duracion_minutos'

type ResultadoEscritura = { success: boolean; error?: string }
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
        console.error('[servicios] Error al leer servicios publicados:', error.message)
        return []
      }

      return (data ?? []) as ServicioPublico[]
    } catch (error) {
      console.error('[servicios] Error inesperado al leer servicios publicados:', error)
      return []
    }
  },
  ['servicios-publicos'],
  { revalidate: 300, tags: ['servicios'] },
)

export const getServicioBySlug = unstable_cache(
  async (slug: string): Promise<ServicioPublico | null> => {
    try {
      const supabase = createSupabasePublicServerClient()
      const { data, error } = await supabase
        .from('servicios')
        .select(COLUMNAS_SERVICIO)
        .eq('slug', slug)
        .eq('publicado', true)
        .maybeSingle()

      if (error) {
        console.error('[servicios] Error al leer el servicio:', error.message)
        return null
      }

      return (data ?? null) as ServicioPublico | null
    } catch (error) {
      console.error('[servicios] Error inesperado al leer el servicio:', error)
      return null
    }
  },
  ['servicio-publico'],
  { revalidate: 300, tags: ['servicios'] },
)

/** Uncached admin catalog using the cookie-backed client. */
export async function getServicios(): Promise<ServicioRow[]> {
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

    return (data ?? []) as ServicioRow[]
  } catch (error) {
    console.error('[servicios] Error inesperado al leer servicios (admin):', error)
    return []
  }
}
function slugifyServicio(nombre: string): string {
  return nombre
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export async function upsertServicio(
  data: Servicio,
): Promise<ResultadoEscritura> {
  try {
    const supabase = await createSupabaseServerClient()
    const payload = {
      nombre: data.nombre,
      descripcion: data.descripcion,
      precio: data.precio,
      duracion_minutos: data.duracion_minutos,
      imagen_url: data.imagen_url,
      imagekit_file_id: data.imagekit_file_id,
      publicado: data.publicado,
    }
    const previousFileId = data.id
      ? await getPreviousImageKitFileId(supabase, 'servicios', data.id)
      : null

    const query = data.id
      ? supabase.from('servicios').update(payload).eq('id', data.id)
      : supabase
          .from('servicios')
          .insert({ ...payload, slug: slugifyServicio(data.nombre) })

    const { error } = await query
    if (error) {
      console.error('[servicios] Error al guardar el servicio:', error.message)
      return { success: false, error: 'No se pudo guardar el servicio.' }
    }

    await deleteReplacedImageKitFile(previousFileId, data.imagekit_file_id)

    return { success: true }
  } catch (error) {
    console.error('[servicios] Error inesperado al guardar el servicio:', error)
    return { success: false, error: 'No se pudo guardar el servicio.' }
  }
}

export async function deleteServicio(
  id: string,
): Promise<ResultadoEscritura> {
  try {
    const supabase = await createSupabaseServerClient()
    const { error } = await supabase.from('servicios').delete().eq('id', id)

    if (error) {
      console.error('[servicios] Error al eliminar el servicio:', error.message)
      if (error.code === '23503') {
        return {
          success: false,
          error:
            'No se puede eliminar: hay citas que referencian este servicio.',
        }
      }
      return { success: false, error: 'No se pudo eliminar el servicio.' }
    }

    return { success: true }
  } catch (error) {
    console.error('[servicios] Error inesperado al eliminar el servicio:', error)
    return { success: false, error: 'No se pudo eliminar el servicio.' }
  }
}
