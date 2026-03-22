import 'server-only';
import { adminAuth } from './firebaseAdmin';
import { prisma } from '../db';
import { isSessionActivityFresh, SESSION_ACTIVITY_COOKIE_NAME } from './sessionActivity';

/**
 * Server-side helper to get the authenticated user from the session cookie.
 * Use in API routes to protect endpoints.
 */
export async function getAuthUser(request) {
  try {
    if (!adminAuth) {
      console.error('[Auth] Firebase Admin is not configured on the server.');
      return null;
    }

    const sessionCookie = request.cookies.get('__session')?.value;
    const sessionActivity = request.cookies.get(SESSION_ACTIVITY_COOKIE_NAME)?.value;
    if (!sessionCookie || !isSessionActivityFresh(sessionActivity)) return null;

    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
    const user = await prisma.user.findUnique({
      where: { firebaseUid: decoded.uid },
      include: {
        patientProfile: true,
        specialistProfile: true,
      },
    });

    return user;
  } catch (error) {
    console.error('[Auth] Session verification failed:', error.message);
    return null;
  }
}

/**
 * Require authentication — returns the user or throws a 401 response.
 */
export async function requireAuth(request) {
  const user = await getAuthUser(request);
  if (!user) {
    throw new Response(JSON.stringify({ error: 'No autorizado' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  return user;
}
