'use client'

import { type CitaFormValues } from '@/lib/validations/cita'
import ResumenCita from './ResumenCita'

interface Props {
  values: Partial<CitaFormValues>
}

export default function CitaLateral({ values }: Props) {
  return (
    <div className="flex flex-col gap-4 w-full lg:w-panel-md shrink-0">
      <ResumenCita values={values} />

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
  )
}
