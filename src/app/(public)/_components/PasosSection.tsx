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
    <section className="max-w-content mx-auto w-full px-6 md:px-12 lg:px-20 py-20 md:py-28 flex flex-col gap-12">
      <div className="flex flex-col gap-3 max-w-lg">
        <span className="text-12 font-bold tracking-wide uppercase text-primary">
          Fácil y sin registro
        </span>
        <h2 className="text-32 font-semibold text-text-heading">
          Tu próxima visita, paso a paso.
        </h2>
      </div>

      <div className="flex flex-col md:flex-row gap-10">
        {PASOS.map((paso) => (
          <div key={paso.numero} className="flex flex-col gap-3 flex-1">
            <span className="text-32 font-regular text-primary leading-none">
              {paso.numero}
            </span>
            <h3 className="text-18 font-semibold text-text-main">{paso.titulo}</h3>
            <p className="text-14 text-text-muted leading-relaxed">{paso.texto}</p>
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
