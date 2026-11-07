import type { UseFormRegister, FieldErrors } from 'react-hook-form'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'
import type { CitaFormValues } from '@/lib/validations/cita'

interface Props {
  register: UseFormRegister<CitaFormValues>
  errors: FieldErrors<CitaFormValues>
}

export default function SeccionPropietario({ register, errors }: Props) {
  return (
    <Card className="flex flex-col gap-5">
      <h2 className="text-19 font-semibold text-text-main">01 · Sobre ti</h2>

      <Input
        label="Nombre y apellidos *"
        placeholder="Tu nombre completo"
        autoComplete="name"
        error={errors.nombre?.message}
        {...register('nombre')}
      />

      <Input
        label="Teléfono *"
        placeholder="+34 600 000 000"
        type="tel"
        autoComplete="tel"
        error={errors.telefono?.message}
        helperText={
          !errors.telefono
            ? 'Te contactaremos para confirmar.'
            : undefined
        }
        {...register('telefono')}
      />

      <Input
        label="Correo electrónico *"
        placeholder="tu@email.com"
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        helperText={
          !errors.email
            ? 'Recibirás una copia de la solicitud.'
            : undefined
        }
        {...register('email')}
      />
    </Card>
  )
}
