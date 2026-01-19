
"use client";

import { use, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { auth, db } from "../../firebaseConfig";
import Navbar from "../../navbar/navbar";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  query,
  getDocs,
  orderBy,
  limit,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import LoadingSpinner from "../../loading/loadingSpinner";

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
  // const [classFee, setClassFee] = useState(600); // Example class fee

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
        createdAt: serverTimestamp(),
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

  // Latest Class Schedule status with date and time from firestore
  const [latestClassSchedule, setLatestClassSchedule] = useState(null);
  const [lastPayment, setLastPayment] = useState(null);
  useEffect(() => {
    const fetchLatestClassSchedule = async () => {
      try {
        const latestClassScheduleQuery = query(
          collection(db, "classesRequests"),
          orderBy("createdAt", "desc"),
          limit(1)
        );
        const latestClassScheduleSnap = await getDocs(latestClassScheduleQuery);
        if (!latestClassScheduleSnap.empty) {
          const latestClassScheduleData = latestClassScheduleSnap.docs[0].data();
          setLatestClassSchedule(latestClassScheduleData);
        } else {
          setLatestClassSchedule(null);
        }
      } catch (err) {
        console.error("Error fetching latest class schedule:", err);
        setError("Failed to fetch latest class schedule.");
      }
    };
    fetchLatestClassSchedule();
  }, []);


  useEffect(() => {
    const fetchLastCreditRequest = async () => {
      // 1. Ensure `uid` is available before querying
      if (!uid) {
        // console.warn("User ID (uid) not available, skipping credit request fetch.");
        setLastPayment(null); // Assuming setLastPayment is what you use for this data
        return;
      }

      try {
        const lastCreditRequestQuery = query(
          // Correct collection name: "creditRequests"
          collection(db, "creditRequests"),
          // Filter by 'targetUserId' which identifies the user for this request
          where("targetUserId", "==", uid),
          orderBy("createdAt", "desc"),
          limit(1)
        );
        const lastCreditRequestSnap = await getDocs(lastCreditRequestQuery);
        if (!lastCreditRequestSnap.empty) {
          const lastCreditRequestData = lastCreditRequestSnap.docs[0].data();
          // Assuming you still want to set this data to 'lastPayment' state
          setLastPayment(lastCreditRequestData);
        } else {
          setLastPayment(null);
        }
      } catch (err) {
        console.error("Error fetching last credit request:", err);
        setError("Failed to fetch last credit request.");
      }
    };
    fetchLastCreditRequest();
  }, [uid]); // 'uid' is correctly listed as a dependency



  if (latestClassSchedule) {
      const formattedDate = new Date(latestClassSchedule.date).toLocaleDateString("en-CA"); // en-CA gives YYYY-MM-DD
      latestClassSchedule.date = formattedDate;      
      console.log("Latest class schedule:", latestClassSchedule);
    } else {
      console.log("No latest class schedule found.");       
      }
  




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

    <div className="relative min-h-screen flex flex-col items-center justify-start bg-gray-900 text-white pt-24 px-4">
      <div className="absolute inset-0 bg-[url('/background.jpg')] bg-cover bg-center opacity-25"></div>

      <div className="relative z-10 w-full max-w-3xl">

        {/* Welcome Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-blue-300">
            Welcome, {userData.displayName || "User"} 👋
          </h1>
          <p className="text-gray-400 mt-2 text-sm tracking-wide">
            Manage your classes, check notices, and stay up-to-date
          </p>
        </div>
        <>
        {/* buttons */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setShowSchedulePopup(true)}
            className="bg-blue-500 hover:bg-blue-600 hover:cursor-pointer text-white font-semibold py-2 px-4 rounded"
          >
            Schedule a Class
          </button>
          <button
            onClick={handleBuyCredit}
            className="bg-green-500 hover:bg-green-600 hover:cursor-pointer text-white font-semibold py-2 px-4 rounded"
          >
            Buy Credits
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 hover:cursor-pointer text-white font-semibold py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>    
        </>

        {/* Latest Notice */}
        <div className="mb-8 bg-gray-800/80 backdrop-blur-md p-6 rounded-xl shadow-lg border border-gray-700 hover:border-blue-500 transition-all">
          <h2 className="text-2xl font-semibold text-blue-400 mb-3">
            Latest Notice
          </h2>
          <p className="text-gray-300 leading-relaxed">
            {notice ? notice.text : "No notices available at the moment."}
          </p>
        </div>

        {/* Credit Display */}
        <div
          className={`mb-8 p-5 text-center rounded-xl shadow-md border ${
            credit >= 0
              ? "bg-green-900/40 text-green-300 border-green-700"
              : "bg-red-900/40 text-red-300 border-red-700"
          }`}
        >
          <span className="text-lg font-medium">
            {credit >= 0
              ? `You have ${credit} class${credit !== 1 ? "es" : ""} left`
              : `Payment due for ${Math.abs(credit)} class${Math.abs(credit) !== 1 ? "es" : ""}`}
          </span>
        </div>

        {/* Class Schedule Status */}
        <div className="mb-8 bg-gray-800/80 p-6 rounded-xl shadow-lg border border-gray-700 hover:border-purple-500 transition-all">
          <h2 className="text-2xl font-semibold text-purple-400 mb-3">
            Latest Class Schedule Status
          </h2>
          {latestClassSchedule ? (
            <div className="text-gray-300 space-y-1">
              <p>
                <span className="font-semibold text-gray-100">Status:</span>{" "}
                {latestClassSchedule.status}
              </p>
              <p>
                <span className="font-semibold text-gray-100">Date:</span>{" "}
                {latestClassSchedule.date}
              </p>
              <p>
                <span className="font-semibold text-gray-100">Time:</span>{" "}
                {latestClassSchedule.time}
              </p>
            </div>
          ) : (
            <p className="text-gray-400">No class scheduled yet.</p>
          )}
        </div>

          {/* Latest payment Status can be added here */}
       { lastPayment && (
        <div className="mb-8 bg-gray-800/80 p-6 rounded-xl shadow-lg border border-gray-700 hover:border-purple-500 transition-all">
        <h2 className=" text-2xl font-semibold text-purple-400 mb-3">Last Payment Summary</h2>
        <p>
          Classes: {lastPayment?.amount} 
        </p>
        <p>
          Status: {lastPayment?.status}  
        </p>  
        <p>
          Date: {lastPayment?.createdAt}
        </p>
        <p>
          Method: {lastPayment?.paymentMethod}
        </p>
       </div> 
        )}

      </div>

      {/* Schedule Popup */}
      {showSchedulePopup && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm">
        <div className="bg-gray-800/95 p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-all scale-100 hover:scale-105">
          <h2 className="text-2xl font-bold mb-6 text-blue-300">Schedule a Class</h2>
          <span>According to Indian Standard Time (IST)</span>

            <div className="flex flex-col gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Select Date:
                </label>
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  dateFormat="yyyy-MM-dd"
                  minDate={new Date()}
                  className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-400 outline-none transition"
                  placeholderText="Select a date"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Select Time (IST):
                </label>
                <input
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-400 outline-none transition"
                />
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={handleSchedule}
                  className="bg-blue-600 hover:bg-blue-700 hover:cursor-pointer text-white px-6 py-2 rounded-lg font-medium transition-all hover:shadow-md"
                >
                  Submit
                </button>
                <button
                  onClick={() => {
                    setShowSchedulePopup(false);
                    setSelectedDate(null);
                    setSelectedTime("");
                  }}
                  className="bg-gray-600 hover:bg-gray-700 hover:cursor-pointer text-white px-6 py-2 rounded-lg font-medium transition-all hover:shadow-md"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  </>
  );
}
