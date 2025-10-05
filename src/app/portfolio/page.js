"use client";

import { useEffect, useState } from "react";
import Navbar from "../navbar/navbar";
import { useRouter } from "next/navigation";
import { auth, db } from "../firebaseConfig";
import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default function LandingPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);

        // Create profile if not exists
        const userRef = doc(db, "users", firebaseUser.uid);
        const docSnap = await getDoc(userRef);
        if (!docSnap.exists()) {
          await setDoc(userRef, {
            uid: firebaseUser.uid,
            email: firebaseUser.email || "N/A",
            displayName: firebaseUser.displayName || "Organizer User",
            photoURL: firebaseUser.photoURL || "",
            role: "user",
            createdAt: new Date().toISOString()
          });
        }

        // Redirect to user page
        router.push(`/user/${firebaseUser.uid}`);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  if (loading) return <div className="p-8 text-white">Loading...</div>;

  return (
    <>
      <Navbar />

    <div className="relative min-h-screen flex flex-col items-center justify-center text-center bg-gray-900">

    <div className="absolute inset-0 bg-[url('/background.jpg')] bg-cover bg-center opacity-30"></div>

    <div className="relative z-10">
      <h1 className="text-4xl font-bold bg-amber-600 text-gray-800 p-4 rounded-2xl mb-6">Welcome to "No Violin only Violance"</h1>
      <button
        onClick={handleLogin}
        className="bg-blue-600 hover:bg-blue-700 hover:cursor-pointer px-6 py-3 rounded text-white font-bold"
        >
        Login with Google
      </button>
    </div>

    </div>

        </>

  );
}
