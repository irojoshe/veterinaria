import type { Metadata } from 'next'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { getServiciosPublicos } from '@/lib/services/servicios'
import ServicioCard from './_components/ServicioCard'

export const metadata: Metadata = {
  title: 'Servicios',
  description:
    'Consulta general, vacunación, medicina preventiva y más. Solicita tu cita sin registro.',
}

export default async function ServiciosPage() {
  const servicios = await getServiciosPublicos()

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="max-w-content mx-auto w-full px-20 pt-16 pb-10
                          flex flex-col gap-4">
        <span className="text-12 font-bold tracking-wide uppercase text-primary">
          Nuestros servicios
        </span>
        <h1 className="text-52 font-semibold text-text-heading leading-tight max-w-2xl">
          El cuidado que necesita,<br />en cada momento.
        </h1>
        <p className="text-18 text-text-muted max-w-xl leading-relaxed">
          Conoce nuestra propuesta de atención y solicita una visita sin crear una cuenta.
        </p>

        {/* Filtros de categoría */}
        <div className="flex items-center gap-3 flex-wrap mt-2">
          <CategoryBadge label="Todos los servicios" count={servicios.length} active />
          <CategoryBadge label="Bienestar y prevención" />
          <CategoryBadge label="Cuidados específicos" />
          <span className="ml-auto text-14 text-text-muted">Precios orientativos · EUR</span>
        </div>
      </section>

      {/* Grid */}
      <section
        className="max-w-content mx-auto w-full px-20 pb-16"
        aria-label="Catálogo de servicios"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicios.map((s) => (
            <ServicioCard key={s.id} servicio={s} />
          ))}
        </div>
      </section>

      {/* Aviso + ayuda */}
      <section className="max-w-content mx-auto w-full px-20 pb-10 flex flex-col gap-6">
        <Card className="bg-accent-green-light border-none">
          <div className="flex items-start gap-3">
            <span className="text-20 leading-none shrink-0" aria-hidden="true">✓</span>
            <div className="flex flex-col gap-1">
              <p className="text-14 font-semibold text-text-main">
                Cada mascota necesita una atención diferente
              </p>
              <p className="text-13 text-text-muted">
                Los precios y la duración son orientativos. La clínica te informará si
                la valoración requiere otros cuidados, antes de realizarlos.
              </p>
            </div>
          </div>
        </Card>

        {/* CTA ayuda */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6
                        bg-background-surface border border-border rounded-xl px-8 py-8">
          <div className="flex flex-col gap-2">
            <h2 className="text-32 font-semibold text-text-heading">
              ¿No sabes qué servicio elegir?
            </h2>
            <p className="text-15 text-text-muted">
              Cuéntanos qué le ocurre y te orientamos antes de tu visita.
            </p>
          </div>
          <Button asChild variant="secondary" size="lg">
            <a
              href="https://wa.me/34900123456"
              target="_blank"
              rel="noopener noreferrer"
            >
              Consultar por WhatsApp
            </a>
          </Button>
        </div>
      </section>
    </div>
  )
}

function CategoryBadge({
  label,
  count,
  active = false,
}: {
  label: string
  count?: number
  active?: boolean
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                  text-12 font-semibold transition-colors cursor-default ${
                    active
                      ? 'bg-accent-green-light text-primary'
                      : 'bg-background text-text-muted border border-border'
                  }`}
    >
      {label}
      {count !== undefined && (
        <span className="opacity-70">· {count}</span>
      )}
    </span>
  )
}
