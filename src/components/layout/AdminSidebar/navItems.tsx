import {
  IconDashboard, IconCalendar, IconStethoscope, IconPaw,
  IconUsers, IconStore, IconMail, IconCheckCircle,
} from './AdminIcons'

export const NAV_ITEMS = [
  { href: '/admin',                label: 'Resumen',                 icon: <IconDashboard /> },
  { href: '/admin/citas',          label: 'Citas',                   icon: <IconCalendar /> },
  { href: '/admin/servicios',      label: 'Servicios',               icon: <IconStethoscope /> },
  { href: '/admin/mascotas',       label: 'Mascotas',                icon: <IconPaw /> },
  { href: '/admin/clientes',       label: 'Clientes',                icon: <IconUsers /> },
  { href: '/admin/negocio',        label: 'Información del negocio', icon: <IconStore /> },
  { href: '/admin/notificaciones', label: 'Notificaciones',          icon: <IconMail /> },
  { href: '/admin/operacion',      label: 'Estados de operación',    icon: <IconCheckCircle /> },
]
