import { getResumenEstadisticas } from '@/lib/services/dashboard'
import StatCard from './StatCard'

export default async function ResumenMascotas() {
  const stats = await getResumenEstadisticas()

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-18 font-semibold text-text-heading">Mascotas y clientes</h2>

      <div className="grid grid-cols-2 gap-4">
        <StatCard
          label="Mascotas registradas"
          value={stats.mascotas_total}
          sub={`${stats.mascotas_publicas} con publicación pública`}
        />
        <StatCard
          label="Clientes"
          value={stats.clientes_total}
          sub="Propietarios derivados de citas"
        />
      </div>
    </section>
  )
}
