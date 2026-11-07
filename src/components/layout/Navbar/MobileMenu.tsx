'use client'

import Link from 'next/link'
import { clsx } from 'clsx'
import Button from '@/components/ui/Button'

const NAV_LINKS = [
  { href: '/',          label: 'Inicio' },
  { href: '/servicios', label: 'Servicios' },
  { href: '/mascotas',  label: 'Mascotas' },
  { href: '/cita',      label: 'Cita' },
  { href: '/contacto',  label: 'Contacto' },
]

interface MobileMenuProps {
  open: boolean
  pathname: string
}

export default function MobileMenu({ open, pathname }: MobileMenuProps) {
  return (
    <div
      id="mobile-menu"
      role="dialog"
      aria-label="Menú de navegación"
      aria-hidden={!open}
      className={clsx(
        'md:hidden fixed inset-x-0 top-[calc(30px+76px)] bottom-0 z-40',
        'bg-background-surface border-t border-border flex flex-col',
        'transition-transform duration-200',
        open ? 'translate-y-0' : '-translate-y-full pointer-events-none'
      )}
    >
      <ul className="flex flex-col p-6 gap-1" role="list">
        {NAV_LINKS.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              aria-current={pathname === link.href ? 'page' : undefined}
              className={clsx(
                'flex items-center h-12 px-3 rounded-md text-15 transition-colors',
                pathname === link.href
                  ? 'font-bold text-primary bg-accent-green-light'
                  : 'font-regular text-text-main hover:bg-background'
              )}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
      <div className="px-6 pb-6">
        <Button fullWidth asChild>
          <Link href="/cita">Solicitar cita</Link>
        </Button>
      </div>
    </div>
  )
}
