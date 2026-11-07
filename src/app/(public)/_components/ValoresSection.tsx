const VALORES = [
  {
    icon: '🤝',
    titulo: 'Trato cercano',
    texto: 'Escuchamos lo que os preocupa.',
  },
  {
    icon: '🩺',
    titulo: 'Cuidado con criterio',
    texto: 'Te explicamos cada paso.',
  },
  {
    icon: '📅',
    titulo: 'A tu ritmo',
    texto: 'Solicita tu visita sin crear una cuenta.',
  },
]

export default function ValoresSection() {
  return (
    <section
      className="w-full bg-brand-light py-8 px-page-px md:px-page-px-md lg:px-page-px-lg"
      aria-label="Valores de la clínica"
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-gap-md">
        {VALORES.map((v) => (
          <div key={v.titulo} className="flex items-start gap-lg flex-1">
            <span className="text-5xl leading-none" aria-hidden="true">{v.icon}</span>
            <div className="flex flex-col gap-sm">
              <p className="text-lg font-semibold text-text-primary">{v.titulo}</p>
              <p className="text-base text-text-secondary">{v.texto}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
