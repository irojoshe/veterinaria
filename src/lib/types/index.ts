export interface Servicio {
  id: string
  nombre: string
  descripcion: string
  precio: number
  duracion_minutos: number
  imagen_url: string | null
  publicado: boolean
  slug: string
}

export interface Negocio {
  nombre: string
  descripcion: string
  telefono: string
  email: string
  direccion: string
  horario_semana: string
  horario_sabado: string
  horario_domingo: string
  whatsapp: string | null
}

export interface Mascota {
  id: string
  nombre: string
  especie: string
  raza: string
  foto_url: string | null
  slug: string
  publica: boolean
  propietario?: string
}

export type EstadoCita = 'pendiente' | 'confirmada' | 'atendida' | 'cancelada'

export interface Cita {
  id: string
  referencia: string
  propietario_nombre: string
  propietario_email: string
  propietario_telefono: string
  mascota_nombre: string
  servicio_nombre: string
  fecha_preferida: string
  hora_preferida: string
  motivo: string
  estado: EstadoCita
  created_at: string
}

export interface ResumenEstadisticas {
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
