'use client';

import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';

export default function PortalHeader({ title, subtitle }) {
  const { user } = useAuth();

  return (
    <div className="flex flex-col gap-4 border-b border-slate-200 bg-white/85 px-4 py-5 backdrop-blur md:flex-row md:items-center md:justify-between md:px-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
          Portal del paciente
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-slate-600">{subtitle}</p> : null}
      </div>
      <div className="flex items-center gap-3">
        <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">
          {user?.name || user?.email || 'Paciente'}
        </div>
        <Link
          href="/portal/agendar"
          className="inline-flex rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Nueva teleconsulta
        </Link>
      </div>
    </div>
  );
}
