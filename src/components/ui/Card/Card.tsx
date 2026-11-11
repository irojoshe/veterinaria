import { cn } from '@/lib/utils/cn'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Padding interno. Por defecto 'md' (24px) */
  padding?: 'none' | 'sm' | 'md' | 'lg'
  /** Borde visible. Por defecto true */
  bordered?: boolean
}

const paddingStyles = {
  none: '',
  sm:   'p-gap-sm',
  md:   'p-card',
  lg:   'p-section',
}

export default function Card({
  padding = 'md',
  bordered = true,
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        'bg-bg-default rounded-card',
        bordered && 'border border-border',
        paddingStyles[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
