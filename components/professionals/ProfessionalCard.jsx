import Link from 'next/link';
import { Star } from 'lucide-react';

export default function ProfessionalCard({ professional, showBooking = true }) {
  const primaryService = professional.services[0];
  const bookingHref = primaryService
    ? `/portal/agendar?serviceId=${primaryService.id}&professional=${professional.slug}`
    : '/portal/agendar';

  return (
    <article className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-[var(--brand-500)]/10 hover:border-[var(--brand-500)]/30">
      <div className="aspect-[5/4] overflow-hidden bg-slate-100">
        {professional.photoUrl ? (
          <img
            src={professional.photoUrl}
            alt={professional.name}
            className="h-full w-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : null}
      </div>
      <div className="space-y-4 p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-lg font-bold text-slate-950">{professional.name}</p>
              <span className="inline-flex items-center rounded-full bg-[var(--brand-500)]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--brand-700)]">
                Verificado
              </span>
            </div>
            <p className="text-sm font-medium text-[var(--brand-700)]">{professional.title}</p>
          </div>
          <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            {professional.experienceYears || 0} anios
          </div>
        </div>

        <p className="text-sm leading-7 text-slate-600">{professional.headline || professional.bio}</p>

        <div className="flex flex-wrap gap-2 text-xs text-slate-500">
          {professional.specialties.map((specialty) => (
            <span key={specialty.slug} className="rounded-full bg-[var(--brand-500)]/8 px-3 py-1 text-[var(--brand-700)]">
              {specialty.name}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 rounded-3xl bg-slate-50 p-4 text-sm text-slate-600">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Universidad</p>
            <p className="mt-1 font-medium text-slate-950">{professional.university || 'No disponible'}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Valoracion</p>
            <p className="mt-1 flex items-center gap-1 font-medium text-slate-950">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              {professional.ratingAverage.toFixed(1)} ({professional.ratingCount})
            </p>
          </div>
        </div>

        <div className="space-y-2 text-sm text-slate-600">
          <p className="font-medium text-slate-950">Disponibilidad mock</p>
          {professional.availability.length ? (
            professional.availability.map((slot) => (
              <p key={slot.id}>{slot.formatted}</p>
            ))
          ) : (
            <p>Sin horarios visibles por ahora.</p>
          )}
        </div>

        {showBooking ? (
          <Link
            href={bookingHref}
            className="btn-primary inline-flex w-full items-center justify-center rounded-full px-4 py-3 text-sm font-bold"
          >
            Reservar cita
          </Link>
        ) : null}
      </div>
    </article>
  );
}
