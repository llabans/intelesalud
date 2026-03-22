import { redirect } from 'next/navigation';
import { requireServerAuth } from '@/lib/auth/serverSession';

export const dynamic = 'force-dynamic';

export default async function PatientDashboardPage() {
  await requireServerAuth({ allowedRoles: ['PATIENT'], pathname: '/dashboard/patient' });
  redirect('/portal');
}
