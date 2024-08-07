// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCGN2b8VZIvUCYa-f9Z3iz2nyZQTyhBBUs",
  authDomain: "coastal-dental-health-staffing.firebaseapp.com",
  projectId: "coastal-dental-health-staffing",
  storageBucket: "coastal-dental-health-staffing.appspot.com",
  messagingSenderId: "984843729525",
  appId: "1:984843729525:web:b09afe2b2e6948dd5b563c",
  measurementId: "G-D3KKHM0ZD5"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
