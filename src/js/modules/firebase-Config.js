import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  sendEmailVerification,
  signInWithPopup,
  getRedirectResult,
  FacebookAuthProvider,
  GoogleAuthProvider,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
} from 'firebase/firestore/lite';

import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyA98uniRsm9RWCyTgE6RdWDF6tVgPqCccw',
  authDomain: 'vetcat-2880a.firebaseapp.com',
  databaseURL: 'https://vetcat-2880a-default-rtdb.firebaseio.com',
  projectId: 'vetcat-2880a',
  storageBucket: 'vetcat-2880a.appspot.com',
  messagingSenderId: '738330368561',
  appId: '1:738330368561:web:29c125cd7cfb0dda67d310',
  measurementId: 'G-3Y0WBP9XT8',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const firebaseApp = initializeApp(firebaseConfig);

export { firebaseApp, db, auth, signInWithEmailAndPassword };
