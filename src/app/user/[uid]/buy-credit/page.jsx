"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
} from "firebase/firestore";
import { getAuth, signOut } from "firebase/auth";

import Image from "next/image";
import { db, auth} from "../../../firebaseConfig";

// const firebaseConfig = {
//   apiKey: "AIzaSyCnC0PIIObZmyjA71QcuvKWBAgDOdR7ZWs",
//   authDomain: "music-class-organizer.firebaseapp.com",
//   projectId: "music-class-organizer",
//   storageBucket: "music-class-organizer.firebasestorage.app",
//   messagingSenderId: "58811528949",
//   appId: "1:58811528949:web:2d70afe79536d988ec77bc",
//   measurementId: "G-XLSHQT4D98",
// };

// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);
// const auth = getAuth(app);

export default function BuyCreditPage() {
  const { uid } = useParams();
  const router = useRouter();

  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!amount || !message) {
      alert("Please fill all fields.");
      return;
    }

    try {
      await addDoc(collection(db, "creditRequests"), {
        targetUserId: uid,
        amount,
        message,
        status: "pending",
        createdAt: new Date().toISOString(),
      });
      alert("Credit request sent to admin.");
      router.push(`/user/${uid}`);
    } catch (error) {
      console.error("Error submitting credit request:", error);
      alert("Failed to submit request.");
    }
  }

  async function handleLogout() {
    await signOut(auth);
    router.push("/");
  }

  return (

    <div className="relative ">
      <div className="absolute inset-0 bg-[url('/background.jpg')] bg-cover bg-center opacity-30"></div>

      <div className="relative z-10 opacity-90">



    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-8">
      <button
        onClick={handleLogout}
        className="absolute top-5 right-5 bg-red-600 px-4 py-2 rounded"
      >
        Logout
      </button>

      <h1 className="text-2xl font-bold mb-6">Buy Class-es Request</h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 bg-gray-800 p-6 rounded-lg w-full max-w-md"
      >
        <input
          type="number"
          placeholder="Number of class you want to pay for"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="p-2 rounded border"
        />
        <textarea
          placeholder="Paste your proof of payment here"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="p-2 rounded border"
        />
          <Image
            src="/qr_code.jpeg"
            alt="Logo"
            width={200}
            height={200}
            className="mx-auto"
          />
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 hover:cursor-pointer px-4 py-2 rounded font-bold"
        >
          Submit Request
        </button>
        <button
          onClick={() => router.push(`/user/${uid}`)}
          className="bg-red-500 hover:bg-red-600 hover:cursor-pointer px-4 py-2 rounded font-bold"
        >
          Cancel
        </button>
      </form>
    </div>
    </div>
    </div>
  );
}
