'use client'

import { useMemo, useState } from 'react'
import type { Notificacion } from '@/lib/types'
import NotificacionTableRow from './NotificacionTableRow'

const TODOS = '__todos__'

interface Props {
  notificaciones: Notificacion[]
}

interface EstadoOption {
  key: string
  label: string
  count: number
}

export default function TablaNotificaciones({ notificaciones }: Props) {
  const [estadoSeleccionado, setEstadoSeleccionado] = useState(TODOS)

  const estados = useMemo<EstadoOption[]>(() => {
    const opciones = new Map<string, EstadoOption>()

    for (const notificacion of notificaciones) {
      const key = normalizeEstado(notificacion.estado)
      const existente = opciones.get(key)

      if (existente) {
        existente.count += 1
      } else {
        opciones.set(key, {
          key,
          label: notificacion.estado.trim() || 'Sin estado',
          count: 1,
        })
      }
    }

    return Array.from(opciones.values())
  }, [notificaciones])

  const notificacionesFiltradas = useMemo(
    () =>
      estadoSeleccionado === TODOS
        ? notificaciones
        : notificaciones.filter(
            (notificacion) => normalizeEstado(notificacion.estado) === estadoSeleccionado,
          ),
    [estadoSeleccionado, notificaciones],
  )

  const mostrarError = notificaciones.some((notificacion) => Boolean(notificacion.error))
  const gridTemplateColumns = mostrarError
    ? '1fr 1.5fr 100px 1.4fr 150px minmax(180px, 1.5fr)'
    : '1fr 1.5fr 100px 1.4fr 150px'

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex flex-wrap gap-2" aria-label="Filtrar por estado">
          <EstadoChip
            label="Todos"
            count={notificaciones.length}
            activo={estadoSeleccionado === TODOS}
            onClick={() => setEstadoSeleccionado(TODOS)}
          />
          {estados.map((estado) => (
            <EstadoChip
              key={estado.key}
              label={estado.label}
              count={estado.count}
              activo={estadoSeleccionado === estado.key}
              onClick={() => setEstadoSeleccionado(estado.key)}
            />
          ))}
        </div>
        <p className="text-13 text-text-muted">
          Mostrando {notificacionesFiltradas.length} de {notificaciones.length}
        </p>
      </div>

      <div className="border border-border rounded-lg overflow-x-auto">
        <div className="min-w-[1000px]">
          <div
            className="grid gap-3.5 px-4 py-3 bg-accent-green-light text-11 font-bold
                       text-text-muted uppercase tracking-wide"
            style={{ gridTemplateColumns }}
          >
            <span>Tipo</span>
            <span>Destinatario</span>
            <span>Estado</span>
            <span>Cita relacionada</span>
            <span>Fecha</span>
            {mostrarError && <span>Error</span>}
          </div>

          {notificacionesFiltradas.map((notificacion, index) => (
            <NotificacionTableRow
              key={notificacion.id}
              notificacion={notificacion}
              esUltimo={index === notificacionesFiltradas.length - 1}
              mostrarError={mostrarError}
            />
          ))}

          {notificacionesFiltradas.length === 0 && (
            <div className="px-4 py-10 text-center text-14 text-text-muted bg-background-surface">
              No hay notificaciones para el estado seleccionado.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function normalizeEstado(estado: string): string {
  return estado.trim().toLocaleLowerCase('es-ES')
}

function EstadoChip({
  label,
  count,
  activo,
  onClick,
}: {
  label: string
  count: number
  activo: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={activo}
      className={`inline-flex items-center px-3 py-1.5 rounded-full text-12 font-semibold
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary
                  ${activo
                    ? 'bg-accent-green-light text-primary'
                    : 'bg-background border border-border text-text-muted'}`}
    >
      {label} · {count}
    </button>
  )
}
