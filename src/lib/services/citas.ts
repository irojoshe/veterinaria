import type { Cita, EstadoCita } from '@/lib/types'

/** TODO: reemplazar con Supabase */

const CITAS_MOCK: Cita[] = [
  {
    id: '1', referencia: 'HV-2026-0184',
    propietario_nombre: 'Lucía Torres',
    propietario_email: 'lucia.torres@example.com',
    propietario_telefono: '+34 600 123 456',
    mascota_nombre: 'Luna', servicio_nombre: 'Consulta general',
    fecha_preferida: '2026-11-18', hora_preferida: '10:30',
    motivo: 'Revisión general. Luna tiene menos apetito desde hace dos días.',
    estado: 'pendiente', created_at: '2026-11-17T09:15:00Z',
  },
  {
    id: '2', referencia: 'HV-2026-0185',
    propietario_nombre: 'Mateo Ruiz',
    propietario_email: 'mateo.ruiz@example.com',
    propietario_telefono: '+34 600 234 567',
    mascota_nombre: 'Nilo', servicio_nombre: 'Vacunación',
    fecha_preferida: '2026-11-18', hora_preferida: '11:00',
    motivo: 'Vacuna anual pendiente.', estado: 'confirmada',
    created_at: '2026-11-17T10:00:00Z',
  },
  {
    id: '3', referencia: 'HV-2026-0186',
    propietario_nombre: 'Elena Vidal',
    propietario_email: 'elena.vidal@example.com',
    propietario_telefono: '+34 600 345 678',
    mascota_nombre: 'Coco', servicio_nombre: 'Medicina preventiva',
    fecha_preferida: '2026-11-18', hora_preferida: '12:00',
    motivo: 'Revisión preventiva anual.', estado: 'confirmada',
    created_at: '2026-11-17T11:00:00Z',
  },
  {
    id: '4', referencia: 'HV-2026-0179',
    propietario_nombre: 'Lucía Torres',
    propietario_email: 'lucia.torres@example.com',
    propietario_telefono: '+34 600 123 456',
    mascota_nombre: 'Luna', servicio_nombre: 'Vacunación',
    fecha_preferida: '2026-11-17', hora_preferida: '16:00',
    motivo: 'Vacunación de refuerzo.', estado: 'atendida',
    created_at: '2026-11-10T08:00:00Z',
  },
  {
    id: '5', referencia: 'HV-2026-0180',
    propietario_nombre: 'Daniel Gil',
    propietario_email: 'daniel.gil@example.com',
    propietario_telefono: '+34 600 456 789',
    mascota_nombre: 'Milo', servicio_nombre: 'Consulta general',
    fecha_preferida: '2026-11-17', hora_preferida: '17:00',
    motivo: 'Cojera leve en pata trasera.', estado: 'cancelada',
    created_at: '2026-11-10T09:00:00Z',
  },
  {
    id: '6', referencia: 'HV-2026-0187',
    propietario_nombre: 'Sara León',
    propietario_email: 'sara.leon@example.com',
    propietario_telefono: '+34 600 567 890',
    mascota_nombre: 'Oliva', servicio_nombre: 'Cuidado e higiene',
    fecha_preferida: '2026-11-19', hora_preferida: '09:30',
    motivo: 'Revisión de piel y oídos.', estado: 'pendiente',
    created_at: '2026-11-15T14:00:00Z',
  },
]

export async function getCitas(): Promise<Cita[]> {
  return CITAS_MOCK
}

export async function getCitaById(id: string): Promise<Cita | null> {
  return CITAS_MOCK.find((c) => c.id === id) ?? null
}

export async function updateEstadoCita(
  id: string,
  estado: EstadoCita
): Promise<{ success: boolean }> {
  // TODO: supabase.from('citas').update({ estado }).eq('id', id)
  console.log(`[mock] updateEstadoCita id=${id} estado=${estado}`)
  return { success: true }
}
