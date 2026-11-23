import {
  CITA_COLUMNS,
  mapCitaRow,
  normalizeCitaStatus,
  type CitaRow,
} from '@/lib/services/citas'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { Cita, EstadoCita, ResumenDashboard } from '@/lib/types'

interface AppointmentMonthRow {
  estado: string
  fecha: string
}

interface MonthSummary {
  today: number
  todayPending: number
  todayConfirmed: number
  distribution: Record<EstadoCita, number>
}

const EMPTY_DASHBOARD: ResumenDashboard = {
  totalCitas: 0,
  citasPendientes: 0,
  totalMascotas: 0,
  totalServicios: 0,
  citas_hoy: 0,
  citas_hoy_pendientes: 0,
  citas_hoy_confirmadas: 0,
  citas_mes: 0,
  servicios_publicados: 0,
  servicios_total: 0,
  mascotas_total: 0,
  mascotas_publicas: 0,
  clientes_total: 0,
  pendientes_revision: 0,
  distribucion: { pendiente: 0, confirmada: 0, atendida: 0, cancelada: 0 },
}

export async function getResumenEstadisticas(): Promise<ResumenDashboard> {
  try {
    const supabase = await createSupabaseServerClient()
    const today = new Date().toISOString().slice(0, 10)
    const firstDayOfMonth = `${today.slice(0, 7)}-01`

    const [citasTotal, pendientes, mes, servicios, mascotas, clientes] =
      await Promise.all([
        supabase.from('citas').select('id', { count: 'exact', head: true }),
        supabase
          .from('citas')
          .select('id', { count: 'exact', head: true })
          .in('estado', ['pendiente', 'pending']),
        supabase
          .from('citas')
          .select('estado,fecha', { count: 'exact' })
          .gte('fecha', firstDayOfMonth),
        supabase.from('servicios').select('publicado', { count: 'exact' }),
        supabase.from('mascotas').select('publicado', { count: 'exact' }),
        supabase.from('clientes').select('email', { count: 'exact', head: true }),
      ])

    const failedQuery = [
      citasTotal,
      pendientes,
      mes,
      servicios,
      mascotas,
      clientes,
    ].find((result) => result.error)

    if (failedQuery?.error) throw failedQuery.error

    const monthRows = (mes.data ?? []) as AppointmentMonthRow[]
    const monthly = monthRows.reduce<MonthSummary>(
      (summary, row) => {
        const status = normalizeCitaStatus(row.estado)
        summary.distribution[status] += 1

        if (row.fecha === today) {
          summary.today += 1
          if (status === 'pendiente') summary.todayPending += 1
          if (status === 'confirmada') summary.todayConfirmed += 1
        }

        return summary
      },
      {
        today: 0,
        todayPending: 0,
        todayConfirmed: 0,
        distribution: { pendiente: 0, confirmada: 0, atendida: 0, cancelada: 0 },
      },
    )

    const serviceRows = (servicios.data ?? []) as { publicado: boolean }[]
    const petRows = (mascotas.data ?? []) as { publicado: boolean }[]
    const pendingCount = pendientes.count ?? 0
    const serviceCount = servicios.count ?? 0
    const petCount = mascotas.count ?? 0

    return {
      totalCitas: citasTotal.count ?? 0,
      citasPendientes: pendingCount,
      totalMascotas: petCount,
      totalServicios: serviceCount,
      citas_hoy: monthly.today,
      citas_hoy_pendientes: monthly.todayPending,
      citas_hoy_confirmadas: monthly.todayConfirmed,
      citas_mes: mes.count ?? monthRows.length,
      servicios_publicados: serviceRows.filter((row) => row.publicado).length,
      servicios_total: serviceCount,
      mascotas_total: petCount,
      mascotas_publicas: petRows.filter((row) => row.publicado).length,
      clientes_total: clientes.count ?? 0,
      pendientes_revision: pendingCount,
      distribucion: monthly.distribution,
    }
  } catch (error) {
    console.error('[dashboard] getResumenEstadisticas:', error)
    return EMPTY_DASHBOARD
  }
}

export async function getCitasHoy(): Promise<Cita[]> {
  try {
    const supabase = await createSupabaseServerClient()
    const { data, error } = await supabase
      .from('citas')
      .select(CITA_COLUMNS)
      .eq('fecha', 'now()')
      .order('hora', { ascending: true })

    if (error) {
      console.error('[dashboard] getCitasHoy:', error.message)
      return []
    }

    return ((data ?? []) as unknown as CitaRow[]).map(mapCitaRow)
  } catch (error) {
    console.error('[dashboard] getCitasHoy:', error)
    return []
  }
}
