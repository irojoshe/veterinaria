'use client'

interface TextareaFieldProps {
  id: string
  label: string
  name: string
  defaultValue: string
  rows: number
  helperText?: string
}

export default function TextareaField({
  id,
  label,
  name,
  defaultValue,
  rows,
  helperText,
}: TextareaFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-13 font-semibold text-text-main">
        {label}
      </label>
      <textarea
        id={id}
        name={name}
        rows={rows}
        defaultValue={defaultValue}
        className="w-full px-3.5 py-3 rounded-md text-14 text-text-main
                   bg-background-surface border border-border outline-none resize-y
                   focus:ring-2 focus:ring-primary"
      />
      {helperText && <p className="text-11 text-text-muted">{helperText}</p>}
    </div>
  )
}
