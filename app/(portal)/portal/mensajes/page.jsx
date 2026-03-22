import AssistantPanel from '@/components/chat/AssistantPanel';
import AppointmentConversationCard from '@/components/appointments/AppointmentConversationCard';
import PortalHeader from '@/components/portal/PortalHeader';
import EmptyStateCard from '@/components/portal/EmptyStateCard';
import { requireServerAuth } from '@/lib/auth/serverSession';
import { getPortalMessages } from '@/lib/portal/queries';

export default async function PortalMessagesPage() {
  const user = await requireServerAuth({ allowedRoles: ['PATIENT'], pathname: '/portal/mensajes' });
  const appointments = await getPortalMessages(user);

  return (
    <>
      <PortalHeader title="Mensajes" subtitle="Bandeja moderna para conversaciones de cita y asistente administrativo." />
      <div className="grid gap-6 px-4 py-6 md:px-6 xl:grid-cols-[1.2fr,0.8fr]">
        <div className="space-y-5">
          {appointments.length ? (
            appointments.map((appointment) => (
              <AppointmentConversationCard
                key={appointment.id}
                appointment={appointment}
                heading={appointment.service?.name || 'Solicitud clinica'}
                subheading={`${appointment.specialist?.name || 'Profesional'} · ${appointment.service?.specialty?.name || ''}`}
                composerPlaceholder="Escribe aqui una duda administrativa o mensaje de coordinacion..."
                onAppointmentChange={() => {}}
              />
            ))
          ) : (
            <EmptyStateCard
              title="Aun no hay conversaciones de cita"
              description="Cuando empieces una reserva o solicites seguimiento, las conversaciones apareceran aqui."
              ctaHref="/portal/agendar"
              ctaLabel="Crear reserva"
            />
          )}
        </div>
        <AssistantPanel channel="PORTAL" heading="Asistente administrativo" />
      </div>
    </>
  );
}
