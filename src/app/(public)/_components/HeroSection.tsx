import Link from 'next/link'
import Image from 'next/image'
import Button from '@/components/ui/Button'
import type { Negocio } from '@/lib/types'

export default function HeroSection({ negocio }: { negocio: Negocio }) {
  return (
    <section className="max-w-content mx-auto px-20 py-12 md:py-16
                        flex flex-col md:flex-row items-center gap-16">
      {/* Texto */}
      <div className="flex flex-col gap-7 flex-1">
        <div className="flex flex-col gap-3">
          <span className="text-12 font-bold tracking-wide uppercase text-primary">
            Cerca de ti, cerca de ellos
          </span>
          <h1 className="text-32 md:text-52 font-semibold text-text-heading leading-tight">
            Su bienestar.<br />Nuestra forma<br />de cuidar.
          </h1>
          <p className="text-18 text-text-muted leading-relaxed max-w-md">
            {negocio.descripcion}
          </p>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <Button asChild size="lg">
            <Link href="/cita">Solicitar cita</Link>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link href="/servicios">Conoce la clínica</Link>
          </Button>
        </div>

        <p className="text-12 text-text-muted">
          Sin registro · Te contactamos para confirmar tu cita
        </p>
      </div>

      {/* Fotografía */}
      <div className="flex flex-col gap-3.5 w-full md:w-hero-md shrink-0">
      <div className="relative w-full h-card-image-sm md:h-card-image-xl rounded-2xl overflow-hidden">
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
          <span className="text-12 text-text-muted">Pequeños gestos. Grandes vínculos.</span>
          <span className="text-12 text-text-muted">Huella Vet — Madrid</span>
        </div>
      </div>
    </section>
  )
}
