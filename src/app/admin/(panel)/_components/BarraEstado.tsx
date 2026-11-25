interface BarraEstadoProps {
  label: string
  valor: number
  total: number
  color: string
}

export default function BarraEstado({ label, valor, total, color }: BarraEstadoProps) {
  const pct = total > 0 ? Math.round((valor / total) * 100) : 0

  return (
    <div className="flex items-center gap-3">
      <span className="text-13 text-text-muted w-24 shrink-0">{label}</span>
      <div className="flex-1 h-2.5 rounded-full bg-background overflow-hidden">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={valor}
          aria-valuemin={0}
          aria-valuemax={total}
          aria-label={`${label}: ${valor} de ${total}`}
        />
      </div>
      <span className="text-13 font-semibold text-text-main w-6 text-right">
        {valor}
      </span>
    </div>
  )
}
