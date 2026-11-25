'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { clsx } from 'clsx'
import NavItem from '../AdminSidebar/NavItem'
import { NAV_ITEMS } from '../AdminSidebar/navItems'
import { AdminSidebarFooter } from '../AdminSidebar/AdminSidebar'

const MENU_ID = 'admin-mobile-menu'

export default function AdminMobileMenu() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const triggerRef = useRef<HTMLButtonElement>(null)
  const drawerRef = useRef<HTMLDivElement>(null)
  const wasOpen = useRef(false)
  const closeMenu = useCallback(() => setOpen(false), [])

  useEffect(() => {
    if (!open) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMenu()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, closeMenu])

  useEffect(() => {
    if (open) {
      wasOpen.current = true
      drawerRef.current?.focus()
    } else if (wasOpen.current) {
      wasOpen.current = false
      triggerRef.current?.focus()
    }
  }, [open])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="md:hidden flex items-center justify-center w-10 h-10 -ml-2 rounded-md
                   text-text-muted hover:bg-background-warm transition-colors
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label={open ? 'Cerrar menú de administración' : 'Abrir menú de administración'}
        aria-expanded={open}
        aria-controls={MENU_ID}
        onClick={() => setOpen((value) => !value)}
      >
        <HamburgerIcon open={open} />
      </button>

      {open && (
        <div
          aria-hidden="true"
          className="md:hidden fixed inset-0 z-40 bg-primary-deeper/40 backdrop-blur-sm"
          onClick={closeMenu}
        />
      )}

      <div
        id={MENU_ID}
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menú de administración"
        aria-hidden={!open}
        tabIndex={-1}
        className={clsx(
          'md:hidden fixed inset-y-0 left-0 z-50 w-[280px] max-w-[85vw]',
          'bg-primary-deeper flex flex-col shadow-panel transition-transform duration-200',
          open ? 'translate-x-0' : '-translate-x-full pointer-events-none'
        )}
      >
        {open && (
          <>
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-primary-nav/40">
              <p className="text-13 font-semibold text-background-surface">
                Navegación administrativa
              </p>
              <button
                type="button"
                onClick={closeMenu}
                aria-label="Cerrar menú de administración"
                className="flex items-center justify-center w-8 h-8 rounded-md text-border-muted
                           hover:text-background-surface hover:bg-primary-nav/50 transition-colors
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background-surface"
              >
                <CloseIcon />
              </button>
            </div>
            <nav
              className="flex flex-col gap-1 px-3 py-4 flex-1 overflow-y-auto"
              aria-label="Módulos de administración"
            >
              {NAV_ITEMS.map((item) => (
                <NavItem
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  icon={item.icon}
                  active={
                    item.href === '/admin'
                      ? pathname === '/admin'
                      : pathname.startsWith(item.href)
                  }
                  onClick={closeMenu}
                />
              ))}
            </nav>
            <AdminSidebarFooter onNavigate={closeMenu} />
          </>
        )}
      </div>
    </>
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

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  )
}
