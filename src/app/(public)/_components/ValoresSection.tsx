const VALORES = [
  {
    icon: '/icons/valor-trato-cercano.svg',
    titulo: 'Trato cercano',
    texto: 'Escuchamos lo que os preocupa.',
  },
  {
    icon: '/icons/valor-cuidado-criterio.svg',
    titulo: 'Cuidado con criterio',
    texto: 'Te explicamos cada paso.',
  },
  {
    icon: '/icons/valor-a-tu-ritmo.svg',
    titulo: 'A tu ritmo',
    texto: 'Solicita tu visita sin crear una cuenta.',
  },
]

export default function ValoresSection() {
  return (
    <section
      className="w-full bg-brand-light py-6 md:py-8"
      aria-label="Valores de la clínica"
    >
      <div className="max-w-content mx-auto flex flex-col gap-6 md:flex-row md:gap-12 px-page-px md:px-page-px-md lg:px-page-px-lg">
        {VALORES.map((v) => (
          <div key={v.titulo} className="flex flex-1 items-start gap-4 md:items-center">
            <img
              src={v.icon}
              alt=""
              width={30}
              height={30}
              aria-hidden="true"
              className="h-[26px] w-[26px] shrink-0 md:h-[30px] md:w-[30px]"
            />
            <div className="flex flex-col gap-1">
              <p className="text-16 font-semibold text-text-main">{v.titulo}</p>
              <p className="text-13 text-text-secondary">{v.texto}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
