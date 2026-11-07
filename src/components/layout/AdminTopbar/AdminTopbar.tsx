// Server Component — los datos del admin vendrán de la sesión en el futuro

interface AdminTopbarProps {
  breadcrumb?: string
}

export default function AdminTopbar({ breadcrumb = 'Administración' }: AdminTopbarProps) {
  return (
    <header
      className="flex items-center justify-between px-9 bg-background-surface
                 border-b border-border h-admin-header shrink-0 sticky top-0 z-30"
      aria-label="Barra de administración"
    >
      {/* Breadcrumb */}
      <p className="text-13 text-text-muted">{breadcrumb}</p>

      {/* Admin info */}
      <div className="flex items-center gap-3.5">
        <button
          aria-label="Notificaciones"
          className="w-9 h-9 flex items-center justify-center rounded-md text-text-muted
                     hover:bg-background transition-colors focus-visible:outline-none
                     focus-visible:ring-2 focus-visible:ring-primary"
        >
          <IconBell className="w-5 h-5" />
        </button>

        {/* Avatar */}
        <div
          className="w-avatar-sm h-avatar-sm rounded-full bg-accent-green-light
                     flex items-center justify-center shrink-0"
          aria-hidden="true"
        >
          <span className="text-12 font-bold text-text-main">AV</span>
        </div>

        <span className="text-13 text-text-main hidden sm:block">Administrador</span>
      </div>
    </header>
  )
}

function IconBell({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  )
}
