export interface Servicio {
  id?: string
  nombre: string
  descripcion: string
  precio: number
  duracion_minutos: number
  imagen_url: string | null
  imagekit_file_id: string | null
  publicado: boolean
  slug?: string
}

/**
 * Public service projection. `publicado` is omitted because it is only a filter.
 * See docs/patterns/data-fetching.md.
 */
export type ServicioRow = Servicio & { id: string }
export type ServicioPublico = Omit<Servicio, 'publicado' | 'id'> & { id: string }

/**
 * Admin pet record aligned with the `mascotas` table.
 */
export interface Mascota {
  id?: string
  nombre: string
  especie: string
  raza: string
  sexo: string | null
  fecha_nacimiento: string | null
  foto_url: string | null
  imagekit_file_id: string | null
  publicado: boolean
  precio: number
  historia: string | null
  estado_adopcion: string
  vacunado: boolean
  esterilizado: boolean
  microchip: boolean
  compatible_ninos: boolean
  compatible_mascotas: boolean
}

/**
 * Public pet catalog projection. `publicado` is omitted because it is only a filter.
 * See docs/patterns/data-fetching.md.
 */
export type MascotaRow = Mascota & { id: string }
export type MascotaPublica = Omit<
  Mascota,
  'publicado' | 'id' | 'imagekit_file_id'
> & { id: string }

/**
 * Clinic business data. It reflects the `negocio` table and its complete schedule.
 */
export interface Negocio {
  nombre: string
  descripcion: string
  direccion: string
  telefono: string
  email: string
  whatsapp: string | null
  horario: string
  mapa_url: string | null
  logo_url: string | null
  imagekit_file_id: string | null
}

export type EstadoCita = 'pendiente' | 'confirmada' | 'atendida' | 'cancelada'

export interface Cita {
  id: string
  propietario_nombre: string
  propietario_email: string
  propietario_telefono: string
  mascota_nombre: string
  servicios?: { nombre: string }
  fecha: string
  hora: string
  motivo: string
  estado: EstadoCita
  created_at: string
}

export interface Notificacion {
  id: string
  cita_id: string | null
  tipo: string
  destinatario_email: string
  estado: string
  error: string | null
  created_at: string
  sent_at: string | null
  citas?: { mascota_nombre: string; propietario_nombre: string }
}

export interface Cliente {
  email: string
  nombre: string
  telefono: string
  total_citas: number
  ultima_cita: string | null
}

export interface ResumenEstadisticas {
  totalCitas: number
  citasPendientes: number
  totalMascotas: number
  totalServicios: number
}

export interface ResumenDashboard extends ResumenEstadisticas {
  citas_hoy: number
  citas_hoy_pendientes: number
  citas_hoy_confirmadas: number
  citas_mes: number
  servicios_publicados: number
  servicios_total: number
  mascotas_total: number
  mascotas_publicas: number
  clientes_total: number
  pendientes_revision: number
  distribucion: Record<EstadoCita, number>
}

const CITA_DATE_FORMATTER = new Intl.DateTimeFormat('es-ES', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

export function formatCitaDate(value: string): string {
  const [year, month, day] = value.split('-').map(Number)
  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
    return value
  }

  return CITA_DATE_FORMATTER.format(new Date(year, month - 1, day))
}

export function formatCitaTime(value: string): string {
  return value.slice(0, 5)
}

export function getCitaReference(id: string): string {
  return id.slice(0, 8).toUpperCase()
}
