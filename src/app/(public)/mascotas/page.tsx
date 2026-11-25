import type { Metadata } from 'next'
import Image from 'next/image'
import { getMascotasPublicas } from '@/lib/services/mascotas'
import { getNegocio } from '@/lib/services/negocio'
import type { MascotaPublica } from '@/lib/types'
import MascotaCard from './_components/MascotaCard'

export const metadata: Metadata = {
  title: 'Nuestras mascotas',
  description:
    'Conoce a las mascotas que forman parte de la familia de Huella Vet: perros, gatos y conejos que nos acompañan cada día.',
}

export default async function MascotasPage() {
  const [mascotas, negocio] = await Promise.all([
    getMascotasPublicas(),
    getNegocio(),
  ])

  return (
    <div className="max-w-content mx-auto w-full px-6 md:px-20 py-12 flex flex-col gap-10">
      {/* Cabecera */}
      <div className="flex flex-col gap-4 max-w-2xl">
        <span className="text-12 font-bold tracking-wide uppercase text-brand-primary">
          La familia
        </span>
        <h1 className="text-32 md:text-52 font-semibold text-text-heading leading-tight">
          Encuentra a tu nuevo mejor amigo.
        </h1>
        <p className="text-18 text-text-muted leading-relaxed">
          Conoce a los peluditos que buscan un hogar y dales una segunda
          oportunidad.
        </p>
      </div>

      {/* Listado */}
      {mascotas.length === 0 ? (
        <div className="flex flex-col gap-2 p-8 rounded-card bg-background-surface border border-border">
          <p className="text-16 font-semibold text-text-main">
            Todavía no hay mascotas publicadas
          </p>
          <p className="text-13 text-text-muted">
            Estamos preparando las historias de la familia. Vuelve pronto.
          </p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {mascotas.map((mascota) => (
            <li key={mascota.id}>
              <MascotaCard mascota={mascota} whatsapp={negocio.whatsapp} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
