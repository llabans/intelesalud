'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
  getRedirectResult,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  signOut,
} from 'firebase/auth';
import {
  auth,
  googleProvider,
  isFirebaseAuthDomainSameSite,
} from '@/lib/auth/firebaseClient';
import { trackEvent } from '@/lib/analytics/firebaseAnalytics';
import {
  SESSION_IDLE_TIMEOUT_MS,
} from '@/lib/auth/sessionActivity';

const AuthContext = createContext(null);
const REDIRECT_LOGIN_STATE_KEY = '__intelesalud_redirect_login_state';
const REDIRECT_LOGIN_MAX_AGE_MS = 10 * 60 * 1000;
const SESSION_VERIFICATION_RETRY_DELAYS_MS = [0, 150, 350];

function isMobileBrowser() {
  if (typeof window === 'undefined') {
    return false;
  }

  return /iPhone|iPad|Android/i.test(window.navigator.userAgent);
}

function getPendingRedirectLogin() {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const rawValue = window.sessionStorage.getItem(REDIRECT_LOGIN_STATE_KEY);
    if (!rawValue) {
      return null;
    }

    const parsedValue = JSON.parse(rawValue);
    if (!parsedValue?.provider || !parsedValue?.startedAt) {
      window.sessionStorage.removeItem(REDIRECT_LOGIN_STATE_KEY);
      return null;
    }

    if (Date.now() - parsedValue.startedAt > REDIRECT_LOGIN_MAX_AGE_MS) {
      window.sessionStorage.removeItem(REDIRECT_LOGIN_STATE_KEY);
      return null;
    }

    return parsedValue;
  } catch {
    window.sessionStorage.removeItem(REDIRECT_LOGIN_STATE_KEY);
    return null;
  }
}

function markPendingRedirectLogin(provider) {
  if (typeof window === 'undefined') {
    return;
  }

  window.sessionStorage.setItem(
    REDIRECT_LOGIN_STATE_KEY,
    JSON.stringify({
      provider,
      startedAt: Date.now(),
    })
  );
}

