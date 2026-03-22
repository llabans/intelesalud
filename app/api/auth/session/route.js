import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/auth/firebaseAdmin';
import { prisma } from '@/lib/db';
import { authRateLimiter, extractClientIp, recordAuthEvent } from '@/lib/auth/security';
import { resolveServerPostLoginPath } from '@/lib/auth/postLoginDestination';
import { ensureTrustedOrigin, jsonNoStore } from '@/lib/security/http';
import {
  buildSessionActivityValue,
  getSessionActivityCookieAttributes,
  isSessionActivityFresh,
  SESSION_ACTIVITY_COOKIE_NAME,
  shouldUseSecureCookies,
} from '@/lib/auth/sessionActivity';

const SESSION_DURATION = 12 * 60 * 60 * 1000;

function normalizeEmail(email) {
  if (!email || typeof email !== 'string') {
    return null;
  }

  return email.trim().toLowerCase();
}

function serializeUser(user) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    image: user.image,
    role: user.role,
    phone: user.phone,
    onboardingCompleted: Boolean(user.patientProfile?.onboardingCompletedAt),
  };
}

async function getUserByFirebaseUid(firebaseUid) {
  return prisma.user.findUnique({
    where: { firebaseUid },
    include: {
      patientProfile: true,
      specialistProfile: true,
    },
  });
}

function buildAuthError(error) {
  const code = error?.code || 'auth/unknown';

  switch (code) {
    case 'auth/id-token-expired':
      return { code, status: 401, message: 'La sesion de Firebase ha expirado. Intenta nuevamente.' };
    case 'auth/argument-error':
      return { code, status: 400, message: 'El token recibido no es valido.' };
    case 'auth/invalid-credential':
    case 'auth/invalid-id-token':
      return { code, status: 401, message: 'No se pudo validar el token de Google.' };
    default:
      return { code, status: 401, message: 'No se pudo completar la autenticacion.' };
  }
}

export async function POST(request) {
  try {
    const originError = ensureTrustedOrigin(request);
    if (originError) {
      return originError;
    }

    if (!adminAuth) {
      return jsonNoStore(
        {
          error: 'Firebase Admin no esta configurado en el servidor.',
          code: 'auth/admin-not-configured',
        },
        { status: 503 }
      );
    }

    const clientIp = extractClientIp(request);
    if (!authRateLimiter.isAllowed(clientIp)) {
      return jsonNoStore(
        {
          error: 'Demasiados intentos. Intenta de nuevo mas tarde.',
          code: 'auth/rate-limit',
        },
        { status: 429 }
      );
    }

    const { idToken } = await request.json();
    if (!idToken) {
      return jsonNoStore(
        { error: 'Token requerido.', code: 'auth/missing-token' },
        { status: 400 }
      );
    }

    const decoded = await adminAuth.verifyIdToken(idToken);
    const { uid, email, name, picture, firebase, email_verified: emailVerified } = decoded;
    const signInProvider = firebase?.sign_in_provider || 'unknown';
    const normalizedEmail = normalizeEmail(email);

    const [existingUserByUid, existingUserByEmail] = await Promise.all([
      prisma.user.findUnique({
        where: { firebaseUid: uid },
      }),
      normalizedEmail && emailVerified
        ? prisma.user.findUnique({
            where: { email: normalizedEmail },
          })
        : Promise.resolve(null),
    ]);

    const isNewUser = !existingUserByUid && !existingUserByEmail;

    if (existingUserByUid) {
      await prisma.user.update({
        where: { firebaseUid: uid },
        data: {
          email: normalizedEmail || undefined,
          name: name || undefined,
          image: picture || undefined,
        },
      });
    } else if (existingUserByEmail) {
      await prisma.user.update({
        where: { id: existingUserByEmail.id },
        data: {
          firebaseUid: uid,
          email: normalizedEmail || undefined,
          name: name || undefined,
          image: picture || undefined,
        },
      });
    } else {
      await prisma.user.create({
        data: {
          firebaseUid: uid,
          email: normalizedEmail || null,
          name: name || null,
          image: picture || null,
          role: 'PATIENT',
        },
      });
    }

    const user = await getUserByFirebaseUid(uid);
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: SESSION_DURATION,
    });
    const postLoginPath = await resolveServerPostLoginPath({ user, isNewUser });

    await recordAuthEvent({
      userId: user.id,
      eventName: 'login_google',
      ip: clientIp,
      userAgent: request.headers.get('user-agent'),
      detail: {
        provider: signInProvider,
        reusedExistingUser: Boolean(existingUserByEmail && !existingUserByUid),
      },
    });

    const response = jsonNoStore({
      user: serializeUser(user),
      postLoginPath,
      isNewUser,
    });

    response.cookies.set('__session', sessionCookie, {
      httpOnly: true,
      secure: shouldUseSecureCookies(),
      sameSite: 'lax',
      maxAge: SESSION_DURATION / 1000,
      path: '/',
    });
    response.cookies.set(
      SESSION_ACTIVITY_COOKIE_NAME,
      buildSessionActivityValue(),
      getSessionActivityCookieAttributes()
    );

    return response;
  } catch (error) {
    console.error('[Auth] Session creation failed:', error);
    const authError = buildAuthError(error);
    return jsonNoStore(
      { error: authError.message, code: authError.code },
      { status: authError.status }
    );
  }
}

