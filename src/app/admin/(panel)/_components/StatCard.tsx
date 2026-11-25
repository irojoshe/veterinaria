interface StatCardProps {
  label: string
  value: string | number
  sub?: string
}

/** Tarjeta numérica de un solo indicador */
export default function StatCard({ label, value, sub }: StatCardProps) {
  return (
    <div className="flex flex-col gap-2 bg-background-surface border border-border
                    rounded-lg p-6">
      <p className="text-13 text-text-muted">{label}</p>
      <p className="text-36 font-semibold text-text-main leading-none">{value}</p>
      {sub && <p className="text-11 text-text-muted">{sub}</p>}
    </div>
  )
}
