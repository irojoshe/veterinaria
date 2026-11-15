import { forwardRef, isValidElement, cloneElement } from 'react'
import { cn } from '@/lib/utils/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  fullWidth?: boolean
  /** Renderiza el primer hijo como el elemento raíz (útil con <Link>) */
  asChild?: boolean
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-brand-primary text-bg-default hover:bg-brand-secondary active:bg-brand-secondary ' +
    'disabled:bg-border-light disabled:text-text-muted',
  secondary:
    'bg-bg-default text-brand-primary border border-border hover:bg-bg-secondary ' +
    'active:bg-border-light disabled:opacity-50',
  outline:
    'bg-transparent text-brand-primary border border-brand-primary hover:bg-bg-secondary ' +
    'active:bg-border-light disabled:opacity-50',
  danger:
    'bg-status-cancelled text-bg-default hover:opacity-90 ' +
    'active:opacity-80 disabled:opacity-50',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-13 gap-1.5',
  md: 'h-btn px-5 text-14 gap-2',
  lg: 'h-btn px-5 text-14 gap-2.5',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      asChild = false,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading

    const computedClass = cn(
      'inline-flex items-center justify-center font-semibold rounded-input',
      'transition-colors duration-150 cursor-pointer select-none',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2',
      'disabled:cursor-not-allowed',
      variantStyles[variant],
      sizeStyles[size],
      fullWidth && 'w-full',
      className
    )

    // Modo asChild: clona el hijo y le pasa las clases
    if (asChild && isValidElement(children)) {
      return cloneElement(children as React.ReactElement<{ className?: string }>, {
        className: cn((children as React.ReactElement<{ className?: string }>).props.className, computedClass),
      })
    }

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={computedClass}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin h-4 w-4 shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12" cy="12" r="10"
              stroke="currentColor" strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
export default Button
