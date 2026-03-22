import { NextResponse } from 'next/server';
import {
  isSessionActivityFresh,
  SESSION_ACTIVITY_COOKIE_NAME,
  SESSION_ACTIVITY_MAX_AGE_SECONDS,
  shouldUseSecureCookies,
  buildSessionActivityValue,
} from './lib/auth/sessionActivity';

const PROTECTED_ROUTES = ['/dashboard', '/book', '/checkout'];
const ADDITIONAL_PROTECTED_ROUTES = ['/portal', '/onboarding', '/confirmation'];

function getAppOrigin(request) {
  const configuredOrigin = process.env.NEXT_PUBLIC_APP_URL;
  if (configuredOrigin) {
    return configuredOrigin;
  }

  const protocol = request.headers.get('x-forwarded-proto') || 'https';
  const host =
    request.headers.get('x-forwarded-host') ||
    request.headers.get('host') ||
    request.nextUrl.host;

  return `${protocol}://${host}`;
}

function buildRedirectUrl(request, pathname, searchParams) {
  const url = new URL(pathname, getAppOrigin(request));

  if (searchParams) {
    for (const [key, value] of searchParams.entries()) {
      url.searchParams.set(key, value);
    }
  }

  return url;
}

export function middleware(request) {
  const { pathname, search } = request.nextUrl;
  const sessionCookie = request.cookies.get('__session')?.value;
  const sessionActivity = request.cookies.get(SESSION_ACTIVITY_COOKIE_NAME)?.value;
  const isProtected = [...PROTECTED_ROUTES, ...ADDITIONAL_PROTECTED_ROUTES].some((route) =>
    pathname.startsWith(route)
  );
  const hasActiveSession = Boolean(sessionCookie && isSessionActivityFresh(sessionActivity));

  if (isProtected && !hasActiveSession) {
    const loginUrl = buildRedirectUrl(request, '/login');
    loginUrl.searchParams.set('redirect', `${pathname}${search || ''}`);
    return NextResponse.redirect(loginUrl);
  }

  const response = NextResponse.next();

  if (isProtected && hasActiveSession) {
    response.cookies.set(SESSION_ACTIVITY_COOKIE_NAME, buildSessionActivityValue(), {
      httpOnly: true,
      secure: shouldUseSecureCookies(),
      sameSite: 'lax',
      maxAge: SESSION_ACTIVITY_MAX_AGE_SECONDS,
      path: '/',
    });
  }

  if (isProtected) {
    response.headers.set('Cache-Control', 'no-store, max-age=0');
    response.headers.set('Vary', 'Cookie');
  }

  return response;
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/book/:path*',
    '/checkout/:path*',
    '/portal/:path*',
    '/onboarding',
    '/confirmation/:path*',
  ],
};
