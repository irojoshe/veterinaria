'use client'

import { useActionState, useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { citaSchema, type CitaFormValues } from '@/lib/validations/cita'
import { crearCita, type ActionResult } from '../actions'
import Button from '@/components/ui/Button'
import SeccionPropietario from './SeccionPropietario'
import SeccionMascota from './SeccionMascota'
import SeccionPreferencias from './SeccionPreferencias'
import ResumenCita from './ResumenCita'
import type { Servicio } from '@/lib/types'

interface Props { servicios: Servicio[] }

export default function CitaForm({ servicios }: Props) {
  const [state, formAction, isPending] = useActionState<ActionResult | null, FormData>(
    crearCita,
    null
  )

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CitaFormValues>({
    resolver: zodResolver(citaSchema),
    defaultValues: { _hp: '', acepta_privacidad: false },
  })

  // Observa los valores para el resumen en tiempo real
  const watched = useWatch({ control })

  // Muestra errores del servidor en consola (puedes conectar a un toast)
  useEffect(() => {
    if (state && !state.success) {
      console.error('[crearCita]', state.error)
    }
  }, [state])

  // Convierte el objeto RHF a FormData y llama la Server Action
  function onSubmit(data: CitaFormValues) {
    const fd = new FormData()
    Object.entries(data).forEach(([k, v]) => {
      if (v !== undefined && v !== null) fd.set(k, String(v))
    })
    formAction(fd)
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-label="Formulario de solicitud de cita"
    >
      {/* ── Honeypot: oculto para humanos, visible para bots ─────────── */}
      <input
        type="text"
        tabIndex={-1}
        aria-hidden="true"
        autoComplete="off"
        className="absolute -left-[9999px] opacity-0 pointer-events-none"
        {...register('_hp')}
      />

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Columna izquierda: formulario */}
        <div className="flex flex-col gap-6 flex-1 min-w-0">
          <SeccionPropietario register={register} errors={errors} />
          <SeccionMascota     register={register} errors={errors} />
          <SeccionPreferencias
            register={register}
            errors={errors}
            servicios={servicios}
          />

          {/* Privacidad y envío */}
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
        </div>

        {/* Columna derecha: resumen + aviso urgencia */}
        <div className="flex flex-col gap-4 w-full lg:w-panel-md shrink-0">
          <ResumenCita values={watched} />

          <div className="flex flex-col gap-3 p-5 rounded-lg bg-background-surface
                          border border-border">
            <p className="text-14 font-semibold text-text-main">¿Necesitas orientación?</p>
            <p className="text-13 text-text-muted">
              Podemos ayudarte a elegir el servicio antes de enviar tu solicitud.
            </p>
            <a
              href="https://wa.me/34900123456"
              target="_blank"
              rel="noopener noreferrer"
              className="text-14 font-semibold text-primary hover:underline
                         focus-visible:outline-none focus-visible:ring-2
                         focus-visible:ring-primary rounded-sm"
            >
              Consultar por WhatsApp
            </a>
            <p className="text-12 text-text-muted">Lun–vie 09:00–19:00 · Sáb 10:00–14:00</p>
          </div>

          <p className="text-12 text-status-cancelled px-1">
            Si tu mascota necesita atención urgente, no esperes respuesta a esta
            solicitud. Contacta con un servicio veterinario de urgencias.
          </p>
        </div>
      </div>
    </form>
  )
}