export async function GET(request) {
  try {
    if (!adminAuth) {
      return jsonNoStore({ user: null }, { status: 503 });
    }

    const sessionCookie = request.cookies.get('__session')?.value;
    const sessionActivity = request.cookies.get(SESSION_ACTIVITY_COOKIE_NAME)?.value;
    if (!sessionCookie || !isSessionActivityFresh(sessionActivity)) {
      const response = jsonNoStore({ user: null }, { status: 401 });
      response.cookies.set('__session', '', { httpOnly: true, maxAge: 0, path: '/' });
      response.cookies.set(SESSION_ACTIVITY_COOKIE_NAME, '', { maxAge: 0, path: '/' });
      return response;
    }

    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
    const user = await getUserByFirebaseUid(decoded.uid);

    if (!user) {
      return jsonNoStore({ user: null }, { status: 401 });
    }

    return jsonNoStore({
      user: serializeUser(user),
    });
  } catch (error) {
    console.error('[Auth] Session verification failed:', error.message);
    return jsonNoStore({ user: null }, { status: 401 });
  }
}

export async function DELETE(request) {
  try {
    const originError = ensureTrustedOrigin(request);
    if (originError) {
      return originError;
    }

    if (!adminAuth) {
      const response = jsonNoStore({ success: true });
      response.cookies.set('__session', '', { maxAge: 0, path: '/' });
      response.cookies.set(SESSION_ACTIVITY_COOKIE_NAME, '', { maxAge: 0, path: '/' });
      return response;
    }

    const sessionCookie = request.cookies.get('__session')?.value;

    if (sessionCookie) {
      const decoded = await adminAuth.verifySessionCookie(sessionCookie).catch(() => null);

      if (decoded) {
        const user = await getUserByFirebaseUid(decoded.uid);

        await recordAuthEvent({
          userId: user?.id,
          eventName: 'logout',
          ip: extractClientIp(request),
          userAgent: request.headers.get('user-agent'),
        });

        await adminAuth.revokeRefreshTokens(decoded.uid).catch(() => {});
      }
    }

    const response = jsonNoStore({ success: true });
    response.cookies.set('__session', '', {
      httpOnly: true,
      secure: shouldUseSecureCookies(),
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    });
    response.cookies.set(SESSION_ACTIVITY_COOKIE_NAME, '', { maxAge: 0, path: '/' });

    return response;
  } catch (error) {
    console.error('[Auth] Logout failed:', error);
    const response = jsonNoStore({ success: true });
    response.cookies.set('__session', '', { maxAge: 0, path: '/' });
    response.cookies.set(SESSION_ACTIVITY_COOKIE_NAME, '', { maxAge: 0, path: '/' });
    return response;
  }
}
