import { unstable_cache } from 'next/cache'
import type { SupabaseClient } from '@supabase/supabase-js'
import {
  createSupabasePublicServerClient,
  createSupabaseServerClient,
} from '@/lib/supabase/server'
import {
  deleteReplacedImageKitFile,
  getPreviousImageKitState,
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

/**
 * `slug` is UNIQUE: a repeated name gets a numeric suffix instead of failing
 * the insert with a constraint violation.
 */
async function resolveSlugUnico(
  supabase: SupabaseClient<any>,
  slug: string,
): Promise<string> {
  const { data, error } = await supabase
    .from('servicios')
    .select('slug')
    .like('slug', `${slug}%`)

  if (error) {
    console.error('[servicios] Error al calcular el slug:', error.message)
    return slug
  }

  const existentes = new Set((data ?? []).map((row) => row.slug as string))
  if (!existentes.has(slug)) return slug

  let sufijo = 2
  while (existentes.has(`${slug}-${sufijo}`)) sufijo += 1
  return `${slug}-${sufijo}`
}

export async function upsertServicio(
  data: Servicio,
  eliminarFoto = false,
): Promise<ResultadoEscritura> {
  try {
    const supabase = await createSupabaseServerClient()

    const previous = data.id
      ? await getPreviousImageKitState(supabase, 'servicios', data.id, 'imagen_url')
      : { imageUrl: null, fileId: null }

    // An empty upload keeps the stored photo instead of wiping it.
    // An explicit delete (eliminarFoto) wipes it.
    const imagenUrl = eliminarFoto ? null : (data.imagen_url ?? previous.imageUrl)
    const fileId = eliminarFoto ? null : (data.imagekit_file_id ?? previous.fileId)

    const payload = {
      nombre: data.nombre,
      descripcion: data.descripcion,
      precio: data.precio,
      duracion_minutos: data.duracion_minutos,
      imagen_url: imagenUrl,
      imagekit_file_id: fileId,
      publicado: data.publicado,
    }

    if (data.id) {
      const { error } = await supabase
        .from('servicios')
        .update(payload)
        .eq('id', data.id)

      if (error) {
        console.error(
          '[servicios] Error al actualizar el servicio:',
          error.code,
          error.message,
          error.details,
        )
        return {
          success: false,
          error: `No se pudo guardar el servicio (${error.code ?? 'sin código'}).`,
        }
      }
    } else {
      const slug = await resolveSlugUnico(supabase, slugifyServicio(data.nombre))
      const { error } = await supabase
        .from('servicios')
        .insert({ ...payload, slug })

      if (error) {
        console.error(
          '[servicios] Error al crear el servicio:',
          error.code,
          error.message,
          error.details,
        )
        return {
          success: false,
          error: `No se pudo guardar el servicio (${error.code ?? 'sin código'}).`,
        }
      }
    }

    await deleteReplacedImageKitFile(previous.fileId, fileId)

    return { success: true }
  } catch (error) {
    console.error('[servicios] Error inesperado al guardar el servicio:', error)
    return {
      success: false,
      error: 'Error inesperado al guardar el servicio.',
    }
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
