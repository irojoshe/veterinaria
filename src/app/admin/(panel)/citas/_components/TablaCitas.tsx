'use client'

import { useState, useMemo } from 'react'
import FiltroCitas, { type FiltroEstado } from './FiltroCitas'
import DetalleCitaModal from './DetalleCitaModal'
import FilaCita from './FilaCita'
import type { Cita, EstadoCita } from '@/lib/types'

const COLS = ['Fecha / hora', 'Propietario / mascota', 'Servicio', 'Estado', 'Referencia', 'Acciones']

interface Props { citas: Cita[] }

export default function TablaCitas({ citas }: Props) {
  const [filtro,       setFiltro]       = useState<FiltroEstado>('todas')
  const [busqueda,     setBusqueda]     = useState('')
  const [seleccionada, setSeleccionada] = useState<Cita | null>(null)

  const totales = useMemo(() => {
    const base: Record<FiltroEstado, number> = {
      todas: citas.length, pendiente: 0, confirmada: 0, atendida: 0, cancelada: 0,
    }
    citas.forEach((c) => { base[c.estado as EstadoCita]++ })
    return base
  }, [citas])

  const citasFiltradas = useMemo(() => {
    const q = busqueda.toLowerCase()
    return citas.filter((c) => {
      const coincideFiltro  = filtro === 'todas' || c.estado === filtro
      const coincideBusqueda =
        !q ||
        c.propietario_nombre.toLowerCase().includes(q) ||
        c.mascota_nombre.toLowerCase().includes(q) ||
        c.referencia.toLowerCase().includes(q)
      return coincideFiltro && coincideBusqueda
    })
  }, [citas, filtro, busqueda])

  return (
    <>
      <div className="flex flex-col gap-5">
        <FiltroCitas
          filtroActivo={filtro}
          busqueda={busqueda}
          totalPorEstado={totales}
          onFiltro={setFiltro}
          onBusqueda={setBusqueda}
        />

        <p className="text-13 font-semibold text-text-main">
          Mostrando {citasFiltradas.length} de {citas.length} citas
        </p>

        {citasFiltradas.length === 0 ? (
          <EmptyState onLimpiar={() => { setFiltro('todas'); setBusqueda('') }} />
        ) : (
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="grid grid-cols-6 gap-3.5 px-4 py-3 bg-accent-green-light
                            text-11 font-bold text-text-muted uppercase tracking-wide"
                 role="row">
              {COLS.map((c) => <span key={c} role="columnheader">{c}</span>)}
            </div>
            {citasFiltradas.map((cita, i) => (
              <FilaCita
                key={cita.id}
                cita={cita}
                ultimo={i === citasFiltradas.length - 1}
                onClick={() => setSeleccionada(cita)}
              />
            ))}
          </div>
        )}
      </div>

      <DetalleCitaModal
        cita={seleccionada}
        onClose={() => setSeleccionada(null)}
      />
    </>
  )
}

function EmptyState({ onLimpiar }: { onLimpiar: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 py-16 bg-background-surface
                    border border-border rounded-lg">
      <p className="text-20 font-semibold text-text-main">
        No encontramos citas con estos filtros
      </p>
      <p className="text-14 text-text-muted">Prueba otro nombre o amplía los filtros.</p>
      <button
        onClick={onLimpiar}
        className="text-14 font-semibold text-primary hover:underline
                   focus-visible:outline-none focus-visible:ring-2
                   focus-visible:ring-primary rounded-sm"
      >
        Limpiar filtros
      </button>
    </div>
  )
}
