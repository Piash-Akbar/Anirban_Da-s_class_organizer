"use client";

import Navbar from "../../../navbar/navbar";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "../../../firebaseConfig";

export default function CompleteForm() {
  const router = useRouter();

  // Ensure currentUser is available before trying to access displayName
  const displayName = auth.currentUser?.displayName || "User"; 

  const handleFormRedirect = () => {
    // Open the form in a new tab for a better user experience
    window.open(
      "https://docs.google.com/forms/d/1_tdk6BvpHvKqWZQhZJ-7D9i6GSC2fngkg3c62vyPYzc/viewform?edit_requested=true",
      "_blank"
    );
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (err) {
      console.error("Error logging out:", err);
      // Use a more subtle toast/modal for errors in a real app, but alert for now
      alert("Failed to log out: " + err.message); 
    }
  };

  return (
    <>
      <Navbar />
      {/* Main Container - Adjusted to use 'flex-grow' and 'min-h-screen' for better filling */}
      <div className="flex flex-col min-h-screen bg-gray-900">
        {/* Navbar takes its space, the rest of the content takes the remaining height */}
        
        {/* Hero Section */}
        <div className="relative flex-grow flex items-center justify-center text-center p-6">
          {/* Background Image - Subtle, dark overlay for contrast */}
          <div className="absolute inset-0 bg-[url('/background.jpg')] bg-cover bg-center opacity-20"></div>

          {/* Content Card/Box - Centerpiece with modern styling */}
          <div className="relative z-10 w-full max-w-lg p-10 md:p-12 bg-gray-800 bg-opacity-90 rounded-xl shadow-2xl border border-yellow-600/30">
            
            {/* Title & Greeting */}
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 leading-tight">
              Welcome, <span className="text-yellow-600">{displayName}</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-md mx-auto">
              Please complete the quick registration form for Anirban Bhattacharjee's **Violin Classes** before proceeding...
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col space-y-4">
              
              {/* Primary Action - Highlighted */}
              <button
                className="w-full transition duration-300 transform hover:scale-[1.02] bg-yellow-600 hover:bg-yellow-700 hover:cursor-pointer px-8 py-4 rounded-lg text-white font-bold text-lg shadow-lg hover:shadow-xl"
                onClick={handleFormRedirect}
              >
                📝 Fill Out the Registration Form
              </button>

              {/* Secondary Action - Styled to contrast but not compete */}
              <button
                className="w-full transition duration-300 border border-blue-600 text-blue-300 hover:text-white hover:bg-blue-600 hover:cursor-pointer px-8 py-4 rounded-lg font-semibold text-base"
                onClick={handleLogout}
              >
                Log Out Securely
              </button>
            </div>
            
          </div>
        </div>
      </div>
    </>
  );
}