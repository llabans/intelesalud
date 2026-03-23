import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import { Phone, Mail, ShieldCheck, Lock } from 'lucide-react';

export default function PublicFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      {/* ── Main row: logo + links + contact — all horizontal ── */}
      <div className="mx-auto flex max-w-7xl flex-wrap items-start justify-between gap-8 px-4 py-10 md:px-6">
        {/* Brand */}
        <div className="max-w-[220px] shrink-0">
          <AppLogo href="/" />
          <p className="mt-2 text-xs leading-5 text-slate-400">
            Telesalud premium con especialistas verificados en Perú.
          </p>
        </div>

        {/* Nav links — horizontal groups */}
        <div className="flex flex-wrap gap-x-12 gap-y-6 text-sm">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-900">Plataforma</p>
            <div className="mt-2 flex flex-col gap-1.5 text-slate-500">
              <Link href="/especialidades" className="transition hover:text-cyan-800">Especialidades</Link>
              <Link href="/profesionales" className="transition hover:text-cyan-800">Profesionales</Link>
              <Link href="/como-funciona" className="transition hover:text-cyan-800">Cómo funciona</Link>
              <Link href="/faq" className="transition hover:text-cyan-800">FAQ</Link>
            </div>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-900">Legal</p>
            <div className="mt-2 flex flex-col gap-1.5 text-slate-500">
              <Link href="/terms" className="transition hover:text-cyan-800">Términos</Link>
              <Link href="/privacy" className="transition hover:text-cyan-800">Privacidad</Link>
              <Link href="/consent" className="transition hover:text-cyan-800">Consentimiento</Link>
            </div>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-900">Contacto</p>
            <div className="mt-2 flex flex-col gap-1.5 text-slate-500">
              <a
                href="https://wa.me/51921977372?text=Hola,%20quiero%20información%20sobre%20InteleSalud"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 transition hover:text-cyan-800"
              >
                <Phone className="h-3.5 w-3.5" /> +51 921 977 372
              </a>
              <a
                href="mailto:intelesalud@medicalcore.app"
                className="inline-flex items-center gap-1.5 transition hover:text-cyan-800"
              >
                <Mail className="h-3.5 w-3.5" /> Correo electrónico
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-slate-200">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-4 sm:flex-row md:px-6">
          <p className="text-xs text-slate-400">© 2026 InteleSalud. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Datos encriptados
            </span>
            <span className="inline-flex items-center gap-1">
              <Lock className="h-3.5 w-3.5 text-cyan-700" /> HIPAA-ready
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
