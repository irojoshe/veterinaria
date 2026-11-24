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

interface Props {
  mascota?: Mascota
}

/**
 * Fields the `mascotas` table requires. They used to be hidden inputs with
 * empty defaults, which violated `mascotas_sexo_check` and the `date` cast.
 */
export default function CamposMascota({ mascota }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-13 font-semibold text-text-main">Sexo</label>
          <select
            name="sexo"
            defaultValue={mascota?.sexo ?? ''}
            className="h-btn px-3.5 rounded-md text-14 text-text-main
                       bg-background-surface border border-border outline-none
                       focus:ring-2 focus:ring-primary"
          >
            <option value="">Selecciona un sexo</option>
            <option value="macho">Macho</option>
            <option value="hembra">Hembra</option>
          </select>
        </div>
        <Input
          label="Fecha de nacimiento"
          name="fecha_nacimiento"
          type="date"
          defaultValue={mascota?.fecha_nacimiento ?? ''}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Precio (€)"
          name="precio"
          type="number"
          min="0"
          step="0.01"
          defaultValue={mascota?.precio ?? 0}
        />
        <div className="flex flex-col gap-1.5">
          <label className="text-13 font-semibold text-text-main">
            Estado de adopción
          </label>
          <select
            name="estado_adopcion"
            defaultValue={mascota?.estado_adopcion ?? 'disponible'}
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
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-13 font-semibold text-text-main">Historia</label>
        <textarea
          name="historia"
          rows={4}
          defaultValue={mascota?.historia ?? ''}
          className="w-full px-3.5 py-3.5 rounded-md text-14 text-text-main
                     bg-background-surface border border-border outline-none resize-none
                     focus:ring-2 focus:ring-primary"
        />
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
                defaultChecked={
                  mascota ? Boolean(mascota[checkbox.name]) : checkbox.fallback
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