function clearPendingRedirectLogin() {
  if (typeof window === 'undefined') {
    return;
  }

  window.sessionStorage.removeItem(REDIRECT_LOGIN_STATE_KEY);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authError, setAuthError] = useState(null);
  const [loading, setLoading] = useState(true);
  const idleTimerRef = useRef(null);
  const lastActivityTouchRef = useRef(0);
  const idleLogoutInProgressRef = useRef(false);

  const fetchSession = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/session', {
        cache: 'no-store',
        credentials: 'same-origin',
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setAuthError(null);
        return data.user;
      }

      setUser(null);
      return null;
    } catch {
      setUser(null);
      return null;
    }
  }, []);

  const verifyServerSession = useCallback(async () => {
    for (const delayMs of SESSION_VERIFICATION_RETRY_DELAYS_MS) {
      if (delayMs > 0) {
        await new Promise((resolve) => window.setTimeout(resolve, delayMs));
      }

      const sessionUser = await fetchSession();
      if (sessionUser) {
        return sessionUser;
      }
    }

    return null;
  }, [fetchSession]);

  const createServerSession = useCallback(async (idToken) => {
    const response = await fetch('/api/auth/session', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(data.error || 'Error al crear la sesion.');
      error.code = data.code || 'auth/session-create-failed';
      throw error;
    }

    const authenticatedUser = {
      ...data.user,
      postLoginPath: data.postLoginPath || null,
      isNewUser: Boolean(data.isNewUser),
    };

    setAuthError(null);
    setUser(authenticatedUser);
    const verifiedSessionUser = await verifyServerSession();

    if (!verifiedSessionUser) {
      const error = new Error(
        'Google autentico correctamente, pero el navegador no logro conservar la sesion.'
      );
      error.code = 'auth/session-not-persisted';
      throw error;
    }

    return {
      ...authenticatedUser,
      ...verifiedSessionUser,
      postLoginPath: authenticatedUser.postLoginPath,
      isNewUser: authenticatedUser.isNewUser,
    };
  }, [verifyServerSession]);

  const clearIdleTimer = useCallback(() => {
    if (idleTimerRef.current) {
      window.clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
  }, []);

  const touchSessionActivity = useCallback(() => {
    // Activity cookie is now httpOnly — refreshed server-side by middleware
    // on each protected route navigation. No client-side write needed.
  }, []);

  useEffect(() => {
    let mounted = true;

    const bootstrapAuth = async () => {
      try {
        if (!auth) {
          await fetchSession();
          return;
        }

        const pendingRedirectLogin = getPendingRedirectLogin();
        const redirectResult = await getRedirectResult(auth);

        if (redirectResult?.user) {
          clearPendingRedirectLogin();
          const idToken = await redirectResult.user.getIdToken();
          await createServerSession(idToken);
          void trackEvent('login_success', {
            provider: redirectResult.providerId || redirectResult.user.providerData?.[0]?.providerId || 'unknown',
            method: 'redirect',
          });
        } else {
          if (typeof auth.authStateReady === 'function') {
            await auth.authStateReady();
          }

          if (pendingRedirectLogin?.provider && auth.currentUser) {
            clearPendingRedirectLogin();
            const idToken = await auth.currentUser.getIdToken();
            await createServerSession(idToken);
            void trackEvent('login_success', {
              provider: pendingRedirectLogin.provider,
              method: 'redirect_persisted_user',
            });
            return;
          }

          const sessionUser = await fetchSession();
          if (!sessionUser && auth.currentUser) {
            if (pendingRedirectLogin?.provider) {
              clearPendingRedirectLogin();
              const redirectStateError = new Error(
                isFirebaseAuthDomainSameSite()
                  ? 'No se pudo reanudar el acceso con Google al volver desde el navegador movil.'
                  : 'El acceso movil con Google requiere que Firebase use el mismo dominio de la app o un proxy /__/auth.'
              );
              redirectStateError.code = isFirebaseAuthDomainSameSite()
                ? 'auth/redirect-state-lost'
                : 'auth/mobile-redirect-domain-mismatch';
              setAuthError(redirectStateError);
              console.error('[Auth] Redirect login did not survive the round trip.', redirectStateError);
              void trackEvent('login_failed', {
                provider: pendingRedirectLogin.provider,
                code: redirectStateError.code,
              });
              return;
            }

            await signOut(auth);
          }
        }
      } catch (error) {
        clearPendingRedirectLogin();
        setAuthError(error);
        console.error('[Auth] Redirect login failed:', error);
        void trackEvent('login_failed', {
          provider: 'redirect',
          code: error?.code || 'auth/redirect-failed',
        });
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    bootstrapAuth();

    if (!auth) {
      return () => {
        mounted = false;
      };
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [createServerSession, fetchSession]);

  const logout = useCallback(async () => {
    try {
      clearPendingRedirectLogin();
      clearIdleTimer();
      await fetch('/api/auth/session', { method: 'DELETE', credentials: 'same-origin' });
      if (auth) {
        await signOut(auth);
      }
      setUser(null);
    } catch (error) {
      console.error('[Auth] Logout failed:', error);
    }
  }, [clearIdleTimer]);

  useEffect(() => {
    if (!user) {
      idleLogoutInProgressRef.current = false;
      clearIdleTimer();
      return undefined;
    }

    const scheduleIdleLogout = () => {
      clearIdleTimer();
      idleTimerRef.current = window.setTimeout(async () => {
        if (idleLogoutInProgressRef.current) {
          return;
        }

        idleLogoutInProgressRef.current = true;
        await logout();
        window.location.href = '/login?mode=login&reason=idle';
      }, SESSION_IDLE_TIMEOUT_MS);
    };

    const handleActivity = () => {
      touchSessionActivity();
      scheduleIdleLogout();
    };

    touchSessionActivity(true);
    scheduleIdleLogout();

    const activityEvents = ['pointerdown', 'keydown', 'scroll', 'touchstart'];
    activityEvents.forEach((eventName) =>
      window.addEventListener(eventName, handleActivity, { passive: true })
    );

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        handleActivity();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearIdleTimer();
      activityEvents.forEach((eventName) => window.removeEventListener(eventName, handleActivity));
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [clearIdleTimer, logout, touchSessionActivity, user]);

  const login = useCallback(
    async (providerName) => {
      if (!auth) {
        const error = new Error('Firebase Client no esta configurado.');
        error.code = 'auth/not-configured';
        throw error;
      }

      if (providerName !== 'google') {
        const error = new Error('Proveedor no soportado.');
        error.code = 'auth/provider-not-supported';
        throw error;
      }

      const provider = googleProvider;
      setAuthError(null);
      void trackEvent('login_attempt', { provider: providerName });

      if (isMobileBrowser()) {
        markPendingRedirectLogin(providerName);
        void trackEvent('login_redirect_started', { provider: providerName, reason: 'mobile-browser' });
        await signInWithRedirect(auth, provider);
        return null;
      }

      setLoading(true);

      try {
        const result = await signInWithPopup(auth, provider);
        const idToken = await result.user.getIdToken();
        const authenticatedUser = await createServerSession(idToken);
        void trackEvent('login_success', { provider: providerName, method: 'popup' });
        return authenticatedUser;
      } catch (error) {
        if (
          error?.code === 'auth/popup-blocked' ||
          error?.code === 'auth/cancelled-popup-request'
        ) {
          markPendingRedirectLogin(providerName);
          void trackEvent('login_redirect_started', {
            provider: providerName,
            reason: error.code,
          });
          await signInWithRedirect(auth, provider);
          return null;
        }

        console.error('[Auth] Login failed:', error);
        void trackEvent('login_failed', {
          provider: providerName,
          code: error?.code || 'auth/login-failed',
        });
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [createServerSession]
  );

  const updatePhone = useCallback(async (phone) => {
    const response = await fetch('/api/auth/profile', {
      method: 'PATCH',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(data.error || 'Error al actualizar.');
      error.code = data.code || 'profile/update-failed';
      throw error;
    }

    setUser(data.user);
    return data.user;
  }, []);

  return (
    <AuthContext.Provider value={{ user, authError, loading, login, logout, updatePhone }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
