import type { Metadata } from 'next'
import { getNegocio } from '@/lib/services/negocio'

export const metadata: Metadata = {
  title: 'Contacto y ubicación',
  description:
    'Dirección, horarios y teléfono de Huella Vet. Encuentra la clínica y escríbenos para resolver tus dudas.',
}

export default async function ContactoPage() {
  const negocio = await getNegocio()
  const mapaUrl =
    negocio.mapa_url ??
    `https://www.google.com/maps?q=${encodeURIComponent(negocio.direccion)}`

  return (
    <div className="max-w-content mx-auto w-full px-6 md:px-20 py-12 flex flex-col gap-10">
      {/* Cabecera */}
      <div className="flex flex-col gap-4 max-w-2xl">
        <span className="text-12 font-bold tracking-wide uppercase text-brand-primary">
          Estamos cerca
        </span>
        <h1 className="text-32 md:text-52 font-semibold text-text-heading leading-tight">
          Hablemos de su bienestar.
        </h1>
        <p className="text-18 text-text-muted leading-relaxed">
          {negocio.descripcion}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start">
        {/* Datos de contacto */}
        <dl className="flex flex-col gap-4">
          <Dato label="Clínica" value={negocio.nombre} />
          <Dato label="Dirección" value={negocio.direccion} />
          <Dato label="Horario" value={negocio.horario} />
          <Dato
            label="Teléfono"
            value={negocio.telefono}
            href={`tel:${negocio.telefono.replace(/\s/g, '')}`}
          />
          <Dato
            label="Email"
            value={negocio.email}
            href={`mailto:${negocio.email}`}
          />
          {negocio.whatsapp && (
            <Dato
              label="WhatsApp"
              value={negocio.whatsapp}
              href={`https://wa.me/${negocio.whatsapp.replace(/\D/g, '')}`}
              external
            />
          )}
        </dl>

        {/* Mapa */}
        <div className="w-full flex flex-col gap-3">
          <div className="relative w-full h-72 md:h-96 overflow-hidden rounded-card border border-border bg-bg-warm">
            <iframe
              src={mapaUrl}
              title={`Mapa de ${negocio.nombre} en ${negocio.direccion}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 w-full h-full border-0"
            />
          </div>
          <a
            href={mapaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-13 font-semibold text-brand-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded-sm w-fit"
          >
            Abrir en el mapa ↗
          </a>
        </div>
      </div>
    </div>
  )
}

function Dato({
  label,
  value,
  href,
  external,
}: {
  label: string
  value: string
  href?: string
  external?: boolean
}) {
  return (
    <div className="grid grid-cols-2 gap-5">
      <dt className="text-13 text-text-secondary">{label}</dt>
      <dd className="text-13 font-semibold text-text-main">
        {href ? (
          <a
            href={href}
            {...(external
              ? { target: '_blank', rel: 'noopener noreferrer' }
              : {})}
            className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded-sm"
          >
            {value}
          </a>
        ) : (
          value
        )}
      </dd>
    </div>
  )
}
