import { initializeApp, getApps } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyCGN2b8v2IvUCYa-f9Z3iz2nyZQTyhBBUs",
  authDomain: "coastal-dental-health-staffing.firebaseapp.com",
  projectId: "coastal-dental-health-staffing",
  storageBucket: "coastal-dental-health-staffing.appspot.com",
  messagingSenderId: "984843729525",
  appId: "1:984843729525:web:b09afe2b2e6948dd5b563c",
  measurementId: "G-D3KKHM0ZD5"
};

// Initialize Firebase if it hasn't been initialized already
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0]; // use the already initialized app
}

// Use initializeAuth to ensure auth state persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
