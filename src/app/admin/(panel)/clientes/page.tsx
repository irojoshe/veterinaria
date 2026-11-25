import type { Metadata } from 'next'
import { getCitas } from '@/lib/services/citas'
import { getClientes } from '@/lib/services/clientes'
import TablaClientes from './_components/TablaClientes'

export const metadata: Metadata = { title: 'Clientes' }

export default async function ClientesAdminPage() {
  const [clientes, citas] = await Promise.all([getClientes(), getCitas()])
  const conHistorial = clientes.filter((cliente) => cliente.total_citas > 0).length

  return (
    <div className="px-4 py-6 md:px-9 md:py-9 flex flex-col gap-6 max-w-page">
      <div className="flex flex-col gap-1">
        <p className="text-13 text-text-muted">Administración / Clientes</p>
        <h1 className="text-32 font-semibold text-text-heading">Clientes</h1>
        <p className="text-15 text-text-muted">
          Consulta los datos de contacto y el historial de citas de cada cliente.
        </p>
      </div>

      <div className="flex gap-3 flex-wrap">
        <span className="inline-flex items-center px-3 py-1.5 rounded-full
                         text-12 font-semibold bg-accent-green-light text-primary">
          Total · {clientes.length}
        </span>
        <span className="inline-flex items-center px-3 py-1.5 rounded-full
                         text-12 font-semibold bg-background border border-border text-text-muted">
          Con historial · {conHistorial}
        </span>
        <span className="inline-flex items-center px-3 py-1.5 rounded-full
                         text-12 font-semibold bg-background border border-border text-text-muted">
          Sin historial · {clientes.length - conHistorial}
        </span>
      </div>

      <TablaClientes clientes={clientes} citas={citas} />

      <p className="text-11 text-text-muted">
        El historial se enlaza con las citas mediante el email del propietario.
      </p>
    </div>
  )
}
