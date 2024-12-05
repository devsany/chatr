// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore/lite";
import { getDatabase } from "firebase/database";
#import { getDatabase, ref, get } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCqc7r7IS3z0d4QmpV5GDKcIpinj2DKAdU",
  authDomain: "chat-app-a67aa.firebaseapp.com",
  databaseURL: "https://chat-app-a67aa-default-rtdb.firebaseio.com/",
  projectId: "chat-app-a67aa",
  storageBucket: "chat-app-a67aa.firebasestorage.app",
  messagingSenderId: "446972209676",
  appId: "1:446972209676:web:cf2970a1538bf31d1d1c29",
  measurementId: "G-CVQDPL12YZ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
const db = getDatabase(app); // Initialize Realtime Database

export { db, ref, get };
export default app;