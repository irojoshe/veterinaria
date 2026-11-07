'use client'

import { forwardRef, useId } from 'react'
import { twMerge } from 'tailwind-merge'
import { clsx } from 'clsx'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  fullWidth?: boolean
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, fullWidth, className, id, ...props }, ref) => {
    const generatedId = useId()
    const inputId = id ?? generatedId
    const hasError = Boolean(error)

    return (
      <div className={clsx('flex flex-col gap-1.5', fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-label font-semibold text-text-primary"
          >
            {label}
          </label>
        )}

        <input
          ref={ref}
          id={inputId}
          aria-describedby={
            error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
          }
          aria-invalid={hasError}
          className={twMerge(
            clsx(
              'w-full h-9 px-gap-md rounded-input text-body text-text-primary bg-bg-default',
              'border transition-colors duration-150 outline-none',
              'placeholder:text-text-muted',
              'focus:ring-2 focus:ring-brand-primary focus:border-brand-primary',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              hasError
                ? 'border-status-cancelled focus:ring-status-cancelled'
                : 'border-border-default',
              className
            )
          )}
          {...props}
        />

        {error && (
          <p id={`${inputId}-error`} className="text-small text-status-cancelled" role="alert">
            {error}
          </p>
        )}

        {!error && helperText && (
          <p id={`${inputId}-helper`} className="text-small text-text-muted">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
export default Input
