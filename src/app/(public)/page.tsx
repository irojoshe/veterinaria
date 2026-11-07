import type { Metadata } from 'next'
import { getNegocio } from '@/lib/services/negocio'
import { getServiciosPublicos } from '@/lib/services/servicios'
import HeroSection from './_components/HeroSection'
import ValoresSection from './_components/ValoresSection'
import ServiciosDestacados from './_components/ServiciosDestacados'
import PasosSection from './_components/PasosSection'
import ContactoSection from './_components/ContactoSection'

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
      <PasosSection />
      <ContactoSection negocio={negocio} />
    </>
  )
}
