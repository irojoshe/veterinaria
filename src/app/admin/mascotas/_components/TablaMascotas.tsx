'use client'

import { useState } from 'react'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import FormMascota from './FormMascota'
import { eliminarMascota } from '../actions'
import PaginationControls from '../../_components/shared/PaginationControls'
import DeleteModal from '../../_components/shared/DeleteModal'
import MascotaTableRow from './MascotaTableRow'
import type { Mascota } from '@/lib/types'

const PAGE_SIZE = 6

interface Props {
  mascotas: Mascota[]
}

export default function TablaMascotas({ mascotas }: Props) {
  const [pagina, setPagina] = useState(1)
  const [editando, setEditando] = useState<Mascota | null | 'nueva'>(null)
  const [eliminandoId, setEliminandoId] = useState<string | null>(null)

  const paginas = Math.ceil(mascotas.length / PAGE_SIZE)
  const slice = mascotas.slice((pagina - 1) * PAGE_SIZE, pagina * PAGE_SIZE)
  const eliminando = mascotas.find((m) => m.id === eliminandoId)

  return (
    <>
      <div className="flex justify-end">
        <Button size="sm" onClick={() => setEditando('nueva')}>
          + Nueva mascota
        </Button>
      </div>

      <div className="border border-border rounded-lg overflow-hidden">
        <div
          className="grid grid-cols-[56px_1fr_1fr_1fr_100px_120px] gap-3.5
                     px-4 py-3 bg-accent-green-light
                     text-11 font-bold text-text-muted uppercase tracking-wide"
        >
          <span>Foto</span>
          <span>Nombre</span>
          <span>Identificación</span>
          <span>Propietario</span>
          <span>Publicación</span>
          <span>Acciones</span>
        </div>

        {slice.map((m, i) => (
          <MascotaTableRow
            key={m.id}
            mascota={m}
            esUltimo={i === slice.length - 1}
            onEditar={() => setEditando(m)}
            onEliminar={() => setEliminandoId(m.id)}
          />
        ))}
      </div>

      {paginas > 1 && (
        <PaginationControls
          pagina={pagina}
          paginas={paginas}
          onChange={setPagina}
          total={mascotas.length}
          pageSize={PAGE_SIZE}
        />
      )}

      <Modal
        open={editando !== null}
        onClose={() => setEditando(null)}
        title={
          editando === 'nueva'
            ? 'Nueva mascota'
            : `Editar · ${(editando as Mascota)?.nombre}`
        }
        size="md"
      >
        <FormMascota
          mascota={editando === 'nueva' ? undefined : (editando as Mascota)}
          onSuccess={() => setEditando(null)}
        />
      </Modal>

      <DeleteModal
        id={eliminandoId}
        nombre={eliminando?.nombre}
        onClose={() => setEliminandoId(null)}
        action={eliminarMascota}
      />
    </>
  )
}
