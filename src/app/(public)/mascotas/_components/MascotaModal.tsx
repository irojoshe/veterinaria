'use client'

import Image from 'next/image'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Link from 'next/link'
import type { MascotaPublica } from '@/lib/types'
import { calcularEdadExacta } from '@/lib/utils/date'

const PLACEHOLDER = '/images/placeholder-mascota.jpg'

function formatearPrecio(precio: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(precio)
}

interface MascotaModalProps {
  mascota: MascotaPublica
  open: boolean
  onClose: () => void
  whatsapp?: string | null
}

function CheckItem({ label, ok }: { label: string; ok: boolean }) {
  return (
    <li className="flex items-center gap-2.5 text-13">
      <span
        aria-hidden="true"
        className={
          ok
            ? 'flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-700'
            : 'flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-700'
        }
      >
        {ok ? '✓' : '✕'}
      </span>
      <span className={ok ? 'text-text-main' : 'text-text-muted'}>{label}</span>
    </li>
  )
}

export default function MascotaModal({
  mascota,
  open,
  onClose,
  whatsapp,
}: MascotaModalProps) {
  const edad = calcularEdadExacta(mascota.fecha_nacimiento)
  const tel = (whatsapp ?? '+34900123456').replace(/\D/g, '')
  const disponible = mascota.estado_adopcion === 'disponible'
  const reservado = mascota.estado_adopcion === 'reservado'
  const vendido = mascota.estado_adopcion === 'vendido'

  const mensajeWhatsApp = `Hola, estoy interesado en comprar a ${mascota.nombre} (${mascota.especie} · ${mascota.raza}).`

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mascota.nombre}
      description={[mascota.especie, mascota.raza].filter(Boolean).join(' · ')}
      size="lg"
    >
      <div className="flex flex-col gap-5">
        {/* Banner superior con foto pequeña */}
        <div className="relative w-full h-40 overflow-hidden rounded-card bg-bg-warm">
          <Image
            src={mascota.foto_url ?? PLACEHOLDER}
            alt={`Foto de ${mascota.nombre}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 672px"
          />
        </div>

        {/* Precio + estado */}
        <div className="flex items-center justify-between gap-4">
          <p className="text-28 font-bold text-brand-primary">
            {formatearPrecio(mascota.precio)}
          </p>
          {mascota.estado_adopcion && (
            <span
              className={
                'px-3 py-1 rounded-full text-13 font-semibold ' +
                (disponible
                  ? 'bg-green-100 text-green-800'
                  : reservado
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-red-100 text-red-800')
              }
            >
              {mascota.estado_adopcion}
            </span>
          )}
        </div>

        {/* Datos básicos */}
        <dl className="grid grid-cols-2 gap-3">
          {edad && (
            <>
              <dt className="text-13 text-text-secondary">Edad</dt>
              <dd className="text-13 font-semibold text-text-main">{edad}</dd>
            </>
          )}
          {mascota.sexo && (
            <>
              <dt className="text-13 text-text-secondary">Sexo</dt>
              <dd className="text-13 font-semibold text-text-main capitalize">
                {mascota.sexo}
              </dd>
            </>
          )}
        </dl>

        {/* Salud */}
        <section className="flex flex-col gap-2">
          <h3 className="text-15 font-semibold text-text-heading">Salud</h3>
          <ul className="flex flex-col gap-1.5">
            <CheckItem label="Vacunado" ok={mascota.vacunado} />
            <CheckItem label="Esterilizado" ok={mascota.esterilizado} />
            <CheckItem label="Microchip" ok={mascota.microchip} />
          </ul>
        </section>

        {/* Comportamiento */}
        <section className="flex flex-col gap-2">
          <h3 className="text-15 font-semibold text-text-heading">Comportamiento</h3>
          <ul className="flex flex-col gap-1.5">
            <CheckItem label="Compatible con niños" ok={mascota.compatible_ninos} />
            <CheckItem
              label="Compatible con otras mascotas"
              ok={mascota.compatible_mascotas}
            />
          </ul>
        </section>

        {/* Historia */}
        {mascota.historia && (
          <section className="flex flex-col gap-2">
            <h3 className="text-15 font-semibold text-text-heading">Historia</h3>
            <p className="text-14 text-text-secondary leading-relaxed whitespace-pre-line">
              {mascota.historia}
            </p>
          </section>
        )}

        {/* Proceso de compra */}
        <p className="text-12 text-text-muted border-t border-border pt-3">
          Proceso: 1. Contacto · 2. Revisión veterinaria · 3. Entrega
        </p>

        {/* Acciones condicionales */}
        {disponible && (
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button asChild variant="primary" size="lg" className="flex-1 h-12">
              <a
                href={`https://wa.me/${tel}?text=${encodeURIComponent(mensajeWhatsApp)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Comprar por WhatsApp
              </a>
            </Button>
            <Button asChild variant="secondary" size="lg" className="flex-1 h-12">
              <Link href="/cita">
                <span>Agendar visita</span>
              </Link>
            </Button>
          </div>
        )}

        {reservado && (
          <div className="flex flex-col gap-3 pt-2">
            <p className="text-13 text-amber-800 bg-amber-50 border border-amber-200 rounded-md p-3">
              Esta mascota está reservada actualmente, pero puedes contactarnos
              por si la reserva no se concreta.
            </p>
            <Button asChild variant="primary" size="lg" className="h-12">
              <a
                href={`https://wa.me/${tel}?text=${encodeURIComponent(mensajeWhatsApp)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Contactar por WhatsApp
              </a>
            </Button>
          </div>
        )}

        {vendido && (
          <p className="text-13 text-text-muted bg-background-surface border border-border rounded-md p-3">
            Esta mascota ya encontró un hogar. ¡Mira nuestras otras mascotas
            disponibles!
          </p>
        )}
      </div>
    </Modal>
  )
}
