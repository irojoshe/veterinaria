import { z } from 'zod'

export const SEXOS_MASCOTA = ['macho', 'hembra'] as const
export const ESTADOS_ADOPCION = ['disponible', 'reservado', 'vendido'] as const

export const optionalUrlSchema = z.union([
  z.literal(''),
  z.string().trim().url('Introduce una URL válida.'),
])

/**
 * `sexo` is a CHECK constrained column: only 'macho', 'hembra' or NULL are
 * accepted. An empty select value is normalized to NULL so the row is never
 * rejected by `mascotas_sexo_check`.
 */
export const sexoMascotaSchema = z
  .preprocess(
    (value) => (typeof value === 'string' ? value.trim().toLowerCase() : value),
    z.union([z.literal(''), z.enum(SEXOS_MASCOTA)]),
  )
  .transform((value) => (value === '' ? null : value))

/** `fecha_nacimiento` is a `date` column: an empty value becomes NULL. */
export const fechaNacimientoSchema = z
  .union([
    z.literal(''),
    z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha de nacimiento no válida.'),
  ])
  .transform((value) => (value === '' ? null : value))

export const mascotaSchema = z.object({
  id: z.string().optional(),
  nombre: z.string().trim().min(1, 'El nombre es obligatorio.'),
  especie: z.string().trim().min(1, 'Indica la especie.'),
  raza: z.string().trim().optional().default(''),
  publicado: z.boolean(),
  foto_url: optionalUrlSchema,
  imagekit_file_id: z.string().nullable(),
  sexo: sexoMascotaSchema,
  fecha_nacimiento: fechaNacimientoSchema,
  precio: z.coerce.number().nonnegative('El precio no puede ser negativo.'),
  historia: z.string().nullable(),
  estado_adopcion: z
    .enum(ESTADOS_ADOPCION, {
      errorMap: () => ({ message: 'Selecciona un estado de adopción válido.' }),
    })
    .default('disponible'),
  vacunado: z.boolean(),
  esterilizado: z.boolean(),
  microchip: z.boolean(),
  compatible_ninos: z.boolean(),
  compatible_mascotas: z.boolean(),
})

export type MascotaFormValues = z.infer<typeof mascotaSchema>
