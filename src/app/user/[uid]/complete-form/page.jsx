"use client";

import Navbar from "../../../navbar/navbar";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "../../../firebaseConfig";

export default function CompleteForm() {
  const router = useRouter();

  const handleFormRedirect = () => {
    window.location.href = 
      "https://docs.google.com/forms/d/1_tdk6BvpHvKqWZQhZJ-7D9i6GSC2fngkg3c62vyPYzc/viewform?edit_requested=true";
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (err) {
      console.error("Error logging out:", err);
      alert("Failed to log out: " + err.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="relative min-h-screen flex flex-col items-center justify-center text-center bg-gray-900">
        <div className="absolute inset-0 bg-[url('/background.jpg')] bg-cover bg-center opacity-30"></div>
        <div className="relative z-10 flex flex-col">
          <h1 className="text-4xl font-bold text-white mb-6">
            Dear {auth.currentUser.displayName}, Please Fill Out the Form before Proceeding
          </h1>
          <p className="text-white mb-4">
            To proceed, please fill out the registration form for Anirban Bhattacharjee&apos;s violin classes.
          </p>
          <button
            className="bg-yellow-600 m-4 hover:bg-yellow-700 hover:cursor-pointer px-6 py-3 rounded text-white font-bold"
            onClick={handleFormRedirect}
          >
            Fill Out the Form
          </button>
          <button
            className="bg-blue-600 m-4 hover:bg-blue-700 hover:cursor-pointer px-6 py-3 rounded text-white font-bold"
            onClick={handleLogout}
          >
            Log Out
          </button>
        </div>
      </div>
    </>
  );
}