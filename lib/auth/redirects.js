import { getDashboardPathForRole } from './roles';

export function normalizeRedirectTarget(value) {
  if (!value || typeof value !== 'string') {
    return null;
  }

  if (!value.startsWith('/')) {
    return null;
  }

  if (value.startsWith('//') || value.startsWith('/\\')) {
    return null;
  }

  return value;
}

export function buildLoginPath(pathname) {
  const redirectTarget = normalizeRedirectTarget(pathname);

  if (!redirectTarget) {
    return '/login';
  }

  return `/login?redirect=${encodeURIComponent(redirectTarget)}`;
}

export function getPostLoginRedirect({ role, redirectTarget, fallbackPath }) {
  return (
    normalizeRedirectTarget(redirectTarget) ||
    normalizeRedirectTarget(fallbackPath) ||
    getDashboardPathForRole(role)
  );
}
