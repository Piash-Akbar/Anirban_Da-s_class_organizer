
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { auth, db } from "../../firebaseConfig";
import Navbar from "@/app/navbar/navbar";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  query,
  getDocs,
  orderBy,
  limit,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import LoadingSpinner from "@/app/loading/loadingSpinner";

export default function UserPage() {
  const params = useParams();
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [role, setRole] = useState(null);
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSchedulePopup, setShowSchedulePopup] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [credit, setCredit] = useState(0);

  const uid = params.uid;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data
        const userDoc = await getDoc(doc(db, "users", uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          console.log("User data:", data); // Debug user data
          setUserData(data);
          setRole(data.role);
          setCredit(data.credits);

          if (data.role === "admin") {
            console.log("Redirecting to /admin for admin user:", uid);
            router.push("/admin");
            return;
          }

          // Fetch the latest notice
          const noticeQuery = query(
            collection(db, "notices"),
            orderBy("createdAt", "desc"),
            limit(1)
          );
          const noticeSnap = await getDocs(noticeQuery);
          console.log("Notice snapshot empty:", noticeSnap.empty); // Debug notice query
          if (!noticeSnap.empty) {
            const noticeData = noticeSnap.docs[0].data();
            console.log("Fetched notice:", noticeData); // Debug notice data
            setNotice(noticeData);
          } else {
            console.log("No notices found in Firestore.");
          }
        } else {
          console.error("User not found for UID:", uid);
          setError("User profile not found.");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(`Failed to load user data or notices: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [uid, router]);

  const handleSchedule = async () => {
    if (!selectedDate || !selectedTime) {
      alert("Please select date and time.");
      return;
    }

    try {
      // Format date as YYYY-MM-DD in local timezone
      const formattedDate = selectedDate.toLocaleDateString("en-CA"); // en-CA gives YYYY-MM-DD
      await addDoc(collection(db, "classesRequests"), {
        uid,
        date: formattedDate,
        time: selectedTime,
        status: "pending",
        createdAt: new Date().toISOString(),
      });
      alert("Class schedule request sent!");
      setShowSchedulePopup(false);
      setSelectedDate(null);
      setSelectedTime("");
    } catch (err) {
      console.error("Error scheduling class:", err);
      alert("Failed to send schedule request: " + err.message);
    }
  };

  const handleBuyCredit = () => {
    router.push(`/user/${uid}/buy-credit`);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-lg text-gray-400">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="p-4 bg-red-600 text-white rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
    <div className="relative min-h-screen flex flex-col items-center justify-center text-center bg-gray-900">
      <div className="absolute inset-0 bg-[url('/background.jpg')] bg-cover bg-center opacity-30"></div>

      <div className="relative z-10 opacity-90">


      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Welcome, {userData.displayName || "User"}
        </h1>

        <div className="mb-8 bg-gray-800 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Latest Notice</h2>
          <p className="text-gray-300">
            {notice ? notice.text : "No notices available."}
          </p>
        </div>

        <div
          className={`mt-8 mb-8 justify-center flex items-center p-4 rounded-lg ${
            credit >= 0 ? "bg-gray-800 text-green-400" : "bg-gray-800 text-red-400"
          }`}
        >
          {credit >= 0
            ? `You have ${credit} class(es) left`
            : `You have due for ${Math.abs(credit)} class(es)`}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => setShowSchedulePopup(true)}
            className="bg-blue-600 hover:bg-blue-700 hover:cursor-pointer text-white px-6 py-3 rounded-md font-medium transition-colors"
          >
            Schedule a Class
          </button>
          <button
            onClick={handleBuyCredit}
            className="bg-green-600 hover:bg-green-700 hover:cursor-pointer text-white px-6 py-3 rounded-md font-medium transition-colors"
          >
            Buy Class
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 hover:cursor-pointer text-white px-6 py-3 rounded-md font-medium transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Schedule Popup */}
        {showSchedulePopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm transition-opacity duration-300">
            <div className="bg-gray-800/90 p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-transform duration-300 scale-100 hover:scale-105">
              <h2 className="text-2xl font-bold mb-6 text-blue-300">Schedule a Class</h2>
              <div className="flex flex-col gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Select Date:</label>
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    dateFormat="yyyy-MM-dd"
                    utcOffset={0} // Treat as local time
                    minDate={new Date()} // Prevent past dates
                    className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    placeholderText="Select a date"
                    />
                </div>

                <div>
                  <label className="block text-sm font-medium  text-gray-200 mb-2">Select Time:</label>
                  <input
                    type="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full p-3 rounded-lg bg-gray-700 text-white border hover:cursor-text border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                </div>

                <div className="flex justify-end gap-4 mt-6">
                  <button
                    onClick={handleSchedule}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 hover:cursor-pointer rounded-lg font-medium transition-colors duration-200"
                    >
                    Submit
                  </button>
                  <button
                    onClick={() => {
                      setShowSchedulePopup(false);
                      setSelectedDate(null);
                      setSelectedTime("");
                    }}
                    className="bg-gray-600 hover:bg-gray-700 hover:cursor-pointer text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      </div>

    </div>
    </>
  );
}
