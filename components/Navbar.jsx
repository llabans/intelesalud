'use client';

import Link from 'next/link';
import { HeartPulse } from 'lucide-react';
import { useAuth } from './AuthProvider';
import UserMenu from './UserMenu';
import { DEFAULT_BOOKING_PATH } from '@/lib/platform/catalog';

export default function Navbar() {
  const { user, loading } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="group flex items-center gap-2.5 text-slate-900">
          <div className="rounded-lg bg-emerald-600 p-1.5 transition-colors group-hover:bg-emerald-500">
            <HeartPulse className="text-white" size={22} strokeWidth={2.5} />
          </div>
          <span className="text-xl font-bold tracking-tight">InteleSalud</span>
        </Link>

        <nav className="hidden flex-grow items-center justify-center gap-10 text-[13px] font-semibold uppercase tracking-wider text-slate-500 md:flex">
          <Link href="/especialidades" className="transition-colors hover:text-emerald-600">
            Especialidades
          </Link>
          <Link href="/como-funciona" className="transition-colors hover:text-emerald-600">
            Como funciona
          </Link>
          <Link href="/profesionales" className="transition-colors hover:text-emerald-600">
            Profesionales
          </Link>
          <Link href="/faq" className="transition-colors hover:text-emerald-600">
            FAQ
          </Link>
        </nav>

        <div className="flex items-center gap-8">
          {!loading &&
            (user ? (
              <UserMenu />
            ) : (
              <div className="hidden items-center gap-4 text-[13px] font-bold uppercase tracking-wider lg:flex">
                <Link
                  href="/login"
                  className="text-slate-900 transition-colors hover:text-emerald-600"
                >
                  Iniciar sesion
                </Link>
              </div>
            ))}

          <Link
            href={DEFAULT_BOOKING_PATH}
            className="rounded-full bg-slate-900 px-7 py-3 text-xs font-bold uppercase tracking-widest text-white shadow-lg shadow-slate-900/10 transition-all hover:bg-slate-800 hover:shadow-slate-900/20 active:scale-95"
          >
            Agendar cita
          </Link>
        </div>
      </div>
    </header>
  );
}
