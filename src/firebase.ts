import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 

const firebaseConfig = {
    apiKey: "AIzaSyDDXdrh12SOXA8yh3Iqc7CxgllP8C0FRrw",
    authDomain: "movietracker-497c0.firebaseapp.com",
    projectId: "movietracker-497c0",
    storageBucket: "movietracker-497c0.firebasestorage.app",
    messagingSenderId: "351525842036",
    appId: "1:351525842036:web:22423d6d4e0bc4b6cb3521",
    measurementId: "G-K7CH380PZ2"
};

export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app); 