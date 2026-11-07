import type { Metadata } from 'next'
import Card from '@/components/ui/Card'
import { getServiciosPublicos } from '@/lib/services/servicios'
import CitaForm from './_components/CitaForm'

export const metadata: Metadata = {
  title: 'Solicitar cita',
  description:
    'Solicita una visita veterinaria en Huella Vet sin crear una cuenta. Confirmamos por teléfono o email.',
}

export default async function CitaPage() {
  const servicios = await getServiciosPublicos()

  return (
    <div className="max-w-content mx-auto w-full px-6 md:px-20 py-12 flex flex-col gap-8">
      {/* Cabecera */}
      <div className="flex flex-col gap-4 max-w-2xl">
        <span className="text-12 font-bold tracking-wide uppercase text-primary">
          Sin registro
        </span>
        <h1 className="text-32 md:text-52 font-semibold text-text-heading leading-tight">
          Cuéntanos cómo podemos ayudar.
        </h1>
        <p className="text-18 text-text-muted leading-relaxed">
          Revisaremos tu petición y te contactaremos para confirmar fecha y hora.
        </p>
      </div>

      {/* Aviso informativo */}
      <Card className="bg-accent-blue-light border-none flex flex-row gap-3 items-start">
        <span className="text-20 leading-none shrink-0" aria-hidden="true">ℹ</span>
        <div className="flex flex-col gap-1">
          <p className="text-14 font-semibold text-text-main">
            Solicitud, no reserva confirmada
          </p>
          <p className="text-13 text-text-muted">
            Fecha y hora son preferencias sujetas a confirmación.
            Los campos con * son obligatorios.
          </p>
        </div>
      </Card>

      {/* Formulario */}
      <CitaForm servicios={servicios} />
    </div>
  )
}
