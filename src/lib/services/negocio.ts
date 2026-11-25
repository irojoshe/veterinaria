import { unstable_cache } from 'next/cache'
import {
  createSupabasePublicServerClient,
  createSupabaseServerClient,
} from '@/lib/supabase/server'
import {
  deleteReplacedImageKitFile,
  getPreviousImageKitState,
} from '@/lib/imagekit/server'
import type { Negocio } from '@/lib/types'

/**
 * Columnas de la tabla `negocio`: exactamente las que consume la UI.
 * Ver docs/patterns/data-fetching.md.
 */
const COLUMNAS_NEGOCIO =
  'nombre, descripcion, direccion, telefono, email, whatsapp, horario, mapa_url, logo_url, imagekit_file_id'

/**
 * Valores por defecto mientras la fila de `negocio` no esté completa.
 * Se mergean sobre la fila real: la base gana cuando tiene valor.
 */
const NEGOCIO_POR_DEFECTO: Negocio = {
  nombre: 'Huella Vet',
  descripcion:
    'Atención veterinaria cercana, tiempo para escuchar y cuidado en cada etapa de su vida.',
  telefono: '+34 900 123 456',
  email: 'hola@huellavet.example',
  direccion: 'Calle del Olivo, 24 · Madrid',
  horario: 'Lun–Vie 09:00–19:00 · Sáb 10:00–14:00 · Dom Cerrado',
  whatsapp: '+34900123456',
  mapa_url: null,
  logo_url: null,
  imagekit_file_id: null,
}

/**
 * Información pública de la clínica.
 *
 * Lectura cacheada con `unstable_cache`: es información pública y estable.
 * Usa el cliente sin cookies porque dentro de un scope de cache Next.js 16
 * lanza un error al leer cookies o headers.
 */
export const getNegocio = unstable_cache(
  async (): Promise<Negocio> => {
    try {
      const supabase = createSupabasePublicServerClient()

      const { data, error } = await supabase
        .from('negocio')
        .select(COLUMNAS_NEGOCIO)
        .limit(1)
        .maybeSingle()

      if (error) {
        console.error('[negocio] Error al leer la clínica:', error.message)
        return NEGOCIO_POR_DEFECTO
      }

      if (!data) return NEGOCIO_POR_DEFECTO

      // La base gana cuando trae valor; los NULL caen al default.
      return {
        nombre: data.nombre || NEGOCIO_POR_DEFECTO.nombre,
        descripcion: data.descripcion || NEGOCIO_POR_DEFECTO.descripcion,
        direccion: data.direccion || NEGOCIO_POR_DEFECTO.direccion,
        telefono: data.telefono || NEGOCIO_POR_DEFECTO.telefono,
        email: data.email || NEGOCIO_POR_DEFECTO.email,
        whatsapp: data.whatsapp || NEGOCIO_POR_DEFECTO.whatsapp,
        horario: data.horario || NEGOCIO_POR_DEFECTO.horario,
        mapa_url: data.mapa_url || NEGOCIO_POR_DEFECTO.mapa_url,
        logo_url: data.logo_url || NEGOCIO_POR_DEFECTO.logo_url,
        imagekit_file_id:
          data.imagekit_file_id || NEGOCIO_POR_DEFECTO.imagekit_file_id,
      }
    } catch (error) {
      console.error('[negocio] Error inesperado al leer la clínica:', error)
      return NEGOCIO_POR_DEFECTO
    }
  },
  ['negocio-publico'],
  { revalidate: 300, tags: ['negocio'] },
)

const ERROR_ACTUALIZACION = 'No se pudo actualizar la información de la clínica.'

export async function actualizarNegocio(
  data: Negocio,
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createSupabaseServerClient()

    const { data: fila, error: selectError } = await supabase
      .from('negocio')
      .select('id, logo_url, imagekit_file_id')
      .limit(1)
      .maybeSingle()

    if (selectError) {
      console.error(
        '[negocio] Error al buscar el registro:',
        selectError.code,
        selectError.message,
      )
      return { success: false, error: ERROR_ACTUALIZACION }
    }

    if (!fila) {
      const payload: Negocio = {
        nombre: data.nombre,
        descripcion: data.descripcion,
        direccion: data.direccion,
        telefono: data.telefono,
        email: data.email,
        whatsapp: data.whatsapp,
        horario: data.horario,
        mapa_url: data.mapa_url,
        logo_url: data.logo_url,
        imagekit_file_id: data.imagekit_file_id,
      }

      const { error: insertError } = await supabase
        .from('negocio')
        .insert(payload)
        .select('id')
        .single()

      if (insertError) {
        console.error(
          '[negocio] Error al crear el registro:',
          insertError.code,
          insertError.message,
        )
        return { success: false, error: ERROR_ACTUALIZACION }
      }

      return { success: true }
    }

    const previous = await getPreviousImageKitState(
      supabase,
      'negocio',
      fila.id,
      'logo_url',
    )

    const payload: Negocio = {
      nombre: data.nombre,
      descripcion: data.descripcion,
      direccion: data.direccion,
      telefono: data.telefono,
      email: data.email,
      whatsapp: data.whatsapp,
      horario: data.horario,
      mapa_url: data.mapa_url,
      logo_url: data.logo_url || previous.imageUrl,
      imagekit_file_id: data.imagekit_file_id || previous.fileId,
    }

    const { error: updateError } = await supabase
      .from('negocio')
      .update(payload)
      .eq('id', fila.id)

    if (updateError) {
      console.error(
        '[negocio] Error al actualizar el registro:',
        updateError.code,
        updateError.message,
      )
      return { success: false, error: ERROR_ACTUALIZACION }
    }

    await deleteReplacedImageKitFile(previous.fileId, payload.imagekit_file_id)

    return { success: true }
  } catch (error) {
    console.error('[negocio] Error inesperado al actualizar la clínica:', error)
    return { success: false, error: ERROR_ACTUALIZACION }
  }
}
