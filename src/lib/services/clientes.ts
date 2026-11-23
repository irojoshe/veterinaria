import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { Cliente } from '@/lib/types'

const CLIENT_COLUMNS = 'email,nombre,telefono,total_citas,ultima_cita'

export async function getClientes(): Promise<Cliente[]> {
  try {
    const supabase = await createSupabaseServerClient()
    const { data, error } = await supabase
      .from('clientes')
      .select(CLIENT_COLUMNS)
      .order('nombre')

    if (error) {
      console.error('[clientes] getClientes:', error.message)
      return []
    }

    return (data ?? []) as Cliente[]
  } catch (error) {
    console.error('[clientes] getClientes:', error)
    return []
  }
}
