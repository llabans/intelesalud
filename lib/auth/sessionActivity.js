export const SESSION_IDLE_TIMEOUT_MS = 10 * 60 * 1000;
export const SESSION_ACTIVITY_COOKIE_NAME = '__session_activity';
export const SESSION_ACTIVITY_MAX_AGE_SECONDS = SESSION_IDLE_TIMEOUT_MS / 1000;
export const SESSION_ACTIVITY_TOUCH_INTERVAL_MS = 60 * 1000;

export function shouldUseSecureCookies() {
  if (process.env.SESSION_COOKIE_SECURE === 'true') {
    return true;
  }

  if (process.env.SESSION_COOKIE_SECURE === 'false') {
    return false;
  }

  return process.env.NODE_ENV === 'production';
}

export function buildSessionActivityValue(now = Date.now()) {
  return String(now);
}

export function isSessionActivityFresh(value, now = Date.now()) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return false;
  }

  return now - parsed <= SESSION_IDLE_TIMEOUT_MS;
}

export function getSessionActivityCookieAttributes() {
  return {
    httpOnly: true,
    secure: shouldUseSecureCookies(),
    sameSite: 'lax',
    maxAge: SESSION_ACTIVITY_MAX_AGE_SECONDS,
    path: '/',
  };
}

