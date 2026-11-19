'use client'

import { useState } from 'react'
import Image from 'next/image'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import type { MascotaPublica } from '@/lib/types'

const PLACEHOLDER = '/images/placeholder-mascota.jpg'

function calcularEdad(fechaNacimiento: string | null): string | null {
  if (!fechaNacimiento) return null
  const nacimiento = new Date(fechaNacimiento)
  if (Number.isNaN(nacimiento.getTime())) return null
  const hoy = new Date()
  let años = hoy.getFullYear() - nacimiento.getFullYear()
  const mes = hoy.getMonth() - nacimiento.getMonth()
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) años -= 1
  if (años < 0) return null
  return años === 1 ? '1 año' : `${años} años`
}

function formatearPrecio(precio: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(precio)
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
  const edad = calcularEdad(mascota.fecha_nacimiento)
  const tel = (whatsapp ?? '+34900123456').replace(/\D/g, '')

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
            <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-background-surface/90 backdrop-blur text-12 font-semibold text-text-main">
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
              className="text-16 md:text-14"
              onClick={() => setOpen(true)}
            >
              Quiero conocerlo
            </Button>
          </div>
        </div>
      </article>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={mascota.nombre}
        description={[mascota.especie, mascota.raza].filter(Boolean).join(' · ')}
        size="md"
      >
        <div className="flex flex-col gap-5">
          <div className="relative w-full h-56 overflow-hidden rounded-card bg-bg-warm">
            <Image
              src={src}
              alt={`Foto de ${mascota.nombre}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 512px"
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <p className="text-24 font-bold text-brand-primary">
              {formatearPrecio(mascota.precio)}
            </p>
            {mascota.estado_adopcion && (
              <span className="px-2.5 py-1 rounded-full bg-brand-light text-12 font-semibold text-brand-primary">
                {mascota.estado_adopcion}
              </span>
            )}
          </div>

          {mascota.historia && (
            <p className="text-15 text-text-secondary leading-relaxed whitespace-pre-line">
              {mascota.historia}
            </p>
          )}

          <div className="flex justify-center pt-2">
            <Button asChild variant="primary" size="lg" className="h-14 md:h-12 w-full sm:w-auto sm:min-w-[260px] text-16 md:text-14">
              <a
                href={`https://wa.me/${tel}?text=${encodeURIComponent(
                  `Hola, me interesa conocer a ${mascota.nombre} (${mascota.especie} · ${mascota.raza}). Quisiera mas informacion sobre la adopcion.`,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Contactar por WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
