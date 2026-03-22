import Link from 'next/link';
import { ArrowRight, CalendarDays, ShieldCheck, Video, CreditCard } from 'lucide-react';
import ProfessionalCard from '@/components/professionals/ProfessionalCard';
import AnimatedSection from '@/components/ui/AnimatedSection';
import { StaggerContainer, StaggerItem } from '@/components/ui/AnimatedStagger';
import { BENEFIT_ITEMS, FAQ_ITEMS, HOW_IT_WORKS_STEPS, SPECIALTY_CATALOG } from '@/lib/platform/catalog';
import { listProfessionals } from '@/lib/professionals/queries';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const professionals = (await listProfessionals()).slice(0, 3);

  return (
    <div className="space-y-24 pb-24">
      {/* ── Hero ────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-[radial-gradient(ellipse_at_top,rgba(14,116,144,0.06),transparent_60%)]">
        <AnimatedSection className="relative z-[2]">
          <section className="mx-auto grid max-w-7xl gap-12 px-4 pt-16 pb-8 md:px-6 lg:grid-cols-[1.15fr,0.85fr] lg:items-center lg:pt-20">
            <div className="space-y-8">
              {/* Pill badge */}
              <div className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-800">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Especialistas Certificados Disponibles Hoy
              </div>

              {/* Headline */}
              <div className="space-y-5">
                <h1 className="max-w-2xl text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-[3.5rem]">
                  Tu salud en manos expertas, sin salir de casa.
                </h1>
                <p className="max-w-xl text-lg leading-8 text-slate-500">
                  Conecta por videollamada con médicos especialistas y resuelve tu diagnóstico con evidencia clínica en minutos.
                </p>
              </div>

              {/* CTAs */}
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/portal/agendar"
                  className="btn-primary inline-flex items-center justify-center gap-2 rounded-lg px-7 py-4 text-base font-semibold shadow-md transition-all duration-200"
                >
                  <CalendarDays className="h-5 w-5" />
                  Agendar consulta
                </Link>
                <Link
                  href="/como-funciona"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-7 py-4 text-base font-semibold text-slate-700 transition-all duration-200 hover:border-cyan-800 hover:text-cyan-800"
                >
                  Cómo funciona <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500">
                <span className="inline-flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-cyan-700" /> Acceso seguro con Google
                </span>
                <span className="inline-flex items-center gap-2">
                  <Video className="h-4 w-4 text-cyan-700" /> Videoconsulta privada
                </span>
                <span className="inline-flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-cyan-700" /> Pago simple por Plin
                </span>
              </div>
            </div>

            {/* Right column — specialties + flow */}
            <div className="grid gap-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-900/5">
                <p className="text-sm font-semibold text-slate-900">Especialidades disponibles</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {SPECIALTY_CATALOG.slice(0, 6).map((specialty) => (
                    <div key={specialty.id} className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3.5">
                      <p className="font-medium text-slate-900 text-sm">{specialty.name}</p>
                      <p className="mt-1.5 text-xs leading-5 text-slate-500">{specialty.summary}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-cyan-200/60 bg-gradient-to-br from-cyan-800 to-cyan-700 p-6">
                <p className="text-sm font-semibold text-white/90">Tu consulta en 4 pasos</p>
                <div className="mt-4 grid gap-2.5">
                  {HOW_IT_WORKS_STEPS.map((step, index) => (
                    <div key={step.id} className="flex gap-3.5 rounded-xl bg-white/10 px-4 py-3 backdrop-blur-sm">
                      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/20 text-xs font-bold text-white">
                        {index + 1}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-white">{step.title}</p>
                        <p className="mt-0.5 text-xs leading-5 text-white/60">{step.description}</p>
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
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Una base sólida para evolucionar a producción</h2>
            </div>
            <Link href="/como-funciona" className="hidden items-center gap-2 text-sm font-semibold text-cyan-800 transition-colors hover:text-cyan-700 md:inline-flex">
              Ver recorrido completo <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <StaggerContainer className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {BENEFIT_ITEMS.map((item) => (
              <StaggerItem key={item.id}>
                <div className="h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md hover:border-cyan-200">
                  <p className="text-lg font-bold text-slate-900">{item.title}</p>
                  <p className="mt-3 text-sm leading-7 text-slate-500">{item.description}</p>
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
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Directorio con filtros reales y disponibilidad visible</h2>
            </div>
            <Link href="/profesionales" className="hidden text-sm font-semibold text-cyan-800 transition-colors hover:text-cyan-700 md:inline-flex">
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
        <section className="mx-auto max-w-7xl rounded-2xl border border-slate-200 bg-white px-6 py-10 shadow-sm md:px-10">
          <div className="grid gap-8 lg:grid-cols-[0.8fr,1.2fr]">
            <div>
              <p className="section-label">FAQ breve</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Respuestas claras antes de reservar</h2>
            </div>
            <StaggerContainer className="space-y-4">
              {FAQ_ITEMS.map((item) => (
                <StaggerItem key={item.question}>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 transition hover:border-cyan-200">
                    <p className="font-medium text-slate-900">{item.question}</p>
                    <p className="mt-2 text-sm leading-7 text-slate-500">{item.answer}</p>
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
