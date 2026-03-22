import PortalHeader from '@/components/portal/PortalHeader';
import LogoutButton from '@/components/portal/LogoutButton';
import { requireServerAuth } from '@/lib/auth/serverSession';

export default async function PortalSettingsPage() {
  await requireServerAuth({ allowedRoles: ['PATIENT'], pathname: '/portal/configuracion' });

  return (
    <>
      <PortalHeader title="Configuracion" subtitle="Sesion, seguridad y preferencias basicas del portal." />
      <div className="space-y-5 px-4 py-6 md:px-6">
        <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-lg font-semibold text-slate-950">Seguridad</p>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Tu sesion usa cookies seguras en servidor y proteccion real por middleware. Desde aqui puedes cerrar sesion cuando lo necesites.
          </p>
          <div className="mt-5">
            <LogoutButton />
          </div>
        </div>
      </div>
    </>
  );
}
