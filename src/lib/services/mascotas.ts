import type { Mascota } from '@/lib/types'

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
