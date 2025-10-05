'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../../firebaseConfig";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { signOut, onAuthStateChanged } from "firebase/auth";
import LoadingSpinner from "@/app/loading/loadingSpinner";

// Utility function to format date
const formatDate = (date) => {
  try {
    if (date && typeof date.toDate === "function") {
      // Firestore Timestamp
      return date.toDate().toLocaleDateString();
    } else if (typeof date === "string") {
      // String date (e.g., "2025-10-17" or ISO 8601)
      const parsedDate = new Date(date);
      return isNaN(parsedDate.getTime()) ? "Invalid date" : parsedDate.toLocaleDateString();
    } else if (typeof date === "number") {
      // Unix timestamp (milliseconds)
      return new Date(date).toLocaleDateString();
    }
    return "Unknown date";
  } catch (err) {
    console.error("Error formatting date:", err);
    return "Invalid date";
  }
};

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState([]);
  const [users, setUsers] = useState([]);
  const [notices, setNotices] = useState([]);
  const [concerts, setConcerts] = useState([]);
  const [editNotice, setEditNotice] = useState(null);
  const [editConcert, setEditConcert] = useState(null);

  // Logout handler
  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (err) {
      console.error("Logout error:", err);
      setErrors((prev) => [...prev, "Failed to log out."]);
    }
  };

  // Update notice
  const updateNotice = async (id, newText) => {
    try {
      if (!newText) {
        setErrors((prev) => [...prev, "Notice text cannot be empty."]);
        return;
      }
      await updateDoc(doc(db, "notices", id), {
        text: newText,
        updatedAt: new Date().toISOString(),
      });
      setEditNotice(null);
      fetchPostsAndConcerts();
    } catch (err) {
      console.error("Error updating notice:", err);
      setErrors((prev) => [...prev, "Failed to update notice."]);
    }
  };

  // Delete notice
  const deleteNotice = async (id) => {
    try {
      await deleteDoc(doc(db, "notices", id));
      fetchPostsAndConcerts();
    } catch (err) {
      console.error("Error deleting notice:", err);
      setErrors((prev) => [...prev, "Failed to delete notice."]);
    }
  };

  // Update concert
  const updateConcert = async (id, updatedData) => {
    try {
      if (!updatedData.venue || !updatedData.date || !updatedData.location) {
        setErrors((prev) => [...prev, "All concert fields are required."]);
        return;
      }
      await updateDoc(doc(db, "upcomingConcerts", id), {
        venue: updatedData.venue,
        date: updatedData.date,
        location: updatedData.location,
        updatedAt: new Date().toISOString(),
      });
      setEditConcert(null);
      fetchPostsAndConcerts();
    } catch (err) {
      console.error("Error updating concert:", err);
      setErrors((prev) => [...prev, "Failed to update concert."]);
    }
  };

  // Delete concert
  const deleteConcert = async (id) => {
    try {
      await deleteDoc(doc(db, "upcomingConcerts", id));
      fetchPostsAndConcerts();
    } catch (err) {
      console.error("Error deleting concert:", err);
      setErrors((prev) => [...prev, "Failed to delete concert."]);
    }
  };

  // Fetch notices and concerts
  const fetchPostsAndConcerts = async () => {
    try {
      // Fetch notices
      const noticesQuery = query(
        collection(db, "notices"),
        orderBy("createdAt", "desc"),
        limit(5)
      );
      const noticesSnapshot = await getDocs(noticesQuery);
      const noticesData = noticesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: formatDate(doc.data().createdAt),
      }));
      setNotices(noticesData);

      // Fetch concerts
      const concertsQuery = query(
        collection(db, "upcomingConcerts"),
        orderBy("createdAt", "desc"),
        limit(5)
      );
      const concertsSnapshot = await getDocs(concertsQuery);
      const concertsData = concertsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: formatDate(doc.data().createdAt),
      }));
      setConcerts(concertsData);
    } catch (err) {
      console.error("Error fetching posts and concerts:", err);
      setErrors((prev) => [...prev, "Failed to load posts or concerts."]);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setErrors((prev) => [...prev, "You must be logged in to access this page."]);
        setLoading(false);
        router.push("/");
        return;
      }

      setUser(currentUser);

      // Check if user is admin
      try {
        const userDoc = await getDocs(
          query(collection(db, "users"), where("uid", "==", currentUser.uid))
        );
        const userData = userDoc.docs[0]?.data();
        if (userData?.role !== "admin") {
          setErrors((prev) => [...prev, "You do not have permission to access this page."]);
          setLoading(false);
          router.push("/");
          return;
        }
      } catch (err) {
        console.error("Error checking user role:", err);
        setErrors((prev) => [...prev, "Failed to verify user role."]);
        setLoading(false);
        return;
      }

      // Fetch users and their last class
      try {
        const usersCollection = collection(db, "users");
        const usersQuery = query(usersCollection, where("role", "==", "user"));
        const usersSnapshot = await getDocs(usersQuery);
        const usersData = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Fetch last class for each user
        const usersWithLastClass = await Promise.all(
          usersData.map(async (user) => {
            try {
              const classQuery = query(
                collection(db, "classesRequests"),
                where("uid", "==", user.id),
                where("status", "==", "approved"),
                orderBy("createdAt", "desc"),
                limit(1)
              );
              const classSnapshot = await getDocs(classQuery);
              const lastClass = classSnapshot.docs[0]?.data();
              return {
                ...user,
                lastClass: lastClass
                  ? {
                      date: formatDate(lastClass.date),
                      time: lastClass.time || "No time specified",
                      details: lastClass.details || "No details",
                      rawDate: lastClass.date // Store raw date for sorting
                    }
                  : null,
              };
            } catch (err) {
              console.error(`Error fetching last class for user ${user.id}:`, err.message);
              if (err.code === "failed-precondition" && err.message.includes("index")) {
                console.error(
                  "This query requires a composite index. Please create it in the Firebase Console using the provided link in the error message."
                );
              }
              return { ...user, lastClass: null };
            }
          })
        );

        // Sort users by last class date (most recent first, null last)
        const sortedUsers = usersWithLastClass.sort((a, b) => {
          if (!a.lastClass && !b.lastClass) return 0;
          if (!a.lastClass) return 1;
          if (!b.lastClass) return -1;
          const dateA = a.lastClass.rawDate && typeof a.lastClass.rawDate.toDate === "function"
            ? a.lastClass.rawDate.toDate().getTime()
            : new Date(a.lastClass.rawDate).getTime();
          const dateB = b.lastClass.rawDate && typeof b.lastClass.rawDate.toDate === "function"
            ? b.lastClass.rawDate.toDate().getTime()
            : new Date(b.lastClass.rawDate).getTime();
          return dateB - dateA; // Descending order
        });

        setUsers(sortedUsers);
        console.log("Sorted users with last class:", sortedUsers);
      } catch (err) {
        console.error("Error fetching users:", err);
        setErrors((prev) => [...prev, "Failed to load users."]);
      }

      // Fetch notices and concerts
      try {
        await fetchPostsAndConcerts();
      } catch (err) {
        console.error("Error in initial fetch of posts and concerts:", err);
        setErrors((prev) => [...prev, "Failed to load posts or concerts."]);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
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
            Admin Dashboard - Student Data
          </h1>

          {errors.length > 0 && (
            <div className="mb-8 p-4 bg-red-900 bg-opacity-80 backdrop-blur-md text-white rounded-xl shadow-lg animate-fade-in">
              {errors.map((error, index) => (
                <p key={index} className="text-red-200">{error}</p>
              ))}
            </div>
          )}

          {/* Registered Users Section */}
          <section className="mb-12">
            <h2 className="text-3xl font-serif font-semibold mb-6 text-amber-400 animate-fade-in">
              Registered Users
            </h2>
            {users.length === 0 ? (
              <p className="text-gray-300 text-lg italic">No users found.</p>
            ) : (
              <div className="space-y-6">
                {users.map((u, index) => (
                  <div
                    key={u.id}
                    className="bg-gray-800 bg-opacity-90 backdrop-blur-md p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse-card animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex flex-col gap-2">
                      <p className="text-xl font-medium text-gray-100">
                        <span className="font-bold">{u.displayName || "N/A"}</span>
                      </p>
                      <p className="text-gray-300">
                        <span className="font-semibold">Email:</span> {u.email}
                      </p>
                      <p className="text-gray-300">
                        <span className="font-semibold">Classes Left:</span> {u.credits || 0}
                      </p>
                      <p className="text-gray-300">
                        <span className="font-semibold">Last Class:</span>{" "}
                        {u.lastClass
                          ? `${u.lastClass.date} at ${u.lastClass.time}`
                          : "No classes attended"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Latest Posts and Upcoming Concerts Section */}
          <section className="mb-12">
            <h2 className="text-3xl font-serif font-semibold mb-6 text-amber-400 animate-fade-in">
              Latest Posts and Upcoming Concerts
            </h2>

            {/* Notices Subsection */}
            <h3 className="text-2xl font-serif font-medium mb-4 text-gray-200 animate-fade-in">
              Recent Notices
            </h3>
            {notices.length === 0 ? (
              <p className="text-gray-300 text-lg italic">No notices found.</p>
            ) : (
              <div className="space-y-6 mb-8">
                {notices.map((notice, index) => (
                  <div
                    key={notice.id}
                    className="bg-gray-800 bg-opacity-90 backdrop-blur-md p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse-card animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {editNotice && editNotice.id === notice.id ? (
                      <div className="flex flex-col gap-4">
                        <textarea
                          value={editNotice.text}
                          onChange={(e) => setEditNotice({ ...editNotice, text: e.target.value })}
                          className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-300"
                          rows="4"
                        />
                        <div className="flex space-x-3">
                          <button
                            onClick={() => updateNotice(notice.id, editNotice.text)}
                            className="bg-gradient-to-r from-green-500 to-green-700 text-white px-5 py-2 rounded-lg font-medium hover:from-green-600 hover:to-green-800 transition-all duration-300"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditNotice(null)}
                            className="bg-gradient-to-r from-gray-500 to-gray-700 text-white px-5 py-2 rounded-lg font-medium hover:from-gray-600 hover:to-gray-800 transition-all duration-300"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                          <p className="text-gray-300">{notice.text}</p>
                          <p className="text-gray-400 text-sm mt-1">
                            Posted: {notice.createdAt}
                          </p>
                        </div>
                        <div className="flex space-x-3">
                          <button
                            onClick={() => setEditNotice({ id: notice.id, text: notice.text })}
                            className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-5 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-blue-800 transition-all duration-300"
                          >
                            Update
                          </button>
                          <button
                            onClick={() => deleteNotice(notice.id)}
                            className="bg-gradient-to-r from-red-500 to-red-700 text-white px-5 py-2 rounded-lg font-medium hover:from-red-600 hover:to-red-800 transition-all duration-300"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Concerts Subsection */}
            <h3 className="text-2xl font-serif font-medium mb-4 text-gray-200 animate-fade-in">
              Upcoming Concerts
            </h3>
            {concerts.length === 0 ? (
              <p className="text-gray-300 text-lg italic">No upcoming concerts found.</p>
            ) : (
              <div className="space-y-6">
                {concerts.map((concert, index) => (
                  <div
                    key={concert.id}
                    className="bg-gray-800 bg-opacity-90 backdrop-blur-md p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse-card animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {editConcert && editConcert.id === concert.id ? (
                      <div className="flex flex-col gap-4">
                        <div>
                          <label htmlFor={`venue-${concert.id}`} className="block text-gray-300 font-medium mb-1">
                            Venue
                          </label>
                          <input
                            type="text"
                            id={`venue-${concert.id}`}
                            value={editConcert.venue}
                            onChange={(e) => setEditConcert({ ...editConcert, venue: e.target.value })}
                            className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-300"
                          />
                        </div>
                        <div>
                          <label htmlFor={`date-${concert.id}`} className="block text-gray-300 font-medium mb-1">
                            Date
                          </label>
                          <input
                            type="text"
                            id={`date-${concert.id}`}
                            value={editConcert.date}
                            onChange={(e) => setEditConcert({ ...editConcert, date: e.target.value })}
                            className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-300"
                          />
                        </div>
                        <div>
                          <label htmlFor={`location-${concert.id}`} className="block text-gray-300 font-medium mb-1">
                            Location
                          </label>
                          <input
                            type="text"
                            id={`location-${concert.id}`}
                            value={editConcert.location}
                            onChange={(e) => setEditConcert({ ...editConcert, location: e.target.value })}
                            className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-300"
                          />
                        </div>
                        <div className="flex space-x-3">
                          <button
                            onClick={() => updateConcert(concert.id, editConcert)}
                            className="bg-gradient-to-r from-green-500 to-green-700 text-white px-5 py-2 rounded-lg font-medium hover:from-green-600 hover:to-green-800 transition-all duration-300"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditConcert(null)}
                            className="bg-gradient-to-r from-gray-500 to-gray-700 text-white px-5 py-2 rounded-lg font-medium hover:from-gray-600 hover:to-gray-800 transition-all duration-300"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                          <p className="text-xl font-medium text-gray-100">
                            <span className="font-bold">{concert.venue}</span>
                          </p>
                          <p className="text-gray-300">
                            <span className="font-semibold">Date:</span> {concert.date}
                          </p>
                          <p className="text-gray-300">
                            <span className="font-semibold">Location:</span> {concert.location}
                          </p>
                          <p className="text-gray-400 text-sm mt-1">
                            Posted: {concert.createdAt}
                          </p>
                        </div>
                        <div className="flex space-x-3">
                          <button
                            onClick={() => setEditConcert({ id: concert.id, ...concert })}
                            className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-5 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-blue-800 transition-all duration-300"
                          >
                            Update
                          </button>
                          <button
                            onClick={() => deleteConcert(concert.id)}
                            className="bg-gradient-to-r from-red-500 to-red-700 text-white px-5 py-2 rounded-lg font-medium hover:from-red-600 hover:to-red-800 transition-all duration-300"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Action Buttons */}
          <div className="text-center space-x-4 animate-fade-in">
            <button
              onClick={() => router.push("/admin")}
              className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-blue-800 transition-all duration-300"
            >
              Back to Dashboard
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