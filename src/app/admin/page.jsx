'use client';

import { useEffect, useState } from "react";
import Navbar from "../navbar/navbar";
import { auth, db } from "../firebaseConfig";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  addDoc,
  getDoc,
  increment,
  query,
  where,
} from "firebase/firestore";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import LoadingSpinner from "../loading/loadingSpinner";

export default function AdminPage() {
  const [classRequests, setClassRequests] = useState([]);
  const [creditRequests, setCreditRequests] = useState([]);
  const [noticeText, setNoticeText] = useState("");
  const [concertData, setConcertData] = useState({ venue: "", date: "", location: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 🔹 Verify admin on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setError("You must be logged in to access this page.");
        setLoading(false);
        router.push("/");
        return;
      }

      try {
        console.log("Checking user:", user.uid, user.email);
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (!userDoc.exists()) {
          setError("User profile not found. Please contact support.");
          setLoading(false);
          router.push("/");
          return;
        }

        if (userDoc.data().role !== "admin") {
          setError("You do not have admin privileges.");
          setLoading(false);
          router.push("/");
          return;
        }

        await fetchRequests();
      } catch (error) {
        console.error("Error checking user role:", error);
        setError("Failed to verify admin status: " + error.message);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  // 🔹 Fetch requests
  const fetchRequests = async () => {
    try {
      const classQuery = query(
        collection(db, "classesRequests"),
        where("status", "==", "pending")
      );
      const classSnap = await getDocs(classQuery);
      const classRequestsData = await Promise.all(
        classSnap.docs.map(async (d) => {
          const data = d.data();
          const userDoc = data.uid ? await getDoc(doc(db, "users", data.uid)) : null;
          const displayName = userDoc?.exists() ? userDoc.data().displayName : "Unknown User";
          return { id: d.id, ...data, displayName };
        })
      );
      setClassRequests(classRequestsData);

      const creditQuery = query(
        collection(db, "creditRequests"),
        where("status", "==", "pending")
      );
      const creditSnap = await getDocs(creditQuery);
      const creditRequestsData = await Promise.all(
        creditSnap.docs.map(async (d) => {
          const data = d.data();
          const userDoc = data.targetUserId
            ? await getDoc(doc(db, "users", data.targetUserId))
            : null;
          const displayName = userDoc?.exists() ? userDoc.data().displayName : "Unknown User";
          return { id: d.id, ...data, displayName };
        })
      );
      setCreditRequests(creditRequestsData);
    } catch (error) {
      console.error("Error fetching requests:", error);
      setError(`Failed to load requests: ${error.message}`);
    }
  };

  // 🔹 Approve request
  const approveRequest = async (collectionName, id) => {
    try {
      if (!collectionName || !id) {
        throw new Error(`Invalid arguments: collectionName=${collectionName}, id=${id}`);
      }

      console.log("Approving request:", collectionName, id);

      const requestDocRef = doc(db, collectionName, id);
      const requestDoc = await getDoc(requestDocRef);
      if (!requestDoc.exists()) throw new Error("Request document not found.");
      const requestData = requestDoc.data();

      if (collectionName === "creditRequests") {
        const { targetUserId, amount } = requestData;
        if (!targetUserId || !amount)
          throw new Error("Invalid credit request: missing targetUserId or amount.");

        const targetUserRef = doc(db, "users", targetUserId);
        const userSnap = await getDoc(targetUserRef);
        if (!userSnap.exists()) throw new Error(`User not found: ${targetUserId}`);

        await updateDoc(targetUserRef, { credits: increment(amount) });
        await updateDoc(requestDocRef, { status: "approved" });

        console.log(`Approved credit request for ${targetUserId}, added ${amount} credits.`);
      } else if (collectionName === "classesRequests") {
        const { uid } = requestData;
        if (!uid) throw new Error("Invalid class request: missing uid.");

        const userDocRef = doc(db, "users", uid);
        const userDoc = await getDoc(userDocRef);
        if (!userDoc.exists()) throw new Error(`User not found: ${uid}`);

        await updateDoc(requestDocRef, { status: "approved" });
        await updateDoc(userDocRef, { credits: increment(-1) });

        console.log(`Approved class request for ${uid}, deducted 1 credit.`);
      }

      router.push("/admin");
      window.location.reload();
    } catch (error) {
      console.error("Error approving request:", error);
      setError(`Failed to approve request: ${error.message}`);
    }
  };

  // 🔹 Decline request
  const declineRequest = async (collectionName, id) => {
    try {
      if (!collectionName || !id) throw new Error("Missing collectionName or id.");
      await updateDoc(doc(db, collectionName, id), { status: "declined" });
      router.push("/admin");
      window.location.reload();
    } catch (error) {
      console.error("Error declining request:", error);
      setError(`Failed to decline request: ${error.message}`);
    }
  };

  // 🔹 Post a notice
  const postNotice = async () => {
    if (!noticeText) return;
    try {
      await addDoc(collection(db, "notices"), {
        text: noticeText,
        createdAt: new Date().toISOString(),
      });
      setNoticeText("");
      window.location.reload();
    } catch (error) {
      console.error("Error posting notice:", error);
      setError(`Failed to post notice: ${error.message}`);
    }
  };

  // 🔹 Post an upcoming concert
  const postConcert = async (e) => {
    e.preventDefault();
    if (!concertData.venue || !concertData.date || !concertData.location) {
      setError("All concert fields are required.");
      return;
    }
    try {
      await addDoc(collection(db, "upcomingConcerts"), {
        venue: concertData.venue,
        date: concertData.date,
        location: concertData.location,
        createdAt: new Date().toISOString(),
      });
      setConcertData({ venue: "", date: "", location: "" });
      setError(null);
      window.location.reload();
    } catch (error) {
      console.error("Error posting concert:", error);
      setError(`Failed to post concert: ${error.message}`);
    }
  };

  // 🔹 Handle concert form input changes
  const handleConcertInputChange = (e) => {
    const { name, value } = e.target;
    setConcertData((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Error logging out:", error);
      setError(`Failed to log out: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white py-12 px-4 md:px-8">
        <style jsx>{`
          @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fadeIn 1s ease-in-out forwards;
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.02); }
          }
          .animate-pulse-card {
            animation: pulse 3s ease-in-out infinite;
          }
        `}</style>

        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-serif font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-pink-500 animate-fade-in">
            Admin Dashboard
          </h1>

          {error && (
            <div className="mb-8 p-4 bg-red-900 bg-opacity-80 backdrop-blur-md text-white rounded-xl shadow-lg animate-fade-in">
              {error}
            </div>
          )}

          {/* ----- Class Requests ----- */}
          <section className="mb-12">
            <h2 className="text-3xl font-serif font-semibold mb-6 text-amber-400 animate-fade-in">
              Pending Class Requests
            </h2>
            {classRequests.length === 0 ? (
              <p className="text-gray-300 text-lg italic">No pending class requests.</p>
            ) : (
              <div className="space-y-6">
                {classRequests.map((req, index) => (
                  <div
                    key={req.id}
                    className="bg-gray-800 bg-opacity-90 backdrop-blur-md p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse-card animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <p className="text-xl font-medium text-gray-100">
                          <span className="font-bold">{req.displayName}</span>
                        </p>
                        <p className="text-gray-300">
                          <span className="font-semibold">Date:</span> {req.date}
                        </p>
                        <p className="text-gray-300">
                          <span className="font-semibold">Time:</span> {req.time} [
                          <span className="text-amber-400">{req.status}</span>]
                        </p>
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => approveRequest("classesRequests", req.id)}
                          className="bg-gradient-to-r from-green-500 to-green-700 text-white px-5 py-2 rounded-lg font-medium hover:from-green-600 hover:to-green-800 transition-all duration-300"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => declineRequest("classesRequests", req.id)}
                          className="bg-gradient-to-r from-red-500 to-red-700 text-white px-5 py-2 rounded-lg font-medium hover:from-red-600 hover:to-red-800 transition-all duration-300"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ----- Credit Requests ----- */}
          <section className="mb-12">
            <h2 className="text-3xl font-serif font-semibold mb-6 text-amber-400 animate-fade-in">
              Pending Credit Requests
            </h2>
            {creditRequests.length === 0 ? (
              <p className="text-gray-300 text-lg italic">No pending credit requests.</p>
            ) : (
              <div className="space-y-6">
                {creditRequests.map((req, index) => (
                  <div
                    key={req.id}
                    className="bg-gray-800 bg-opacity-90 backdrop-blur-md p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse-card animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <p className="text-xl font-medium text-gray-100">
                          <span className="font-bold">{req.displayName}</span>
                        </p>
                        <p className="text-gray-300">
                          <span className="font-semibold">Message:</span>{" "}
                          {req.message || "No message sent"}
                        </p>
                        <p className="text-gray-300">
                          <span className="font-semibold">Classes:</span> {req.amount} [
                          <span className="text-amber-400">{req.status}</span>]
                        </p>
                        <p className="text-red-400 text-sm mt-1">
                          *Accept if sufficient fees for {req.amount} classes have been paid.
                        </p>
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => approveRequest("creditRequests", req.id)}
                          className="bg-gradient-to-r from-green-500 to-green-700 text-white px-5 py-2 rounded-lg font-medium hover:from-green-600 hover:to-green-800 transition-all duration-300"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => declineRequest("creditRequests", req.id)}
                          className="bg-gradient-to-r from-red-500 to-red-700 text-white px-5 py-2 rounded-lg font-medium hover:from-red-600 hover:to-red-800 transition-all duration-300"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ----- Post Concert Section ----- */}
          <section className="mb-12">
            <h2 className="text-3xl font-serif font-semibold mb-6 text-amber-400 animate-fade-in">
              Add Upcoming Concert
            </h2>
            <form onSubmit={postConcert} className="bg-gray-800 bg-opacity-90 backdrop-blur-md p-6 rounded-xl shadow-lg space-y-4 animate-fade-in">
              <div>
                <label htmlFor="venue" className="block text-gray-300 font-medium mb-1">
                  Venue
                </label>
                <input
                  type="text"
                  id="venue"
                  name="venue"
                  value={concertData.venue}
                  onChange={handleConcertInputChange}
                  placeholder="Enter venue name"
                  className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-300"
                />
              </div>
              <div>
                <label htmlFor="date" className="block text-gray-300 font-medium mb-1">
                  Date
                </label>
                <input
                  type="text"
                  id="date"
                  name="date"
                  value={concertData.date}
                  onChange={handleConcertInputChange}
                  placeholder="e.g., October 15, 2025"
                  className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-300"
                />
              </div>
              <div>
                <label htmlFor="location" className="block text-gray-300 font-medium mb-1">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={concertData.location}
                  onChange={handleConcertInputChange}
                  placeholder="e.g., New York, NY"
                  className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-300"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-400 to-pink-500 text-white px-6 py-3 rounded-lg font-medium hover:from-amber-500 hover:to-pink-600 transition-all duration-300"
              >
                Add Concert
              </button>
            </form>
          </section>

          {/* ----- Post Notice Section ----- */}
          <section className="mb-12">
            <h2 className="text-3xl font-serif font-semibold mb-6 text-amber-400 animate-fade-in">
              Post Notice
            </h2>
            <div className="bg-gray-800 bg-opacity-90 backdrop-blur-md p-6 rounded-xl shadow-lg animate-fade-in">
              <textarea
                value={noticeText}
                onChange={(e) => setNoticeText(e.target.value)}
                placeholder="Enter notice text..."
                className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-y transition-all duration-300"
                rows="4"
              />
              <button
                onClick={postNotice}
                className="mt-4 w-full bg-gradient-to-r from-amber-400 to-pink-500 text-white px-6 py-3 rounded-lg font-medium hover:from-amber-500 hover:to-pink-600 transition-all duration-300"
              >
                Post Notice
              </button>
            </div>
          </section>

          {/* ----- Bottom Buttons ----- */}
          <div className="text-center space-x-4 animate-fade-in">
            <button
              onClick={() => router.push("/admin/usersdata")}
              className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-blue-800 transition-all duration-300"
            >
              Students
            </button>
            <button
              onClick={handleLogout}
              className="bg-gradient-to-r from-red-500 to-red-700 text-white px-6 py-3 rounded-lg font-medium hover:from-red-600 hover:to-red-800 transition-all duration-300"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}