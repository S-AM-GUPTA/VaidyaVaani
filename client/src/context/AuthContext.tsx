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
  isAuthenticated: boolean;
  loading: boolean;
}

const formatFirebaseAuthError = (error: any): string => {
  const code = error?.code || '';
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
      return 'Please enter a valid phone number with country code (e.g. +91 9876543210).';
    case 'auth/invalid-verification-code':
      return 'Invalid 6-digit SMS verification code.';
    case 'auth/code-expired':
      return 'Verification code has expired. Please request a new code.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Access temporarily blocked. Please try again later.';
    case 'auth/api-key-not-valid':
    case 'auth/invalid-api-key':
      return 'Invalid Firebase API Key. Please verify your web credentials in client/.env.';
    default:
      return error?.message || 'Authentication failed. Please check your credentials and try again.';
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

  // Sync real Firebase auth state & Firestore profile
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        try {
          const userToken = await fbUser.getIdToken();
          const profile: UserProfile = {
            uid: fbUser.uid,
            email: fbUser.email,
            displayName: fbUser.displayName || (fbUser.email ? fbUser.email.split('@')[0] : 'Patient'),
            photoURL: fbUser.photoURL,
            phoneNumber: fbUser.phoneNumber
          };
          setToken(userToken);
          setUser(profile);
          localStorage.setItem('token', userToken);
          localStorage.setItem('vv_user', JSON.stringify(profile));

          // Real Firestore sync
          await saveUserProfile({
            uid: fbUser.uid,
            email: fbUser.email,
            displayName: profile.displayName,
            phoneNumber: fbUser.phoneNumber
          });
        } catch (e) {
          console.error('Error syncing real Firebase user profile:', e);
        }
      } else {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('vv_user');
      }
      setLoading(false);
    });

    return () => unsubscribe();
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
      await signOut(auth);
    } catch (e) {
      console.error('Firebase signOut error:', e);
    }
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('vv_user');
  };

  // Real Google Sign-In via Firebase Auth
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
      console.error('Real Firebase Google Auth error:', err);
      return { success: false, error: formatFirebaseAuthError(err) };
    }
  };

  // Real Email & Password Login
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
      console.error('Real Firebase Email Login error:', err);
      return { success: false, error: formatFirebaseAuthError(err) };
    }
  };

  // Real Email & Password Registration
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
      console.error('Real Firebase Signup error:', err);
      return { success: false, error: formatFirebaseAuthError(err) };
    }
  };

  // Real Phone Number OTP Auth
  const sendPhoneOtp = async (phoneNumber: string, appVerifierContainerId: string) => {
    try {
      let recaptchaVerifier = (window as any).recaptchaVerifier;
      if (!recaptchaVerifier) {
        recaptchaVerifier = new RecaptchaVerifier(auth, appVerifierContainerId, {
          size: 'invisible'
        });
        (window as any).recaptchaVerifier = recaptchaVerifier;
      }

      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
      setPhoneConfirmation(confirmation);
      return { success: true };
    } catch (err: any) {
      console.error('Real Firebase Phone OTP dispatch error:', err);
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
        displayName: 'Phone User (' + (fbUser.phoneNumber || 'Verified') + ')',
        photoURL: null,
        phoneNumber: fbUser.phoneNumber
      };
      login(idToken, profile);
      return { success: true, user: profile };
    } catch (err: any) {
      console.error('Real Firebase Phone OTP verification error:', err);
      return { success: false, error: formatFirebaseAuthError(err) };
    }
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
