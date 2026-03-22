import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import { Phone, Mail, ShieldCheck, Lock } from 'lucide-react';

export default function PublicFooter() {
  return (
    <footer className="bg-[var(--ink-950)]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-[1.4fr,1fr,1fr,1fr] md:px-6">
        <div className="space-y-4">
          <AppLogo href="/" />
          <p className="max-w-xs text-sm leading-7 text-white/50">
            Plataforma de telesalud premium. Consultas por videollamada con
            especialistas verificados en Peru.
          </p>
        </div>
        <div>
          <p className="text-sm font-bold text-white">Plataforma</p>
          <div className="mt-4 flex flex-col gap-3 text-sm text-white/50">
            <Link href="/especialidades" className="transition hover:text-[var(--accent-500)]">Especialidades</Link>
            <Link href="/profesionales" className="transition hover:text-[var(--accent-500)]">Profesionales</Link>
            <Link href="/como-funciona" className="transition hover:text-[var(--accent-500)]">Cómo funciona</Link>
            <Link href="/faq" className="transition hover:text-[var(--accent-500)]">FAQ</Link>
          </div>
        </div>
        <div>
          <p className="text-sm font-bold text-white">Legal</p>
          <div className="mt-4 flex flex-col gap-3 text-sm text-white/50">
            <Link href="/terms" className="transition hover:text-[var(--accent-500)]">Términos</Link>
            <Link href="/privacy" className="transition hover:text-[var(--accent-500)]">Privacidad</Link>
            <Link href="/consent" className="transition hover:text-[var(--accent-500)]">Consentimiento</Link>
          </div>
        </div>
        <div>
          <p className="text-sm font-bold text-white">Contacto</p>
          <div className="mt-4 flex flex-col gap-3 text-sm text-white/50">
            <a
              href="https://wa.me/51970549203?text=Hola,%20quiero%20información%20sobre%20InteleSalud"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 transition hover:text-[var(--accent-500)]"
            >
              <Phone className="h-4 w-4" /> +51 970 549 203
            </a>
            <a
              href="mailto:contacto@intelesalud.medicalcore.app"
              className="inline-flex items-center gap-2 transition hover:text-[var(--accent-500)]"
            >
              <Mail className="h-4 w-4" /> Correo electrónico
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row md:px-6">
          <p className="text-xs text-white/30">© 2026 InteleSalud. Todos los derechos reservados.</p>
          <div className="flex items-center gap-5 text-xs text-white/30">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-[var(--success)]" /> Datos encriptados
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Lock className="h-4 w-4 text-[var(--brand-500)]" /> HIPAA-ready
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
