import { prisma } from '@/lib/db';
import { DEFAULT_BOOKING_PATH } from '@/lib/platform/catalog';
import { normalizeRedirectTarget } from './redirects';
import { getDashboardPathForRole, isSpecialistRole } from './roles';

function getPatientAppointmentPath(appointment) {
  if (!appointment) {
    return '/portal';
  }

  if (
    appointment.status === 'PENDING' &&
    (!appointment.paymentVoucher || appointment.paymentVoucher.status === 'REJECTED')
  ) {
    return `/checkout/${appointment.id}`;
  }

  return `/confirmation/${appointment.id}`;
}

async function getLatestPatientAppointment(userId) {
  return prisma.appointment.findFirst({
    where: {
      patient: {
        is: {
          userId,
        },
      },
    },
    select: {
      id: true,
      status: true,
      paymentVoucher: {
        select: {
          status: true,
        },
      },
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });
}

export async function resolveServerPostLoginPath({ user, redirectTarget, isNewUser = false }) {
  const explicitRedirect = normalizeRedirectTarget(redirectTarget);
  if (explicitRedirect) {
    return explicitRedirect;
  }

  if (!user) {
    return '/login';
  }

  if (user.role === 'ADMIN' || isSpecialistRole(user.role)) {
    return getDashboardPathForRole(user.role);
  }

  const onboardingCompleted = Boolean(user.patientProfile?.onboardingCompletedAt);
  if (!onboardingCompleted) {
    return '/onboarding';
  }

  if (isNewUser) {
    return '/onboarding';
  }

  const latestAppointment = await getLatestPatientAppointment(user.id);
  return getPatientAppointmentPath(latestAppointment);
}
