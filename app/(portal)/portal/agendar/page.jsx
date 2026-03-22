import PortalHeader from '@/components/portal/PortalHeader';
import BookingFlow from '@/components/appointments/BookingFlow';
import { requireServerAuth } from '@/lib/auth/serverSession';
import { listProfessionals, listSpecialties } from '@/lib/professionals/queries';

export default async function PortalBookingPage() {
  await requireServerAuth({ allowedRoles: ['PATIENT'], pathname: '/portal/agendar' });
  const [specialties, professionals] = await Promise.all([listSpecialties(), listProfessionals()]);

  return (
    <>
      <PortalHeader title="Agendar consulta" subtitle="Selecciona especialidad, profesional, fecha, horario y motivo." />
      <div className="px-4 py-6 md:px-6">
        <BookingFlow professionals={professionals} specialties={specialties} />
      </div>
    </>
  );
}
