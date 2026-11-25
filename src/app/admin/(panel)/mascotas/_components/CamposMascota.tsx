'use client'

import Input from '@/components/ui/Input'
import type { Mascota } from '@/lib/types'

const ESTADOS_ADOPCION = [
  { value: 'disponible', label: 'Disponible' },
  { value: 'reservado', label: 'Reservado' },
  { value: 'vendido', label: 'Vendido' },
]

const CHECKBOXES = [
  { name: 'vacunado', label: 'Vacunado', fallback: true },
  { name: 'esterilizado', label: 'Esterilizado', fallback: false },
  { name: 'microchip', label: 'Microchip', fallback: true },
  { name: 'compatible_ninos', label: 'Compatible con niños', fallback: true },
  { name: 'compatible_mascotas', label: 'Compatible con mascotas', fallback: true },
] as const

export interface CamposMascotaValues {
  sexo: string
  fecha_nacimiento: string
  precio: number
  historia: string
  estado_adopcion: string
  vacunado: boolean
  esterilizado: boolean
  microchip: boolean
  compatible_ninos: boolean
  compatible_mascotas: boolean
}

interface Props {
  values: CamposMascotaValues
  onChange: (field: keyof CamposMascotaValues, value: string | number | boolean) => void
  errors?: Record<string, string>
}

export default function CamposMascota({ values, onChange, errors = {} }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-13 font-semibold text-text-main">Sexo</label>
          <select
            name="sexo"
            value={values.sexo}
            onChange={(e) => onChange('sexo', e.target.value)}
            className="h-btn px-3.5 rounded-md text-14 text-text-main
                       bg-background-surface border border-border outline-none
                       focus:ring-2 focus:ring-primary"
          >
            <option value="">Selecciona un sexo</option>
            <option value="macho">Macho</option>
            <option value="hembra">Hembra</option>
          </select>
          {errors.sexo && (
            <p className="text-12 text-status-cancelled">{errors.sexo}</p>
          )}
        </div>
        <Input
          label="Fecha de nacimiento"
          name="fecha_nacimiento"
          type="date"
          value={values.fecha_nacimiento}
          onChange={(e) => onChange('fecha_nacimiento', e.target.value)}
          error={errors.fecha_nacimiento}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Precio (€)"
          name="precio"
          type="number"
          min="0"
          step="0.01"
          value={values.precio}
          onChange={(e) =>
            onChange('precio', e.target.value === '' ? 0 : Number(e.target.value))
          }
          error={errors.precio}
        />
        <div className="flex flex-col gap-1.5">
          <label className="text-13 font-semibold text-text-main">
            Estado de adopción
          </label>
          <select
            name="estado_adopcion"
            value={values.estado_adopcion}
            onChange={(e) => onChange('estado_adopcion', e.target.value)}
            className="h-btn px-3.5 rounded-md text-14 text-text-main
                       bg-background-surface border border-border outline-none
                       focus:ring-2 focus:ring-primary"
          >
            {ESTADOS_ADOPCION.map((estado) => (
              <option key={estado.value} value={estado.value}>
                {estado.label}
              </option>
            ))}
          </select>
          {errors.estado_adopcion && (
            <p className="text-12 text-status-cancelled">{errors.estado_adopcion}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-13 font-semibold text-text-main">Historia</label>
        <textarea
          name="historia"
          rows={4}
          value={values.historia}
          onChange={(e) => onChange('historia', e.target.value)}
          className="w-full px-3.5 py-3.5 rounded-md text-14 text-text-main
                     bg-background-surface border border-border outline-none resize-none
                     focus:ring-2 focus:ring-primary"
        />
        {errors.historia && (
          <p className="text-12 text-status-cancelled">{errors.historia}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-13 font-semibold text-text-main">Características</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {CHECKBOXES.map((checkbox) => (
            <label
              key={checkbox.name}
              className="flex items-center gap-3 cursor-pointer"
            >
              <input
                type="checkbox"
                name={checkbox.name}
                checked={Boolean(values[checkbox.name as keyof CamposMascotaValues])}
                onChange={(e) =>
                  onChange(checkbox.name as keyof CamposMascotaValues, e.target.checked)
                }
                className="mt-0.5 w-5 h-5 rounded-sm border-border accent-primary"
              />
              <span className="text-13 text-text-main">{checkbox.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}
