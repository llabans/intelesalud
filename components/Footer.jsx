import Link from 'next/link';
import { HeartPulse } from 'lucide-react';
import { DEFAULT_BOOKING_PATH } from '@/lib/platform/catalog';

export default function Footer() {
  return (
    <footer className="w-full bg-indigo-950 px-6 py-16 text-slate-300">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 md:grid-cols-4">
        <div className="col-span-1 md:col-span-2">
          <Link href="/" className="mb-6 flex items-center gap-2 text-white">
            <HeartPulse className="text-emerald-500" size={28} strokeWidth={2.5} />
            <span className="text-2xl font-bold tracking-tight">InteleSalud</span>
          </Link>
          <p className="max-w-sm leading-relaxed text-slate-400">
            Plataforma de telesalud multiespecialidad con una experiencia clara,
            sobria y segura para pacientes y profesionales.
          </p>
        </div>

        <div>
          <h4 className="mb-6 text-sm font-semibold uppercase tracking-wider text-white">
            Pacientes
          </h4>
          <ul className="space-y-3 text-sm">
            <li>
              <Link
                href={DEFAULT_BOOKING_PATH}
                className="transition-colors hover:text-emerald-400"
              >
                Agendar consulta
              </Link>
            </li>
            <li>
              <Link href="/login" className="transition-colors hover:text-emerald-400">
                Iniciar sesion
              </Link>
            </li>
            <li>
              <Link href="/profesionales" className="transition-colors hover:text-emerald-400">
                Ver profesionales
              </Link>
            </li>
            <li>
              <Link href="/faq" className="transition-colors hover:text-emerald-400">
                Preguntas frecuentes
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-6 text-sm font-semibold uppercase tracking-wider text-white">
            Legal
          </h4>
          <ul className="space-y-3 text-sm">
            <li>
              <Link href="/privacy" className="transition-colors hover:text-emerald-400">
                Politica de privacidad
              </Link>
            </li>
            <li>
              <Link href="/terms" className="transition-colors hover:text-emerald-400">
                Terminos de servicio
              </Link>
            </li>
            <li>
              <Link href="/consent" className="transition-colors hover:text-emerald-400">
                Consentimiento informado
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-16 flex max-w-7xl flex-col items-center justify-between border-t border-indigo-900/50 pt-8 text-sm text-slate-500 md:flex-row">
        <p>&copy; {new Date().getFullYear()} InteleSalud. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
