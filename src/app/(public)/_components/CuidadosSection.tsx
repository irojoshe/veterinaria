const CONSEJOS = [
  {
    etiqueta: '01 / BIENESTAR',
    titulo: 'Una rutina que les siente bien',
    descripcion: 'Alimentación, actividad y descanso adaptados a su edad.',
    descripcionDesktop: 'Alimentación, actividad y descanso adaptados a su edad.',
  },
  {
    etiqueta: '02 / BIENESTAR',
    titulo: 'Prevenir es acompañar',
    descripcion: 'Consulta su pauta de revisiones y vacunación.',
    descripcionDesktop: 'Consulta la pauta de revisiones y vacunación de tu mascota.',
  },
  {
    etiqueta: '03 / BIENESTAR',
    titulo: 'Observa los pequeños cambios',
    descripcion: 'Si cambia su apetito o conducta, contacta con la clínica.',
    descripcionDesktop: 'Si cambia su apetito o su conducta, contacta con la clínica.',
  },
]

export default function CuidadosSection() {
  return (
    <section
      className="w-full py-10 md:py-20"
      aria-label="Cuidados cotidianos"
    >
      <div className="max-w-content mx-auto w-full px-page-px md:px-page-px-md lg:px-page-px-lg flex flex-col gap-6 md:gap-8">
        {/* Cabecera */}
        <div className="flex flex-col gap-gap-md">
          <span className="text-eyebrow uppercase text-brand-primary">
            Para cada etapa
          </span>
          <h2 className="text-h2 font-semibold text-text-primary">
            Su cuidado también sigue en casa.
          </h2>
        </div>

        {/* Tarjetas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CONSEJOS.map((c) => (
            <article
              key={c.etiqueta}
              className="rounded-card border border-border p-6 md:p-7 flex flex-col gap-3 md:gap-4"
            >
              <span className="text-12 md:text-13 font-bold text-brand-primary">
                {c.etiqueta}
              </span>
              <h3 className="text-h4 md:text-22 font-semibold text-text-main leading-[1.45]">
                {c.titulo}
              </h3>
              <p className="text-14 md:text-15 text-text-secondary md:hidden">
                {c.descripcion}
              </p>
              <p className="hidden md:block text-14 md:text-15 text-text-secondary">
                {c.descripcionDesktop}
              </p>
            </article>
          ))}
        </div>

        {/* Nota legal */}
        <p className="text-12 text-text-secondary md:hidden">
          Orientación general. No sustituye una valoración veterinaria.
        </p>
        <p className="hidden md:block text-12 text-text-secondary">
          Orientaciones generales; no sustituyen una valoración veterinaria.
        </p>
      </div>
    </section>
  )
}
