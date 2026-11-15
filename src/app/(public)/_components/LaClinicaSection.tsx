import Link from 'next/link'
import Image from 'next/image'
import Button from '@/components/ui/Button'

export default function LaClinicaSection() {
  return (
    <section
      className="w-full bg-background-warm py-10 md:py-16"
      aria-label="La clínica"
    >
      <div className="max-w-content mx-auto w-full px-page-px md:px-page-px-md lg:px-page-px-lg flex flex-col gap-6 md:flex-row md:items-center md:gap-16">
        {/* Fotografía */}
        <div className="relative h-[260px] w-full shrink-0 overflow-hidden rounded-card md:h-[420px] md:w-[580px]">
          <Image
            src="/images/home/la-clinica.jpg"
            alt="Interior de la clínica Huella Vet"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 580px"
          />
        </div>

        {/* Texto */}
        <div className="flex flex-1 flex-col gap-6 min-w-0">
          <div className="flex flex-col gap-gap-md">
            <span className="text-eyebrow uppercase text-brand-primary">
              Un lugar de confianza
            </span>
            <h2 className="text-h2 font-semibold text-text-primary">
              Medicina cercana.<br />Mirada atenta.
            </h2>
            <p className="text-body text-text-secondary md:hidden">
              Un espacio tranquilo, explicaciones claras y decisiones que tomamos contigo. Cuidamos también el vínculo que compartís.
            </p>
            <p className="hidden md:block text-body text-text-secondary">
              Creemos en una atención que también cuida el vínculo que compartís. Un espacio tranquilo, explicaciones claras y decisiones que tomamos contigo.
            </p>
          </div>

          <p className="hidden md:block text-body text-text-secondary">
            En Huella Vet ponemos la escucha y el bienestar animal en el centro. Conoce nuestra propuesta de clínica y cómo preparamos cada visita.
          </p>

          <Button asChild variant="secondary" className="w-full md:w-auto">
            <Link href="/servicios">Conoce Huella Vet</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
