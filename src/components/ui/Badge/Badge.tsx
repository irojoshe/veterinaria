import { twMerge } from 'tailwind-merge'
import { clsx } from 'clsx'

export type BadgeVariant =
  | 'pending'
  | 'confirmed'
  | 'attended'
  | 'cancelled'
  | 'draft'
  | 'public'
  | 'private'
  | 'neutral'

export interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  pending:   'bg-status-pending-bg text-status-pending',
  confirmed: 'bg-status-confirmed-bg text-status-confirmed',
  attended:  'bg-status-attended-bg text-status-attended',
  cancelled: 'bg-status-cancelled-bg text-status-cancelled',
  draft:     'bg-bg-default text-text-muted border border-border-default',
  public:    'bg-status-confirmed-bg text-status-confirmed',
  private:   'bg-bg-default text-text-muted',
  neutral:   'bg-bg-default text-text-muted',
}

export default function Badge({
  variant = 'neutral',
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center px-gap-md py-gap-sm rounded-input',
          'text-caption font-semibold leading-none whitespace-nowrap',
          variantStyles[variant],
          className
        )
      )}
    >
      {children}
    </span>
  )
}
