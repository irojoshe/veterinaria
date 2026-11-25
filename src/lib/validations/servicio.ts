import { z } from 'zod'

export const optionalUrlSchema = z.union([
  z.literal(''),
  z.string().trim().url('Introduce una URL válida.'),
])

/**
 * Service form contract. `precio` allows 0 because the column is
 * `numeric NOT NULL DEFAULT 0 CHECK (precio >= 0)`.
 */
export const servicioSchema = z.object({
  id: z.string().optional(),
  nombre: z.string().trim().min(2, 'El nombre es obligatorio.'),
  descripcion: z.string().trim().min(10, 'Añade una descripción.'),
  precio: z.coerce.number().nonnegative('El precio no puede ser negativo.'),
  duracion_minutos: z.coerce.number().int().positive('Indica la duración.'),
  publicado: z.boolean(),
  imagen_url: optionalUrlSchema,
  imagekit_file_id: z.string().nullable(),
})

export type ServicioFormValues = z.infer<typeof servicioSchema>
