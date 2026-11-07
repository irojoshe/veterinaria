import { twMerge } from 'tailwind-merge'
import { clsx } from 'clsx'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Padding interno. Por defecto 'md' (24px) */
  padding?: 'none' | 'sm' | 'md' | 'lg'
  /** Borde visible. Por defecto true */
  bordered?: boolean
}

const paddingStyles = {
  none: '',
  sm:   'p-3',
  md:   'p-6',
  lg:   'p-8',
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
      className={twMerge(
        clsx(
          'bg-background-surface rounded-lg',
          bordered && 'border border-border',
          paddingStyles[padding],
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  )
}
