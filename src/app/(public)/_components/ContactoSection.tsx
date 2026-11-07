import Link from 'next/link'
import Button from '@/components/ui/Button'
import type { Negocio } from '@/lib/types'

export default function ContactoSection({ negocio }: { negocio: Negocio }) {
  return (
    <section
      className="w-full bg-accent-green-light py-16"
      aria-label="Contacto y horarios"
    >
      <div className="max-w-content mx-auto px-20 flex flex-col md:flex-row gap-16">
        {/* Datos */}
        <div className="flex flex-col gap-6 flex-1">
          <div className="flex flex-col gap-3">
            <span className="text-12 font-bold tracking-wide uppercase text-primary">
              Estamos cerca
            </span>
            <h2 className="text-32 font-semibold text-text-heading">
              Hablemos de su bienestar.
            </h2>
          </div>

          <dl className="flex flex-col gap-3">
            <DataRow label="Dirección" value={negocio.direccion} />
            <DataRow label="Lun–vie"   value={negocio.horario_semana} />
            <DataRow label="Sábados"   value={negocio.horario_sabado} />
            <DataRow label="Domingos"  value={negocio.horario_domingo} />
            <DataRow label="Teléfono"  value={negocio.telefono} />
          </dl>

          <p className="text-13 text-text-muted">{negocio.email}</p>

          <div className="flex gap-3 flex-wrap">
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
                     bg-background-warm shrink-0"
          aria-hidden="true"
        />
      </div>
    </section>
  )
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-5">
      <dt className="text-13 text-text-muted w-24 shrink-0">{label}</dt>
      <dd className="text-14 font-semibold text-text-main">{value}</dd>
    </div>
  )
}
