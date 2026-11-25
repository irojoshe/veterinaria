'use client'

import { clsx } from 'clsx'
import type { EstadoCita } from '@/lib/types'

export type FiltroEstado = EstadoCita | 'todas'

interface Props {
  filtroActivo: FiltroEstado
  busqueda: string
  totalPorEstado: Record<FiltroEstado, number>
  onFiltro: (f: FiltroEstado) => void
  onBusqueda: (v: string) => void
}

const FILTROS: { value: FiltroEstado; label: string }[] = [
  { value: 'todas',     label: 'Todas' },
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'confirmada',label: 'Confirmada' },
  { value: 'atendida',  label: 'Atendida' },
  { value: 'cancelada', label: 'Cancelada' },
]

export default function FiltroCitas({
  filtroActivo,
  busqueda,
  totalPorEstado,
  onFiltro,
  onBusqueda,
}: Props) {
  return (
    <div className="flex flex-col gap-4">
      {/* Chips de estado */}
      <div className="flex items-center gap-2 flex-wrap">
        {FILTROS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => onFiltro(value)}
            className={clsx(
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full',
              'text-12 font-semibold transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
              filtroActivo === value
                ? 'bg-accent-green-light text-primary'
                : 'bg-background text-text-muted border border-border hover:border-primary'
            )}
            aria-pressed={filtroActivo === value}
          >
            {label}
            <span className="opacity-70">· {totalPorEstado[value]}</span>
          </button>
        ))}
      </div>

      {/* Buscador */}
      <input
        type="search"
        value={busqueda}
        onChange={(e) => onBusqueda(e.target.value)}
        placeholder="Buscar por propietario o mascota…"
        className="w-full max-w-sm h-btn px-3.5 rounded-md text-14 text-text-main
                   bg-background-surface border border-border outline-none
                   focus:ring-2 focus:ring-primary placeholder:text-text-muted
                   transition-colors"
        aria-label="Buscar citas"
      />
    </div>
  )
}
