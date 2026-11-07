import type { UseFormRegister, FieldErrors } from 'react-hook-form'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'
import type { CitaFormValues } from '@/lib/validations/cita'

interface Props {
  register: UseFormRegister<CitaFormValues>
  errors: FieldErrors<CitaFormValues>
}

const ESPECIES = ['Perro', 'Gato', 'Conejo', 'Ave', 'Otro']
const SEXOS    = ['Macho', 'Hembra']

export default function SeccionMascota({ register, errors }: Props) {
  return (
    <Card className="flex flex-col gap-5">
      <h2 className="text-19 font-semibold text-text-main">02 · Tu mascota</h2>

      <Input
        label="Nombre de la mascota *"
        placeholder="¿Cómo se llama?"
        error={errors.mascota_nombre?.message}
        {...register('mascota_nombre')}
      />

      <div className="grid grid-cols-2 gap-4">
        <SelectField
          label="Especie *"
          options={ESPECIES}
          error={errors.especie?.message}
          {...register('especie')}
        />
        <Input
          label="Raza"
          placeholder="Ej. Golden retriever"
          {...register('raza')}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <SelectField
          label="Sexo"
          options={SEXOS}
          placeholder="Selecciona"
          {...register('sexo')}
        />
        <Input
          label="Fecha de nacimiento"
          type="date"
          helperText="Si no la conoces, deja en blanco."
          {...register('fecha_nacimiento')}
        />
      </div>

      <Input
        label="Identificación / microchip"
        placeholder="Opcional"
        helperText="No se mostrará públicamente."
        {...register('microchip')}
      />
    </Card>
  )
}

/* ── SelectField ─────────────────────────────────────────────────────────── */
import { forwardRef } from 'react'

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  options: string[]
  error?: string
  placeholder?: string
}

const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, options, error, placeholder, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-13 font-semibold text-text-main">{label}</label>
      <select
        ref={ref}
        className={`w-full h-btn px-3.5 rounded-md text-14 text-text-main
                    bg-background-surface border transition-colors outline-none
                    focus:ring-2 focus:ring-primary
                    ${error ? 'border-status-cancelled' : 'border-border'}`}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      {error && <p className="text-12 text-status-cancelled">{error}</p>}
    </div>
  )
)
SelectField.displayName = 'SelectField'
