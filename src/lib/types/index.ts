export interface Servicio {
  id: string
  nombre: string
  descripcion: string
  precio: number
  duracion_minutos: number
  imagen_url: string | null
  publicado: boolean
  slug?: string
}

/**
 * Servicio del catálogo público: exactamente las columnas que consume la UI
 * pública. `publicado` no se selecciona porque solo se usa como filtro.
 * Ver docs/patterns/data-fetching.md.
 */
export type ServicioPublico = Omit<Servicio, 'publicado'>

/**
 * Mascota del catálogo público: exactamente las columnas que consume la UI
 * pública. `publicado` no se selecciona porque solo se usa como filtro.
 * Ver docs/patterns/data-fetching.md.
 */
export interface MascotaPublica {
  id: string
  nombre: string
  especie: string
  raza: string
  sexo: string
  fecha_nacimiento: string | null
  foto_url: string | null
  precio: number
  historia: string | null
  estado_adopcion: string
}

/**
 * Datos de la clínica. Refleja el esquema real de la tabla `negocio`:
 * un único campo `horario` con el schedule completo.
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
}

/**
 * Mascota del panel de administración.
 *
 * OJO: sigue el mock legacy del panel admin (`publica`, `propietario`).
 * La tabla real `mascotas` usa `publicado` y no tiene `propietario`.
 * Deuda pendiente: alinear el panel admin con el esquema real.
 */
export interface Mascota {
  id: string
  nombre: string
  especie: string
  raza: string
  foto_url: string | null
  slug?: string
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
