import { initializeApp, getApps } from 'firebase/app';
import {
  browserLocalPersistence,
  browserPopupRedirectResolver,
  browserSessionPersistence,
  getAuth,
  GoogleAuthProvider,
  indexedDBLocalPersistence,
  initializeAuth,
} from 'firebase/auth';

const runtimeFirebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || undefined,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || undefined,
};

export const hasFirebaseClientConfig = Boolean(
  runtimeFirebaseConfig.apiKey &&
    runtimeFirebaseConfig.authDomain &&
    runtimeFirebaseConfig.projectId &&
    runtimeFirebaseConfig.appId
);

export const firebaseConfig = hasFirebaseClientConfig
  ? runtimeFirebaseConfig
  : {
      apiKey: 'dummy_key_for_build',
      authDomain: 'dummy.firebaseapp.com',
      projectId: 'dummy-project',
      appId: 'dummy-app-id',
      measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || undefined,
    };

// Initialize Firebase only if we have a real or dummy config
export const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

function normalizeHost(candidate) {
  if (!candidate || typeof candidate !== 'string') {
    return null;
  }

  try {
    return new URL(candidate.includes('://') ? candidate : `https://${candidate}`).host.toLowerCase();
  } catch {
    return null;
  }
}

function createBrowserAuth() {
  if (typeof window === 'undefined' || !hasFirebaseClientConfig) {
    return null;
  }

  try {
    return initializeAuth(firebaseApp, {
      persistence: [
        indexedDBLocalPersistence,
        browserLocalPersistence,
        browserSessionPersistence,
      ],
      popupRedirectResolver: browserPopupRedirectResolver,
    });
  } catch {
    return getAuth(firebaseApp);
  }
}

// Only initialize Auth if we are in the browser, to avoid SSR/build errors
export const auth = createBrowserAuth();

export function isFirebaseAuthDomainSameSite() {
  if (typeof window === 'undefined' || !hasFirebaseClientConfig) {
    return true;
  }

  const configuredAuthHost = normalizeHost(runtimeFirebaseConfig.authDomain);
  const currentHost = normalizeHost(window.location.origin);

  if (!configuredAuthHost || !currentHost) {
    return true;
  }

  return configuredAuthHost === currentHost;
}

export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');
googleProvider.setCustomParameters({
  prompt: 'select_account',
});
