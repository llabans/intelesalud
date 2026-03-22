import PortalHeader from '@/components/portal/PortalHeader';
import EmptyStateCard from '@/components/portal/EmptyStateCard';
import ReviewForm from '@/components/portal/ReviewForm';
import { requireServerAuth } from '@/lib/auth/serverSession';
import { getPortalSummary } from '@/lib/portal/queries';

export default async function PortalHistoryPage() {
  const user = await requireServerAuth({ allowedRoles: ['PATIENT'], pathname: '/portal/historial' });
  const summary = await getPortalSummary(user);
  const history = summary.appointments.filter((appointment) => appointment.portalSection === 'history');

  return (
    <>
      <PortalHeader title="Historial" subtitle="Resumen de atenciones, motivo, estado y evaluacion por cada atencion." />
      <div className="space-y-5 px-4 py-6 md:px-6">
        {history.length ? (
          history.map((appointment) => (
            <article key={appointment.id} className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-sky-700">{appointment.statusLabel}</p>
              <h2 className="mt-2 text-xl font-semibold text-slate-950">{appointment.service?.name}</h2>
              <p className="mt-2 text-sm text-slate-600">
                {appointment.specialist?.name} · {appointment.service?.specialty?.name}
              </p>
              <p className="mt-2 text-sm text-slate-600">
                {appointment.slot?.dateLabel} · {appointment.slot?.startLabel}
              </p>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                {appointment.intakeNotes || 'Resumen mock de consulta y continuidad administrativa del paciente.'}
              </p>
              {appointment.status === 'COMPLETED' ? (
                <ReviewForm appointmentId={appointment.id} currentReview={appointment.review} />
              ) : null}
            </article>
          ))
        ) : (
          <EmptyStateCard
            title="Aun no tienes historial clinico visible"
            description="Tu historial aparecera aqui despues de tus primeras atenciones o cuando el flujo mock se complete."
            ctaHref="/portal/agendar"
            ctaLabel="Crear primera cita"
          />
        )}
      </div>
    </>
  );
}
