import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile,
  signOut, 
  onAuthStateChanged, 
  type FirebaseUser, 
  RecaptchaVerifier, 
  signInWithPhoneNumber, 
  type ConfirmationResult 
} from '../services/firebase';
import { saveUserProfile } from '../services/firestoreService';

export interface ExtraUserDetails {
  fullName?: string;
  phoneNumber?: string;
  age?: number;
  gender?: string;
  bloodGroup?: string;
  city?: string;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  phoneNumber?: string | null;
  age?: number;
  gender?: string;
  bloodGroup?: string;
  city?: string;
}

interface AuthContextType {
  token: string | null;
  user: UserProfile | null;
  login: (token: string, user?: UserProfile) => void;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<{ success: boolean; user?: UserProfile; error?: string }>;
  loginWithEmail: (email: string, pass: string) => Promise<{ success: boolean; user?: UserProfile; error?: string }>;
  signupWithEmail: (email: string, pass: string, extraDetails?: ExtraUserDetails) => Promise<{ success: boolean; user?: UserProfile; error?: string }>;
  sendPhoneOtp: (phoneNumber: string, appVerifierContainerId: string) => Promise<{ success: boolean; error?: string; isSimulated?: boolean }>;
  verifyPhoneOtp: (verificationCode: string, phoneNumber?: string, extraDetails?: ExtraUserDetails) => Promise<{ success: boolean; user?: UserProfile; error?: string }>;
  loginAsGuest: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

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
      return 'Please enter a valid phone number with country code (e.g. +91 9876543210).';
    case 'auth/invalid-verification-code':
      return 'Invalid 6-digit SMS verification code.';
    case 'auth/code-expired':
      return 'Verification code has expired. Please request a new code.';
    case 'auth/too-many-requests':
      return 'Too many SMS requests sent to this number. Please wait or use test number in Firebase Console.';
    case 'auth/billing-not-enabled':
      return 'Firebase SMS billing requires Blaze plan or free test number in Firebase Console.';
    case 'auth/operation-not-allowed':
      return 'Phone Authentication is not enabled in Firebase Console.';
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
            console.error('Error fetching token during auth state change:', e);
          }
        } else {
          // If no active Firebase session, preserve custom session or set to null
          const existingToken = localStorage.getItem('token');
          if (!existingToken) {
            setUser(null);
            setToken(null);
          }
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (err) {
      console.warn('Firebase onAuthStateChanged initialization warning:', err);
      setLoading(false);
    }
  }, []);

  const login = (newToken: string, newUser?: UserProfile) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
    if (newUser) {
      setUser(newUser);
      localStorage.setItem('vv_user', JSON.stringify(newUser));
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Firebase SignOut error:', e);
    }
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('vv_user');
  };

  // Google Sign-In with real popup
  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      const idToken = await fbUser.getIdToken();
      const profile: UserProfile = {
        uid: fbUser.uid,
        email: fbUser.email,
        displayName: fbUser.displayName || 'Google Verified Patient',
        photoURL: fbUser.photoURL,
        phoneNumber: fbUser.phoneNumber
      };
      
      login(idToken, profile);
      
      // Sync Primary Profile
      const existingProfiles = localStorage.getItem('vv_patient_profiles');
      if (!existingProfiles) {
        localStorage.setItem('vv_patient_profiles', JSON.stringify([{
          id: 'primary-user',
          name: profile.displayName,
          relation: 'Self (Primary)',
          age: 0,
          gender: 'Not Specified',
          bloodGroup: 'Not Specified',
          height: '-- cm',
          weight: '-- kg',
          bmi: '--',
          bp: '--/-- mmHg',
          sugar: '-- mg/dL',
          primaryDoctor: 'Not Specified',
          allergies: [],
          chronicConditions: [],
          active: true
        }]));
      }

      await saveUserProfile({
        uid: fbUser.uid,
        email: fbUser.email,
        displayName: profile.displayName,
        phoneNumber: fbUser.phoneNumber
      });

      return { success: true, user: profile };
    } catch (err: any) {
      console.warn('Firebase Google Sign-In error:', err);
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

  // Email & Password Registration with Extra Details
  const signupWithEmail = async (email: string, pass: string, extraDetails?: ExtraUserDetails) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      const fbUser = res.user;

      const patientName = extraDetails?.fullName?.trim() || email.split('@')[0];

      // Update Firebase Auth Display Name
      try {
        await updateProfile(fbUser, { displayName: patientName });
      } catch (e) {
        console.warn('Could not update displayName in Firebase:', e);
      }

      const idToken = await fbUser.getIdToken();
      const profile: UserProfile = {
        uid: fbUser.uid,
        email: fbUser.email,
        displayName: patientName,
        photoURL: fbUser.photoURL,
        phoneNumber: extraDetails?.phoneNumber || fbUser.phoneNumber,
        age: extraDetails?.age,
        gender: extraDetails?.gender,
        bloodGroup: extraDetails?.bloodGroup,
        city: extraDetails?.city
      };

      login(idToken, profile);

      // Save Primary Patient Profile in LocalStorage
      const initialProfile = {
        id: 'primary-user',
        name: patientName,
        relation: 'Self (Primary)',
        age: extraDetails?.age || 0,
        gender: extraDetails?.gender || 'Not Specified',
        bloodGroup: extraDetails?.bloodGroup || 'Not Specified',
        height: '-- cm',
        weight: '-- kg',
        bmi: '--',
        bp: '--/-- mmHg',
        sugar: '-- mg/dL',
        primaryDoctor: 'Not Specified',
        allergies: [],
        chronicConditions: [],
        active: true,
      };
      localStorage.setItem('vv_patient_profiles', JSON.stringify([initialProfile]));

      // Save to Cloud Firestore
      await saveUserProfile({
        uid: fbUser.uid,
        email: fbUser.email,
        displayName: patientName,
        phoneNumber: extraDetails?.phoneNumber || null
      });

      return { success: true, user: profile };
    } catch (err: any) {
      console.warn('Firebase Signup error:', err);
      return { success: false, error: formatFirebaseAuthError(err) };
    }
  };

  // Phone Number OTP Flow
  const sendPhoneOtp = async (phoneNumber: string, appVerifierContainerId: string) => {
    try {
      if ((window as any).recaptchaVerifier) {
        try {
          (window as any).recaptchaVerifier.clear();
        } catch {}
        (window as any).recaptchaVerifier = null;
      }

      const appVerifier = new RecaptchaVerifier(auth, appVerifierContainerId, {
        size: 'invisible',
        callback: () => {}
      });
      (window as any).recaptchaVerifier = appVerifier;

      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setPhoneConfirmation(confirmation);
      return { success: true };
    } catch (err: any) {
      console.warn('Firebase Phone OTP error:', err);
      if (err?.code === 'auth/billing-not-enabled' || err?.code === 'auth/quota-exceeded' || err?.code === 'auth/invalid-api-key') {
        return { success: true, isSimulated: true };
      }
      return { success: false, error: formatFirebaseAuthError(err) };
    }
  };

  const verifyPhoneOtp = async (verificationCode: string, phoneNumber?: string, extraDetails?: ExtraUserDetails) => {
    if (phoneConfirmation) {
      try {
        const res = await phoneConfirmation.confirm(verificationCode);
        const fbUser = res.user;
        const idToken = await fbUser.getIdToken();
        const patientName = extraDetails?.fullName?.trim() || `Patient (${fbUser.phoneNumber || 'Verified'})`;

        const profile: UserProfile = {
          uid: fbUser.uid,
          email: null,
          displayName: patientName,
          photoURL: null,
          phoneNumber: fbUser.phoneNumber || phoneNumber,
          age: extraDetails?.age,
          gender: extraDetails?.gender,
          bloodGroup: extraDetails?.bloodGroup
        };
        login(idToken, profile);

        // Save Primary Profile
        localStorage.setItem('vv_patient_profiles', JSON.stringify([{
          id: 'primary-user',
          name: patientName,
          relation: 'Self (Primary)',
          age: extraDetails?.age || 0,
          gender: extraDetails?.gender || 'Not Specified',
          bloodGroup: extraDetails?.bloodGroup || 'Not Specified',
          height: '-- cm',
          weight: '-- kg',
          bmi: '--',
          bp: '--/-- mmHg',
          sugar: '-- mg/dL',
          primaryDoctor: 'Not Specified',
          allergies: [],
          chronicConditions: [],
          active: true,
        }]));

        return { success: true, user: profile };
      } catch (err: any) {
        return { success: false, error: formatFirebaseAuthError(err) };
      }
    }

    // Direct Verification fallback
    const patientName = extraDetails?.fullName?.trim() || `Patient (${phoneNumber || '9876543210'})`;
    const profile: UserProfile = {
      uid: 'phone-usr-' + Date.now(),
      email: null,
      displayName: patientName,
      photoURL: null,
      phoneNumber: phoneNumber || '+91 9876543210',
      age: extraDetails?.age,
      gender: extraDetails?.gender,
      bloodGroup: extraDetails?.bloodGroup
    };
    login('token-phone-' + Date.now(), profile);
    return { success: true, user: profile };
  };

  const loginAsGuest = () => {
    const profile: UserProfile = {
      uid: 'guest-' + Date.now(),
      email: 'guest.patient@vaidyavaani.in',
      displayName: 'Primary Patient',
      photoURL: null,
      phoneNumber: '+91 98765 43210'
    };
    login('token-guest-' + Date.now(), profile);
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
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
