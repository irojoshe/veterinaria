import Link from 'next/link'
import Image from 'next/image'
import Button from '@/components/ui/Button'
import CtaCita from '@/components/ui/CtaCita'
import type { Negocio } from '@/lib/types'

export default function HeroSection({ negocio }: { negocio: Negocio }) {
  return (
    <section
      className="mx-auto w-full max-w-content px-page-px md:px-page-px-md lg:px-page-px-lg
                 py-6 md:pt-12 md:pb-page-h-lg
                 flex flex-col md:flex-row items-center gap-6 lg:gap-16"
    >
      {/* Texto */}
      <div className="flex flex-1 flex-col gap-6 min-w-0">
        <div className="flex flex-col gap-gap-md">
          <span className="text-eyebrow uppercase text-brand-primary">
            Cerca de ti, cerca de ellos
          </span>
          <h1 className="text-h2 lg:text-h1 text-text-heading">
            Su bienestar.<br />Nuestra forma<br />de cuidar.
          </h1>
          <p className="text-body lg:text-lead text-text-muted">{negocio.descripcion}</p>
        </div>

        <div className="flex flex-col md:flex-row items-stretch md:items-start gap-4">
          <CtaCita size="lg" label="Solicitar una cita" className="w-full md:w-auto" />
          <Button asChild variant="secondary" size="lg" className="hidden md:inline-flex">
            <Link href="/servicios">Conoce la clínica</Link>
          </Button>
        </div>

        <p className="text-12 text-text-muted">
          Sin registro · Te contactamos para confirmar tu cita
        </p>
      </div>

      {/* Fotografía: el padre define la altura para que `fill` no colapse a 0 */}
      <div className="flex w-full shrink-0 flex-col gap-6 md:gap-3.5 md:w-hero-md">
        <div className="relative h-hero-photo-sm w-full overflow-hidden rounded-pill md:h-card-image-xl md:rounded-hero">
          <Image
            src="/images/home/hero-mobile.jpg"
            alt="Veterinaria atendiendo a una mascota en Huella Vet"
            fill
            priority
            className="object-cover md:hidden"
            sizes="(max-width: 768px) 100vw, 620px"
          />
          <Image
            src="/images/home/hero-desktop.jpg"
            alt="Veterinaria atendiendo a una mascota en Huella Vet"
            fill
            priority
            className="hidden object-cover md:block"
            sizes="620px"
          />
        </div>
        <div className="flex items-center justify-between text-small">
          <span className="text-text-muted">Pequeños gestos. Grandes vínculos.</span>
          <span className="text-brand-primary">Huella Vet — Madrid</span>
        </div>
      </div>
    </section>
  )
}
