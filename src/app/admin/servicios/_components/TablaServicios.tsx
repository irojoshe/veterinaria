'use client'

import { useState } from 'react'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import FormServicio from './FormServicio'
import { eliminarServicio } from '../actions'
import PaginationControls from '../../_components/shared/PaginationControls'
import DeleteModal from '../../_components/shared/DeleteModal'
import ServicioTableRow from './ServicioTableRow'
import type { Servicio } from '@/lib/types'

const PAGE_SIZE = 6

interface Props {
  servicios: Servicio[]
}

export default function TablaServicios({ servicios }: Props) {
  const [pagina, setPagina] = useState(1)
  const [editando, setEditando] = useState<Servicio | null | 'nuevo'>(null)
  const [eliminandoId, setEliminandoId] = useState<string | null>(null)

  const total = servicios.length
  const paginas = Math.ceil(total / PAGE_SIZE)
  const slice = servicios.slice((pagina - 1) * PAGE_SIZE, pagina * PAGE_SIZE)
  const eliminando = servicios.find((s) => s.id === eliminandoId)

  return (
    <>
      <div className="flex justify-end">
        <Button size="sm" onClick={() => setEditando('nuevo')}>
          + Nuevo servicio
        </Button>
      </div>

      <div className="border border-border rounded-lg overflow-hidden">
        <div
          className="grid grid-cols-[64px_1fr_80px_80px_100px_120px] gap-3.5
                     px-4 py-3 bg-accent-green-light
                     text-11 font-bold text-text-muted uppercase tracking-wide"
        >
          <span>Imagen</span>
          <span>Nombre</span>
          <span>Precio</span>
          <span>Duración</span>
          <span>Publicación</span>
          <span>Acciones</span>
        </div>

        {slice.map((s, i) => (
          <ServicioTableRow
            key={s.id}
            servicio={s}
            esUltimo={i === slice.length - 1}
            onEditar={() => setEditando(s)}
            onEliminar={() => setEliminandoId(s.id)}
          />
        ))}
      </div>

      {paginas > 1 && (
        <PaginationControls
          pagina={pagina}
          paginas={paginas}
          onChange={setPagina}
          total={total}
          pageSize={PAGE_SIZE}
        />
      )}

      <Modal
        open={editando !== null}
        onClose={() => setEditando(null)}
        title={
          editando === 'nuevo'
            ? 'Nuevo servicio'
            : `Editar · ${(editando as Servicio)?.nombre}`
        }
        size="md"
      >
        <FormServicio
          servicio={editando === 'nuevo' ? undefined : (editando as Servicio)}
          onSuccess={() => setEditando(null)}
        />
      </Modal>

      <DeleteModal
        id={eliminandoId}
        nombre={eliminando?.nombre}
        onClose={() => setEliminandoId(null)}
        action={eliminarServicio}
      />
    </>
  )
}
