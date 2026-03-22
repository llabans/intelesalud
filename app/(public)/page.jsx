import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import ProfessionalCard from '@/components/professionals/ProfessionalCard';
import { BENEFIT_ITEMS, FAQ_ITEMS, HOW_IT_WORKS_STEPS, SPECIALTY_CATALOG } from '@/lib/platform/catalog';
import { listProfessionals } from '@/lib/professionals/queries';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const professionals = (await listProfessionals()).slice(0, 3);

  return (
    <div className="space-y-24 pb-24">
      <section className="mx-auto grid max-w-7xl gap-12 px-4 pt-14 md:px-6 lg:grid-cols-[1.1fr,0.9fr] lg:items-center">
        <div className="space-y-7">
          <div className="inline-flex rounded-full border border-sky-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-sky-700 shadow-sm">
            Telesalud premium
          </div>
          <div className="space-y-5">
            <h1 className="max-w-3xl text-5xl font-semibold leading-tight tracking-tight text-slate-950 md:text-6xl">
              Telemedicina clara, humana y multiespecialidad para pacientes que quieren continuidad real.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              InteleSalud conecta pacientes con profesionales de distintas especialidades en una experiencia ordenada: reserva, pago, confirmacion, portal, documentos mock y sala virtual lista para evolucionar.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link href="/portal/agendar" className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-slate-950/10 transition hover:bg-slate-800">
              Agendar consulta
            </Link>
            <Link href="/profesionales" className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50">
              Explorar profesionales
            </Link>
          </div>
          <div className="flex flex-wrap gap-3 text-sm text-slate-600">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm"><CheckCircle2 className="h-4 w-4 text-sky-700" /> Google Sign-In y sesion segura</span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm"><CheckCircle2 className="h-4 w-4 text-sky-700" /> Portal del paciente y chatbot</span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm"><CheckCircle2 className="h-4 w-4 text-sky-700" /> Pago por Plin y confirmacion</span>
          </div>
        </div>
        <div className="grid gap-4">
          <div className="rounded-[36px] border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-950/5">
            <p className="text-sm font-semibold text-slate-950">Especialidades visibles</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {SPECIALTY_CATALOG.slice(0, 6).map((specialty) => (
                <div key={specialty.id} className="rounded-[24px] border border-slate-100 bg-slate-50 px-4 py-4">
                  <p className="font-medium text-slate-950">{specialty.name}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{specialty.summary}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[36px] border border-slate-200 bg-[linear-gradient(145deg,rgba(2,132,199,0.08),rgba(12,74,110,0.02))] p-6">
            <p className="text-sm font-semibold text-slate-950">Flujo estructurado</p>
            <div className="mt-4 grid gap-3">
              {HOW_IT_WORKS_STEPS.map((step, index) => (
                <div key={step.id} className="flex gap-4 rounded-[24px] bg-white/80 px-4 py-4 shadow-sm">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold text-white">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-slate-950">{step.title}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">Propuesta de valor</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Una base solida para evolucionar a produccion</h2>
          </div>
          <Link href="/como-funciona" className="hidden items-center gap-2 text-sm font-semibold text-slate-950 md:inline-flex">
            Ver recorrido completo <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {BENEFIT_ITEMS.map((item) => (
            <div key={item.id} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-lg font-semibold text-slate-950">{item.title}</p>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">Profesionales destacados</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Directorio con filtros reales y disponibilidad visible</h2>
          </div>
          <Link href="/profesionales" className="hidden text-sm font-semibold text-slate-950 md:inline-flex">
            Ver todos
          </Link>
        </div>
        <div className="mt-8 grid gap-6 xl:grid-cols-3">
          {professionals.map((professional) => (
            <ProfessionalCard key={professional.id} professional={professional} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl rounded-[40px] border border-slate-200 bg-white px-6 py-10 shadow-sm md:px-10">
        <div className="grid gap-8 lg:grid-cols-[0.8fr,1.2fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">FAQ breve</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Respuestas claras antes de reservar</h2>
          </div>
          <div className="space-y-4">
            {FAQ_ITEMS.map((item) => (
              <div key={item.question} className="rounded-[24px] border border-slate-200 bg-slate-50 px-5 py-4">
                <p className="font-medium text-slate-950">{item.question}</p>
                <p className="mt-2 text-sm leading-7 text-slate-600">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
