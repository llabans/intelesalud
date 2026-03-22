import { FAQ_ITEMS } from '@/lib/platform/catalog';

export default function FAQPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-10 px-4 py-14 md:px-6">
      <div className="max-w-3xl space-y-4">
        <p className="section-label">Preguntas frecuentes</p>
        <h1 className="text-4xl font-semibold tracking-tight text-slate-950">Transparencia antes de la primera teleconsulta</h1>
        <p className="text-lg leading-8 text-slate-600">
          Respuestas sobrias sobre acceso, reservas, pagos, portal y alcance administrativo del asistente.
        </p>
      </div>
      <div className="space-y-4">
        {FAQ_ITEMS.map((item) => (
          <article key={item.question} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">{item.question}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">{item.answer}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
