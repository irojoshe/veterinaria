import type { Metadata } from 'next'
import { Suspense } from 'react'
import ResumenCitas from './_components/ResumenCitas'
import ResumenMascotas from './_components/ResumenMascotas'
import ResumenServicios from './_components/ResumenServicios'
import AlertaPendientes from './_components/AlertaPendientes'
import TablaCitasHoy from './_components/TablaCitasHoy'

export const metadata: Metadata = { title: 'Resumen' }

export default function AdminDashboardPage() {
  return (
    <div className="px-9 py-9 flex flex-col gap-8 max-w-page">

      {/* Encabezado */}
      <div className="flex flex-col gap-1">
        <h1 className="text-32 font-semibold text-text-heading">
          Una mirada al día de hoy
        </h1>
        <p className="text-15 text-text-muted">
          18 de noviembre de 2026 · Vista de ejemplo, no actualizada en tiempo real.
        </p>
      </div>

      {/* Alerta de pendientes */}
      <Suspense fallback={<SkeletonAlerta />}>
        <AlertaPendientes />
      </Suspense>

      {/* Grid de widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Columna principal (2/3) */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <Suspense fallback={<SkeletonSeccion filas={3} />}>
            <ResumenCitas />
          </Suspense>

          <Suspense fallback={<SkeletonTabla />}>
            <TablaCitasHoy />
          </Suspense>
        </div>

        {/* Columna lateral (1/3) */}
        <div className="flex flex-col gap-8">
          <Suspense fallback={<SkeletonSeccion filas={2} />}>
            <ResumenMascotas />
          </Suspense>

          <Suspense fallback={<SkeletonSeccion filas={2} />}>
            <ResumenServicios />
          </Suspense>
        </div>
      </div>

      <p className="text-11 text-text-muted">
        Huella Vet · Datos ilustrativos · Sin conexión a servicios reales
      </p>
    </div>
  )
}

/* ── Skeletons de carga ─────────────────────────────────────────────────── */

function SkeletonAlerta() {
  return (
    <div className="h-16 rounded-lg bg-border-muted/40 animate-pulse" aria-hidden="true" />
  )
}

function SkeletonSeccion({ filas }: { filas: number }) {
  return (
    <div className="flex flex-col gap-3" aria-hidden="true">
      <div className="h-5 w-32 rounded bg-border-muted/40 animate-pulse" />
      {Array.from({ length: filas }).map((_, i) => (
        <div key={i} className="h-24 rounded-lg bg-border-muted/40 animate-pulse" />
      ))}
    </div>
  )
}

function SkeletonTabla() {
  return (
    <div className="flex flex-col gap-3" aria-hidden="true">
      <div className="h-5 w-32 rounded bg-border-muted/40 animate-pulse" />
      <div className="h-48 rounded-lg bg-border-muted/40 animate-pulse" />
    </div>
  )
}
