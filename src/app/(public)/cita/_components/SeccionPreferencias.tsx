import type { UseFormRegister, FieldErrors } from 'react-hook-form'
import { forwardRef } from 'react'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'
import type { CitaFormValues } from '@/lib/validations/cita'
import type { Servicio } from '@/lib/types'

interface Props {
  register: UseFormRegister<CitaFormValues>
  errors: FieldErrors<CitaFormValues>
  servicios: Servicio[]
}

const HORAS_ORIENTATIVAS = ['10:00', '10:30', '11:00', '11:30', '12:00']

export default function SeccionPreferencias({ register, errors, servicios }: Props) {
  return (
    <Card className="flex flex-col gap-5">
      <h2 className="text-19 font-semibold text-text-main">03 · Preferencias de cita</h2>

      {/* Servicio */}
      <div className="flex flex-col gap-1.5">
        <label className="text-13 font-semibold text-text-main">Servicio *</label>
        <select
          className={`w-full h-btn px-3.5 rounded-md text-14 text-text-main
                      bg-background-surface border transition-colors outline-none
                      focus:ring-2 focus:ring-primary
                      ${errors.servicio ? 'border-status-cancelled' : 'border-border'}`}
          {...register('servicio')}
        >
          <option value="">Selecciona un servicio</option>
          {servicios.map((s) => (
            <option key={s.id} value={s.slug}>
              {s.nombre} · {s.precio} € · {s.duracion_minutos} min
            </option>
          ))}
        </select>
        {errors.servicio && (
          <p className="text-12 text-status-cancelled">{errors.servicio.message}</p>
        )}
      </div>

      {/* Fecha y hora */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Fecha preferida *"
          type="date"
          error={errors.fecha_preferida?.message}
          {...register('fecha_preferida')}
        />
        <Input
          label="Hora preferida *"
          type="time"
          error={errors.hora_preferida?.message}
          {...register('hora_preferida')}
        />
      </div>

      {/* Horas orientativas */}
      <div className="flex flex-col gap-1.5">
        <p className="text-12 text-text-muted">Horarios orientativos disponibles:</p>
        <div className="flex gap-2 flex-wrap">
          {HORAS_ORIENTATIVAS.map((h) => (
            <span
              key={h}
              className="px-2.5 py-1 rounded-full text-12 font-semibold
                         bg-background text-text-muted border border-border"
            >
              {h}
            </span>
          ))}
        </div>
        <p className="text-12 text-text-muted">
          Fecha y hora son preferencias, no disponibilidad garantizada.
        </p>
      </div>

      {/* Motivo */}
      <div className="flex flex-col gap-1.5">
        <label className="text-13 font-semibold text-text-main">Motivo de consulta *</label>
        <textarea
          rows={3}
          placeholder="Describe brevemente el motivo de la visita..."
          className={`w-full px-3.5 py-3.5 rounded-md text-14 text-text-main
                      bg-background-surface border transition-colors outline-none resize-none
                      focus:ring-2 focus:ring-primary placeholder:text-text-muted
                      ${errors.motivo ? 'border-status-cancelled' : 'border-border'}`}
          {...register('motivo')}
        />
        {errors.motivo
          ? <p className="text-12 text-status-cancelled">{errors.motivo.message}</p>
          : <p className="text-12 text-text-muted">No incluyas información sensible innecesaria.</p>
        }
      </div>
    </Card>
  )
}
