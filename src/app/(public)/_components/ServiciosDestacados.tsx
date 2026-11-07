import Link from 'next/link'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import type { Servicio } from '@/lib/types'

export default function ServiciosDestacados({ servicios }: { servicios: Servicio[] }) {
  const destacados = servicios.slice(0, 3)

  return (
    <section className="max-w-6xl mx-auto w-full px-page-px md:px-page-px-md lg:px-page-px-lg py-page-h-xxl md:py-page-h-xl flex flex-col gap-gap-lg">
      {/* Cabecera */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-gap-md">
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
        <Button asChild variant="secondary">
          <Link href="/servicios">Todos los servicios ↗</Link>
        </Button>
      </div>

      {/* Grid de servicios */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-gap-md">
        {destacados.map((s) => (
          <ServicioCard key={s.id} servicio={s} />
        ))}
      </div>
    </section>
  )
}

function ServicioCard({ servicio }: { servicio: Servicio }) {
  return (
    <Card padding="none" className="flex flex-col overflow-hidden">
      {/* Imagen placeholder */}
      <div className="h-card-image-sm bg-bg-secondary w-full shrink-0" aria-hidden="true" />

      <div className="flex flex-col gap-gap-md p-card">
        <h3 className="text-h4 font-semibold text-text-primary">{servicio.nombre}</h3>
        <p className="text-body text-text-secondary leading-relaxed">{servicio.descripcion}</p>

        <div className="flex items-center justify-between">
          <span className="text-h5 font-semibold text-text-primary">
            {servicio.precio} €
          </span>
          <span className="text-label text-text-muted">{servicio.duracion_minutos} min</span>
        </div>

        <hr className="border-border-default" />

        <div className="flex items-center justify-between">
          <Link
            href={`/servicios/${servicio.slug}`}
            className="text-label font-semibold text-brand-primary hover:underline
                       focus-visible:outline-none focus-visible:ring-2
                       focus-visible:ring-brand-primary rounded-sm"
          >
            Ver detalle ↗
          </Link>
          <Link
            href={`/cita?servicio=${servicio.slug}`}
            className="text-label font-semibold text-brand-primary hover:underline
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
