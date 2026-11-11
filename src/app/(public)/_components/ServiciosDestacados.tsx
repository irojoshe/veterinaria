import Link from 'next/link'
import Image from 'next/image'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import type { Servicio } from '@/lib/types'

const IMAGENES: Record<string, string> = {
  'consulta-general': '/images/home/servicio-consulta.png',
  vacunacion: '/images/home/servicio-vacunacion.jpg',
  'medicina-preventiva': '/images/home/servicio-preventiva.jpg',
}

export default function ServiciosDestacados({ servicios }: { servicios: Servicio[] }) {
  const destacados = servicios.slice(0, 3)

  return (
    <section className="max-w-content mx-auto w-full px-page-px md:px-page-px-md lg:px-page-px-lg py-10 md:py-page-h-xl flex flex-col gap-gap-lg">
      {/* Cabecera */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-gap-md md:gap-20">
        <div className="flex flex-col gap-gap-md max-w-lg">
          <span className="text-tiny font-bold tracking-wide uppercase text-brand-primary">
            Lo que hacemos
          </span>
          <h2 className="text-h2 font-semibold text-text-primary">
            Cuidar empieza por conocerles.
          </h2>
          <p className="text-body text-text-secondary">
            Desde su primera revisión hasta el acompañamiento de cada día.
          </p>
        </div>
        <div className="hidden md:block">
          <Button asChild variant="secondary">
            <Link href="/servicios">Todos los servicios ↗</Link>
          </Button>
        </div>
      </div>

      {/* Grid de servicios */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {destacados.map((s) => (
          <ServicioCard key={s.id} servicio={s} />
        ))}
      </div>

      {/* CTA móvil */}
      <div className="md:hidden">
        <Button asChild variant="secondary" fullWidth>
          <Link href="/servicios">Todos los servicios ↗</Link>
        </Button>
      </div>
    </section>
  )
}

function ServicioCard({ servicio }: { servicio: Servicio }) {
  const imagen = servicio.imagen_url ?? (servicio.slug ? IMAGENES[servicio.slug] : undefined)

  return (
    <Card padding="none" className="flex flex-col overflow-hidden">
      {/* Imagen */}
      {imagen ? (
        <div className="relative h-card-image-sm w-full shrink-0 overflow-hidden bg-bg-secondary">
          <Image
            src={imagen}
            alt={servicio.nombre}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 410px"
          />
        </div>
      ) : (
        <div className="h-card-image-sm w-full shrink-0 bg-bg-secondary" aria-hidden="true" />
      )}

      <div className="flex flex-col gap-gap-md p-card">
        <h3 className="text-22 font-semibold text-text-main">{servicio.nombre}</h3>
        <p className="text-14 text-text-secondary leading-relaxed">{servicio.descripcion}</p>

        <div className="flex items-center justify-between">
          <span className="text-h5 font-semibold text-text-main">
            {servicio.precio} €
          </span>
          <span className="text-13 text-text-muted">{servicio.duracion_minutos} min</span>
        </div>

        <hr className="border-border-default" />

        <div className="flex items-center justify-between">
          <Link
            href={`/servicios/${servicio.slug}`}
            className="text-13 font-semibold text-brand-primary hover:underline
                       focus-visible:outline-none focus-visible:ring-2
                       focus-visible:ring-brand-primary rounded-sm"
          >
            Ver detalle ↗
          </Link>
          <Link
            href={`/cita?servicio=${servicio.slug}`}
            className="text-13 font-semibold text-brand-primary hover:underline
                       focus-visible:outline-none focus-visible:ring-2
                       focus-visible:ring-brand-primary rounded-sm"
          >
            Solicitar cita →
          </Link>
        </div>
      </div>
    </Card>
  )
}
