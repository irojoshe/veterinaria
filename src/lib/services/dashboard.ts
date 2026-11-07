import type { Cita, ResumenEstadisticas, EstadoCita } from '@/lib/types'

/** Datos de ejemplo · TODO: reemplazar con Supabase */

export async function getResumenEstadisticas(): Promise<ResumenEstadisticas> {
  return {
    citas_hoy:            3,
    citas_hoy_pendientes: 1,
    citas_hoy_confirmadas: 2,
    citas_mes:            24,
    servicios_publicados: 6,
    servicios_total:      7,
    mascotas_total:       12,
    mascotas_publicas:    4,
    clientes_total:       9,
    pendientes_revision:  6,
    distribucion: {
      pendiente:  6,
      confirmada: 10,
      atendida:   6,
      cancelada:  2,
    },
  }
}

export async function getCitasHoy(): Promise<Cita[]> {
  return [
    {
      id: '1', referencia: 'HV-2026-0184',
      propietario_nombre: 'Lucía Torres',
      propietario_email:  'lucia.torres@example.com',
      propietario_telefono: '+34 600 123 456',
      mascota_nombre: 'Luna', servicio_nombre: 'Consulta general',
      fecha_preferida: '2026-11-18', hora_preferida: '10:30',
      motivo: 'Revisión general.', estado: 'pendiente',
      created_at: '2026-11-17T09:15:00Z',
    },
    {
      id: '2', referencia: 'HV-2026-0185',
      propietario_nombre: 'Mateo Ruiz',
      propietario_email:  'mateo.ruiz@example.com',
      propietario_telefono: '+34 600 234 567',
      mascota_nombre: 'Nilo', servicio_nombre: 'Vacunación',
      fecha_preferida: '2026-11-18', hora_preferida: '11:00',
      motivo: 'Vacuna anual.', estado: 'confirmada',
      created_at: '2026-11-17T10:00:00Z',
    },
    {
      id: '3', referencia: 'HV-2026-0186',
      propietario_nombre: 'Elena Vidal',
      propietario_email:  'elena.vidal@example.com',
      propietario_telefono: '+34 600 345 678',
      mascota_nombre: 'Coco', servicio_nombre: 'Medicina preventiva',
      fecha_preferida: '2026-11-18', hora_preferida: '12:00',
      motivo: 'Revisión preventiva.', estado: 'confirmada',
      created_at: '2026-11-17T11:00:00Z',
    },
  ]
}
