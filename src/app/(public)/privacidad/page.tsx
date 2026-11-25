import type { Metadata } from 'next'
import { getNegocio } from '@/lib/services/negocio'

export const metadata: Metadata = {
  title: 'Aviso de privacidad',
  description:
    'Cómo tratamos los datos personales que nos envías al solicitar una cita en Huella Vet.',
}

export default async function PrivacidadPage() {
  const negocio = await getNegocio()

  return (
    <div className="max-w-content mx-auto w-full px-6 md:px-20 py-12 flex flex-col gap-10">
      {/* Cabecera */}
      <div className="flex flex-col gap-4 max-w-2xl">
        <span className="text-12 font-bold tracking-wide uppercase text-brand-primary">
          Aviso legal
        </span>
        <h1 className="text-32 md:text-52 font-semibold text-text-heading leading-tight">
          Tus datos, bajo control.
        </h1>
        <p className="text-18 text-text-muted leading-relaxed">
          Esta página explica qué datos recogemos cuando nos pides una cita, para
          qué los usamos y cómo puedes pedirnos que los borremos.
        </p>
      </div>

      <div className="flex flex-col gap-8 max-w-3xl">
        <Section title="Responsable del tratamiento">
          <p>
            {negocio.nombre}, con domicilio en {negocio.direccion}, es responsable
            de los datos personales recogidos a través de este sitio. Puedes
            contactarnos en{' '}
            <a
              href={`mailto:${negocio.email}`}
              className="font-semibold text-brand-primary hover:underline"
            >
              {negocio.email}
            </a>{' '}
            o al teléfono{' '}
            <a
              href={`tel:${negocio.telefono.replace(/\s/g, '')}`}
              className="font-semibold text-brand-primary hover:underline"
            >
              {negocio.telefono}
            </a>
            .
          </p>
        </Section>

        <Section title="Qué datos recogemos">
          <p>
            Solo cuando envías una solicitud de cita. No necesitas crear cuenta y
            no te pedimos documentos de identidad.
          </p>
          <ul className="flex flex-col gap-2 list-disc pl-5">
            <li>Tu nombre, email y teléfono, para poder confirmarte la cita.</li>
            <li>
              El nombre y los datos básicos de tu mascota (especie, raza y edad),
              para preparar la consulta.
            </li>
            <li>
              La fecha y hora que prefieres y el motivo de la visita, para
              organizar la agenda.
            </li>
          </ul>
        </Section>

        <Section title="Para qué los usamos">
          <p>
            Únicamente para gestionar tu solicitud de cita: confirmar fecha y
            hora, preparar la consulta y avisarte del resultado. No vendemos ni
            cedemos tus datos a terceros con fines comerciales.
          </p>
        </Section>

        <Section title="Base legal y conservación">
          <p>
            La base legal es tu consentimiento, que das al marcar la casilla de
            privacidad del formulario. Conservamos los datos mientras dure la
            relación con la clínica y, después, durante los plazos legales
            aplicables a la atención veterinaria.
          </p>
        </Section>

        <Section title="Destinatarios">
          <p>
            Solo el equipo de {negocio.nombre} accede a los datos para atender la
            cita. No cedemos la información a terceros salvo obligación legal.
          </p>
        </Section>

        <Section title="Tus derechos">
          <p>
            Puedes pedirnos acceso, rectificación, supresión, limitación u
            oposición de tus datos, y retirar tu consentimiento en cualquier
            momento. Escríbenos a{' '}
            <a
              href={`mailto:${negocio.email}`}
              className="font-semibold text-brand-primary hover:underline"
            >
              {negocio.email}
            </a>{' '}
            y responderemos lo antes posible.
          </p>
        </Section>

        <Section title="Cookies">
          <p>
            Este sitio no instala cookies de seguimiento ni de publicidad. Las
            cookies técnicas propias del servidor son necesarias para que la
            web funcione y no se usan para seguir tu navegación.
          </p>
        </Section>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-h2 font-semibold text-text-heading">{title}</h2>
      <div className="flex flex-col gap-3 text-16 text-text-secondary leading-relaxed">
        {children}
      </div>
    </section>
  )
}
