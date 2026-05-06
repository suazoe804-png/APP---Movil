import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

// Simple anonymous sign-in for internal use cases to satisfy Security Rules.
export const authenticateUser = async () => {
  try {
    await signInAnonymously(auth);
  } catch (error) {
    console.error('Auth error:', error);
  }
};
