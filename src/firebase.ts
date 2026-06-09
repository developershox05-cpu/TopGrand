import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

let app: any;
let db: any;
let auth: any;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app, firebaseConfig.firestoreDatabaseId || undefined);
  auth = getAuth(app);
} catch (error) {
  console.warn("Firebase initialization failed. Proceeding with robust local mock instances for stability:", error);
  // Fail-safe fallbacks so the app never goes blank/white
  app = {};
  db = {
    type: "mock-firestore",
    collection: () => ({
      doc: () => ({
        set: async () => {},
        get: async () => ({ exists: () => false, data: () => null })
      })
    })
  };
  auth = {
    type: "mock-auth",
    currentUser: null,
    onAuthStateChanged: (cb: any) => {
      cb(null);
      return () => {};
    }
  };
}

export { db, auth };

