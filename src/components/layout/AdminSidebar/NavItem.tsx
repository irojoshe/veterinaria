import Link from 'next/link'
import { clsx } from 'clsx'

interface NavItemProps {
  href: string
  label: string
  icon: React.ReactNode
  active: boolean
}

export default function NavItem({ href, label, icon, active }: NavItemProps) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={clsx(
        'flex items-center gap-3 px-3 py-2.5 rounded-md text-13 transition-colors duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background-surface',
        active
          ? 'bg-primary-nav text-background-surface font-semibold'
          : 'text-border-muted hover:text-background-surface hover:bg-primary-nav/50 font-regular'
      )}
    >
      <span className="w-icon-sm h-icon-sm shrink-0" aria-hidden="true">{icon}</span>
      {label}
    </Link>
  )
}
