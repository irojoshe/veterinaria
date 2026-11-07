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
      className="w-full bg-accent-green-light py-8 px-6 md:px-12 lg:px-20"
      aria-label="Valores de la clínica"
    >
      <div className="max-w-content mx-auto flex flex-col md:flex-row gap-6">
        {VALORES.map((v) => (
          <div key={v.titulo} className="flex items-start gap-4 flex-1">
            <span className="text-26 leading-none" aria-hidden="true">{v.icon}</span>
            <div className="flex flex-col gap-1">
              <p className="text-16 font-semibold text-text-main">{v.titulo}</p>
              <p className="text-13 text-text-muted">{v.texto}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
