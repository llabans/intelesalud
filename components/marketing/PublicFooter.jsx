import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';

export default function PublicFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-[1.4fr,1fr,1fr] md:px-6">
        <div className="space-y-4">
          <AppLogo href="/" />
          <p className="max-w-xl text-sm leading-7 text-slate-600">
            Plataforma de telesalud con enfoque premium para reservas, continuidad administrativa
            y portal del paciente en distintas especialidades.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-950">Plataforma</p>
          <div className="mt-4 flex flex-col gap-3 text-sm text-slate-600">
            <Link href="/especialidades">Especialidades</Link>
            <Link href="/profesionales">Profesionales</Link>
            <Link href="/como-funciona">Como funciona</Link>
            <Link href="/faq">FAQ</Link>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-950">Legal</p>
          <div className="mt-4 flex flex-col gap-3 text-sm text-slate-600">
            <Link href="/terms">Terminos</Link>
            <Link href="/privacy">Privacidad</Link>
            <Link href="/consent">Consentimiento</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
