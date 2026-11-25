import Link from 'next/link'
import { getResumenEstadisticas } from '@/lib/services/dashboard'
import StatCard from './StatCard'

export default async function ResumenServicios() {
  const stats = await getResumenEstadisticas()

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-18 font-semibold text-text-heading">Servicios</h2>

      <StatCard
        label="Servicios publicados"
        value={`${stats.servicios_publicados} / ${stats.servicios_total}`}
        sub={`${stats.servicios_total - stats.servicios_publicados} borrador`}
      />

      <div className="flex flex-col gap-2 bg-background-surface border border-border
                      rounded-lg p-5">
        <p className="text-14 font-semibold text-text-main">Accesos rápidos</p>
        <div className="flex flex-col gap-1.5">
          <QuickLink href="/admin/clientes"  label="Consultar clientes ↗" />
          <QuickLink href="/admin/negocio"   label="Revisar configuración ↗" />
          <QuickLink href="/admin/servicios" label="Gestionar servicios ↗" />
        </div>
      </div>
    </section>
  )
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="text-13 font-semibold text-primary hover:underline
                 focus-visible:outline-none focus-visible:ring-2
                 focus-visible:ring-primary rounded-sm"
    >
      {label}
    </Link>
  )
}
