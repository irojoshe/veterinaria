import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import type { CitaFormValues } from '@/lib/validations/cita'

interface Props {
  values: Partial<CitaFormValues>
}

export default function ResumenCita({ values }: Props) {
  const filas = [
    { label: 'Mascota',    value: values.mascota_nombre && values.especie ? `${values.mascota_nombre} · ${values.especie}` : '—' },
    { label: 'Servicio',   value: values.servicio   ?? '—' },
    { label: 'Preferencia',value: values.fecha_preferida && values.hora_preferida ? `${values.fecha_preferida} · ${values.hora_preferida}` : '—' },
    { label: 'Motivo',     value: values.motivo     ?? '—' },
  ]

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-19 font-semibold text-text-main">Tu solicitud, de un vistazo</h3>
        <Badge variant="pending">Pendiente de confirmación</Badge>
      </div>

      <dl className="flex flex-col gap-3">
        {filas.map(({ label, value }) => (
          <div key={label} className="flex gap-5">
            <dt className="text-13 text-text-muted w-28 shrink-0">{label}</dt>
            <dd className="text-13 font-semibold text-text-main break-words flex-1">{value}</dd>
          </div>
        ))}
      </dl>

      <hr className="border-border" />
      <p className="text-13 text-text-muted">
        No se realiza ningún cobro al solicitar. La clínica revisará tu petición y te contactará.
      </p>
    </Card>
  )
}
