import { 
  db, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  addDoc, 
  serverTimestamp 
} from './firebase';

export interface FirestoreUserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  phoneNumber?: string | null;
  createdAt?: any;
  updatedAt?: any;
}

export interface FirestoreFamilyMember {
  id?: string;
  name: string;
  relation: string;
  age: number;
  gender: string;
  bloodGroup: string;
  height: string;
  weight: string;
  bmi: string;
  bp: string;
  sugar: string;
  primaryDoctor: string;
  allergies: string[];
  chronicConditions: string[];
  createdAt?: any;
}

export interface FirestorePrescription {
  id?: string;
  patientId: string;
  patientName: string;
  doctorName: string;
  medicines: Array<{
    name: string;
    dosage: string;
    timing: string;
    foodInstructions?: string;
    warnings?: string;
  }>;
  summaryText?: string;
  createdAt?: any;
}

export interface FirestoreLabReport {
  id?: string;
  patientId: string;
  patientName: string;
  testType: string;
  biomarkers: Array<{
    name: string;
    value: string;
    unit?: string;
    status: 'NORMAL' | 'ELEVATED' | 'LOW' | 'CRITICAL';
    referenceRange?: string;
  }>;
  summaryText?: string;
  createdAt?: any;
}

// User Profile Operations
export const saveUserProfile = async (user: FirestoreUserProfile): Promise<void> => {
  try {
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, {
      ...user,
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp()
    }, { merge: true });
  } catch (err) {
    console.warn('Firestore saveUserProfile fallback:', err);
  }
};

export const getUserProfile = async (uid: string): Promise<FirestoreUserProfile | null> => {
  try {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data() as FirestoreUserProfile;
    }
    return null;
  } catch (err) {
    console.warn('Firestore getUserProfile fallback:', err);
    return null;
  }
};

// Family Members Operations
export const saveFamilyMember = async (userId: string, member: FirestoreFamilyMember): Promise<string> => {
  try {
    const memCollection = collection(db, 'users', userId, 'familyMembers');
    if (member.id) {
      const memDoc = doc(db, 'users', userId, 'familyMembers', member.id);
      await setDoc(memDoc, { ...member, updatedAt: serverTimestamp() }, { merge: true });
      return member.id;
    } else {
      const docRef = await addDoc(memCollection, { ...member, createdAt: serverTimestamp() });
      return docRef.id;
    }
  } catch (err) {
    console.warn('Firestore saveFamilyMember fallback:', err);
    return member.id || 'mem_' + Date.now();
  }
};

export const getFamilyMembers = async (userId: string): Promise<FirestoreFamilyMember[]> => {
  try {
    const memCollection = collection(db, 'users', userId, 'familyMembers');
    const snap = await getDocs(memCollection);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as FirestoreFamilyMember));
  } catch (err) {
    console.warn('Firestore getFamilyMembers fallback:', err);
    return [];
  }
};

// Prescription Operations
export const savePrescriptionToFirestore = async (userId: string, rx: FirestorePrescription): Promise<string> => {
  try {
    const rxCollection = collection(db, 'users', userId, 'prescriptions');
    const docRef = await addDoc(rxCollection, { ...rx, createdAt: serverTimestamp() });
    return docRef.id;
  } catch (err) {
    console.warn('Firestore savePrescription fallback:', err);
    return 'rx_' + Date.now();
  }
};

// Lab Report Operations
export const saveLabReportToFirestore = async (userId: string, report: FirestoreLabReport): Promise<string> => {
  try {
    const repCollection = collection(db, 'users', userId, 'reports');
    const docRef = await addDoc(repCollection, { ...report, createdAt: serverTimestamp() });
    return docRef.id;
  } catch (err) {
    console.warn('Firestore saveLabReport fallback:', err);
    return 'rep_' + Date.now();
  }
};
