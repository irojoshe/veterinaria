import Link from 'next/link'

const FOOTER_LINKS = [
  { href: '/servicios', label: 'Servicios' },
  { href: '/mascotas',  label: 'Mascotas' },
  { href: '/cita',      label: 'Cita' },
  { href: '/contacto',  label: 'Contacto' },
  { href: '/privacidad', label: 'Privacidad' },
  { href: '/admin',     label: 'Acceso de administración' },
]

export default function Footer() {
  return (
    <footer className="bg-primary-deeper text-background-surface" aria-label="Pie de página">
      <div className="max-w-content mx-auto w-full px-6 md:px-12 lg:px-16 py-16 md:py-20 flex flex-col gap-7">

        {/* Marca + info */}
        <div className="flex flex-col md:flex-row md:items-start gap-10 md:gap-20">
          {/* Brand */}
          <div className="flex flex-col gap-3 min-w-sidebar-min">
            <Link href="/" className="flex items-center gap-2.5 w-fit
                                       focus-visible:outline-none focus-visible:ring-2
                                       focus-visible:ring-background-surface rounded-sm">
              <span className="w-brand-icon h-brand-icon rounded-full bg-background-surface
                               flex items-center justify-center shrink-0" aria-hidden="true">
                <PawIcon className="text-primary w-5 h-5" />
              </span>
              <span className="text-25 font-bold text-background-surface tracking-tight leading-none">
                huella vet
              </span>
            </Link>
            <p className="text-17 text-background-surface/80 leading-relaxed max-w-xs">
              Cuidado cercano. Toda una vida juntos.
            </p>
            <p className="text-12 text-border-muted max-w-xs">
              Huella Vet es una marca provisional. Fotografías ilustrativas y datos de ejemplo.
            </p>
          </div>

          {/* Columnas de info */}
          <div className="flex flex-col md:flex-row gap-10 md:gap-16 flex-1">
            {/* Contacto */}
            <div className="flex flex-col gap-2">
              <p className="text-14 font-bold text-background-surface">+34 900 123 456</p>
              <p className="text-13 text-border-muted">hola@huellavet.example</p>
              <p className="text-13 text-border-muted">Calle del Olivo, 24 · Madrid</p>
            </div>

            {/* Horario */}
            <div className="flex flex-col gap-2">
              <p className="text-14 text-background-surface">Lun–vie 09:00–19:00</p>
              <p className="text-14 text-background-surface">Sáb 10:00–14:00</p>
            </div>

            {/* Links */}
            <nav aria-label="Enlaces del pie de página">
              <ul className="flex flex-col gap-2" role="list">
                {FOOTER_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-13 text-border-muted hover:text-background-surface
                                 transition-colors focus-visible:outline-none
                                 focus-visible:ring-1 focus-visible:ring-background-surface
                                 rounded-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        {/* Separador */}
        <hr className="border-border-dark" />

        {/* Copyright */}
        <p className="text-11 text-border-muted">
          © Huella Vet · Propuesta de diseño · Importes orientativos en euros.
        </p>
      </div>
    </footer>
  )
}

function PawIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true"
    >
      <circle cx="11" cy="4" r="2" />
      <circle cx="18" cy="8" r="2" />
      <circle cx="4"  cy="8" r="2" />
      <circle cx="7"  cy="14" r="2" />
      <path d="M12 22c-3.87 0-7-1.57-7-4.5 0-1.5 1.14-2.96 3-3.5
               1.22-.35 2.16-1.09 2.8-2.09.5-.8 1.6-.8 2.1 0
               .64 1 1.58 1.74 2.8 2.09 1.86.54 3 2 3 3.5C19 20.43 15.87 22 12 22z" />
    </svg>
  )
}
