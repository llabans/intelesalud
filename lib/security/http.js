import { NextResponse } from 'next/server';

const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

function getRequestOrigin(request) {
  const protocol =
    request.headers.get('x-forwarded-proto') ||
    (process.env.NODE_ENV === 'production' ? 'https' : 'http');
  const host =
    request.headers.get('x-forwarded-host') ||
    request.headers.get('host') ||
    request.nextUrl?.host;

  return host ? `${protocol}://${host}` : null;
}

export function jsonNoStore(body, init = {}) {
  const headers = new Headers(init.headers || {});
  headers.set('Cache-Control', 'no-store, max-age=0');
  return NextResponse.json(body, { ...init, headers });
}

export function ensureTrustedOrigin(request) {
  if (!MUTATING_METHODS.has(request.method?.toUpperCase())) {
    return null;
  }

  const requestOrigin = request.headers.get('origin');
  const secFetchSite = request.headers.get('sec-fetch-site');
  const trustedOrigins = new Set();

  if (process.env.NEXT_PUBLIC_APP_URL) {
    try {
      trustedOrigins.add(new URL(process.env.NEXT_PUBLIC_APP_URL).origin);
    } catch {}
  }

  const derivedOrigin = getRequestOrigin(request);
  if (derivedOrigin) {
    trustedOrigins.add(derivedOrigin);
  }

  if (!requestOrigin) {
    if (process.env.NODE_ENV !== 'production' && !secFetchSite) {
      return null;
    }

    return jsonNoStore(
      { error: 'No se pudo validar el origen de la solicitud.' },
      { status: 403 }
    );
  }

  if (secFetchSite === 'cross-site') {
    return jsonNoStore({ error: 'Origen no permitido.' }, { status: 403 });
  }

  if (!trustedOrigins.has(requestOrigin)) {
    return jsonNoStore({ error: 'Origen no permitido.' }, { status: 403 });
  }

  return null;
}
