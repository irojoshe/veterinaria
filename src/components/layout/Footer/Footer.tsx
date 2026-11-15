import Link from 'next/link'

const FOOTER_LINKS_LINE_1 = [
  { href: '/servicios', label: 'Servicios' },
  { href: '/mascotas',  label: 'Mascotas' },
  { href: '/cita',      label: 'Cita' },
  { href: '/contacto',  label: 'Contacto' },
]

const FOOTER_LINKS_LINE_2 = [
  { href: '/privacidad', label: 'Privacidad' },
  { href: '/admin',      label: 'Acceso de administración' },
]

export default function Footer() {
  return (
    <footer className="w-full bg-brand-secondary text-background-surface" aria-label="Pie de página">
      <div className="max-w-content mx-auto w-full p-page-px md:p-page-h-lg flex flex-col gap-7">

        <Link href="/" className="flex items-center gap-2.5 w-fit
                                   focus-visible:outline-none focus-visible:ring-2
                                   focus-visible:ring-background-surface rounded-sm">
          <span className="w-brand-icon h-brand-icon rounded-card bg-background-surface
                           flex items-center justify-center shrink-0" aria-hidden="true">
            <PawIcon className="text-primary w-5 h-5" />
          </span>
          <span className="text-25 font-bold text-background-surface tracking-[-1px] leading-none">
            huella vet
          </span>
        </Link>

        <div className="flex flex-col gap-[18px] md:flex-row md:gap-5">
          <div className="md:flex-1 flex flex-col gap-3">
            <p className="text-17 text-background-surface">
              Cuidado cercano. Toda una vida juntos.
            </p>
            <p className="text-12 text-text-on-dark">
              Huella Vet es una marca provisional. Fotografías ilustrativas y datos de ejemplo.
            </p>
          </div>

          <div className="md:flex-1 flex flex-col gap-2">
            <p className="text-14 text-background-surface">+34 900 123 456</p>
            <p className="text-13 text-text-on-dark">
              hola@huellavet.example
              <br />
              Calle del Olivo, 24 · Madrid
            </p>
          </div>

          <div className="md:flex-1 flex flex-col gap-2">
            <p className="text-14 text-background-surface">
              Lun–vie 09:00–19:00 · Sáb 10:00–14:00
            </p>
            <nav aria-label="Enlaces del pie de página" className="flex flex-col gap-1 text-13 text-text-on-dark">
              <FooterLinkLine links={FOOTER_LINKS_LINE_1} />
              <FooterLinkLine links={FOOTER_LINKS_LINE_2} />
            </nav>
          </div>
        </div>

        <hr className="border-border-on-dark" />

        <p className="text-11 text-text-on-dark">
          © Huella Vet · Propuesta de diseño · Importes orientativos en euros.
        </p>
      </div>
    </footer>
  )
}

function FooterLinkLine({ links }: { links: { href: string; label: string }[] }) {
  return (
    <p>
      {links.map((link, index) => (
        <span key={link.href}>
          {index > 0 && <span aria-hidden="true"> · </span>}
          <Link
            href={link.href}
            className="hover:text-background-surface transition-colors
                       focus-visible:outline-none focus-visible:ring-1
                       focus-visible:ring-background-surface rounded-sm"
          >
            {link.label}
          </Link>
        </span>
      ))}
    </p>
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
