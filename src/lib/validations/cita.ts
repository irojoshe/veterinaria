import { z } from 'zod'

export const citaSchema = z.object({
  // Sobre ti
  nombre:  z.string().min(2, 'Indica tu nombre completo.'),
  telefono: z
    .string()
    .regex(/^\+?[\d\s\-]{9,15}$/, 'Formato de teléfono no válido.'),
  email: z.string().email('Introduce un email válido.'),

  // Tu mascota
  mascota_nombre: z.string().min(1, 'Indica el nombre de tu mascota.'),
  especie:        z.string().min(1, 'Selecciona la especie.'),
  raza:           z.string().optional(),
  sexo:           z.string().optional(),
  fecha_nacimiento: z.string().optional(),
  microchip:      z.string().optional(),

  // Preferencias de cita
  servicio:       z.string().min(1, 'Selecciona un servicio.'),
  fecha_preferida: z
    .string()
    .min(1, 'Indica una fecha preferida.')
    .refine((v) => !isNaN(Date.parse(v)), 'Fecha no válida.'),
  hora_preferida: z.string().min(1, 'Indica una hora preferida.'),
  motivo:         z.string().min(10, 'Describe brevemente el motivo (mín. 10 caracteres).'),

  // Privacidad
  acepta_privacidad: z
    .boolean()
    .refine((v) => v === true, 'Debes aceptar el aviso de privacidad.'),

  // Honeypot — debe estar vacío
  _hp: z.string().max(0),
})

export type CitaFormValues = z.infer<typeof citaSchema>
