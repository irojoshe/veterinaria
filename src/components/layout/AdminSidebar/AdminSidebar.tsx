'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import NavItem from './NavItem'
import {
  IconDashboard, IconCalendar, IconStethoscope, IconPaw,
  IconUsers, IconStore, IconMail, IconCheckCircle,
} from './AdminIcons'

const NAV_ITEMS = [
  { href: '/admin',                label: 'Resumen',                 icon: <IconDashboard /> },
  { href: '/admin/citas',          label: 'Citas',                   icon: <IconCalendar /> },
  { href: '/admin/servicios',      label: 'Servicios',               icon: <IconStethoscope /> },
  { href: '/admin/mascotas',       label: 'Mascotas',                icon: <IconPaw /> },
  { href: '/admin/clientes',       label: 'Clientes',                icon: <IconUsers /> },
  { href: '/admin/negocio',        label: 'Información del negocio', icon: <IconStore /> },
  { href: '/admin/notificaciones', label: 'Notificaciones',          icon: <IconMail /> },
  { href: '/admin/operacion',      label: 'Estados de operación',    icon: <IconCheckCircle /> },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside
      className="hidden md:flex flex-col w-sidebar shrink-0 bg-primary-deeper
                 min-h-screen sticky top-0 h-screen overflow-y-auto"
      aria-label="Navegación administrativa"
    >
      <SidebarBrand />

      <nav className="flex flex-col gap-1 px-3 flex-1"
           aria-label="Módulos de administración">
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
          />
        ))}
      </nav>

      <SidebarFooter />
    </aside>
  )
}

function SidebarBrand() {
  return (
    <div className="px-7.5 pt-7.5 pb-6">
      <Link
        href="/admin"
        className="flex items-center gap-2.5 focus-visible:outline-none
                   focus-visible:ring-2 focus-visible:ring-background-surface rounded-sm"
      >
        <span className="w-brand-icon h-brand-icon rounded-full bg-background-surface
                         flex items-center justify-center shrink-0" aria-hidden="true">
          <IconPaw className="text-primary w-5 h-5" />
        </span>
        <span className="text-25 font-bold text-background-surface tracking-tight leading-none">
          huella vet
        </span>
      </Link>
    </div>
  )
}

function SidebarFooter() {
  return (
    <div className="px-3 pb-6 pt-4 flex flex-col gap-2
                    border-t border-primary-nav/40 mt-4">
      <p className="text-11 text-border-muted px-3 uppercase tracking-wide">
        Entorno de ejemplo · Solo administración
      </p>
      <Link
        href="/"
        className="text-13 text-background-surface hover:text-border-muted
                   transition-colors px-3 focus-visible:outline-none
                   focus-visible:ring-1 focus-visible:ring-background-surface rounded-sm"
      >
        ↗ Ver sitio público
      </Link>
      <button
        className="text-13 text-left text-border-muted hover:text-background-surface
                   transition-colors px-3 focus-visible:outline-none
                   focus-visible:ring-1 focus-visible:ring-background-surface rounded-sm"
      >
        Cerrar sesión
      </button>
    </div>
  )
}
