import type { Metadata } from 'next'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'

export const metadata: Metadata = {
  title: 'Solicitud recibida',
  robots: { index: false, follow: false },
}

interface Props {
  searchParams: Promise<{ ref?: string; nombre?: string }>
}

export default async function ConfirmacionPage({ searchParams }: Props) {
  const { ref = '—', nombre = '' } = await searchParams

  const PASOS = [
    {
      titulo: '01 · Recibe una copia',
      texto:  'Te enviamos un email de recepción. No confirma la cita.',
    },
    {
      titulo: '02 · Revisamos tu preferencia',
      texto:  'La clínica comprobará la disponibilidad del horario y el servicio.',
    },
    {
      titulo: '03 · Te contactamos',
      texto:  'Recibirás la confirmación o una propuesta de otra hora.',
    },
  ]

  return (
    <div className="max-w-2xl mx-auto w-full px-6 py-16 flex flex-col gap-8">
      {/* Símbolo */}
      <div className="flex justify-center">
        <div className="w-16 h-16 rounded-full bg-accent-green-light
                        flex items-center justify-center" aria-hidden="true">
          <span className="text-32">✉</span>
        </div>
      </div>

      {/* Encabezado */}
      <div className="flex flex-col gap-3 text-center">
        <span className="text-12 font-bold tracking-wide uppercase text-primary">
          {ref}
        </span>
        <h1 className="text-32 font-semibold text-text-heading">
          {nombre ? `Gracias, ${nombre}.` : 'Gracias.'}<br />
          Hemos recibido tu solicitud.
        </h1>
        <p className="text-18 text-text-muted">
          Tu cita todavía no está confirmada.
        </p>
        <div className="flex justify-center">
          <Badge variant="pending">Pendiente de confirmación</Badge>
        </div>
      </div>

      {/* Resumen referencia */}
      <Card className="flex flex-col gap-3">
        <h2 className="text-19 font-semibold text-text-main">¿Qué ocurre ahora?</h2>
        <div className="flex flex-col gap-4">
          {PASOS.map((paso) => (
            <div key={paso.titulo} className="flex flex-col gap-1">
              <p className="text-14 font-semibold text-text-main">{paso.titulo}</p>
              <p className="text-13 text-text-muted">{paso.texto}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Aviso corrección datos */}
      <Card className="bg-accent-green-light border-none flex gap-3">
        <span className="text-18 shrink-0" aria-hidden="true">✓</span>
        <div className="flex flex-col gap-1">
          <p className="text-14 font-semibold text-text-main">
            ¿Quieres corregir algún dato?
          </p>
          <p className="text-13 text-text-muted">
            Indica la referencia <strong>{ref}</strong> al contactar.
            No vuelvas a enviar la misma solicitud.
          </p>
        </div>
      </Card>

      {/* Acciones */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button asChild fullWidth>
          <Link href="/">Volver al inicio</Link>
        </Button>
        <Button asChild variant="secondary" fullWidth>
          <a
            href="https://wa.me/34900123456"
            target="_blank"
            rel="noopener noreferrer"
          >
            Contactar por WhatsApp
          </a>
        </Button>
      </div>

      <p className="text-12 text-text-muted text-center">
        Referencia y email ilustrativos. No se ha enviado una solicitud real.
      </p>
    </div>
  )
}
