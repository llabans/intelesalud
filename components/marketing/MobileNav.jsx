'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Menu, X, Phone, CalendarDays } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const NAV_ITEMS = [
  ['/', 'Inicio'],
  ['/como-funciona', 'Cómo funciona'],
  ['/especialidades', 'Especialidades'],
  ['/profesionales', 'Profesionales'],
  ['/faq', 'FAQ'],
  ['/#salud-al-dia', 'Salud al Día'],
];

export default function MobileNav({ user }) {
  const [open, setOpen] = useState(false);
  const drawerRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
        aria-label="Abrir menú"
      >
        <Menu size={24} />
      </button>

      <AnimatePresence>
        {open && (
        <div className="fixed inset-0 z-[100]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <motion.nav
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            ref={drawerRef}
            className="absolute right-0 top-0 flex h-full w-[300px] max-w-[85vw] flex-col bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <span className="text-sm font-semibold text-slate-900">Menú</span>
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
                aria-label="Cerrar menú"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-4">
              {NAV_ITEMS.map(([href, label]) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-4 py-3 text-[15px] font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-cyan-800"
                >
                  {label}
                </Link>
              ))}
            </div>

            <div className="border-t border-slate-100 px-4 py-5 space-y-3">
              <a
                href="https://wa.me/51970549203?text=Hola,%20quiero%20información%20sobre%20InteleSalud"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 transition-colors"
              >
                <Phone size={16} />
                WhatsApp: +51 970 549 203
              </a>
              <Link
                href={user ? '/portal' : '/login'}
                onClick={() => setOpen(false)}
                className="block w-full rounded-lg border border-cyan-800 px-4 py-2.5 text-center text-sm font-semibold text-cyan-800 transition hover:bg-cyan-50"
              >
                Portal del Paciente
              </Link>
              <Link
                href={user ? '/portal/agendar' : '/login?redirect=%2Fportal%2Fagendar'}
                onClick={() => setOpen(false)}
                className="btn-primary flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-center text-sm font-semibold"
              >
                <CalendarDays className="h-4 w-4" />
                Agendar consulta
              </Link>
            </div>
          </motion.nav>
        </div>
        )}
      </AnimatePresence>
    </div>
  );
}
