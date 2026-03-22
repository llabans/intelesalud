import 'server-only';
import admin from 'firebase-admin';

const globalForFirebase = globalThis;

function getAdminApp() {
  if (globalForFirebase._firebaseAdminApp) {
    return globalForFirebase._firebaseAdminApp;
  }

  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!serviceAccountKey) {
    console.warn('FIREBASE_SERVICE_ACCOUNT_KEY is not set. Admin SDK will not initialize. (Safe to ignore during build)');
    return null;
  }

  try {
    const serviceAccount = JSON.parse(serviceAccountKey);
    if (typeof serviceAccount.private_key === 'string') {
      serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
    }

    const app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    if (process.env.NODE_ENV !== 'production') {
      globalForFirebase._firebaseAdminApp = app;
    }

    return app;
  } catch (error) {
    console.error('Failed to initialize Firebase Admin:', error.message);
    return null;
  }
}

export const adminApp = getAdminApp();
export const adminAuth = adminApp ? admin.auth(adminApp) : null;
