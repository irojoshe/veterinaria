import Link from 'next/link'
import Image from 'next/image'
import Button from '@/components/ui/Button'

const MASCOTAS = [
  {
    nombre: 'Luna',
    descripcion: 'Perro · Golden retriever',
    alt: 'Luna, perro golden retriever',
    imagen: '/images/home/comunidad-luna.jpg',
  },
  {
    nombre: 'Nilo',
    descripcion: 'Gato · Europeo común',
    alt: 'Nilo, gato europeo común',
    imagen: '/images/home/comunidad-nilo.jpg',
  },
  {
    nombre: 'Coco',
    descripcion: 'Perro · Beagle',
    alt: 'Coco, perro beagle',
    imagen: '/images/home/comunidad-coco.jpg',
  },
]

export default function ComunidadSection() {
  return (
    <section
      className="w-full bg-bg-default py-10 md:py-16"
      aria-label="Nuestra comunidad"
    >
      <div className="max-w-content mx-auto w-full px-page-px md:px-page-px-md lg:px-page-px-lg flex flex-col gap-6 md:gap-8">
        {/* Cabecera */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-20">
          <div className="flex flex-col gap-gap-md max-w-5xl">
            <span className="text-eyebrow uppercase text-brand-primary">
              Vínculos que dejan huella
            </span>
            <h2 className="text-h2 font-semibold text-text-primary md:hidden">
              Parte de nuestra clínica.
            </h2>
            <h2 className="hidden text-h2 font-semibold text-text-primary md:block">
              Ellos también son parte de la clínica.
            </h2>
            <p className="text-body text-text-secondary md:hidden">
              Publicaciones autorizadas. No son mascotas en adopción.
            </p>
            <p className="hidden text-body text-text-secondary md:block">
              Mascotas publicadas con autorización. No son animales en adopción.
            </p>
          </div>
          <div className="hidden md:block">
            <Button asChild variant="secondary">
              <Link href="/mascotas">Conocer mascotas ↗</Link>
            </Button>
          </div>
        </div>

        {/* Tarjetas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MASCOTAS.map((m) => (
            <article key={m.nombre} className="flex flex-col gap-3.5">
              <div className="relative h-[290px] w-full overflow-hidden rounded-card">
                <Image
                  src={m.imagen}
                  alt={m.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 410px"
                />
              </div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex flex-col gap-1">
                  <h3 className="text-h3 font-semibold text-text-main">{m.nombre}</h3>
                  <p className="text-14 text-text-secondary">{m.descripcion}</p>
                </div>
                <img
                  src="/icons/arrow-up-right.svg"
                  alt=""
                  width={20}
                  height={20}
                  aria-hidden="true"
                  className="shrink-0"
                />
              </div>
            </article>
          ))}
        </div>

        {/* CTA móvil */}
        <div className="md:hidden">
          <Button asChild variant="secondary" fullWidth>
            <Link href="/mascotas">Conocer mascotas ↗</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
