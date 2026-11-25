import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Button from '@/components/ui/Button'
import { getServicioBySlug, getServiciosPublicos } from '@/lib/services/servicios'

interface Props {
  params: Promise<{ slug: string }>
}

/** Slugs publicados: la página se prerenderiza para cada servicio del catálogo. */
export async function generateStaticParams() {
  const servicios = await getServiciosPublicos()

  return servicios.map((servicio) => ({ slug: servicio.slug as string }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const servicio = await getServicioBySlug(slug)

  if (!servicio) {
    return { title: 'Servicio no encontrado' }
  }

  return {
    title: servicio.nombre,
    description: servicio.descripcion,
  }
}

export default async function ServicioDetallePage({ params }: Props) {
  const { slug } = await params
  const servicio = await getServicioBySlug(slug)

  if (!servicio) notFound()

  return (
    <article className="max-w-content mx-auto w-full px-6 md:px-20 py-12 flex flex-col gap-10">
      {/* Volver al catálogo */}
      <Link
        href="/servicios"
        className="text-13 font-semibold text-brand-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded-sm w-fit"
      >
        ← Todos los servicios
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start">
        {/* Imagen */}
        <div className="relative w-full h-64 md:h-96 overflow-hidden rounded-card bg-bg-warm">
          <Image
            src={servicio.imagen_url ?? '/images/placeholder-servicio.jpg'}
            alt={servicio.nombre}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 608px"
            priority
          />
        </div>

        {/* Datos */}
        <div className="flex flex-col gap-5">
          <span className="text-12 font-bold tracking-wide uppercase text-brand-primary">
            Servicio
          </span>

          <h1 className="text-32 md:text-52 font-semibold text-text-heading leading-tight">
            {servicio.nombre}
          </h1>

          <p className="text-18 text-text-muted leading-relaxed">
            {servicio.descripcion}
          </p>

          <dl className="flex flex-col gap-3.5">
            <div className="grid grid-cols-2 gap-5">
              <dt className="text-13 text-text-secondary">Precio</dt>
              <dd className="text-13 font-semibold text-text-main">
                {servicio.precio} €
              </dd>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <dt className="text-13 text-text-secondary">Duración</dt>
              <dd className="text-13 font-semibold text-text-main">
                {servicio.duracion_minutos} min
              </dd>
            </div>
          </dl>

          <Button asChild variant="primary" size="lg" className="w-full md:w-auto">
            <Link href={`/cita?servicio=${servicio.slug}`}>
              <span>Solicitar cita para este servicio</span>
              <img
                src="/icons/arrow-right.svg"
                alt=""
                width={20}
                height={20}
                aria-hidden="true"
              />
            </Link>
          </Button>

          <p className="text-13 text-text-muted">
            La cita es una solicitud: la clínica te confirma fecha y hora.
          </p>
        </div>
      </div>
    </article>
  )
}
