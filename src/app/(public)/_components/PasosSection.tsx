import CtaCita from '@/components/ui/CtaCita'

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
    <section className="max-w-content mx-auto w-full px-page-px md:px-page-px-md lg:px-page-px-lg py-10 md:py-page-h-xl flex flex-col gap-gap-lg">
      <div className="flex flex-col gap-gap-md max-w-lg">
        <span className="text-tiny font-bold tracking-wide uppercase text-brand-primary">
          Fácil y sin registro
        </span>
        <h2 className="text-h2 font-semibold text-text-primary">
          Tu próxima visita, paso a paso.
        </h2>
      </div>

      <div className="flex flex-col md:flex-row gap-6 md:gap-10">
        {PASOS.map((paso) => (
          <div key={paso.numero} className="flex flex-col gap-2.5 md:gap-3 flex-1">
            <span className="text-26 md:text-32 font-normal text-brand-primary leading-[1.45]">
              {paso.numero}
            </span>
            <h3 className="text-h5 md:text-19 font-semibold text-text-main">{paso.titulo}</h3>
            <p className="text-14 text-text-secondary leading-relaxed">{paso.texto}</p>
          </div>
        ))}
      </div>

      <div>
        <CtaCita size="lg" label="Solicitar una cita" className="w-full md:w-auto" />
      </div>
    </section>
  )
}
