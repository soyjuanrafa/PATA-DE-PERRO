/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Firebase Client Configuration and Initialization
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfigJson from '../../firebase-applet-config.json';

const env = ((import.meta as any)?.env) || {};

const apiKey = env.VITE_FIREBASE_API_KEY || firebaseConfigJson.apiKey;
const projectId = env.VITE_FIREBASE_PROJECT_ID || firebaseConfigJson.projectId;
const authDomain = env.VITE_FIREBASE_AUTH_DOMAIN || firebaseConfigJson.authDomain || (projectId ? `${projectId}.firebaseapp.com` : '');
const storageBucket = env.VITE_FIREBASE_STORAGE_BUCKET || firebaseConfigJson.storageBucket || (projectId ? `${projectId}.firebasestorage.app` : '');
const messagingSenderId = env.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseConfigJson.messagingSenderId || '';
const appId = env.VITE_FIREBASE_APP_ID || firebaseConfigJson.appId || '';

const firebaseConfig = {
  apiKey: apiKey || '',
  authDomain: authDomain || '',
  projectId: projectId || '',
  storageBucket: storageBucket || '',
  messagingSenderId: messagingSenderId || '',
  appId: appId || '',
};

// Initialize Firebase App singleton
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Cloud Firestore with specified database ID if present
const firestoreDbId = (firebaseConfigJson as any)?.firestoreDatabaseId;
export const db = firestoreDbId
  ? getFirestore(app, firestoreDbId)
  : getFirestore(app);

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  !firebaseConfig.apiKey.includes('YOUR_FIREBASE') &&
  firebaseConfig.projectId !== 'your-firebase-project-id'
);

