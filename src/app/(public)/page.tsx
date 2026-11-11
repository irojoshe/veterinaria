import type { Metadata } from 'next'
import { getNegocio } from '@/lib/services/negocio'
import { getServiciosPublicos } from '@/lib/services/servicios'
import HeroSection from './_components/HeroSection'
import ValoresSection from './_components/ValoresSection'
import ServiciosDestacados from './_components/ServiciosDestacados'
import LaClinicaSection from './_components/LaClinicaSection'
import CuidadosSection from './_components/CuidadosSection'
import ComunidadSection from './_components/ComunidadSection'
import PasosSection from './_components/PasosSection'
import ContactoSection from './_components/ContactoSection'
import InvitacionFinalSection from './_components/InvitacionFinalSection'

export const metadata: Metadata = {
  title: 'Inicio',
  description:
    'Atención veterinaria cercana en Madrid. Solicita tu cita sin registro.',
}

export default async function HomePage() {
  const [negocio, servicios] = await Promise.all([
    getNegocio(),
    getServiciosPublicos(),
  ])

  return (
    <>
      <HeroSection negocio={negocio} />
      <ValoresSection />
      <ServiciosDestacados servicios={servicios} />
      <LaClinicaSection />
      <CuidadosSection />
      <ComunidadSection />
      <PasosSection />
      <ContactoSection negocio={negocio} />
      <InvitacionFinalSection />
    </>
  )
}
