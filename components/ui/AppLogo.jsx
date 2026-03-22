import Link from 'next/link';
import { HeartPulse } from 'lucide-react';

export default function AppLogo({ href = '/', compact = false }) {
  return (
    <Link href={href} className="inline-flex items-center gap-3 text-slate-950">
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--brand-700),var(--brand-500))] text-white shadow-lg shadow-sky-900/10">
        <HeartPulse className="h-5 w-5" strokeWidth={2.3} />
      </span>
      {!compact ? (
        <span className="flex flex-col leading-none">
          <span className="text-lg font-semibold tracking-tight">InteleSalud</span>
          <span className="text-[11px] uppercase tracking-[0.24em] text-slate-500">
            Telemedicina
          </span>
        </span>
      ) : null}
    </Link>
  );
}
