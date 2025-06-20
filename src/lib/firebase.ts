import { initializeApp, getApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

// These variables are typically injected by Firebase Studio or a similar environment.
// In a standard Next.js app, you'd use environment variables (e.g., process.env.NEXT_PUBLIC_FIREBASE_CONFIG).
declare global {
  var __app_id: string | undefined;
  var __firebase_config: string | undefined;
  var __initial_auth_token: string | undefined;
}

const firebaseConfigString = typeof __firebase_config !== 'undefined' 
  ? __firebase_config 
  : process.env.NEXT_PUBLIC_FIREBASE_CONFIG;

let firebaseConfig = {};
if (firebaseConfigString) {
  try {
    firebaseConfig = JSON.parse(firebaseConfigString);
  } catch (e) {
    console.error("Failed to parse Firebase config:", e);
    // Provide a default minimal config to prevent crashes if JSON is malformed or missing
    // You should replace this with your actual configuration
    firebaseConfig = {
      apiKey: "YOUR_API_KEY",
      authDomain: "YOUR_AUTH_DOMAIN",
      projectId: "YOUR_PROJECT_ID",
      storageBucket: "YOUR_STORAGE_BUCKET",
      messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
      appId: "YOUR_APP_ID"
    };
  }
} else {
    console.warn("Firebase config not found. Using placeholder config. Please ensure your environment variables are set.");
    firebaseConfig = {
      apiKey: "YOUR_API_KEY",
      authDomain: "YOUR_AUTH_DOMAIN",
      projectId: "YOUR_PROJECT_ID",
      storageBucket: "YOUR_STORAGE_BUCKET",
      messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
      appId: "YOUR_APP_ID"
    };
}

const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

const appId: string = typeof __app_id !== 'undefined' 
  ? __app_id 
  : process.env.NEXT_PUBLIC_APP_ID || 'default-app-id';

const initialAuthToken: string | null = typeof __initial_auth_token !== 'undefined' 
  ? __initial_auth_token 
  : process.env.NEXT_PUBLIC_INITIAL_AUTH_TOKEN || null;


export { app, auth, db, appId, initialAuthToken };

export interface Property {
  id: string;
  type: 'buy' | 'rent';
  name: string;
  address: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  description: string;
  imageUrls: string[];
  dataAiHint?: string; // Optional for AI hints on images
}
