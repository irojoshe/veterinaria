'use client'

import { FieldErrors, UseFormRegister } from 'react-hook-form'
import { citaSchema, type CitaFormValues } from '@/lib/validations/cita'
import { ActionResult } from '../actions'
import Button from '@/components/ui/Button'

interface Props {
  register: UseFormRegister<CitaFormValues>
  errors: FieldErrors<CitaFormValues>
  state: ActionResult | null
  isPending: boolean
}

export default function CitaEnvio({ register, errors, state, isPending }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          className="mt-0.5 w-5 h-5 rounded-sm border-border accent-primary"
          {...register('acepta_privacidad')}
        />
        <span className="text-13 text-text-main">
          He leído el aviso de privacidad y autorizo el uso de mis datos
          para gestionar esta solicitud. *
        </span>
      </label>
      {errors.acepta_privacidad && (
        <p className="text-12 text-status-cancelled" role="alert">
          {errors.acepta_privacidad.message}
        </p>
      )}

      <p className="text-12 text-text-muted">
        No necesitas crear una cuenta. Los campos con * son obligatorios.
      </p>

      {/* Error del servidor */}
      {state && !state.success && (
        <div
          role="alert"
          className="flex items-start gap-3 p-4 rounded-lg
                     bg-status-cancelled-bg text-status-cancelled text-13"
        >
          <span aria-hidden="true">⚠</span>
          <span>{state.error}</span>
        </div>
      )}

      <Button
        type="submit"
        size="lg"
        fullWidth
        loading={isPending}
        disabled={isPending}
      >
        {isPending ? 'Enviando…' : 'Enviar solicitud →'}
      </Button>

      <p className="text-12 text-text-muted text-center">
        Al enviarla recibirás un email de recepción. Tu cita solo estará
        confirmada cuando la clínica te lo comunique.
      </p>
    </div>
  )
}
