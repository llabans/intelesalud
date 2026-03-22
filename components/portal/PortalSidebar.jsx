import Link from 'next/link';
import { CalendarDays, ClipboardList, FileText, LayoutGrid, MessageSquare, Settings, Stethoscope, UserRound, Video, Wallet } from 'lucide-react';
import AppLogo from '@/components/ui/AppLogo';

const ITEMS = [
  ['/portal', 'Resumen', LayoutGrid],
  ['/portal/citas', 'Proximas citas', CalendarDays],
  ['/portal/agendar', 'Agendar consulta', Wallet],
  ['/portal/historial', 'Historial', ClipboardList],
  ['/portal/profesionales', 'Profesionales', Stethoscope],
  ['/portal/documentos', 'Documentos', FileText],
  ['/portal/indicaciones', 'Indicaciones', ClipboardList],
  ['/portal/mensajes', 'Mensajes', MessageSquare],
  ['/portal/perfil', 'Perfil', UserRound],
  ['/portal/configuracion', 'Configuracion', Settings],
  ['/portal/sala', 'Sala virtual', Video],
];

export default function PortalSidebar({ pathname }) {
  return (
    <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-white/90 xl:flex xl:flex-col">
      <div className="border-b border-slate-200 px-6 py-6">
        <AppLogo href="/portal" />
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-4 py-6">
        {ITEMS.map(([href, label, Icon]) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? 'bg-sky-50 text-sky-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
