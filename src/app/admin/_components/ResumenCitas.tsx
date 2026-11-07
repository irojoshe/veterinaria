import { getResumenEstadisticas } from '@/lib/services/dashboard'
import StatCard from './StatCard'
import BarraEstado from './BarraEstado'

export default async function ResumenCitas() {
  const stats = await getResumenEstadisticas()

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-18 font-semibold text-text-heading">Citas</h2>

      <div className="grid grid-cols-2 gap-4">
        <StatCard
          label="Citas de hoy"
          value={stats.citas_hoy}
          sub={`${stats.citas_hoy_pendientes} pendiente · ${stats.citas_hoy_confirmadas} confirmadas`}
        />
        <StatCard
          label="Citas de noviembre"
          value={stats.citas_mes}
          sub="Todos los estados"
        />
      </div>

      {/* Distribución por estado */}
      <div className="flex flex-col gap-3 bg-background-surface border border-border
                      rounded-lg p-6">
        <p className="text-14 font-semibold text-text-main">
          Citas por estado · Noviembre
        </p>
        <div className="flex flex-col gap-3">
          <BarraEstado
            label="Pendiente"
            valor={stats.distribucion.pendiente}
            total={stats.citas_mes}
            color="bg-status-pending"
          />
          <BarraEstado
            label="Confirmada"
            valor={stats.distribucion.confirmada}
            total={stats.citas_mes}
            color="bg-status-confirmed"
          />
          <BarraEstado
            label="Atendida"
            valor={stats.distribucion.atendida}
            total={stats.citas_mes}
            color="bg-status-attended"
          />
          <BarraEstado
            label="Cancelada"
            valor={stats.distribucion.cancelada}
            total={stats.citas_mes}
            color="bg-status-cancelled"
          />
        </div>
      </div>
    </section>
  )
}
