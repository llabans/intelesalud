'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import AppLogo from '@/components/ui/AppLogo';

const NAV_ITEMS = [
  ['/', 'Inicio'],
  ['/especialidades', 'Especialidades'],
  ['/como-funciona', 'Como funciona'],
  ['/profesionales', 'Profesionales'],
  ['/faq', 'FAQ'],
];

export default function PublicNavbar() {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-6">
        <AppLogo />
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 lg:flex">
          {NAV_ITEMS.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className={
                pathname === href ? 'text-slate-950' : 'transition-colors hover:text-slate-950'
              }
            >
              {label}
            </Link>
          ))}
          <Link href="/login" className="transition-colors hover:text-slate-950">
            Acceso
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          {!loading && !user ? (
            <Link
              href="/login"
              className="hidden rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 md:inline-flex"
            >
              Iniciar sesion
            </Link>
          ) : null}
          <Link
            href={user ? '/portal/agendar' : '/login?redirect=%2Fportal%2Fagendar'}
            className="inline-flex rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-950/10 transition hover:bg-slate-800"
          >
            Agendar consulta
          </Link>
        </div>
      </div>
    </header>
  );
}
