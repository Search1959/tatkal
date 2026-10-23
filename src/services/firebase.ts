import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  getDocFromServer,
  query, 
  orderBy, 
  enableIndexedDbPersistence
} from 'firebase/firestore';
import { 
  getAuth, 
  signInAnonymously, 
  onAuthStateChanged, 
  User, 
  signInWithCustomToken 
} from 'firebase/auth';
import configJson from '../../firebase-applet-config.json';
import { Passenger, SavedJourney, AlertNotification } from '../types';

const firebaseConfig = {
  apiKey: configJson.apiKey,
  authDomain: configJson.authDomain,
  projectId: configJson.projectId,
  storageBucket: configJson.storageBucket,
  messagingSenderId: configJson.messagingSenderId,
  appId: configJson.appId,
  measurementId: configJson.measurementId
};

// Initialize App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with configured databaseId
export const db = configJson.firestoreDatabaseId && configJson.firestoreDatabaseId !== '(default)'
  ? getFirestore(app, configJson.firestoreDatabaseId)
  : getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

// Connection test
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (err: unknown) {
    // If permission denied or not found, it still proves internet network connection to the server
    if (err instanceof Error && !err.message.includes('the client is offline')) {
      return true;
    }
    console.warn('Firestore connection check:', err);
    return false;
  }
}

// User session management across devices
export function initAuthSession(onUserChange: (user: User | null) => void): () => void {
  // Listen to auth changes
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (user) {
      onUserChange(user);
    } else {
      // Auto-authenticate anonymously if no active user session
      try {
        const cred = await signInAnonymously(auth);
        onUserChange(cred.user);
      } catch (e) {
        console.error('Anonymous auth failed:', e);
        onUserChange(null);
      }
    }
  });

  return unsubscribe;
}

// Real-time Cloud Subscriptions
export function subscribeCloudPassengers(userId: string, callback: (passengers: Passenger[]) => void) {
  const colRef = collection(db, 'users', userId, 'passengers');
  return onSnapshot(colRef, (snapshot) => {
    const list: Passenger[] = [];
    snapshot.forEach(docSnap => {
      list.push(docSnap.data() as Passenger);
    });
    callback(list);
  }, (err) => {
    console.warn('Error subscribing to cloud passengers:', err);
  });
}

export async function saveCloudPassenger(userId: string, passenger: Passenger) {
  const docRef = doc(db, 'users', userId, 'passengers', passenger.id);
  await setDoc(docRef, { ...passenger, userId }, { merge: true });
}

export async function deleteCloudPassenger(userId: string, passengerId: string) {
  const docRef = doc(db, 'users', userId, 'passengers', passengerId);
  await deleteDoc(docRef);
}

export function subscribeCloudJourneys(userId: string, callback: (journeys: SavedJourney[]) => void) {
  const colRef = collection(db, 'users', userId, 'journeys');
  return onSnapshot(colRef, (snapshot) => {
    const list: SavedJourney[] = [];
    snapshot.forEach(docSnap => {
      list.push(docSnap.data() as SavedJourney);
    });
    callback(list);
  }, (err) => {
    console.warn('Error subscribing to cloud journeys:', err);
  });
}

export async function saveCloudJourney(userId: string, journey: SavedJourney) {
  const docRef = doc(db, 'users', userId, 'journeys', journey.id);
  await setDoc(docRef, { ...journey, userId }, { merge: true });
}

export async function deleteCloudJourney(userId: string, journeyId: string) {
  const docRef = doc(db, 'users', userId, 'journeys', journeyId);
  await deleteDoc(docRef);
}

export function subscribeCloudAlerts(userId: string, callback: (alerts: AlertNotification[]) => void) {
  const colRef = collection(db, 'users', userId, 'alerts');
  return onSnapshot(colRef, (snapshot) => {
    const list: AlertNotification[] = [];
    snapshot.forEach(docSnap => {
      list.push(docSnap.data() as AlertNotification);
    });
    callback(list);
  }, (err) => {
    console.warn('Error subscribing to cloud alerts:', err);
  });
}

export async function saveCloudAlert(userId: string, alert: AlertNotification) {
  const docRef = doc(db, 'users', userId, 'alerts', alert.id);
  await setDoc(docRef, { ...alert, userId }, { merge: true });
}

export async function dismissCloudAlert(userId: string, alertId: string) {
  const docRef = doc(db, 'users', userId, 'alerts', alertId);
  await setDoc(docRef, { status: 'DISMISSED' }, { merge: true });
}
