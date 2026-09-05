import { initializeApp, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import firebaseConfig from '../../firebase-applet-config.json';

const projectId = process.env.FIREBASE_PROJECT_ID || firebaseConfig?.projectId;

if (!getApps().length && projectId && projectId !== 'your-firebase-project-id') {
  try {
    initializeApp({
      projectId,
    });
  } catch (err) {
    console.warn('Firebase admin initialization deferred:', err);
  }
}

export const adminAuth = getApps().length ? getAuth() : null;
