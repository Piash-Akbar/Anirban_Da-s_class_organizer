"use client";

import Navbar from "../navbar/navbar";
import { useRouter } from "next/navigation";

export default function CompleteForm() {
  const router = useRouter();

  const handleFormRedirect = () => {
    router.push(
      "https://docs.google.com/forms/d/1_tdk6BvpHvKqWZQhZJ-7D9i6GSC2fngkg3c62vyPYzc/viewform?edit_requested=true"
    );
  };

  return (
    <>
      <Navbar />
      <div className="relative min-h-screen flex flex-col items-center justify-center text-center bg-gray-900">
        <div className="absolute inset-0 bg-[url('/background.jpg')] bg-cover bg-center opacity-30"></div>
        <div className="relative z-10 flex flex-col">
          <h1 className="text-4xl font-bold text-white mb-6">
            Please Complete the Registration Form
          </h1>
          <p className="text-white mb-4">
            To proceed, please fill out the registration form for Anirban Bhattacharjee's violin classes.
          </p>
          <button
            className="bg-yellow-600 m-4 hover:bg-yellow-700 hover:cursor-pointer px-6 py-3 rounded text-white font-bold"
            onClick={handleFormRedirect}
          >
            Fill Out the Form
          </button>
        </div>
      </div>
    </>
  );
}