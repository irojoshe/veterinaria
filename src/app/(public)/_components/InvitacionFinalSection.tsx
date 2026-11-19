import Link from 'next/link'
import Button from '@/components/ui/Button'

export default function InvitacionFinalSection() {
  return (
    <section
      className="w-full py-10 md:py-20"
      aria-label="Invitación final"
    >
      <div className="max-w-content mx-auto w-full px-page-px md:px-page-px-md lg:px-page-px-lg flex flex-col md:flex-row md:items-center md:justify-between gap-6 md:gap-20">
        <div className="flex flex-1 flex-col">
          <h2 className="text-h2 font-semibold text-text-primary">
            <span className="md:hidden">
              Una vida juntos. Un cuidado a su altura.
            </span>
            <span className="hidden md:inline">
              Una vida juntos.<br />Un cuidado a su altura.
            </span>
          </h2>
        </div>

        <Button asChild variant="primary" size="lg" className="w-full md:w-auto">
          <Link href="/cita">
            <span>Solicitar una cita</span>
            <img
              src="/icons/arrow-right.svg"
              alt=""
              width={20}
              height={20}
              aria-hidden="true"
            />
          </Link>
        </Button>
      </div>
    </section>
  )
}
