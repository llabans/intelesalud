import { requireServerAuth } from '@/lib/auth/serverSession';

export const dynamic = 'force-dynamic';

export default async function SpecialistDashboardPage() {
  await requireServerAuth({
    allowedRoles: ['SPECIALIST'],
    pathname: '/dashboard/specialist',
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 md:px-6">
      <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm md:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">
          Espacio preparado
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
          Panel de especialista en preparacion
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
          La primera entrega prioriza portal de paciente, booking, pagos y continuidad
          administrativa. Este espacio queda reservado para evolucionar agenda clinica,
          historial y seguimiento profesional sin romper la arquitectura existente.
        </p>
      </div>
    </div>
  );
}
