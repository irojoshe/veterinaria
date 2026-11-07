import Link from 'next/link'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import type { Servicio } from '@/lib/types'

export default function ServiciosDestacados({ servicios }: { servicios: Servicio[] }) {
  const destacados = servicios.slice(0, 3)

  return (
    <section className="max-w-content mx-auto px-20 py-16 flex flex-col gap-10">
      {/* Cabecera */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-3 max-w-lg">
          <span className="text-12 font-bold tracking-wide uppercase text-primary">
            Lo que hacemos
          </span>
          <h2 className="text-32 font-semibold text-text-heading">
            Cuidar empieza por conocerles.
          </h2>
          <p className="text-15 text-text-muted">
            Desde su primera revisión hasta el acompañamiento de cada día.
          </p>
        </div>
        <Button asChild variant="secondary">
          <Link href="/servicios">Todos los servicios ↗</Link>
        </Button>
      </div>

      {/* Grid de servicios */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
      <div className="h-card-image-sm bg-background-warm w-full shrink-0" aria-hidden="true" />

      <div className="flex flex-col gap-3.5 p-6">
        <h3 className="text-22 font-semibold text-text-main">{servicio.nombre}</h3>
        <p className="text-14 text-text-muted leading-relaxed">{servicio.descripcion}</p>

        <div className="flex items-center justify-between">
          <span className="text-18 font-semibold text-text-main">
            {servicio.precio} €
          </span>
          <span className="text-13 text-text-muted">{servicio.duracion_minutos} min</span>
        </div>

        <hr className="border-border" />

        <div className="flex items-center justify-between">
          <Link
            href={`/servicios/${servicio.slug}`}
            className="text-13 font-semibold text-primary hover:underline
                       focus-visible:outline-none focus-visible:ring-2
                       focus-visible:ring-primary rounded-sm"
          >
            Ver detalle ↗
          </Link>
          <Link
            href={`/cita?servicio=${servicio.slug}`}
            className="text-13 font-semibold text-primary hover:underline
                       focus-visible:outline-none focus-visible:ring-2
                       focus-visible:ring-primary rounded-sm"
          >
            Solicitar cita →
          </Link>
        </div>
      </div>
    </Card>
  )
}
