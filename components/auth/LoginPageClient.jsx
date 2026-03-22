'use client';

import Link from 'next/link';
import { Suspense, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ArrowRight, Lock, ShieldCheck } from 'lucide-react';
import AppLogo from '@/components/ui/AppLogo';
import { useAuth } from '@/components/AuthProvider';
import { getPostLoginRedirect, normalizeRedirectTarget } from '@/lib/auth/redirects';

function getFriendlyLoginError(error) {
  switch (error?.code) {
    case 'auth/unauthorized-domain':
      return 'Firebase rechazo el dominio actual. Agrega intelesalud.medicalcore.app en los dominios autorizados.';
    case 'auth/operation-not-allowed':
      return 'Google Sign-In no esta habilitado en Firebase Authentication.';
    case 'auth/invalid-api-key':
      return 'La API key publica de Firebase no es valida para esta app.';
    case 'auth/network-request-failed':
      return 'No se pudo conectar con Firebase Authentication. Revisa authDomain, dominios autorizados y conectividad.';
    case 'auth/configuration-not-found':
      return 'La configuracion de Google Sign-In en Firebase Authentication no esta completa.';
    case 'auth/popup-closed-by-user':
      return 'Se cerro la ventana de Google antes de completar el inicio de sesion.';
    case 'auth/popup-blocked':
      return 'El navegador bloqueo la ventana emergente. Se necesita permitir popups o usar redireccionamiento.';
    case 'auth/admin-not-configured':
      return 'El servidor no tiene Firebase Admin configurado correctamente.';
    case 'auth/not-configured':
      return 'La configuracion publica de Firebase esta incompleta en esta app.';
    case 'auth/session-not-persisted':
      return 'Google autentico correctamente, pero el navegador no logro conservar la sesion.';
    case 'auth/redirect-state-lost':
      return 'El acceso con Google se interrumpio al volver desde el navegador movil. Intenta nuevamente.';
    case 'auth/mobile-redirect-domain-mismatch':
      return 'El login movil con Google requiere que Firebase use el mismo dominio de la app o un proxy /__/auth en intelesalud.medicalcore.app.';
    default:
      return error?.message || 'Error al iniciar sesion. Por favor intenta de nuevo.';
  }
}

function LoginContent() {
  const { authError, login, user } = useAuth();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [errorCode, setErrorCode] = useState('');
  const navigationCommittedRef = useRef(false);

  const explicitRedirect = normalizeRedirectTarget(searchParams.get('redirect'));
  const loginReason = searchParams.get('reason');

  const navigateAfterLogin = (target, { replace = false } = {}) => {
    if (typeof window === 'undefined') {
      return;
    }

    navigationCommittedRef.current = true;
    if (replace) {
      window.location.replace(target);
      return;
    }

    window.location.assign(target);
  };

  useEffect(() => {
    if (user && !navigationCommittedRef.current) {
      navigateAfterLogin(
        getPostLoginRedirect({
          role: user.role,
          redirectTarget: explicitRedirect,
          fallbackPath: user.postLoginPath,
        }),
        { replace: true }
      );
    }
  }, [explicitRedirect, user]);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');
    setErrorCode('');

    try {
      const loggedInUser = await login('google');
      if (loggedInUser) {
        navigateAfterLogin(
          getPostLoginRedirect({
            role: loggedInUser.role,
            redirectTarget: explicitRedirect,
            fallbackPath: loggedInUser.postLoginPath,
          })
        );
      }
    } catch (loginError) {
      if (loginError?.code === 'auth/popup-closed-by-user') {
        setIsLoading(false);
        return;
      }

      setError(getFriendlyLoginError(loginError));
      setErrorCode(loginError?.code || '');
    } finally {
      setIsLoading(false);
    }
  };

  const contextErrorMessage = !error && authError ? getFriendlyLoginError(authError) : '';
  const displayedError = error || contextErrorMessage;
  const displayedErrorCode = error ? errorCode : authError?.code || '';

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.15fr,0.85fr]">
      <div className="hidden overflow-hidden bg-[linear-gradient(140deg,#09222e_0%,#0c4859_42%,#0f8ba8_100%)] px-10 py-12 text-white lg:flex lg:flex-col lg:justify-between">
        <AppLogo href="/" />
        <div className="max-w-xl space-y-8">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-sky-100/80">
            Telesalud multiespecialidad
          </p>
          <h2 className="text-5xl font-semibold leading-tight tracking-tight">
            Accede a un portal sobrio, humano y listo para continuidad real.
          </h2>
          <p className="max-w-lg text-lg leading-8 text-sky-50/80">
            Reserva, pago, seguimiento, documentos, mensajes y sala virtual desde una sola plataforma.
          </p>
        </div>
        <div className="grid gap-3">
          <div className="rounded-[28px] border border-white/15 bg-white/10 p-5 backdrop-blur">
            <p className="text-sm font-semibold">Acceso seguro</p>
            <p className="mt-2 text-sm leading-7 text-sky-50/75">
              Google Sign-In con sesion server-side, cookies seguras y rutas privadas protegidas.
            </p>
          </div>
          <div className="rounded-[28px] border border-white/15 bg-white/10 p-5 backdrop-blur">
            <p className="text-sm font-semibold">Portal del paciente</p>
            <p className="mt-2 text-sm leading-7 text-sky-50/75">
              Historial, indicaciones, documentos mock y una base lista para videollamada futura.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center px-4 py-10 md:px-8">
        <div className="w-full max-w-lg rounded-[32px] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-950/5 md:p-10">
          <div className="mb-8">
            <AppLogo href="/" />
            <h1 className="mt-8 text-3xl font-semibold tracking-tight text-slate-950">
              Inicia sesion en InteleSalud
            </h1>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Usa tu cuenta de Google para reservar, gestionar tus teleconsultas y entrar a tu portal privado.
            </p>
          </div>

          {displayedError ? (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <p>{displayedError}</p>
              {displayedErrorCode ? (
                <p className="mt-2 text-xs font-mono text-red-500">Codigo: {displayedErrorCode}</p>
              ) : null}
            </div>
          ) : null}

          {!displayedError && loginReason === 'idle' ? (
            <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              Tu sesion se cerro por inactividad. Ingresa otra vez para continuar.
            </div>
          ) : null}

          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="h-5 w-5 rounded-full border-2 border-slate-400 border-t-transparent animate-spin" />
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
            )}
            Continuar con Google
          </button>

          <div className="mt-8 space-y-3 border-t border-slate-200 pt-8 text-sm text-slate-500">
            <div className="flex items-start gap-3">
              <Lock className="mt-0.5 h-4 w-4 text-sky-700" />
              <p>Tu sesion usa cookie segura en servidor y proteccion real de rutas privadas.</p>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-4 w-4 text-sky-700" />
              <p>El primer acceso te lleva por un onboarding breve antes de entrar al portal.</p>
            </div>
          </div>

          <div className="mt-8 text-center text-sm text-slate-500">
            <Link href="/" className="inline-flex items-center gap-2 font-medium text-slate-950">
              Volver al inicio <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPageClient() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}
