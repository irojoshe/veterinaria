import Link from 'next/link'
import Image from 'next/image'
import Button from '@/components/ui/Button'
import type { Negocio } from '@/lib/types'

export default function HeroSection({ negocio }: { negocio: Negocio }) {
  return (
    <section className="max-w-6xl mx-auto w-full px-page-px md:px-page-px-md lg:px-page-px-lg py-page-h md:py-page-h-lg
                        flex flex-col md:flex-row items-center gap-gap-lg">
      {/* Texto */}
      <div className="flex flex-col gap-gap-lg flex-1">
        <div className="flex flex-col gap-gap-md">
          <span className="text-tiny font-bold tracking-wide uppercase text-brand-primary">
            Cerca de ti, cerca de ellos
          </span>
          <h1 className="text-h1 md:text-h1 font-semibold text-text-primary leading-tight">
            Su bienestar.<br />Nuestra forma<br />de cuidar.
          </h1>
          <p className="text-body text-text-secondary leading-relaxed max-w-md">
            {negocio.descripcion}
          </p>
        </div>

        <div className="flex items-center gap-gap-md flex-wrap">
          <Button asChild size="lg">
            <Link href="/cita">Solicitar cita</Link>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link href="/servicios">Conoce la clínica</Link>
          </Button>
        </div>

        <p className="text-tiny text-text-muted">
          Sin registro · Te contactamos para confirmar tu cita
        </p>
      </div>

      {/* Fotografía */}
      <div className="flex flex-col gap-gap-md w-full md:w-hero-md shrink-0">
      <div className="relative w-full h-card-image-sm md:h-card-image-xl rounded-hero overflow-hidden">
          <Image
            src="/images/hero-clinica.jpg"
            alt="Veterinaria atendiendo a una mascota en Huella Vet"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 620px"
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-tiny text-text-muted">Pequeños gestos. Grandes vínculos.</span>
          <span className="text-tiny text-text-muted">Huella Vet — Madrid</span>
        </div>
      </div>
    </section>
  )
}
