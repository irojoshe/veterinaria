import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { Notificacion } from '@/lib/types'

const NOTIFICATION_COLUMNS =
  'id,cita_id,tipo,destinatario_email,estado,error,created_at,sent_at,citas(mascota_nombre,propietario_nombre)'

type NotificacionRow = Omit<Notificacion, 'citas'> & {
  citas: { mascota_nombre: string; propietario_nombre: string } | null
}

export async function getNotificaciones(): Promise<Notificacion[]> {
  try {
    const supabase = await createSupabaseServerClient()
    const { data, error } = await supabase
      .from('notificaciones')
      .select(NOTIFICATION_COLUMNS)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[notificaciones] getNotificaciones:', error.message)
      return []
    }

    return ((data ?? []) as unknown as NotificacionRow[]).map((row) => ({
      ...row,
      citas: row.citas ?? undefined,
    }))
  } catch (error) {
    console.error('[notificaciones] getNotificaciones:', error)
    return []
  }
}
