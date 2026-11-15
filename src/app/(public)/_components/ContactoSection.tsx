import Link from 'next/link'
import Image from 'next/image'
import Button from '@/components/ui/Button'
import type { Negocio } from '@/lib/types'

export default function ContactoSection({ negocio }: { negocio: Negocio }) {
  return (
    <section
      className="w-full bg-brand-light py-10 md:py-page-h-lg"
      aria-label="Contacto y horarios"
    >
      <div className="max-w-content mx-auto w-full px-page-px md:px-page-px-md lg:px-page-px-lg grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-x-16 md:gap-y-6">
        {/* Cabecera */}
        <div className="md:col-start-1 md:row-start-1 flex flex-col gap-gap-md">
          <span className="text-tiny font-bold tracking-wide uppercase text-brand-primary">
            Estamos cerca
          </span>
          <h2 className="text-h2 font-semibold text-text-primary">
            Hablemos de su bienestar.
          </h2>
        </div>

        {/* Imagen */}
        <div className="relative order-2 md:order-none md:col-start-2 md:row-start-1 w-full h-hero-contact overflow-hidden rounded-card bg-bg-warm">
          <Image
            src="/images/home/contacto.jpg"
            alt="Clínica Huella Vet en Madrid"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 608px"
          />
        </div>

        {/* Datos */}
        <div className="order-3 md:order-none md:col-start-1 md:row-start-2 flex flex-col gap-gap-lg">
          <dl className="flex flex-col gap-3.5">
            <DataRow label="Dirección" value={negocio.direccion} />
            <DataRow label="Lun–vie"   value={negocio.horario_semana} />
            <DataRow label="Sábados"   value={negocio.horario_sabado} />
            <DataRow label="Domingos"  value={negocio.horario_domingo} />
            <DataRow label="Teléfono"  value={negocio.telefono} />
          </dl>

          <p className="text-13 text-text-secondary">{negocio.email}</p>
        </div>

        {/* Descripción + CTA */}
        <div className="order-4 md:order-none md:col-start-2 md:row-start-2 flex flex-col gap-gap-lg">
          <p className="text-14 text-text-secondary">¿Tienes dudas antes de venir? Escríbenos por WhatsApp o consulta toda la información de contacto.</p>

          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <Button asChild variant="secondary" className="w-full md:w-auto">
              <Link href="/contacto">Contacto y ubicación ↗</Link>
            </Button>
            {negocio.whatsapp && (
              <a
                href={`https://wa.me/${negocio.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-13 font-semibold text-brand-primary text-center md:text-left hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded-sm"
              >
                Consultar por WhatsApp ↗
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-2 gap-5">
      <dt className="text-13 text-text-secondary">{label}</dt>
      <dd className="text-13 font-semibold text-text-main">{value}</dd>
    </div>
  )
}
