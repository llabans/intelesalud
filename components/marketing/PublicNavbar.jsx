'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import AppLogo from '@/components/ui/AppLogo';
import MobileNav from '@/components/marketing/MobileNav';

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
                pathname === href ? 'text-[var(--brand-700)] font-semibold' : 'transition-colors hover:text-[var(--brand-700)]'
              }
            >
              {label}
            </Link>
          ))}
          <Link href="/login" className="transition-colors hover:text-[var(--brand-700)]">
            Acceso
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          {!loading && !user ? (
            <Link
              href="/login"
              className="hidden rounded-full border border-[var(--brand-500)] px-4 py-2 text-sm font-semibold text-[var(--brand-700)] transition hover:bg-[var(--brand-500)]/10 md:inline-flex"
            >
              Iniciar sesion
            </Link>
          ) : null}
          <Link
            href={user ? '/portal/agendar' : '/login?redirect=%2Fportal%2Fagendar'}
            className="btn-primary inline-flex min-h-[44px] items-center rounded-full px-5 py-2.5 text-sm font-semibold"
          >
            Agendar consulta
          </Link>
          <MobileNav user={user} />
        </div>
      </div>
    </header>
  );
}
