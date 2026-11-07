import Link from 'next/link'
import Button from '@/components/ui/Button'

const PASOS = [
  {
    numero: '01',
    titulo: 'Cuéntanos qué necesita',
    texto: 'Elige servicio y comparte los datos de tu mascota.',
  },
  {
    numero: '02',
    titulo: 'Indica tu preferencia',
    texto: 'Propón un día y una hora para la visita.',
  },
  {
    numero: '03',
    titulo: 'Espera la confirmación',
    texto: 'Revisamos tu solicitud y te contactamos para acordar la cita.',
  },
]

export default function PasosSection() {
  return (
    <section className="max-w-6xl mx-auto w-full px-page-px md:px-page-px-md lg:px-page-px-lg py-page-h-xxl md:py-page-h-xl flex flex-col gap-gap-lg">
      <div className="flex flex-col gap-gap-md max-w-lg">
        <span className="text-tiny font-bold tracking-wide uppercase text-brand-primary">
          Fácil y sin registro
        </span>
        <h2 className="text-h2 font-semibold text-text-primary">
          Tu próxima visita, paso a paso.
        </h2>
      </div>

      <div className="flex flex-col md:flex-row gap-huge">
        {PASOS.map((paso) => (
          <div key={paso.numero} className="flex flex-col gap-gap-md flex-1">
            <span className="text-4xl font-regular text-brand-primary leading-none">
              {paso.numero}
            </span>
            <h3 className="text-h5 font-semibold text-text-primary">{paso.titulo}</h3>
            <p className="text-body text-text-secondary leading-relaxed">{paso.texto}</p>
          </div>
        ))}
      </div>

      <div>
        <Button asChild size="lg">
          <Link href="/cita">Solicitar una cita</Link>
        </Button>
      </div>
    </section>
  )
}
