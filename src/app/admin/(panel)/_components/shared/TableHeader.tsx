interface Props {
  columns: string[]
}

export default function TableHeader({ columns }: Props) {
  return (
    <div
      className="grid gap-3.5 px-4 py-3 bg-accent-green-light
                 text-11 font-bold text-text-muted uppercase tracking-wide"
      style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}
      role="row"
    >
      {columns.map((col) => (
        <span key={col} role="columnheader">
          {col}
        </span>
      ))}
    </div>
  )
}
