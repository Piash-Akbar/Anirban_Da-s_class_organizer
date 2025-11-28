"use client";

import { useEffect, useState } from "react";
import Navbar from "../navbar/navbar";
import { auth, db } from "../firebaseConfig";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  writeBatch,
  increment,
  query,
  where,
  getDoc,
} from "firebase/firestore";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import LoadingSpinner from "../loading/loadingSpinner";

export default function AdminDashboard() {
  const [classRequests, setClassRequests] = useState([]);
  const [creditRequests, setCreditRequests] = useState([]);
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [approving, setApproving] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/");
        return;
      }
      const snap = await getDoc(doc(db, "users", user.uid));
      if (!snap.exists() || snap.data().role !== "admin") {
        router.push("/");
        return;
      }
      await Promise.all([fetchRequests(), fetchStudents()]);
      setLoading(false);
    });
    return () => unsub && unsub();
  }, [router]);

  const fetchRequests = async () => {
    const classQ = query(collection(db, "classesRequests"), where("status", "==", "pending"));
    const classSnap = await getDocs(classQ);
    const classData = await Promise.all(
      classSnap.docs.map(async (d) => {
        const data = d.data();
        const userSnap = data.uid ? await getDoc(doc(db, "users", data.uid)) : null;
        return { id: d.id, ...data, displayName: userSnap?.data()?.displayName ?? "Unknown" };
      })
    );
    setClassRequests(classData);

    const creditQ = query(collection(db, "creditRequests"), where("status", "==", "pending"));
    const creditSnap = await getDocs(creditQ);
    const creditData = await Promise.all(
      creditSnap.docs.map(async (d) => {
        const data = d.data();
        const userSnap = data.targetUserId ? await getDoc(doc(db, "users", data.targetUserId)) : null;
        return { id: d.id, ...data, displayName: userSnap?.data()?.displayName ?? "Unknown" };
      })
    );
    setCreditRequests(creditData);
  };

  const fetchStudents = async () => {
    const usersQ = query(collection(db, "users"), where("role", "==", "student"));
    const snap = await getDocs(usersQ);
    const students = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    setStudents(students);
  };

  const approveRequest = async (col, id) => {
    const key = `${col}-${id}`;
    setApproving((p) => ({ ...p, [key]: true }));
    try {
      const reqRef = doc(db, col, id);
      const reqSnap = await getDoc(reqRef);
      const req = reqSnap.data();

      if (col === "creditRequests") {
        const { targetUserId, amount } = req;
        const batch = writeBatch(db);
        batch.update(doc(db, "users", targetUserId), { credits: increment(amount) });
        batch.update(reqRef, { status: "approved", approvedAt: new Date().toISOString() });
        await batch.commit();
      } else if (col === "classesRequests") {
        const uid = req.uid || req.targetUserId;
        const userSnap = await getDoc(doc(db, "users", uid));
        const user = userSnap.data();
        const batch = writeBatch(db);
        batch.update(doc(db, "users", uid), { credits: increment(-1) });
        batch.update(reqRef, { status: "approved", approvedAt: new Date().toISOString() });
        await batch.commit();
      }
      await fetchRequests();
    } catch (e) {
      setError(e.message);
    } finally {
      setApproving((p) => ({ ...p, [key]: false }));
    }
  };

  const declineRequest = async (col, id) => {
    const key = `${col}-${id}`;
    setApproving((p) => ({ ...p, [key]: true }));
    try {
      await updateDoc(doc(db, col, id), {
        status: "declined",
        declinedAt: new Date().toISOString(),
      });
      await fetchRequests();
    } catch (e) {
      setError(e.message);
    } finally {
      setApproving((p) => ({ ...p, [key]: false }));
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch {
      setError("Logout failed");
    }
  };

  const isProcessing = (col, id) => approving[`${col}-${id}`];

  const filteredStudents = students.filter(
    (s) =>
      (s.displayName ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.email ?? "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="relative min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center py-16 px-4">
        <div className="absolute inset-0 bg-[url('/background.jpg')] bg-cover bg-center opacity-30"></div>
        <div className="relative z-10 w-full max-w-5xl">

          <h1 className="text-4xl font-bold mb-10 text-center bg-gradient-to-r from-amber-400 to-pink-500 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>

          {error && (
            <div className="mb-6 p-4 bg-red-600/80 rounded-lg text-center">
              {error}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={handleLogout}
              className="bg-red-900/80 hover:bg-red-800 text-amber-400 px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-lg"
            >
              Logout
            </button>
            <button
              onClick={() => router.push("/admin/content")}
              className="bg-gradient-to-r from-amber-400 to-pink-500 px-6 py-2 rounded-lg font-medium hover:from-amber-500 hover:to-pink-600 transition-all duration-200 hover:shadow-lg"
            >
              Manage Content
            </button>
          </div>

          {/* Class Requests */}
          <section className="bg-gray-800/80 p-6 rounded-xl shadow-xl mb-10 backdrop-blur-md">
            <h2 className="text-2xl font-semibold mb-4 text-amber-400">
              Pending Class Requests ({classRequests.length})
            </h2>
            {classRequests.length === 0 ? (
              <p className="text-gray-300 italic">No pending requests.</p>
            ) : (
              <div className="space-y-4">
                {classRequests.map((r) => (
                  <div
                    key={r.id}
                    className="bg-gray-900/70 p-4 rounded-lg flex justify-between items-center shadow-lg hover:shadow-amber-500/20 transition-all"
                  >
                    <div>
                      <p className="font-bold text-white">{r.displayName}</p>
                      <p className="text-xl text-gray-400">
                        Date: {r.date} | Time: {r.time}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => approveRequest("classesRequests", r.id)}
                        disabled={isProcessing("classesRequests", r.id)}
                        className={`px-4 py-2 rounded-lg text-white font-medium ${
                          isProcessing("classesRequests", r.id)
                            ? "bg-gray-600"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                      >
                        {isProcessing("classesRequests", r.id) ? "…" : "Approve"}
                      </button>
                      <button
                        onClick={() => declineRequest("classesRequests", r.id)}
                        disabled={isProcessing("classesRequests", r.id)}
                        className={`px-4 py-2 rounded-lg text-white font-medium ${
                          isProcessing("classesRequests", r.id)
                            ? "bg-gray-600"
                            : "bg-red-600 hover:bg-red-700"
                        }`}
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Credit Requests */}
          <section className="bg-gray-800/80 p-6 rounded-xl shadow-xl mb-10 backdrop-blur-md">
            <h2 className="text-2xl font-semibold mb-4 text-amber-400">
              Pending Credit Requests ({creditRequests.length})
            </h2>
            {creditRequests.length === 0 ? (
              <p className="text-gray-300 italic">No pending requests.</p>
            ) : (
              <div className="space-y-4">
                {creditRequests.map((r) => (
                  <div
                    key={r.id}
                    className="bg-gray-900/70 p-4 rounded-lg flex justify-between items-center shadow-lg hover:shadow-pink-500/20 transition-all"
                  >
                    <div>
                      <p className="font-bold text-white">{r.displayName}</p>
                      <p className="text-xl text-gray-400">
                        {r.amount} classes
                      </p>

                      <p>
                        Payment Method: {r.paymentMethod}
                      </p>
                      <p>
                        Transaction Proof: {r.proof}
                      </p>
                      <p>
                        Additional Message: {r.message || "N/A"}
                      </p>

                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => approveRequest("creditRequests", r.id)}
                        disabled={isProcessing("creditRequests", r.id)}
                        className={`px-4 py-2 rounded-lg text-white font-medium ${
                          isProcessing("creditRequests", r.id)
                            ? "bg-gray-600"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                      >
                        {isProcessing("creditRequests", r.id) ? "…" : "Approve"}
                      </button>
                      <button
                        onClick={() => declineRequest("creditRequests", r.id)}
                        disabled={isProcessing("creditRequests", r.id)}
                        className={`px-4 py-2 rounded-lg text-white font-medium ${
                          isProcessing("creditRequests", r.id)
                            ? "bg-gray-600"
                            : "bg-red-600 hover:bg-red-700"
                        }`}
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Students */}
          <section className="bg-gray-800/80 p-6 rounded-xl shadow-xl backdrop-blur-md">
            <h2 className="text-2xl font-semibold mb-4 text-amber-400">Students</h2>
            <input
              type="text"
              placeholder="Search by name or email…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-3 mb-6 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            {filteredStudents.length === 0 ? (
              <p className="text-gray-300 italic">No students found.</p>
            ) : (
              <div className="space-y-4">
                {filteredStudents.map((s) => (
                  <div
                    key={s.id}
                    className="bg-gray-900/70 p-4 rounded-lg shadow-lg hover:shadow-amber-500/10 transition-all"
                  >
                    <p className="font-bold text-white">{s.displayName}</p>
                    <p className="text-sm text-gray-400">
                      Email: {s.email} | Credits: {s.credits ?? 0}
                    </p>

                    change name / fee or delete student functionality can be added here




                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
