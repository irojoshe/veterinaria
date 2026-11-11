'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils/cn'
import CtaCita from '@/components/ui/CtaCita'
import MobileMenu from './MobileMenu'

const NAV_LINKS = [
  { href: '/',          label: 'Inicio' },
  { href: '/servicios', label: 'Servicios' },
  { href: '/mascotas',  label: 'Mascotas' },
  { href: '/cita',      label: 'Cita' },
  { href: '/contacto',  label: 'Contacto' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => { setMenuOpen(false) }, [pathname])
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <header className="w-full sticky top-0 z-40 bg-background">
      <div className="w-full h-banner bg-accent-green-light flex items-center justify-center px-page-px">
        <span className="hidden md:inline text-11 font-normal text-primary text-center">
          Un espacio para cuidar de quienes te acompañan · Clínica y datos de ejemplo
        </span>
        <span className="md:hidden text-11 font-normal text-primary text-center">
          Huella Vet · Clínica de ejemplo
        </span>
      </div>

      <nav aria-label="Navegación principal" className="w-full bg-background">
        <div className="max-w-content mx-auto h-header-mobile md:h-header-desktop px-page-px md:px-page-px-lg flex items-center justify-between">
          <NavBrand />

          <div className="hidden md:flex items-center gap-[30px]">
            <ul className="flex items-center gap-[30px]" role="list">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <NavLink href={link.href} active={pathname === link.href}>
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>

            <CtaCita />
          </div>

          <button
            className="md:hidden flex items-center justify-center w-10 h-10 -mr-2 rounded-md
                       text-primary hover:bg-background-warm transition-colors"
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <HamburgerIcon open={menuOpen} />
          </button>
        </div>
      </nav>

      <MobileMenu open={menuOpen} pathname={pathname} />
    </header>
  )
}

function NavBrand() {
  return (
    <Link href="/" className="flex items-center gap-2.5 focus-visible:outline-none
                               focus-visible:ring-2 focus-visible:ring-primary rounded-sm">
      <span className="w-brand-icon h-brand-icon rounded-card bg-primary flex items-center
                       justify-center shrink-0" aria-hidden="true">
        <PawIcon className="text-background-surface w-5 h-5" />
      </span>
      <span className="text-25 font-bold text-primary-dark tracking-[-1px] leading-none">
        huella vet
      </span>
    </Link>
  )
}

function NavLink({ href, active, children }: {
  href: string; active: boolean; children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'text-14 leading-[1.45] transition-colors duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm',
        active
          ? 'font-bold text-primary'
          : 'font-normal text-text-muted hover:text-text-main'
      )}
    >
      {children}
    </Link>
  )
}

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true">
      {open ? (
        <><path d="M18 6L6 18" /><path d="M6 6l12 12" /></>
      ) : (
        <><path d="M3 6h18" /><path d="M3 12h18" /><path d="M3 18h18" /></>
      )}
    </svg>
  )
}

function PawIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="4" r="2" /><circle cx="18" cy="8" r="2" />
      <circle cx="4" cy="8" r="2" /><circle cx="7" cy="14" r="2" />
      <path d="M12 22c-3.87 0-7-1.57-7-4.5 0-1.5 1.14-2.96 3-3.5
               1.22-.35 2.16-1.09 2.8-2.09.5-.8 1.6-.8 2.1 0
               .64 1 1.58 1.74 2.8 2.09 1.86.54 3 2 3 3.5C19 20.43 15.87 22 12 22z" />
    </svg>
  )
}
