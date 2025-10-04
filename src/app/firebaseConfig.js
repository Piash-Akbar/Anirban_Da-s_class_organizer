// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCnC0PIIObZmyjA71QcuvKWBAgDOdR7ZWs",
  authDomain: "music-class-organizer.firebaseapp.com",
  projectId: "music-class-organizer",
  storageBucket: "music-class-organizer.firebasestorage.app",
  messagingSenderId: "58811528949",
  appId: "1:58811528949:web:2d70afe79536d988ec77bc",
  measurementId: "G-XLSHQT4D98",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
