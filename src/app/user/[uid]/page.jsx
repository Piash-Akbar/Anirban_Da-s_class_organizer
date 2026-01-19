"use client";

import { useEffect, useState } from "react";
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
  const uid = params.uid;

  const [userData, setUserData] = useState(null);
  const [role, setRole] = useState(null);
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showSchedulePopup, setShowSchedulePopup] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");

  const [credit, setCredit] = useState(0);
  const [latestClassSchedule, setLatestClassSchedule] = useState(null);
  const [lastPayment, setLastPayment] = useState(null);

  /* ---------------- FETCH USER + NOTICE ---------------- */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", uid));
        if (!userDoc.exists()) {
          setError("User profile not found.");
          return;
        }

        const data = userDoc.data();
        setUserData(data);
        setRole(data.role);
        setCredit(data.credits);

        if (data.role === "admin") {
          router.push("/admin");
          return;
        }

        const noticeQuery = query(
          collection(db, "notices"),
          orderBy("createdAt", "desc"),
          limit(1)
        );
        const noticeSnap = await getDocs(noticeQuery);
        if (!noticeSnap.empty) {
          setNotice(noticeSnap.docs[0].data());
        }
      } catch (err) {
        setError("Failed to load user data or notices.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [uid, router]);

  /* ---------------- CLASS SCHEDULE ---------------- */
  useEffect(() => {
    const fetchLatestClassSchedule = async () => {
      const q = query(
        collection(db, "classesRequests"),
        orderBy("createdAt", "desc"),
        limit(1)
      );
      const snap = await getDocs(q);
      if (!snap.empty) setLatestClassSchedule(snap.docs[0].data());
    };
    fetchLatestClassSchedule();
  }, []);

  /* ---------------- LAST PAYMENT ---------------- */
  useEffect(() => {
    if (!uid) return;

    const fetchLastPayment = async () => {
      const q = query(
        collection(db, "creditRequests"),
        where("targetUserId", "==", uid),
        orderBy("createdAt", "desc"),
        limit(1)
      );
      const snap = await getDocs(q);
      if (!snap.empty) setLastPayment(snap.docs[0].data());
    };
    fetchLastPayment();
  }, [uid]);

  /* ---------------- ACTIONS ---------------- */
  const handleSchedule = async () => {
    if (!selectedDate || !selectedTime) {
      alert("Please select date and time.");
      return;
    }

    await addDoc(collection(db, "classesRequests"), {
      uid,
      date: selectedDate.toLocaleDateString("en-CA"),
      time: selectedTime,
      status: "pending",
      createdAt: serverTimestamp(),
    });

    alert("Class schedule request sent!");
    setShowSchedulePopup(false);
    setSelectedDate(null);
    setSelectedTime("");
  };

  const handleBuyCredit = () => router.push(`/user/${uid}/buy-credit`);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  /* ---------------- STATES ---------------- */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="bg-red-600/80 px-6 py-4 rounded-xl text-white">
          {error}
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <main className="relative min-h-screen bg-black text-white pt-28 px-4">
        {/* Background */}
        <div className="absolute inset-0 bg-[url('/background.jpg')] bg-cover bg-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        </div>

        <section className="relative z-10 max-w-4xl mx-auto space-y-10 animate-fade-up">

          {/* HEADER */}
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-blue-300">
              Welcome, {userData?.displayName || "User"}
            </h1>
            <p className="text-white/60 mt-2">
              Manage your classes, notices & payments
            </p>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-wrap justify-center gap-4 hover:cursor-pointer">
            {[
              ["Schedule a Class", "from-blue-500 to-indigo-600", () => setShowSchedulePopup(true)],
              ["Buy Credits", "from-green-400 to-emerald-500", handleBuyCredit],
              ["Logout", "from-red-500 to-rose-600", handleLogout],
            ].map(([text, color, action]) => (
              <button
                key={text}
                onClick={action}
                className={`px-6 py-3 rounded-full font-semibold bg-gradient-to-r ${color}
                text-black hover:scale-105 transition shadow-lg hover:cursor-pointer`}
              >
                {text}
              </button>
            ))}
          </div>

          {/* NOTICE */}
          <Card title="Latest Notice" color="blue">
            {notice?.text || "No notices available at the moment."}
          </Card>

          {/* CREDIT */}
          <div className={`p-5 rounded-2xl text-center border shadow-lg
            ${credit >= 0
              ? "bg-green-900/30 border-green-700 text-green-300"
              : "bg-red-900/30 border-red-700 text-red-300"}`}>
            {credit >= 0
              ? `You have ${credit} class${credit !== 1 ? "es" : ""} left`
              : `Payment due for ${Math.abs(credit)} classes`}
          </div>

          {/* CLASS STATUS */}
          <Card title="Latest Class Schedule" color="purple">
            {latestClassSchedule ? (
              <>
                <p>Status: {latestClassSchedule.status}</p>
                <p>Date: {latestClassSchedule.date}</p>
                <p>Time: {latestClassSchedule.time}</p>
              </>
            ) : (
              "No class scheduled yet."
            )}
          </Card>

          {/* PAYMENT */}
          {lastPayment && (
            <Card title="Last Payment Summary" color="purple">
              <p>Classes: {lastPayment.amount}</p>
              <p>Status: {lastPayment.status}</p>
              <p>Method: {lastPayment.paymentMethod}</p>
            </Card>
          )}
        </section>

        {/* POPUP */}
        {showSchedulePopup && (
          <div className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center">
            <div className="bg-gray-900 p-8 rounded-3xl max-w-md w-full shadow-2xl animate-fade-up">
              <h2 className="text-2xl font-bold mb-6 text-blue-300">
                Schedule a Class (IST)
              </h2>

              <div className="space-y-4">
                <DatePicker
                  selected={selectedDate}
                  onChange={setSelectedDate}
                  minDate={new Date()}
                  className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700"
                  placeholderText="Select date"
                />

                <input
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700"
                />

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={handleSchedule}
                    className="px-5 py-2 bg-blue-600 rounded-lg hover:scale-105 transition"
                  >
                    Submit
                  </button>
                  <button
                    onClick={() => setShowSchedulePopup(false)}
                    className="px-5 py-2 bg-gray-700 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

/* ----------- SMALL REUSABLE CARD ----------- */
function Card({ title, color, children }) {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
      <h2 className={`text-2xl font-semibold text-${color}-400 mb-3`}>
        {title}
      </h2>
      <div className="text-white/70 space-y-1">{children}</div>
    </div>
  );
}
