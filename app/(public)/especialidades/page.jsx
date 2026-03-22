import Link from 'next/link';
import { SPECIALTY_CATALOG } from '@/lib/platform/catalog';

export default function SpecialtiesPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-14 md:px-6">
      <div className="max-w-3xl space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">Especialidades</p>
        <h1 className="text-4xl font-semibold tracking-tight text-slate-950">Un portafolio medico preparado para crecer</h1>
        <p className="text-lg leading-8 text-slate-600">
          InteleSalud organiza especialidades, profesionales y servicios en una experiencia de telesalud clara, minimalista y profesional.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {SPECIALTY_CATALOG.map((specialty) => (
          <article key={specialty.id} className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-lg font-semibold text-slate-950">{specialty.name}</p>
            <p className="mt-3 text-sm leading-7 text-slate-600">{specialty.description}</p>
            <Link href={`/profesionales?specialty=${specialty.slug}`} className="mt-6 inline-flex rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50">
              Ver profesionales
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
