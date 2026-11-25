import { unstable_cache } from 'next/cache'
import {
  createSupabasePublicServerClient,
  createSupabaseServerClient,
} from '@/lib/supabase/server'
import {
  deleteReplacedImageKitFile,
  getPreviousImageKitState,
} from '@/lib/imagekit/server'
import type { Mascota, MascotaPublica, MascotaRow } from '@/lib/types'

const COLUMNAS_MASCOTA =
  'id, nombre, especie, raza, sexo, fecha_nacimiento, foto_url, precio, historia, estado_adopcion, vacunado, esterilizado, microchip, compatible_ninos, compatible_mascotas'

const COLUMNAS_MASCOTA_ADMIN =
  'id, nombre, especie, raza, sexo, fecha_nacimiento, foto_url, imagekit_file_id, publicado, precio, historia, estado_adopcion, vacunado, esterilizado, microchip, compatible_ninos, compatible_mascotas'

type ResultadoEscritura = { success: boolean; error?: string }

/** Public pet catalog cached by tag. */
export const getMascotasPublicas = unstable_cache(
  async (): Promise<MascotaPublica[]> => {
    try {
      const supabase = createSupabasePublicServerClient()
      const { data, error } = await supabase
        .from('mascotas')
        .select(COLUMNAS_MASCOTA)
        .eq('publicado', true)
        .order('nombre')

      if (error) {
        console.error('[mascotas] Error al leer mascotas publicadas:', error.message)
        return []
      }

      return (data ?? []) as MascotaPublica[]
    } catch (error) {
      console.error('[mascotas] Error inesperado al leer mascotas publicadas:', error)
      return []
    }
  },
  ['mascotas-publicos'],
  { revalidate: 300, tags: ['mascotas'] },
)

export async function getMascotas(): Promise<MascotaRow[]> {
  try {
    const supabase = await createSupabaseServerClient()
    const { data, error } = await supabase
      .from('mascotas')
      .select(COLUMNAS_MASCOTA_ADMIN)
      .order('nombre')

    if (error) {
      console.error('[mascotas] getMascotas:', error.message)
      return []
    }

    return (data ?? []) as MascotaRow[]
  } catch (error) {
    console.error('[mascotas] getMascotas:', error)
    return []
  }
}

export async function upsertMascota(
  data: Mascota,
  eliminarFoto = false,
): Promise<ResultadoEscritura> {
  try {
    const supabase = await createSupabaseServerClient()

    const previous = data.id
      ? await getPreviousImageKitState(supabase, 'mascotas', data.id, 'foto_url')
      : { imageUrl: null, fileId: null }

    // An empty upload keeps the stored photo instead of wiping it.
    // An explicit delete (eliminarFoto) wipes it.
    const fotoUrl = eliminarFoto ? null : (data.foto_url ?? previous.imageUrl)
    const fileId = eliminarFoto ? null : (data.imagekit_file_id ?? previous.fileId)

    const payload = {
      nombre: data.nombre,
      especie: data.especie,
      raza: data.raza,
      sexo: data.sexo,
      fecha_nacimiento: data.fecha_nacimiento,
      foto_url: fotoUrl,
      imagekit_file_id: fileId,
      publicado: data.publicado,
      precio: data.precio,
      historia: data.historia,
      estado_adopcion: data.estado_adopcion,
      vacunado: data.vacunado,
      esterilizado: data.esterilizado,
      microchip: data.microchip,
      compatible_ninos: data.compatible_ninos,
      compatible_mascotas: data.compatible_mascotas,
    }
    const query = data.id
      ? supabase.from('mascotas').update(payload).eq('id', data.id)
      : supabase.from('mascotas').insert(payload)

    const { error } = await query
    if (error) {
      console.error(
        '[mascotas] Error al guardar la mascota:',
        error.code,
        error.message,
        error.details,
      )
      return {
        success: false,
        error: `No se pudo guardar la mascota (${error.code ?? 'sin código'}).`,
      }
    }

    await deleteReplacedImageKitFile(previous.fileId, fileId)

    return { success: true }
  } catch (error) {
    console.error('[mascotas] Error inesperado al guardar la mascota:', error)
    return {
      success: false,
      error: 'Error inesperado al guardar la mascota.',
    }
  }
}

export async function deleteMascota(
  id: string,
): Promise<ResultadoEscritura> {
  try {
    const supabase = await createSupabaseServerClient()
    const { error } = await supabase.from('mascotas').delete().eq('id', id)

    if (error) {
      console.error('[mascotas] Error al eliminar la mascota:', error.message)
      if (error.code === '23503') {
        return {
          success: false,
          error:
            'No se puede eliminar: hay citas que referencian esta mascota.',
        }
      }
      return { success: false, error: 'No se pudo eliminar la mascota.' }
    }

    return { success: true }
  } catch (error) {
    console.error('[mascotas] Error inesperado al eliminar la mascota:', error)
    return { success: false, error: 'No se pudo eliminar la mascota.' }
  }
}
