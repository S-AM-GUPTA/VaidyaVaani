import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type ConfirmationResult
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  addDoc, 
  serverTimestamp,
  type Timestamp
} from 'firebase/firestore';

// Real Firebase configuration for project: vaidyavaani0
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCU-XVN7P9XLMvp7d6xwFN_saKOdYKFKoo",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "vaidyavaani0.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "vaidyavaani0",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "vaidyavaani0.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "151435989509",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:151435989509:web:3be60110c216460539c26c",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-2FERK4QY7G"
};

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Auth & Providers
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Initialize Cloud Firestore Database
const db = getFirestore(app);

export { 
  app,
  auth, 
  db, 
  googleProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  addDoc, 
  serverTimestamp
};

export type { FirebaseUser, ConfirmationResult, Timestamp };
