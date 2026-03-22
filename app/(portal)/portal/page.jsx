import Link from 'next/link';
import PortalHeader from '@/components/portal/PortalHeader';
import EmptyStateCard from '@/components/portal/EmptyStateCard';
import { requireServerAuth } from '@/lib/auth/serverSession';
import { getPortalSummary } from '@/lib/portal/queries';

export default async function PortalHomePage() {
  const user = await requireServerAuth({ allowedRoles: ['PATIENT'], pathname: '/portal' });
  const summary = await getPortalSummary(user);

  return (
    <>
      <PortalHeader
        title={`Hola${user.name ? `, ${user.name.split(' ')[0]}` : ''}`}
        subtitle="Este es tu centro de continuidad para citas, documentos, indicaciones y mensajes."
      />
      <div className="space-y-6 px-4 py-6 md:px-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Citas registradas</p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">{summary.metrics.appointmentsCount}</p>
          </div>
          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Documentos mock</p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">{summary.metrics.documentsCount}</p>
          </div>
          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Registros clinicos</p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">{summary.metrics.recordsCount}</p>
          </div>
        </div>

        {summary.upcomingAppointment ? (
          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-sky-700">Proxima cita</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">
              {summary.upcomingAppointment.service?.name}
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              {summary.upcomingAppointment.specialist?.name} · {summary.upcomingAppointment.slot?.dateLabel} · {summary.upcomingAppointment.slot?.startLabel}
            </p>
            <div className="mt-5 flex gap-3">
              <Link href="/portal/citas" className="inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                Ver detalle
              </Link>
              <Link href="/portal/sala" className="inline-flex rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50">
                Ir a sala virtual
              </Link>
            </div>
          </div>
        ) : (
          <EmptyStateCard
            title="Aun no tienes citas confirmadas"
            description="Empieza una nueva teleconsulta para activar tu flujo completo de reserva, pago, confirmacion y seguimiento."
            ctaHref="/portal/agendar"
            ctaLabel="Agendar consulta"
          />
        )}

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-lg font-semibold text-slate-950">Accesos rapidos</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                ['/portal/agendar', 'Nueva teleconsulta'],
                ['/portal/documentos', 'Documentos'],
                ['/portal/mensajes', 'Mensajes'],
                ['/portal/perfil', 'Perfil'],
              ].map(([href, label]) => (
                <Link key={href} href={href} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-white">
                  {label}
                </Link>
              ))}
            </div>
          </div>
          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-lg font-semibold text-slate-950">Actividad reciente</p>
            <div className="mt-4 space-y-3">
              {summary.activities.length ? (
                summary.activities.map((activity) => (
                  <div key={activity.id} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-600">
                    <p className="font-medium text-slate-950">{activity.action}</p>
                    <p className="mt-1">{new Date(activity.createdAt).toLocaleString('es-PE')}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">La actividad aparecera aqui conforme uses el portal.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
