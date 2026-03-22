import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import ProfessionalCard from '@/components/professionals/ProfessionalCard';
import AnimatedSection from '@/components/ui/AnimatedSection';
import { StaggerContainer, StaggerItem } from '@/components/ui/AnimatedStagger';
import AuroraBackground from '@/components/ui/AuroraBackground';
import DotPattern from '@/components/ui/DotPattern';
import { BENEFIT_ITEMS, FAQ_ITEMS, HOW_IT_WORKS_STEPS, SPECIALTY_CATALOG } from '@/lib/platform/catalog';
import { listProfessionals } from '@/lib/professionals/queries';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const professionals = (await listProfessionals()).slice(0, 3);

  return (
    <div className="space-y-24 pb-24">
      {/* ── Hero ────────────────────────────────────── */}
      <div className="relative">
        <AuroraBackground />
        <DotPattern className="z-[1]" />
        <AnimatedSection className="relative z-[2]">
          <section className="mx-auto grid max-w-7xl gap-12 px-4 pt-14 md:px-6 lg:grid-cols-[1.1fr,0.9fr] lg:items-center">
          <div className="space-y-7">
            <div className="inline-flex rounded-full border border-[var(--brand-500)]/30 bg-[var(--brand-500)]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-[var(--brand-700)]">
              Telesalud premium
            </div>
            <div className="space-y-5">
              <h1 className="max-w-3xl text-5xl font-extrabold leading-tight tracking-tight text-slate-950 md:text-6xl">
                Telemedicina clara, humana y multiespecialidad para pacientes que quieren continuidad real.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600">
                InteleSalud conecta pacientes con profesionales de distintas especialidades en una experiencia ordenada: reserva, pago, confirmación, portal y sala virtual.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/portal/agendar" className="btn-primary inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 text-sm font-bold">
                Agendar consulta <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/profesionales" className="btn-secondary inline-flex items-center justify-center rounded-full px-7 py-4 text-sm font-bold">
                Explorar profesionales
              </Link>
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-slate-600">
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm"><CheckCircle2 className="h-4 w-4 text-[var(--brand-500)]" /> Google Sign-In y sesión segura</span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm"><CheckCircle2 className="h-4 w-4 text-[var(--brand-500)]" /> Portal del paciente y chatbot</span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm"><CheckCircle2 className="h-4 w-4 text-[var(--brand-500)]" /> Pago por Plin y confirmación</span>
            </div>
          </div>
          <div className="grid gap-4">
            <div className="rounded-[36px] border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-950/5">
              <p className="text-sm font-bold text-slate-950">Especialidades visibles</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {SPECIALTY_CATALOG.slice(0, 6).map((specialty) => (
                  <div key={specialty.id} className="rounded-[24px] border border-slate-100 bg-slate-50 px-4 py-4">
                    <p className="font-medium text-slate-950">{specialty.name}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{specialty.summary}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[36px] border border-[var(--brand-500)]/20 bg-gradient-to-br from-[var(--brand-700)] to-[var(--brand-500)] p-6">
              <p className="text-sm font-bold text-white/90">Flujo estructurado</p>
              <div className="mt-4 grid gap-3">
                {HOW_IT_WORKS_STEPS.map((step, index) => (
                  <div key={step.id} className="flex gap-4 rounded-[24px] bg-white/15 px-4 py-4 backdrop-blur-sm">
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/25 text-sm font-bold text-white">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-white">{step.title}</p>
                      <p className="mt-1 text-sm leading-6 text-white/70">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          </section>
        </AnimatedSection>
      </div>

      {/* ── Beneficios ──────────────────────────────── */}
      <AnimatedSection>
        <section className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="section-label">Propuesta de valor</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Una base sólida para evolucionar a producción</h2>
            </div>
            <Link href="/como-funciona" className="hidden items-center gap-2 text-sm font-semibold text-[var(--brand-700)] md:inline-flex">
              Ver recorrido completo <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <StaggerContainer className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {BENEFIT_ITEMS.map((item) => (
              <StaggerItem key={item.id}>
                <div className="h-full rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md hover:border-[var(--brand-500)]/20">
                  <p className="text-lg font-bold text-slate-950">{item.title}</p>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>
      </AnimatedSection>

      {/* ── Profesionales ───────────────────────────── */}
      <AnimatedSection>
        <section className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="section-label">Profesionales destacados</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Directorio con filtros reales y disponibilidad visible</h2>
            </div>
            <Link href="/profesionales" className="hidden text-sm font-semibold text-[var(--brand-700)] md:inline-flex">
              Ver todos
            </Link>
          </div>
          <StaggerContainer className="mt-8 grid gap-6 xl:grid-cols-3">
            {professionals.map((professional) => (
              <StaggerItem key={professional.id}>
                <ProfessionalCard professional={professional} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>
      </AnimatedSection>

      {/* ── FAQ ─────────────────────────────────────── */}
      <AnimatedSection>
        <section className="mx-auto max-w-7xl rounded-[40px] border border-slate-200 bg-white px-6 py-10 shadow-sm md:px-10">
          <div className="grid gap-8 lg:grid-cols-[0.8fr,1.2fr]">
            <div>
              <p className="section-label">FAQ breve</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Respuestas claras antes de reservar</h2>
            </div>
            <StaggerContainer className="space-y-4">
              {FAQ_ITEMS.map((item) => (
                <StaggerItem key={item.question}>
                  <div className="rounded-[24px] border border-slate-200 bg-slate-50 px-5 py-4 transition hover:border-[var(--brand-500)]/20">
                    <p className="font-medium text-slate-950">{item.question}</p>
                    <p className="mt-2 text-sm leading-7 text-slate-600">{item.answer}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>
      </AnimatedSection>
    </div>
  );
}
