import Image from 'next/image'
import type { MascotaPublica } from '@/lib/types'

/**
 * Calcula la edad en años a partir de la fecha de nacimiento.
 * Devuelve null si no hay fecha o si la fecha es inválida.
 */
function calcularEdad(fechaNacimiento: string | null): string | null {
  if (!fechaNacimiento) return null

  const nacimiento = new Date(fechaNacimiento)
  if (Number.isNaN(nacimiento.getTime())) return null

  const hoy = new Date()
  let años = hoy.getFullYear() - nacimiento.getFullYear()
  const mes = hoy.getMonth() - nacimiento.getMonth()

  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    años -= 1
  }

  if (años < 0) return null

  return años === 1 ? '1 año' : `${años} años`
}

export default function MascotaCard({ mascota }: { mascota: MascotaPublica }) {
  const edad = calcularEdad(mascota.fecha_nacimiento)

  return (
    <article className="w-full h-full flex flex-col overflow-hidden rounded-card bg-background-surface border border-border">
      {/* Foto */}
      <div className="relative w-full h-48 overflow-hidden bg-bg-warm">
        <Image
          src={mascota.foto_url ?? '/images/placeholder-mascota.jpg'}
          alt={`Foto de ${mascota.nombre}`}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>

      {/* Datos */}
      <div className="flex flex-col gap-2 p-5">
        <h2 className="text-19 font-semibold text-text-heading">{mascota.nombre}</h2>

        <p className="text-13 text-text-muted">
          {[mascota.especie, mascota.raza].filter(Boolean).join(' · ')}
        </p>

        <dl className="flex flex-col gap-1.5 mt-1">
          {mascota.sexo && (
            <div className="grid grid-cols-2 gap-5">
              <dt className="text-13 text-text-secondary">Sexo</dt>
              <dd className="text-13 font-semibold text-text-main capitalize">
                {mascota.sexo}
              </dd>
            </div>
          )}
          {edad && (
            <div className="grid grid-cols-2 gap-5">
              <dt className="text-13 text-text-secondary">Edad</dt>
              <dd className="text-13 font-semibold text-text-main">{edad}</dd>
            </div>
          )}
        </dl>
      </div>
    </article>
  )
}
