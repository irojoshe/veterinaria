'use client'

import { useActionState, useEffect } from 'react'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'

interface Props {
  id: string | null
  nombre?: string
  onClose: () => void
  action: (prevState: any, formData: FormData) => Promise<any>
  title?: string
}

export default function DeleteModal({
  id,
  nombre,
  onClose,
  action,
  title = 'Confirmar eliminación',
}: Props) {
  const [state, formAction, isPending] = useActionState(action, null)

  useEffect(() => {
    if (state?.success) onClose()
  }, [state, onClose])

  return (
    <Modal open={Boolean(id)} onClose={onClose} title={title} size="sm">
      <div className="flex flex-col gap-4">
        <p className="text-14 text-text-muted">
          ¿Eliminar <strong className="text-text-main">{nombre}</strong>?
          Esta acción es permanente.
        </p>
        {state && !state.success && (
          <p role="alert" className="text-12 text-status-cancelled">
            {state.error}
          </p>
        )}
        <form action={formAction} className="flex gap-3">
          <input type="hidden" name="id" value={id ?? ''} />
          <Button
            type="submit"
            variant="danger"
            size="sm"
            loading={isPending}
            disabled={isPending}
          >
            Eliminar
          </Button>
          <Button type="button" variant="secondary" size="sm" onClick={onClose}>
            Cancelar
          </Button>
        </form>
      </div>
    </Modal>
  )
}
