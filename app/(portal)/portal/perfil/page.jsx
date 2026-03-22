import PortalHeader from '@/components/portal/PortalHeader';
import ProfileForm from '@/components/portal/ProfileForm';
import { requireServerAuth } from '@/lib/auth/serverSession';
import { getPatientProfileData } from '@/lib/portal/queries';

export default async function PortalProfilePage() {
  const user = await requireServerAuth({ allowedRoles: ['PATIENT'], pathname: '/portal/perfil' });
  const profile = await getPatientProfileData(user);

  return (
    <>
      <PortalHeader title="Perfil" subtitle="Gestiona nombre, telefono, preferencias y datos basicos del portal." />
      <div className="px-4 py-6 md:px-6">
        <ProfileForm initialProfile={profile} initialUser={user} />
      </div>
    </>
  );
}
