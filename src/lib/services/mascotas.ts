import { unstable_cache } from 'next/cache'
import { createSupabasePublicServerClient } from '@/lib/supabase/server'
import type { Mascota, MascotaPublica } from '@/lib/types'

/**
 * Columnas públicas de la tabla `mascotas`: exactamente las que consume la
 * UI del catálogo. Ni una más (SELECT *) ni una menos.
 * Ver docs/patterns/data-fetching.md.
 */
const COLUMNAS_MASCOTA =
  'id, nombre, especie, raza, sexo, fecha_nacimiento, foto_url, precio, historia, estado_adopcion'

/**
 * Mascotas publicadas para el catálogo público.
 *
 * Lectura cacheada con `unstable_cache`: es información pública y estable.
 * Usa el cliente sin cookies porque dentro de un scope de cache Next.js 16
 * lanza un error al leer cookies o headers.
 */
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
        console.error(
          '[mascotas] Error al leer mascotas publicadas:',
          error.message,
        )
        return []
      }

      return (data ?? []) as MascotaPublica[]
    } catch (error) {
      console.error(
        '[mascotas] Error inesperado al leer mascotas publicadas:',
        error,
      )
      return []
    }
  },
  ['mascotas-publicas'],
  { revalidate: 300, tags: ['mascotas'] },
)

const MASCOTAS_MOCK: Mascota[] = [
  { id: '1', nombre: 'Luna',  especie: 'Perro', raza: 'Golden retriever', foto_url: null, slug: 'luna',  publica: true,  propietario: 'Lucía Torres' },
  { id: '2', nombre: 'Nilo',  especie: 'Gato',  raza: 'Europeo común',    foto_url: null, slug: 'nilo',  publica: true,  propietario: 'Mateo Ruiz' },
  { id: '3', nombre: 'Coco',  especie: 'Perro', raza: 'Beagle',           foto_url: null, slug: 'coco',  publica: true,  propietario: 'Elena Vidal' },
  { id: '4', nombre: 'Oliva', especie: 'Conejo',raza: 'Belier',           foto_url: null, slug: 'oliva', publica: true,  propietario: 'Sara León' },
  { id: '5', nombre: 'Milo',  especie: 'Gato',  raza: 'Europeo común',    foto_url: null, slug: 'milo',  publica: false, propietario: 'Daniel Gil' },
  { id: '6', nombre: 'Bruna', especie: 'Perro', raza: 'Mestizo',          foto_url: null, slug: 'bruna', publica: false, propietario: undefined },
]

export async function getMascotas(): Promise<Mascota[]> {
  return MASCOTAS_MOCK
}

export async function upsertMascota(
  data: Omit<Mascota, 'id' | 'slug'> & { id?: string }
): Promise<{ success: boolean }> {
  console.log('[mock] upsertMascota', data)
  return { success: true }
}

export async function deleteMascota(id: string): Promise<{ success: boolean }> {
  console.log('[mock] deleteMascota', id)
  return { success: true }
}
