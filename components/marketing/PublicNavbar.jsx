'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import AppLogo from '@/components/ui/AppLogo';
import MobileNav from '@/components/marketing/MobileNav';
import { Newspaper } from 'lucide-react';

const NAV_ITEMS = [
  ['/', 'Inicio'],
  ['/como-funciona', 'Cómo funciona'],
  ['/especialidades', 'Especialidades'],
  ['/profesionales', 'Profesionales'],
  ['/faq', 'FAQ'],
];

export default function PublicNavbar() {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-3.5 md:px-6">
        <AppLogo />

        <nav className="hidden items-center gap-7 text-sm font-medium text-slate-600 lg:flex">
          {NAV_ITEMS.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className={
                pathname === href
                  ? 'text-cyan-800 font-semibold'
                  : 'transition-colors duration-200 hover:text-cyan-800'
              }
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {/* Salud al Día — botón destacado verde */}
          <Link
            href="/#salud-al-dia"
            className="hidden min-h-[44px] items-center gap-1.5 rounded-lg bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition-all duration-200 hover:bg-emerald-100 md:inline-flex"
          >
            <Newspaper className="h-4 w-4" />
            Salud al Día
          </Link>

          {/* Portal del Paciente */}
          <Link
            href={user ? '/portal' : '/login'}
            className="hidden min-h-[44px] items-center rounded-lg border border-cyan-800 px-4 py-2 text-sm font-semibold text-cyan-800 transition-all duration-200 hover:bg-cyan-50 md:inline-flex"
          >
            Portal del Paciente
          </Link>

          <MobileNav user={user} />
        </div>
      </div>
    </header>
  );
}
