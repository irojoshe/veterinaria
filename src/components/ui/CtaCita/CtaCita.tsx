import Link from 'next/link'
import Button, { type ButtonProps } from '../Button'

export interface CtaCitaProps {
  href?: string
  label?: string
  variant?: ButtonProps['variant']
  size?: ButtonProps['size']
  fullWidth?: boolean
  className?: string
}

export default function CtaCita({
  href = '/cita',
  label = 'Solicitar cita',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
}: CtaCitaProps) {
  return (
    <Button asChild variant={variant} size={size} fullWidth={fullWidth} className={className}>
      <Link href={href}>{label}</Link>
    </Button>
  )
}
