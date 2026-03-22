import PortalHeader from '@/components/portal/PortalHeader';
import ProfessionalCard from '@/components/professionals/ProfessionalCard';
import { requireServerAuth } from '@/lib/auth/serverSession';
import { listProfessionals } from '@/lib/professionals/queries';

export default async function PortalProfessionalsPage() {
  await requireServerAuth({ allowedRoles: ['PATIENT'], pathname: '/portal/profesionales' });
  const professionals = await listProfessionals();

  return (
    <>
      <PortalHeader title="Profesionales" subtitle="Explora especialistas, su experiencia, universidad y disponibilidad mock." />
      <div className="grid gap-6 px-4 py-6 md:px-6 xl:grid-cols-3">
        {professionals.map((professional) => (
          <ProfessionalCard key={professional.id} professional={professional} />
        ))}
      </div>
    </>
  );
}
