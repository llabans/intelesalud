import Link from 'next/link';
import AnimatedSection from '@/components/ui/AnimatedSection';
import { StaggerContainer, StaggerItem } from '@/components/ui/AnimatedStagger';
import { SPECIALTY_CATALOG } from '@/lib/platform/catalog';

export default function SpecialtiesPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-14 md:px-6">
      <AnimatedSection>
        <div className="max-w-3xl space-y-4">
          <p className="section-label">Especialidades</p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-950">Un portafolio médico preparado para crecer</h1>
          <p className="text-lg leading-8 text-slate-600">
            InteleSalud organiza especialidades, profesionales y servicios en una experiencia de telesalud clara, minimalista y profesional.
          </p>
        </div>
      </AnimatedSection>

      <StaggerContainer className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {SPECIALTY_CATALOG.map((specialty) => (
          <StaggerItem key={specialty.id}>
            <article className="h-full rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md hover:border-[var(--brand-500)]/20">
              <p className="text-lg font-bold text-slate-950">{specialty.name}</p>
              <p className="mt-3 text-sm leading-7 text-slate-600">{specialty.description}</p>
              <Link
                href={`/profesionales?specialty=${specialty.slug}`}
                className="mt-6 inline-flex min-h-[44px] items-center rounded-full border border-[var(--brand-500)] px-5 py-3 text-sm font-semibold text-[var(--brand-700)] transition hover:bg-[var(--brand-500)]/10"
              >
                Ver profesionales
              </Link>
            </article>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </div>
  );
}
