import Link from 'next/link'
import Button from '@/components/ui/Button'
import type { Negocio } from '@/lib/types'

export default function ContactoSection({ negocio }: { negocio: Negocio }) {
  return (
    <section
      className="w-full bg-brand-light py-page-h-xxl md:py-page-h-xl"
      aria-label="Contacto y horarios"
    >
      <div className="max-w-6xl mx-auto w-full px-page-px md:px-page-px-md lg:px-page-px-lg flex flex-col md:flex-row gap-huge-2 lg:gap-36">
        {/* Datos */}
        <div className="flex flex-col gap-gap-lg flex-1">
          <div className="flex flex-col gap-gap-md">
            <span className="text-tiny font-bold tracking-wide uppercase text-brand-primary">
              Estamos cerca
            </span>
            <h2 className="text-h2 font-semibold text-text-primary">
              Hablemos de su bienestar.
            </h2>
          </div>

          <dl className="flex flex-col gap-gap-md">
            <DataRow label="Dirección" value={negocio.direccion} />
            <DataRow label="Lun–vie"   value={negocio.horario_semana} />
            <DataRow label="Sábados"   value={negocio.horario_sabado} />
            <DataRow label="Domingos"  value={negocio.horario_domingo} />
            <DataRow label="Teléfono"  value={negocio.telefono} />
          </dl>

          <p className="text-base text-text-secondary">{negocio.email}</p>

          <div className="flex gap-gap-md flex-wrap">
            <Button asChild variant="secondary">
              <Link href="/contacto">Contacto y ubicación ↗</Link>
            </Button>
            {negocio.whatsapp && (
              <Button asChild variant="outline">
                <a
                  href={`https://wa.me/${negocio.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Consultar por WhatsApp
                </a>
              </Button>
            )}
          </div>
        </div>

        {/* Imagen placeholder */}
        <div
          className="hidden md:block w-full md:w-contact-md h-hero-contact rounded-lg
                     bg-bg-warm shrink-0"
          aria-hidden="true"
        />
      </div>
    </section>
  )
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-gap-lg">
      <dt className="text-base text-text-secondary w-24 shrink-0">{label}</dt>
      <dd className="text-body font-semibold text-text-primary">{value}</dd>
    </div>
  )
}
