"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import LoadingSpinner from '../loading/loadingSpinner';
import Navbar from '../navbar/navbar';

export default function ExistingStudentsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const checkAuthAndRole = async (user) => {
      if (user) {
        // User is signed in, now check their role in Firestore.
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists() && userDocSnap.data().role === 'student') {
          // User is a student, grant access.
          setIsAuthorized(true);
          setUserName(userDocSnap.data().displayName || 'Student');
        } else {
          // User is not a student, redirect them.
          alert("You are not authorized to view this page. Please get verified first.");
          router.replace('/another');
        }
      } else {
        // No user is signed in, redirect to login.
        alert("You must be logged in to view this page.");
        router.replace('/another'); // Or a dedicated login page
      }
      setIsLoading(false);
    };

    const unsubscribe = onAuthStateChanged(auth, checkAuthAndRole);

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthorized) {
    // This state will be briefly visible before the redirect completes.
    // You can also just keep showing the spinner.
    return null;
  }

  // If authorized, render the protected page content.
  return (
    <>
      <Navbar />
      <div className="p-8 text-white text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome, {userName}!</h1>
        <p className="text-lg">You can now schedule a class or buy credits.</p>
        {/* TODO: Add your scheduling and credit purchasing components here */}
      </div>
    </>
  );
}