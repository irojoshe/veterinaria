'use client'

import { useMemo, useState } from 'react'
import type { Cita, Cliente } from '@/lib/types'
import ClienteTableRow from './ClienteTableRow'
import DetalleClienteModal from './DetalleClienteModal'

interface Props {
  clientes: Cliente[]
  citas: Cita[]
}

export default function TablaClientes({ clientes, citas }: Props) {
  const [busqueda, setBusqueda] = useState('')
  const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null)

  const clientesFiltrados = useMemo(() => {
    const termino = busqueda.trim().toLocaleLowerCase('es-ES')

    if (!termino) return clientes

    return clientes.filter((cliente) =>
      [cliente.nombre, cliente.email, cliente.telefono].some((valor) =>
        valor.toLocaleLowerCase('es-ES').includes(termino),
      ),
    )
  }, [busqueda, clientes])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex flex-col gap-1">
          <label
            htmlFor="buscar-clientes"
            className="text-13 font-semibold text-text-main"
          >
            Buscar clientes
          </label>
          <input
            id="buscar-clientes"
            type="search"
            value={busqueda}
            onChange={(event) => setBusqueda(event.target.value)}
            placeholder="Nombre, email o teléfono"
            className="h-9 w-full sm:w-80 px-3 rounded-md text-13 text-text-main
                       bg-background-surface border border-border outline-none
                       placeholder:text-text-muted focus:ring-2 focus:ring-primary"
          />
        </div>
        <p className="text-13 text-text-muted">
          Mostrando {clientesFiltrados.length} de {clientes.length}
        </p>
      </div>

      <div className="border border-border rounded-lg overflow-x-auto">
        <div className="min-w-[900px]">
          <div
            className="grid grid-cols-[1.2fr_1.5fr_1.1fr_80px_130px_110px] gap-3.5
                       px-4 py-3 bg-accent-green-light text-11 font-bold
                       text-text-muted uppercase tracking-wide"
          >
            <span>Cliente</span>
            <span>Email</span>
            <span>Teléfono</span>
            <span>Citas</span>
            <span>Última cita</span>
            <span>Acción</span>
          </div>

          {clientesFiltrados.map((cliente, index) => (
            <ClienteTableRow
              key={cliente.email}
              cliente={cliente}
              esUltimo={index === clientesFiltrados.length - 1}
              onVerHistorial={() => setClienteSeleccionado(cliente)}
            />
          ))}

          {clientesFiltrados.length === 0 && (
            <div className="px-4 py-10 text-center text-14 text-text-muted bg-background-surface">
              No hay clientes que coincidan con la búsqueda.
            </div>
          )}
        </div>
      </div>

      <DetalleClienteModal
        cliente={clienteSeleccionado}
        citas={citas}
        onClose={() => setClienteSeleccionado(null)}
      />
    </div>
  )
}
