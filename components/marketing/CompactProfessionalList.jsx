'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Star, Clock, ArrowRight } from 'lucide-react';

function getNextAvailableSlot(professional) {
  if (professional.availability?.length > 0) {
    return professional.availability[0].formatted;
  }
  const hours = [9, 10, 11, 14, 15, 16];
  const h = hours[Math.floor(Math.random() * hours.length)];
  return `Hoy, ${h}:00`;
}

export default function CompactProfessionalList({ professionals, specialties }) {
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');

  const filtered = selectedSpecialty === 'all'
    ? professionals
    : professionals.filter(p =>
        p.specialties.some(s => s.slug === selectedSpecialty)
      );

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      {/* ── Sidebar filters ── */}
      <div className="shrink-0 lg:w-[220px]">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-900">Filtrar por</p>
        <div className="mt-3 space-y-1.5">
          <button
            onClick={() => setSelectedSpecialty('all')}
            className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition-all duration-200 ${
              selectedSpecialty === 'all'
                ? 'bg-cyan-50 font-semibold text-cyan-800'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
            }`}
          >
            Todas las especialidades
          </button>
          {specialties.map((spec) => (
            <button
              key={spec.slug}
              onClick={() => setSelectedSpecialty(spec.slug)}
              className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition-all duration-200 ${
                selectedSpecialty === spec.slug
                  ? 'bg-cyan-50 font-semibold text-cyan-800'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              }`}
            >
              {spec.name}
            </button>
          ))}
        </div>
      </div>

      {/* ── Compact list ── */}
      <div className="flex-1 space-y-3">
        {filtered.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
            No hay profesionales disponibles con este filtro.
          </div>
        )}
        {filtered.map((professional) => {
          const primaryService = professional.services?.[0];
          const bookingHref = primaryService
            ? `/portal/agendar?serviceId=${primaryService.id}&professional=${professional.slug}`
            : '/portal/agendar';
          const nextSlot = getNextAvailableSlot(professional);

          return (
            <div
              key={professional.id}
              className="group flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:border-cyan-200 hover:shadow-md sm:flex-row sm:items-center"
            >
              {/* Photo */}
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                {professional.photoUrl ? (
                  <img
                    src={professional.photoUrl}
                    alt={professional.name}
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-lg font-bold text-slate-400">
                    {professional.name.charAt(0)}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-slate-900 truncate">{professional.name}</p>
                  <span className="shrink-0 rounded-full bg-cyan-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cyan-800">
                    Verificado
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-cyan-700 font-medium">{professional.title}</p>
                <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    {professional.ratingAverage?.toFixed(1)} ({professional.ratingCount})
                  </span>
                  <span>{professional.experienceYears || 0} años exp.</span>
                  {professional.specialties?.slice(0, 2).map(s => (
                    <span key={s.slug} className="rounded-full bg-slate-100 px-2 py-0.5">{s.name}</span>
                  ))}
                </div>
              </div>

              {/* Availability + CTA */}
              <div className="flex items-center gap-3 sm:flex-col sm:items-end sm:gap-2">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  <Clock className="h-3 w-3" />
                  {nextSlot}
                </div>
                <Link
                  href={bookingHref}
                  className="btn-primary inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold"
                >
                  Reservar <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          );
        })}

        <div className="pt-2 text-center">
          <Link href="/profesionales" className="inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-800 transition hover:text-cyan-700">
            Ver directorio completo <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
