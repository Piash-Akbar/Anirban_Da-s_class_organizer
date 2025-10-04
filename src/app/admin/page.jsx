"use client";

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

export default function AdminPage() {
  const [classRequests, setClassRequests] = useState([]);
  const [creditRequests, setCreditRequests] = useState([]);
  const [noticeText, setNoticeText] = useState("");
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

  // 🔹 Approve request (fixed version)
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

      // ✅ Handle credit requests
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
      }

      // ✅ Handle class requests
      else if (collectionName === "classesRequests") {
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
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-lg text-gray-400">Loading...</p>
      </div>
    );
  }

  // 🔹 UI Section
  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gray-900 text-white p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Admin Dashboard - Pending Requests
        </h1>

        {error && (
          <div className="mb-8 p-4 bg-red-600 text-white rounded-lg">{error}</div>
        )}

        {/* ----- Class Requests ----- */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Pending Class Requests</h2>
          {classRequests.length === 0 ? (
            <p className="text-gray-400">No pending class requests.</p>
          ) : (
            <div className="space-y-4">
              {classRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-gray-800 p-4 rounded-lg shadow-md flex justify-between items-center"
                >
                  <p className="text-lg">
                    <b>{req.displayName}</b> <br />
                    <b>Date:</b> {req.date} <br />
                    <b>Time:</b> {req.time} [
                    <span className="text-yellow-400">{req.status}</span>]
                  </p>
                  <div className="space-x-2">
                    <button
                      onClick={() => approveRequest("classesRequests", req.id)}
                      className="bg-green-600 hover:bg-green-700 hover:cursor-pointer text-white px-4 py-2 rounded-md font-medium transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => declineRequest("classesRequests", req.id)}
                      className="bg-red-600 hover:bg-red-700 hover:cursor-pointer text-white px-4 py-2 rounded-md font-medium transition-colors"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ----- Credit Requests ----- */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Pending Credit Requests</h2>
          {creditRequests.length === 0 ? (
            <p className="text-gray-400">No pending credit requests.</p>
          ) : (
            <div className="space-y-4">
              {creditRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-gray-800 p-4 rounded-lg shadow-md flex justify-between items-center"
                >
                  <p className="text-lg">
                    <b>{req.displayName}</b> <br />
                    <b>Message:</b> {req.message || "No message sent"} <br />
                    <b>Classes:</b> {req.amount} [
                    <span className="text-yellow-400">{req.status}</span>]
                    <br />
                    <span className="text-red-500 text-sm">
                      *Accept if sufficient fees for {req.amount} classes have
                      been paid.
                    </span>
                  </p>
                  <div className="space-x-2">
                    <button
                      onClick={() => approveRequest("creditRequests", req.id)}
                      className="bg-green-600 hover:bg-green-700 hover:cursor-pointer text-white px-4 py-2 rounded-md font-medium transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => declineRequest("creditRequests", req.id)}
                      className="bg-red-600 hover:bg-red-700 hover:cursor-pointer text-white px-4 py-2 rounded-md font-medium transition-colors"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ----- Notice Section ----- */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Post Notice</h2>
          <textarea
            value={noticeText}
            onChange={(e) => setNoticeText(e.target.value)}
            placeholder="Enter notice text..."
            className="w-full p-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
            rows="4"
          />
          <button
            onClick={postNotice}
            className="mt-4 bg-blue-600 hover:bg-blue-700 hover:cursor-pointer text-white px-6 py-2 rounded-md font-medium transition-colors"
          >
            Post Notice
          </button>
        </section>

        {/* ----- Bottom Buttons ----- */}
        <div className="text-center">
          <button
            onClick={() => router.push("/admin/usersdata")}
            className="bg-blue-600 hover:bg-blue-700 hover:cursor-pointer text-white mx-4 px-6 py-2 rounded-md font-medium transition-colors"
            >
            Students
          </button>

          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 hover:cursor-pointer text-white px-6 py-2 rounded-md font-medium transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
    </>
  );
}
