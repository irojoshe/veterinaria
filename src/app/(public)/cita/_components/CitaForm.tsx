'use client'

import { useActionState, useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { citaSchema, type CitaFormValues } from '@/lib/validations/cita'
import { crearCita, type ActionResult } from '../actions'
import SeccionPropietario from './SeccionPropietario'
import SeccionMascota from './SeccionMascota'
import SeccionPreferencias from './SeccionPreferencias'
import CitaEnvio from './CitaEnvio'
import CitaLateral from './CitaLateral'
import type { ServicioPublico } from '@/lib/types'

interface Props { servicios: ServicioPublico[] }

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
        className="sr-only"
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

          <CitaEnvio
            register={register}
            errors={errors}
            state={state}
            isPending={isPending}
          />
        </div>

        {/* Columna derecha: resumen + aviso urgencia */}
        <CitaLateral values={watched} />
      </div>
    </form>
  )
}
