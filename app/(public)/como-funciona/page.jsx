import { HOW_IT_WORKS_STEPS } from '@/lib/platform/catalog';

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-14 md:px-6">
      <div className="max-w-3xl space-y-4">
        <p className="section-label">Como funciona</p>
        <h1 className="text-4xl font-semibold tracking-tight text-slate-950">Un recorrido simple para reservar, pagar y continuar tu atencion</h1>
        <p className="text-lg leading-8 text-slate-600">
          La experiencia mezcla catalogo de especialistas, agendamiento, validacion de pago, portal del paciente y preparacion para sala virtual.
        </p>
      </div>

      <div className="grid gap-5">
        {HOW_IT_WORKS_STEPS.map((step, index) => (
          <section key={step.id} className="grid gap-4 rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-[88px,1fr] md:items-start">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-[24px] bg-[var(--brand-700)] text-lg font-semibold text-white">
              {index + 1}
            </div>
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950">{step.title}</h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">{step.description}</p>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
