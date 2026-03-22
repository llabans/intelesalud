import 'server-only';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { adminAuth } from './firebaseAdmin';
import { prisma } from '../db';
import { buildLoginPath } from './redirects';
import { getDashboardPathForRole } from './roles';
import { isSessionActivityFresh, SESSION_ACTIVITY_COOKIE_NAME } from './sessionActivity';

export async function getServerAuthUser() {
  try {
    if (!adminAuth) {
      return null;
    }

    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('__session')?.value;
    const sessionActivity = cookieStore.get(SESSION_ACTIVITY_COOKIE_NAME)?.value;

    if (!sessionCookie || !isSessionActivityFresh(sessionActivity)) {
      return null;
    }

    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
    return prisma.user.findUnique({
      where: { firebaseUid: decoded.uid },
      include: {
        patientProfile: true,
        specialistProfile: true,
      },
    });
  } catch (error) {
    console.error('[Auth] Server session verification failed:', error.message);
    return null;
  }
}

export async function requireServerAuth({ allowedRoles, pathname } = {}) {
  const user = await getServerAuthUser();

  if (!user) {
    redirect(buildLoginPath(pathname));
  }

  if (allowedRoles?.length && !allowedRoles.includes(user.role)) {
    redirect(getDashboardPathForRole(user.role));
  }

  return user;
}
