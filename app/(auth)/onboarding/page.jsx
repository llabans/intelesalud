import OnboardingClient from '@/components/auth/OnboardingClient';
import { requireServerAuth } from '@/lib/auth/serverSession';
import { listSpecialties } from '@/lib/professionals/queries';
import { PATIENT_ATTENTION_PREFERENCES, PATIENT_CARE_INTENTS } from '@/lib/platform/catalog';

export default async function OnboardingPage() {
  const user = await requireServerAuth({ allowedRoles: ['PATIENT'], pathname: '/onboarding' });
  const specialties = await listSpecialties();

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl items-center px-4 py-12 md:px-6">
      <OnboardingClient
        specialties={specialties}
        careIntents={PATIENT_CARE_INTENTS}
        attentionPreferences={PATIENT_ATTENTION_PREFERENCES}
        initialName={user.name || ''}
      />
    </div>
  );
}
