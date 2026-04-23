import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAri_gXnIyC2wN9OE03HeZBy4X9cbGB8xE",
  authDomain: "braindrop-189fa.firebaseapp.com",
  projectId: "braindrop-189fa",
  storageBucket: "braindrop-189fa.firebasestorage.app",
  messagingSenderId: "556094776798",
  appId: "1:556094776798:web:4a910f8a43e6d2a053694f",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
