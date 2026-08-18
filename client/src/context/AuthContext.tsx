import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  type FirebaseUser, 
  RecaptchaVerifier, 
  signInWithPhoneNumber, 
  type ConfirmationResult 
} from '../services/firebase';
import { saveUserProfile } from '../services/firestoreService';

interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  phoneNumber?: string | null;
}

interface AuthContextType {
  token: string | null;
  user: UserProfile | null;
  login: (token: string, user?: UserProfile) => void;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<{ success: boolean; user?: UserProfile; error?: string }>;
  loginWithEmail: (email: string, pass: string) => Promise<{ success: boolean; user?: UserProfile; error?: string }>;
  signupWithEmail: (email: string, pass: string) => Promise<{ success: boolean; user?: UserProfile; error?: string }>;
  sendPhoneOtp: (phoneNumber: string, appVerifierContainerId: string) => Promise<{ success: boolean; error?: string }>;
  verifyPhoneOtp: (verificationCode: string) => Promise<{ success: boolean; user?: UserProfile; error?: string }>;
  loginAsGuest: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const isRealFirebaseConfigured = (): boolean => {
  const key = import.meta.env.VITE_FIREBASE_API_KEY;
  return Boolean(key && !key.includes('Dummy') && key.startsWith('AIzaSy') && key.length > 20);
};

const formatFirebaseAuthError = (error: any): string => {
  const code = error?.code || '';
  const message = error?.message || '';

  if (message.includes('reCAPTCHA client element has been removed')) {
    return 'reCAPTCHA refreshed. Please click "Send SMS Verification Code" again.';
  }

  switch (code) {
    case 'auth/invalid-email':
      return 'Invalid email address format.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please verify your credentials.';
    case 'auth/email-already-in-use':
      return 'An account already exists with this email address. Please sign in instead.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters long.';
    case 'auth/popup-closed-by-user':
      return 'Google sign-in was canceled before completion.';
    case 'auth/unauthorized-domain':
      return 'This domain is not authorized for OAuth operations in Firebase Console.';
    case 'auth/invalid-phone-number':
      return 'Please enter a valid phone number with country code (e.g. +91 8604994330).';
    case 'auth/invalid-verification-code':
      return 'Invalid 6-digit SMS verification code.';
    case 'auth/code-expired':
      return 'Verification code has expired. Please request a new code.';
    case 'auth/too-many-requests':
      return 'Too many SMS requests sent to this number. Please wait or use test number in Firebase Console.';
    case 'auth/quota-exceeded':
      return 'SMS quota exceeded for project. Please enable billing or add a test phone number in Firebase Console.';
    case 'auth/operation-not-allowed':
      return 'Phone Authentication is not enabled in Firebase Console. Go to Build > Authentication > Sign-in method > Phone to enable.';
    default:
      return message || 'Authentication failed. Please check your credentials and try again.';
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('vv_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);
  const [phoneConfirmation, setPhoneConfirmation] = useState<ConfirmationResult | null>(null);

  // Sync real Firebase auth state if active
  useEffect(() => {
    try {
      const unsubscribe = onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
        if (fbUser) {
          try {
            const userToken = await fbUser.getIdToken();
            const profile: UserProfile = {
              uid: fbUser.uid,
              email: fbUser.email,
              displayName: fbUser.displayName || (fbUser.phoneNumber ? `Patient (${fbUser.phoneNumber})` : 'Patient'),
              photoURL: fbUser.photoURL,
              phoneNumber: fbUser.phoneNumber
            };
            setToken(userToken);
            setUser(profile);
            localStorage.setItem('token', userToken);
            localStorage.setItem('vv_user', JSON.stringify(profile));

            // Firestore profile sync
            await saveUserProfile({
              uid: fbUser.uid,
              email: fbUser.email,
              displayName: profile.displayName,
              phoneNumber: fbUser.phoneNumber
            });
          } catch (e) {
            console.warn('Firebase user sync notice:', e);
          }
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } catch {
      setLoading(false);
    }
  }, []);

  const login = (newToken: string, profile?: UserProfile) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
    if (profile) {
      setUser(profile);
      localStorage.setItem('vv_user', JSON.stringify(profile));
    }
  };

  const logout = async () => {
    try {
      if (isRealFirebaseConfigured()) {
        await signOut(auth);
      }
    } catch (e) {
      console.warn('Firebase signOut notice:', e);
    }
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('vv_user');
  };

  // Google Sign-In
  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      const idToken = await fbUser.getIdToken();
      const profile: UserProfile = {
        uid: fbUser.uid,
        email: fbUser.email,
        displayName: fbUser.displayName || 'Google User',
        photoURL: fbUser.photoURL,
        phoneNumber: fbUser.phoneNumber
      };
      login(idToken, profile);
      return { success: true, user: profile };
    } catch (err: any) {
      console.warn('Firebase Google Auth error:', err);
      return { success: false, error: formatFirebaseAuthError(err) };
    }
  };

  // Email & Password Login
  const loginWithEmail = async (email: string, pass: string) => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, pass);
      const fbUser = res.user;
      const idToken = await fbUser.getIdToken();
      const profile: UserProfile = {
        uid: fbUser.uid,
        email: fbUser.email,
        displayName: fbUser.displayName || email.split('@')[0],
        photoURL: fbUser.photoURL,
        phoneNumber: fbUser.phoneNumber
      };
      login(idToken, profile);
      return { success: true, user: profile };
    } catch (err: any) {
      console.warn('Firebase Email Login error:', err);
      return { success: false, error: formatFirebaseAuthError(err) };
    }
  };

  // Email & Password Registration
  const signupWithEmail = async (email: string, pass: string) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      const fbUser = res.user;
      const idToken = await fbUser.getIdToken();
      const profile: UserProfile = {
        uid: fbUser.uid,
        email: fbUser.email,
        displayName: email.split('@')[0],
        photoURL: fbUser.photoURL,
        phoneNumber: fbUser.phoneNumber
      };
      login(idToken, profile);
      return { success: true, user: profile };
    } catch (err: any) {
      console.warn('Firebase Signup error:', err);
      return { success: false, error: formatFirebaseAuthError(err) };
    }
  };

  // Robust Phone Number OTP Authentication
  const sendPhoneOtp = async (phoneNumber: string, appVerifierContainerId: string) => {
    try {
      // Clear any prior reCAPTCHA instance to prevent "element has been removed" errors
      if ((window as any).recaptchaVerifier) {
        try {
          (window as any).recaptchaVerifier.clear();
        } catch {}
        (window as any).recaptchaVerifier = null;
      }

      // Initialize fresh invisible reCAPTCHA
      const appVerifier = new RecaptchaVerifier(auth, appVerifierContainerId, {
        size: 'invisible',
        callback: () => {
          // reCAPTCHA solved
        },
        'expired-callback': () => {
          console.warn('reCAPTCHA expired, resetting...');
        }
      });
      (window as any).recaptchaVerifier = appVerifier;

      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setPhoneConfirmation(confirmation);
      return { success: true };
    } catch (err: any) {
      console.warn('Firebase Phone OTP error:', err);
      // Clean up stale verifier
      try {
        if ((window as any).recaptchaVerifier) {
          (window as any).recaptchaVerifier.clear();
          (window as any).recaptchaVerifier = null;
        }
      } catch {}
      return { success: false, error: formatFirebaseAuthError(err) };
    }
  };

  const verifyPhoneOtp = async (verificationCode: string) => {
    if (!phoneConfirmation) {
      return { success: false, error: 'No active SMS verification session. Please request a new code.' };
    }

    try {
      const res = await phoneConfirmation.confirm(verificationCode);
      const fbUser = res.user;
      const idToken = await fbUser.getIdToken();
      const profile: UserProfile = {
        uid: fbUser.uid,
        email: null,
        displayName: `Patient (${fbUser.phoneNumber || 'Verified'})`,
        photoURL: null,
        phoneNumber: fbUser.phoneNumber
      };
      login(idToken, profile);
      return { success: true, user: profile };
    } catch (err: any) {
      console.warn('Firebase Phone verify error:', err);
      return { success: false, error: formatFirebaseAuthError(err) };
    }
  };

  // 1-Click Guest Pass
  const loginAsGuest = () => {
    const profile: UserProfile = {
      uid: 'guest-' + Date.now(),
      email: 'guest.patient@vaidyavaani.health',
      displayName: 'Guest Patient',
      photoURL: null
    };
    login('vv_guest_jwt_' + Date.now(), profile);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        token, 
        user, 
        login, 
        logout, 
        loginWithGoogle, 
        loginWithEmail, 
        signupWithEmail, 
        sendPhoneOtp, 
        verifyPhoneOtp, 
        loginAsGuest,
        isAuthenticated: !!token, 
        loading 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
