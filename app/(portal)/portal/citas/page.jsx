import PortalHeader from '@/components/portal/PortalHeader';
import EmptyStateCard from '@/components/portal/EmptyStateCard';
import { requireServerAuth } from '@/lib/auth/serverSession';
import { getPortalSummary } from '@/lib/portal/queries';

export default async function PortalAppointmentsPage() {
  const user = await requireServerAuth({ allowedRoles: ['PATIENT'], pathname: '/portal/citas' });
  const summary = await getPortalSummary(user);
  const upcoming = summary.appointments.filter((appointment) => appointment.portalSection === 'upcoming');

  return (
    <>
      <PortalHeader title="Proximas citas" subtitle="Consulta fecha, profesional, estado y acceso a sala virtual." />
      <div className="space-y-5 px-4 py-6 md:px-6">
        {upcoming.length ? (
          upcoming.map((appointment) => (
            <article key={appointment.id} className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-semibold text-sky-700">{appointment.statusLabel}</p>
                  <h2 className="mt-2 text-xl font-semibold text-slate-950">{appointment.service?.name}</h2>
                  <p className="mt-2 text-sm text-slate-600">
                    {appointment.specialist?.name} · {appointment.service?.specialty?.name}
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    {appointment.slot?.dateLabel} a las {appointment.slot?.startLabel}
                  </p>
                </div>
                <a
                  href={appointment.meetingSession?.joinUrl || '/portal/sala'}
                  className="inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Ingresar a sala virtual
                </a>
              </div>
            </article>
          ))
        ) : (
          <EmptyStateCard
            title="No hay citas confirmadas por ahora"
            description="Cuando el pago sea validado o generes una nueva reserva, las veras aqui con su acceso a sala virtual."
            ctaHref="/portal/agendar"
            ctaLabel="Agendar ahora"
          />
        )}
      </div>
    </>
  );
}
