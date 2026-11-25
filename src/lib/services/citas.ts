import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { Cita, EstadoCita } from '@/lib/types'

export const CITA_COLUMNS =
  'id, propietario_nombre, propietario_email, propietario_telefono, mascota_nombre, fecha, hora, motivo, estado, created_at, servicios(nombre)'

export interface CitaRow {
  id: string
  propietario_nombre: string
  propietario_email: string
  propietario_telefono: string
  mascota_nombre: string
  fecha: string
  hora: string
  motivo: string
  estado: string
  created_at: string
  servicios: { nombre: string } | null
}

const STATUS_BY_RAW_VALUE: Record<string, EstadoCita> = {
  pending: 'pendiente',
  pendiente: 'pendiente',
  confirmed: 'confirmada',
  confirmada: 'confirmada',
  completed: 'atendida',
  atendida: 'atendida',
  completada: 'atendida',
  canceled: 'cancelada',
  cancelled: 'cancelada',
  cancelada: 'cancelada',
}

export function normalizeCitaStatus(value: string): EstadoCita {
  const status = STATUS_BY_RAW_VALUE[value.trim().toLowerCase()]

  if (status) return status

  console.warn('[citas] Unknown appointment status:', value)
  return 'pendiente'
}

export function mapCitaRow(row: CitaRow): Cita {
  const { estado, servicios, ...cita } = row

  return {
    ...cita,
    servicios: servicios ?? undefined,
    estado: normalizeCitaStatus(estado),
  }
}

export async function getCitas(): Promise<Cita[]> {
  try {
    const supabase = await createSupabaseServerClient()
    const { data, error } = await supabase
      .from('citas')
      .select(CITA_COLUMNS)
      .order('fecha', { ascending: false })
      .order('hora', { ascending: false })

    if (error) {
      console.error('[citas] getCitas:', error.message)
      return []
    }

    return ((data ?? []) as unknown as CitaRow[]).map(mapCitaRow)
  } catch (error) {
    console.error('[citas] getCitas:', error)
    return []
  }
}

export async function getCitaById(id: string): Promise<Cita | null> {
  try {
    const supabase = await createSupabaseServerClient()
    const { data, error } = await supabase
      .from('citas')
      .select(CITA_COLUMNS)
      .eq('id', id)
      .maybeSingle()

    if (error) {
      console.error('[citas] getCitaById:', error.message)
      return null
    }

    return data ? mapCitaRow(data as unknown as CitaRow) : null
  } catch (error) {
    console.error('[citas] getCitaById:', error)
    return null
  }
}

export async function updateEstadoCita(
  id: string,
  estado: EstadoCita,
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createSupabaseServerClient()
    const { error } = await supabase
      .from('citas')
      .update({ estado })
      .eq('id', id)

    if (error) {
      console.error('[citas] Error al actualizar el estado:', error.message)
      return {
        success: false,
        error: 'No se pudo actualizar el estado de la cita.',
      }
    }

    return { success: true }
  } catch (error) {
    console.error('[citas] Error inesperado al actualizar el estado:', error)
    return {
      success: false,
      error: 'No se pudo actualizar el estado de la cita.',
    }
  }
}
