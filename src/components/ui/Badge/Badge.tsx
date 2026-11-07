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
  pending:   'bg-status-pending-bg   text-status-pending',
  confirmed: 'bg-status-confirmed-bg text-status-confirmed',
  attended:  'bg-status-attended-bg  text-status-attended',
  cancelled: 'bg-status-cancelled-bg text-status-cancelled',
  draft:     'bg-background          text-text-muted border border-border',
  public:    'bg-status-confirmed-bg text-status-confirmed',
  private:   'bg-background          text-text-muted',
  neutral:   'bg-background          text-text-muted',
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
          'inline-flex items-center px-2.5 py-1 rounded-full',
          'text-12 font-semibold leading-none whitespace-nowrap',
          variantStyles[variant],
          className
        )
      )}
    >
      {children}
    </span>
  )
}
