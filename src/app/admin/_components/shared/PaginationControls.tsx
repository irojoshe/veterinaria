'use client'

interface Props {
  pagina: number
  paginas: number
  onChange: (p: number) => void
  total: number
  pageSize: number
}

export default function PaginationControls({
  pagina,
  paginas,
  onChange,
  total,
  pageSize,
}: Props) {
  const desde = (pagina - 1) * pageSize + 1
  const hasta = Math.min(pagina * pageSize, total)

  return (
    <div className="flex items-center justify-between text-13 text-text-muted">
      <span>
        Mostrando {desde}–{hasta} de {total}
      </span>
      <div className="flex gap-1">
        <PaginationButton
          label="‹"
          disabled={pagina === 1}
          onClick={() => onChange(pagina - 1)}
        />
        {Array.from({ length: paginas }, (_, i) => i + 1).map((p) => (
          <PaginationButton
            key={p}
            label={String(p)}
            active={p === pagina}
            onClick={() => onChange(p)}
          />
        ))}
        <PaginationButton
          label="›"
          disabled={pagina === paginas}
          onClick={() => onChange(pagina + 1)}
        />
      </div>
    </div>
  )
}

function PaginationButton({
  label,
  active,
  disabled,
  onClick,
}: {
  label: string
  active?: boolean
  disabled?: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-8 h-8 flex items-center justify-center rounded-md text-13
                  transition-colors focus-visible:outline-none focus-visible:ring-2
                  focus-visible:ring-primary disabled:opacity-40
                  ${
                    active
                      ? 'bg-primary text-background-surface font-semibold'
                      : 'bg-background-surface border border-border hover:bg-background'
                  }`}
    >
      {label}
    </button>
  )
}
