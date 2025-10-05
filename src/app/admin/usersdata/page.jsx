"use client";

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
  const [scheduleLoading, setScheduleLoading] = useState(true);
  const [errors, setErrors] = useState([]);
  const [users, setUsers] = useState([]);
  const [latestSchedule, setLatestSchedule] = useState(null);

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
                where("uid", "==", user.id), // Changed from userId to uid
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
                      date: formatDate(lastClass.date), // Use date field
                      time: lastClass.time || "No time specified",
                      details: lastClass.details || "No details",
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

        setUsers(usersWithLastClass);
        console.log("Users with last class:", usersWithLastClass);
      } catch (err) {
        console.error("Error fetching users:", err);
        setErrors((prev) => [...prev, "Failed to load users."]);
      } finally {
        setLoading(false);
      }

      // Fetch latest approved schedule
      try {
        const scheduleCollection = collection(db, "classesRequests");
        const scheduleQuery = query(
          scheduleCollection,
          where("status", "==", "approved"),
          orderBy("createdAt", "desc"),
          limit(1)
        );
        const scheduleSnapshot = await getDocs(scheduleQuery);
        const scheduleData = scheduleSnapshot.docs[0]?.data();
        setLatestSchedule(
          scheduleData
            ? {
                id: scheduleSnapshot.docs[0].id,
                ...scheduleData,
                date: formatDate(scheduleData.date), // Use date field
                time: scheduleData.time || "No time specified",
              }
            : null
        );
        console.log("Latest schedule:", scheduleData);
      } catch (err) {
        console.error("Error fetching latest schedule:", err);
        setErrors((prev) => [...prev, "Failed to load latest schedule."]);
      } finally {
        setScheduleLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) return <div> <LoadingSpinner /> </div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Page</h1>

      {errors.length > 0 && (
        <div className="mb-4">
          {errors.map((error, index) => (
            <p key={index} className="text-red-500">
              {error}
            </p>
          ))}
        </div>
      )}

      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
      >
        Logout
      </button>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Registered Users</h2>
        {users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <ul className="space-y-2">
            {users.map((u) => (
              <li key={u.id} className="border p-2 rounded">
                <p>
                  <strong>Name:</strong> {u.displayName || "N/A"}
                </p>
                <p>
                  <strong>Email:</strong> {u.email}
                </p>
                <p>
                  <strong>Classes left:</strong> {u.credits || 0}
                </p>
                <p>
                  <strong>Last Class:</strong>{" "}
                  {u.lastClass
                    ? `${u.lastClass.date} at ${u.lastClass.time} `
                    : "No classes attended"}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Latest Approved Schedule</h2>
        {scheduleLoading ? (
          <div>
            <LoadingSpinner />
          </div>
        ) : !latestSchedule ? (
          <p>No approved schedules found.</p>
        ) : (
          <div className="border p-2 rounded">
            <p>
              <strong>Schedule ID:</strong> {latestSchedule.id}
            </p>
            <p>
              <strong>Date:</strong> {latestSchedule.date} at {latestSchedule.time}
            </p>
            {/* <p>
              <strong>Details:</strong> {latestSchedule.details || "No details"}
            </p> */}
          </div>
        )}
      </div>

      <button
        onClick={() => router.push("/admin")}
        className="mt-4 bg-blue-500 hover:bg-blue-600 hover:cursor-pointer text-white px-4 py-2 rounded"
      >
        Back to Dashboard
      </button>
    </div>
  );
}