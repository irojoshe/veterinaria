import Link from 'next/link'
import Image from 'next/image'
import Card from '@/components/ui/Card'
import type { ServicioPublico } from '@/lib/types'

const IMAGEN_PLACEHOLDER = '/images/placeholder-servicio.jpg'

export default function ServicioCard({ servicio }: { servicio: ServicioPublico }) {
  return (
    <Card padding="none" className="flex flex-col overflow-hidden">
      {/* Imagen */}
      <div className="relative h-card-image-sm w-full bg-background-warm shrink-0">
        <Image
          src={servicio.imagen_url ?? IMAGEN_PLACEHOLDER}
          alt={`Imagen de ${servicio.nombre}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>

      {/* Info */}
      <div className="flex flex-col gap-3.5 p-6">
        <h2 className="text-22 font-semibold text-text-main">{servicio.nombre}</h2>
        <p className="text-14 text-text-muted leading-relaxed">{servicio.descripcion}</p>

        <div className="flex items-center justify-between">
          <span className="text-18 font-semibold text-text-main">{servicio.precio} €</span>
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
