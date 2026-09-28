import {getApp, getApps, initializeApp, type FirebaseApp} from 'firebase/app';
import {
  browserLocalPersistence,
  getAuth,
  setPersistence,
  signInAnonymously,
  type Auth,
} from 'firebase/auth';
import {getDatabase, type Database} from 'firebase/database';
import {firebaseWebConfig} from '../firebaseConfig';

const firebaseConfig = {
  apiKey: firebaseWebConfig.apiKey || import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: firebaseWebConfig.authDomain || import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL:
    firebaseWebConfig.databaseURL || import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: firebaseWebConfig.projectId || import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:
    firebaseWebConfig.storageBucket || import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId:
    firebaseWebConfig.messagingSenderId ||
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: firebaseWebConfig.appId || import.meta.env.VITE_FIREBASE_APP_ID,
};

const requiredConfig = [
  firebaseConfig.apiKey,
  firebaseConfig.authDomain,
  firebaseConfig.databaseURL,
  firebaseConfig.projectId,
  firebaseConfig.appId,
];

export const isFirebaseConfigured = requiredConfig.every(
  (value) => typeof value === 'string' && value.trim().length > 0
);

export const firebaseApp: FirebaseApp | null = isFirebaseConfigured
  ? (getApps().length ? getApp() : initializeApp(firebaseConfig))
  : null;

export const firebaseAuth: Auth | null = firebaseApp ? getAuth(firebaseApp) : null;
export const firebaseRealtimeDb: Database | null = firebaseApp
  ? getDatabase(firebaseApp)
  : null;

/**
 * 학생에게 별도 로그인 화면을 보여주지 않고 익명 UID를 부여합니다.
 * 같은 브라우저에서는 Firebase Auth가 UID를 유지합니다.
 */
export async function ensureAnonymousFirebaseUser() {
  if (!firebaseAuth) return null;

  await firebaseAuth.authStateReady();
  if (firebaseAuth.currentUser) return firebaseAuth.currentUser;

  await setPersistence(firebaseAuth, browserLocalPersistence);
  const result = await signInAnonymously(firebaseAuth);
  return result.user;
}
