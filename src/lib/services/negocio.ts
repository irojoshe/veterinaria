import { unstable_cache } from 'next/cache'
import { createSupabasePublicServerClient } from '@/lib/supabase/server'
import type { Negocio } from '@/lib/types'

/**
 * Columnas de la tabla `negocio`: exactamente las que consume la UI.
 * Ver docs/patterns/data-fetching.md.
 */
const COLUMNAS_NEGOCIO =
  'nombre, descripcion, direccion, telefono, email, whatsapp, horario, mapa_url'

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
      }
    } catch (error) {
      console.error('[negocio] Error inesperado al leer la clínica:', error)
      return NEGOCIO_POR_DEFECTO
    }
  },
  ['negocio-publico'],
  { revalidate: 300, tags: ['negocio'] },
)
