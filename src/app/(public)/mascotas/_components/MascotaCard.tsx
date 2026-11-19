'use client'

import { useState } from 'react'
import Image from 'next/image'
import Button from '@/components/ui/Button'
import type { MascotaPublica } from '@/lib/types'
import { calcularEdadExacta } from '@/lib/utils/date'
import MascotaModal from './MascotaModal'

const PLACEHOLDER = '/images/placeholder-mascota.jpg'

function formatearPrecio(precio: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(precio)
}

function badgeStyles(estado: string): string {
  switch (estado) {
    case 'disponible':
      return 'bg-green-100 text-green-800'
    case 'reservado':
      return 'bg-amber-100 text-amber-800'
    case 'vendido':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export default function MascotaCard({
  mascota,
  whatsapp,
}: {
  mascota: MascotaPublica
  whatsapp?: string | null
}) {
  const [src, setSrc] = useState(mascota.foto_url ?? PLACEHOLDER)
  const [open, setOpen] = useState(false)
  const edad = calcularEdadExacta(mascota.fecha_nacimiento)
  const disponible = mascota.estado_adopcion === 'disponible'
  const reservado = mascota.estado_adopcion === 'reservado'
  const vendido = mascota.estado_adopcion === 'vendido'

  const ctaLabel = disponible
    ? 'Ver ficha y comprar'
    : reservado
      ? 'Reservado'
      : vendido
        ? 'Vendido'
        : mascota.estado_adopcion

  const ctaDisabled = reservado || vendido

  return (
    <>
      <article className="w-full h-full flex flex-col overflow-hidden rounded-card bg-background-surface border border-border shadow-sm hover:shadow-md transition-shadow">
        {/* Foto protagonista */}
        <div className="relative w-full h-56 overflow-hidden bg-bg-warm">
          <Image
            src={src}
            alt={`Foto de ${mascota.nombre}`}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            onError={() => {
              if (src !== PLACEHOLDER) setSrc(PLACEHOLDER)
            }}
          />
          {/* Badge de estado */}
          {mascota.estado_adopcion && (
            <span
              className={
                'absolute top-3 left-3 px-2.5 py-1 rounded-full text-12 font-semibold ' +
                badgeStyles(mascota.estado_adopcion)
              }
            >
              {mascota.estado_adopcion}
            </span>
          )}
        </div>

        {/* Datos */}
        <div className="flex flex-col gap-3 p-5 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col gap-0.5 min-w-0">
              <h2 className="text-19 font-semibold text-text-heading truncate">
                {mascota.nombre}
              </h2>
              <p className="text-13 text-text-muted truncate">
                {[mascota.especie, mascota.raza].filter(Boolean).join(' · ')}
              </p>
            </div>
            <p className="text-24 font-bold text-brand-primary shrink-0">
              {formatearPrecio(mascota.precio)}
            </p>
          </div>

          {edad && (
            <p className="text-12 text-text-secondary">{edad}</p>
          )}

          {mascota.historia && (
            <p className="text-13 text-text-secondary leading-relaxed line-clamp-2">
              {mascota.historia}
            </p>
          )}

          <div className="mt-auto pt-2">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              disabled={ctaDisabled}
              onClick={() => {
                if (!ctaDisabled) setOpen(true)
              }}
              className={
                ctaDisabled
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              }
            >
              {ctaLabel}
            </Button>
          </div>
        </div>
      </article>

      <MascotaModal
        mascota={mascota}
        open={open}
        onClose={() => setOpen(false)}
        whatsapp={whatsapp}
      />
    </>
  )
}
