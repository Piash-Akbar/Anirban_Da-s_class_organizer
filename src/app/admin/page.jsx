'use client';

import { useEffect, useState } from "react";
import Navbar from "../navbar/navbar";               // adjust path
import { auth, db } from "../firebaseConfig";                    // adjust path
import {
  collection, getDocs, updateDoc, doc, writeBatch, increment,
  query, where, getDoc
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

  /* ────── AUTH & ADMIN CHECK ────── */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) { router.push("/"); return; }
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

  /* ────── FETCHERS ────── */
  const fetchRequests = async () => {
    // class requests
    const classQ = query(collection(db, "classesRequests"), where("status", "==", "pending"));
    const classSnap = await getDocs(classQ);
    const classData = await Promise.all(classSnap.docs.map(async (d) => {
      const data = d.data();
      const userSnap = data.uid ? await getDoc(doc(db, "users", data.uid)) : null;
      return { id: d.id, ...data, displayName: userSnap?.data()?.displayName ?? "Unknown" };
    }));
    setClassRequests(classData);

    // credit requests
    const creditQ = query(collection(db, "creditRequests"), where("status", "==", "pending"));
    const creditSnap = await getDocs(creditQ);
    const creditData = await Promise.all(creditSnap.docs.map(async (d) => {
      const data = d.data();
      const userSnap = data.targetUserId ? await getDoc(doc(db, "users", data.targetUserId)) : null;
      return { id: d.id, ...data, displayName: userSnap?.data()?.displayName ?? "Unknown" };
    }));
    setCreditRequests(creditData);
  };

  const fetchStudents = async () => {
    const usersQ = query(collection(db, "users"), where("role", "==", "student"));
    const snap = await getDocs(usersQ);
    const students = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    setStudents(students);
  };

  /* ────── APPROVE / DECLINE ────── */
  const approveRequest = async (col, id) => {
    const key = `${col}-${id}`;
    setApproving(p => ({ ...p, [key]: true }));
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
        // if ((user.credits ?? 0) < 1) throw new Error("Not enough credits");

        const batch = writeBatch(db);
        batch.update(doc(db, "users", uid), { credits: increment(-1) });
        batch.update(reqRef, { status: "approved", approvedAt: new Date().toISOString() });

        const gstRef = doc(collection(db, "guestList"));
        batch.set(gstRef, {
          userId: uid,
          displayName: user.displayName,
          classRequestId: id,
          addedAt: new Date().toISOString(),
          createdBy: "admin"
        });
        await batch.commit();

        // optional calendar
        if (req.date && req.time) {
          await createCalendarEvent(`Class: ${user.displayName}`, req.date, req.time);
        }
      }
      await fetchRequests();
    } catch (e) {
      setError(e.message);
    } finally {
      setApproving(p => ({ ...p, [key]: false }));
    }
  };

  const declineRequest = async (col, id) => {
    const key = `${col}-${id}`;
    setApproving(p => ({ ...p, [key]: true }));
    try {
      await updateDoc(doc(db, col, id), {
        status: "declined",
        declinedAt: new Date().toISOString()
      });
      await fetchRequests();
    } catch (e) {
      setError(e.message);
    } finally {
      setApproving(p => ({ ...p, [key]: false }));
    }
  };

  /* -------Logout------- */
  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch {
      setError("Logout failed");
    }
  };

  /* ────── CALENDAR HELPER ────── */
  const createCalendarEvent = async (summary, date, time) => {
    const start = parseDateTime(date, time);
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    await fetch("/api/calendar/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        summary,
        description: `Music class for ${summary}`,
        startDateTime: start.toISOString(),
        endDateTime: end.toISOString(),
        timeZone: "Asia/Dhaka"
      })
    });
  };

  const parseDateTime = (d, t) => {
    const [hh, mm] = t.split(":").map(Number);
    const iso = d.includes("-") ? d : d.split("/").reverse().join("-");
    const dateObj = new Date(`${iso}T${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}:00`);
    if (isNaN(dateObj)) throw new Error("Invalid date/time");
    return dateObj;
  };

  const isProcessing = (col, id) => approving[`${col}-${id}`];

  /* ────── FILTERED STUDENTS ────── */
  const filteredStudents = students.filter(s =>
    (s.displayName ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.email ?? "").toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          @keyframes fadeIn { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
          .fade { animation: fadeIn 0.8s forwards; }
          @keyframes pulse { 0%,100% { transform:scale(1); } 50% { transform:scale(1.02); } }
          .pulse { animation: pulse 3s infinite; }
        `}</style>

        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-serif font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-pink-500 fade">
            Admin Dashboard
          </h1>

          {error && <div className="mb-6 p-4 bg-red-900/80 rounded-xl">{error}</div>}


          <div className="flex gap-4 justify-center mb-12">
            <button onClick={handleLogout} className="text-amber-400 bg-red-900/80 px-4 py-2 rounded-xl hover:cursor-pointer">Logout</button>
            <button
              onClick={() => router.push("/admin/content")}
              className="bg-gradient-to-r from-amber-400 to-pink-500 px-6 py-2 rounded-lg font-medium hover:from-amber-500 hover:to-pink-600"
            >
              Content
            </button>
          </div>







          {/* ────── CLASS REQUESTS ────── */}
          <section className="mb-12">
            <h2 className="text-3xl font-serif mb-4 text-amber-400">
              Pending Class Requests ({classRequests.length})
            </h2>
            {classRequests.length === 0 ? (
              <p className="text-gray-300 italic">No pending requests.</p>
            ) : (
              <div className="space-y-4">
                {classRequests.map((r, i) => (
                  <div
                    key={r.id}
                    className="bg-gray-800/90 backdrop-blur p-5 rounded-xl flex justify-between items-center fade"
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    <div>
                      <p className="font-bold">{r.displayName}</p>
                      <p className="text-sm text-gray-300">
                        Date: {r.date} | Time: {r.time}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => approveRequest("classesRequests", r.id)}
                        disabled={isProcessing("classesRequests", r.id)}
                        className={`px-4 py-1 rounded text-white ${
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
                        className={`px-4 py-1 rounded text-white ${
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

          {/* ────── CREDIT REQUESTS ────── */}
          <section className="mb-12">
            <h2 className="text-3xl font-serif mb-4 text-amber-400">
              Pending Credit Requests ({creditRequests.length})
            </h2>
            {creditRequests.length === 0 ? (
              <p className="text-gray-300 italic">No pending requests.</p>
            ) : (
              <div className="space-y-4">
                {creditRequests.map((r, i) => (
                  <div
                    key={r.id}
                    className="bg-gray-800/90 backdrop-blur p-5 rounded-xl flex justify-between items-center fade"
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    <div>
                      <p className="font-bold">{r.displayName}</p>
                      <p className="text-sm text-gray-300">
                        {r.amount} classes – {r.message || "no msg"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => approveRequest("creditRequests", r.id)}
                        disabled={isProcessing("creditRequests", r.id)}
                        className={`px-4 py-1 rounded text-white ${
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
                        className={`px-4 py-1 rounded text-white ${
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

          {/* ────── STUDENTS ────── */}
          <section className="mb-12">
            <h2 className="text-3xl font-serif mb-4 text-amber-400">Students</h2>
            <input
              type="text"
              placeholder="Search by name or email…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full p-3 mb-4 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            {filteredStudents.length === 0 ? (
              <p className="text-gray-300 italic">No students found.</p>
            ) : (
              <div className="space-y-4">
                {filteredStudents.map((s, i) => (
                  <div
                    key={s.id}
                    className="bg-gray-800/90 backdrop-blur p-5 rounded-xl fade"
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    <p className="font-bold">{s.displayName}</p>
                    <p className="text-sm text-gray-300">
                      Email: {s.email} | Credits: {s.credits ?? 0}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>

          <div className="text-center">
            <button
              onClick={() => router.push("/admin/content")}
              className="bg-gradient-to-r from-amber-400 to-pink-500 px-6 py-2 rounded-lg font-medium hover:from-amber-500 hover:to-pink-600"
            >
              Manage Content
            </button>
          </div>
        </div>
      </div>
    </>
  );
}