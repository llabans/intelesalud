import Link from 'next/link';
import PortalHeader from '@/components/portal/PortalHeader';
import EmptyStateCard from '@/components/portal/EmptyStateCard';
import { requireServerAuth } from '@/lib/auth/serverSession';
import { getPortalSummary } from '@/lib/portal/queries';

export default async function PortalRoomPage() {
  const user = await requireServerAuth({ allowedRoles: ['PATIENT'], pathname: '/portal/sala' });
  const summary = await getPortalSummary(user);
  const appointment = summary.upcomingAppointment;

  return (
    <>
      <PortalHeader title="Sala virtual" subtitle="Base preparada para integrar videollamada real futura." />
      <div className="space-y-6 px-4 py-6 md:px-6">
        {appointment ? (
          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-sky-700">Sesion programada</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">{appointment.service?.name}</h2>
            <p className="mt-2 text-sm text-slate-600">
              Profesional asignado: {appointment.specialist?.name}
            </p>
            <p className="mt-2 text-sm text-slate-600">
              {appointment.slot?.dateLabel} · {appointment.slot?.startLabel}
            </p>
            <div className="mt-6 rounded-[24px] border border-dashed border-slate-300 bg-slate-50 px-5 py-6 text-sm leading-7 text-slate-600">
              Placeholder para proveedor futuro de videollamada, verificacion de audio/video, estado de sesion y control de ingreso.
            </div>
            <div className="mt-5 flex gap-3">
              <Link href={appointment.meetingSession?.joinUrl || '#'} className="inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                Boton de ingreso
              </Link>
            </div>
          </div>
        ) : (
          <EmptyStateCard
            title="No hay una sala activa en este momento"
            description="Cuando tengas una cita confirmada, la veras aqui con estado de sesion, profesional asignado y boton de ingreso."
            ctaHref="/portal/citas"
            ctaLabel="Ver citas"
          />
        )}
      </div>
    </>
  );
}
