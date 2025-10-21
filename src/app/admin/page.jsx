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
  writeBatch,
} from "firebase/firestore";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import LoadingSpinner from "../loading/loadingSpinner";
import dynamic from "next/dynamic";
import "react-datepicker/dist/react-datepicker.css"; // Import react-datepicker CSS

// Dynamically import DatePicker to avoid SSR issues
const DatePicker = dynamic(() => import("react-datepicker"), { ssr: false });

export default function AdminPage() {
  const [classRequests, setClassRequests] = useState([]);
  const [creditRequests, setCreditRequests] = useState([]);
  const [noticeText, setNoticeText] = useState("");
  const [concertData, setConcertData] = useState({ venue: "", date: "", time: "", location: "" });
  const [error, setError] = useState(null);
  const [approving, setApproving] = useState({});
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 🔹 Verify admin
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setError("You must be logged in to access this page.");
        setLoading(false);
        router.push("/");
        return;
      }

      try {
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

  // 🔹 Fetch pending requests with debug logging
  const fetchRequests = async () => {
    try {
      // Class requests
      const classQuery = query(collection(db, "classesRequests"), where("status", "==", "pending"));
      const classSnap = await getDocs(classQuery);
      const classRequestsData = await Promise.all(
        classSnap.docs.map(async (d) => {
          const data = d.data();
          
          // DEBUG: Log date/time formats
          if (data.date || data.time) {
            console.log("📋 Class Request Data:", {
              id: d.id,
              date: data.date,
              time: data.time,
              dateType: typeof data.date,
              timeType: typeof data.time,
              dateLength: data.date?.length
            });
          }
          
          const userDoc = data.uid ? await getDoc(doc(db, "users", data.uid)) : null;
          const displayName = userDoc?.exists() ? userDoc.data().displayName : "Unknown User";
          return { id: d.id, ...data, displayName };
        })
      );
      setClassRequests(classRequestsData);

      // Credit requests
      const creditQuery = query(collection(db, "creditRequests"), where("status", "==", "pending"));
      const creditSnap = await getDocs(creditQuery);
      const creditRequestsData = await Promise.all(
        creditSnap.docs.map(async (d) => {
          const data = d.data();
          const userDoc = data.targetUserId ? await getDoc(doc(db, "users", data.targetUserId)) : null;
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

  // 🔹 Robust date/time parser
  const parseDateTime = (dateStr, timeStr) => {
    if (!dateStr || !timeStr) {
      throw new Error("Date or time is missing");
    }

    console.log(`🔍 Parsing date: "${dateStr}" | time: "${timeStr}"`);

    // Helper to pad numbers
    const pad = (num) => num.toString().padStart(2, '0');

    // Parse time first
    const timeMatch = timeStr.match(/^(\d{1,2}):(\d{1,2})$/);
    if (!timeMatch) {
      throw new Error(`Invalid time format: "${timeStr}". Use HH:MM (24-hour)`);
    }
    
    const hour = parseInt(timeMatch[1]);
    const minute = parseInt(timeMatch[2]);
    
    if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
      throw new Error(`Invalid time values: ${hour}:${minute}. Use 00:00 to 23:59`);
    }

    // Parse date
    let year, month, day;
    
    // Format 1: DD/MM/YYYY or DD-MM-YYYY
    const dmyMatch = dateStr.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
    if (dmyMatch) {
      day = parseInt(dmyMatch[1]);
      month = parseInt(dmyMatch[2]);
      year = parseInt(dmyMatch[3]);
      console.log("✅ Detected DD/MM/YYYY format");
    }
    // Format 2: YYYY-MM-DD
    else {
      const isoMatch = dateStr.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/);
      if (isoMatch) {
        year = parseInt(isoMatch[1]);
        month = parseInt(isoMatch[2]);
        day = parseInt(isoMatch[3]);
        console.log("✅ Detected YYYY-MM-DD format");
      } else {
        throw new Error(`Unable to parse date: "${dateStr}". Expected: DD/MM/YYYY or YYYY-MM-DD`);
      }
    }

    // Validate date components
    if (month < 1 || month > 12) {
      throw new Error(`Invalid month: ${month}`);
    }
    if (day < 1 || day > 31) {
      throw new Error(`Invalid day: ${day}`);
    }

    // Create date object (month is 0-indexed in JS)
    const dateObj = new Date(year, month - 1, day, hour, minute, 0, 0);
    
    // Validate final date
    if (isNaN(dateObj.getTime())) {
      throw new Error(`Invalid date created from "${dateStr}" and "${timeStr}"`);
    }
    
    // Check reasonable date range
    const now = new Date();
    const minDate = new Date(2020, 0, 1);
    const maxDate = new Date(now.getFullYear() + 2, 11, 31);
    
    if (dateObj < minDate || dateObj > maxDate) {
      console.warn(`⚠️ Date outside reasonable range: ${dateObj.toDateString()}`);
    }

    console.log(`✅ Parsed to: ${dateObj.toISOString()}`);
    return dateObj;
  };

  // 🔹 Create Google Calendar Event
  const createCalendarEvent = async (summary, date, time) => {
    try {
      if (!summary || !date || !time) {
        console.warn("❌ Missing required parameters:", { summary, date, time });
        return null;
      }

      console.log("📅 Processing calendar event:", summary);

      // Parse date and time
      const startDateTime = parseDateTime(date, time);
      const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // +1 hour

      console.log("📆 Event times:", {
        start: startDateTime.toISOString(),
        end: endDateTime.toISOString()
      });

      const response = await fetch("/api/calendar/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          summary,
          description: `Music class session for ${summary}`,
          startDateTime: startDateTime.toISOString(),
          endDateTime: endDateTime.toISOString(),
          timeZone: "Asia/Dhaka"
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}`);
      }

      console.log("✅ Event created successfully:", data.eventLink);
      return data;
    } catch (error) {
      console.error("❌ Calendar creation failed:", error);
      throw error; // Re-throw to handle in caller
    }
  };

  // 🔹 Approve request with transaction safety
  const approveRequest = async (collectionName, id) => {
    const key = `${collectionName}-${id}`;
    setApproving(prev => ({ ...prev, [key]: true }));
    setError(null);

    try {
      const requestDocRef = doc(db, collectionName, id);
      const requestDoc = await getDoc(requestDocRef);
      if (!requestDoc.exists()) throw new Error("Request document not found.");
      const requestData = requestDoc.data();

      console.log("🔍 Processing request:", { collectionName, id, requestData });

      if (collectionName === "creditRequests") {
        const { targetUserId, amount } = requestData;
        if (!targetUserId || amount === undefined) {
          throw new Error("Missing targetUserId or amount in credit request");
        }

        const targetUserRef = doc(db, "users", targetUserId);
        const batch = writeBatch(db);
        batch.update(targetUserRef, { credits: increment(amount) });
        batch.update(requestDocRef, { 
          status: "approved",
          approvedAt: new Date().toISOString()
        });
        await batch.commit();

        console.log("✅ Credit request approved:", amount, "credits added");

      } else if (collectionName === "classesRequests") {
        const { uid, userId, date, time } = requestData;
        const actualUid = uid || userId;

        if (!actualUid) {
          throw new Error("Missing user ID in class request");
        }

        const userDocRef = doc(db, "users", actualUid);
        const userDocSnap = await getDoc(userDocRef);
        
        if (!userDocSnap.exists()) {
          throw new Error(`User ${actualUid} not found`);
        }

        const userData = userDocSnap.data();
        const userName = userData.displayName || "Student";
        const currentCredits = userData.credits || 0;

        if (currentCredits < 1) {
          throw new Error(`${userName} doesn't have enough credits (needs 1)`);
        }

        // Check if user is already in guest list
        const guestQuery = query(collection(db, "guestList"), where("userId", "==", actualUid));
        const guestSnap = await getDocs(guestQuery);
        if (!guestSnap.empty) {
          console.warn(`⚠️ User ${userName} already in guest list`);
        } else {
          // Use batch transaction for atomicity
          const batch = writeBatch(db);
          batch.update(userDocRef, { credits: increment(-1) });
          batch.update(requestDocRef, { 
            status: "approved",
            approvedAt: new Date().toISOString()
          });

          // Add to guest list
          const guestListRef = doc(collection(db, "guestList"));
          batch.set(guestListRef, {
            userId: actualUid,
            displayName: userName,
            classRequestId: id,
            addedAt: new Date().toISOString(),
            createdBy: "admin"
          });

          await batch.commit();

          console.log("✅ Class request approved for", userName);
          console.log("✅ Added to guest list:", userName);
        }

        // Create calendar event (non-blocking)
        if (date && time) {
          try {
            const result = await createCalendarEvent(`Class: ${userName}`, date, time);
            if (result) {
              console.log("✅ Calendar event created:", result.eventLink);
            }
          } catch (calendarError) {
            console.error("⚠️ Calendar creation failed:", calendarError);
            setError(`Class approved for ${userName} and added to guest list, but calendar event failed: ${calendarError.message}`);
          }
        } else {
          console.warn("⚠️ No date/time provided, skipping calendar event");
        }
      }

      // Refresh data
      await fetchRequests();
    } catch (error) {
      console.error("❌ Error approving request:", error);
      setError(`Failed to approve ${collectionName}: ${error.message}`);
    } finally {
      setApproving(prev => ({ ...prev, [key]: false }));
    }
  };

  // 🔹 Decline request
  const declineRequest = async (collectionName, id) => {
    const key = `${collectionName}-${id}`;
    setApproving(prev => ({ ...prev, [key]: true }));
    setError(null);

    try {
      await updateDoc(doc(db, collectionName, id), { 
        status: "declined",
        declinedAt: new Date().toISOString()
      });
      console.log("✅ Request declined:", id);
      await fetchRequests();
    } catch (error) {
      console.error("Error declining request:", error);
      setError(`Failed to decline request: ${error.message}`);
    } finally {
      setApproving(prev => ({ ...prev, [key]: false }));
    }
  };

  // 🔹 Post Notice
  const postNotice = async () => {
    if (!noticeText.trim()) {
      setError("Notice text cannot be empty");
      return;
    }
    try {
      await addDoc(collection(db, "notices"), {
        text: noticeText.trim(),
        createdAt: new Date().toISOString(),
        createdBy: "admin",
      });
      setNoticeText("");
      setError(null);
      console.log("✅ Notice posted");
      await fetchRequests(); // Refresh in case notices affect requests
    } catch (error) {
      console.error("Error posting notice:", error);
      setError(`Failed to post notice: ${error.message}`);
    }
  };

  // 🔹 Post Concert
  const postConcert = async (e) => {
    e.preventDefault();
    const { venue, date, time, location } = concertData;
    if (!venue.trim() || !date.trim() || !time.trim() || !location.trim()) {
      setError("All concert fields are required.");
      return;
    }
    try {
      await addDoc(collection(db, "upcomingConcerts"), {
        venue: venue.trim(),
        date: date.trim(),
        time: time.trim(),
        location: location.trim(),
        createdAt: new Date().toISOString(),
        createdBy: "admin",
      });
      setConcertData({ venue: "", date: "", time: "", location: "" });
      setError(null);
      console.log("✅ Concert posted");
    } catch (error) {
      console.error("Error posting concert:", error);
      setError(`Failed to post concert: ${error.message}`);
    }
  };

  const handleConcertInputChange = (e) => {
    const { name, value } = e.target;
    setConcertData((prev) => ({ ...prev, [name]: value }));
    setError(null); // Clear error on input
  };

  const handleDateChange = (date) => {
    if (date) {
      const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
      const timeStr = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`; // HH:MM
      setConcertData((prev) => ({ ...prev, date: dateStr, time: timeStr }));
    } else {
      setConcertData((prev) => ({ ...prev, date: "", time: "" }));
    }
    setError(null); // Clear error on date change
  };

  const handleNoticeChange = (e) => {
    setNoticeText(e.target.value);
    setError(null); // Clear error on input
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const isProcessing = (collectionName, id) => approving[`${collectionName}-${id}`];

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
          .react-datepicker-wrapper {
            width: 100%;
          }
          .react-datepicker__input-container input {
            width: 100%;
            padding: 0.75rem;
            border-radius: 0.5rem;
            background: #374151;
            color: #fff;
            border: 1px solid #4B5563;
            outline: none;
            transition: all 0.3s ease;
          }
          .react-datepicker__input-container input:focus {
            border-color: #F59E0B;
            box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.5);
          }
          .react-datepicker {
            background: #1F2937;
            color: #E5E7EB;
            border: 1px solid #4B5563;
          }
          .react-datepicker__header {
            background: #374151;
            border-bottom: 1px solid #4B5563;
          }
          .react-datepicker__day--selected,
          .react-datepicker__day--keyboard-selected,
          .react-datepicker__time-list-item--selected {
            background: #F59E0B !important;
            color: #fff !important;
          }
          .react-datepicker__day:hover,
          .react-datepicker__time-list-item:hover {
            background: #4B5563;
          }
          .react-datepicker__time-container,
          .react-datepicker__time-box {
            background: #1F2937;
            color: #E5E7EB;
          }
        `}</style>

        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-serif font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-pink-500 animate-fade-in">
            Admin Dashboard
          </h1>

          {error && (
            <div className="mb-8 p-4 bg-red-900 bg-opacity-80 backdrop-blur-md text-white rounded-xl shadow-lg animate-fade-in border border-red-500">
              <div className="flex items-center">
                <span className="mr-2">⚠️</span>
                {error}
              </div>
            </div>
          )}

          {/* ----- Class Requests ----- */}
          <section className="mb-12">
            <h2 className="text-3xl font-serif font-semibold mb-6 text-amber-400 animate-fade-in">
              Pending Class Requests ({classRequests.length})
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
                      <div className="flex-1">
                        <p className="text-xl font-medium text-gray-100">
                          <span className="font-bold">{req.displayName}</span>
                        </p>
                        <p className="text-gray-300">
                          <span className="font-semibold">Date:</span> {req.date || "Not specified"}
                        </p>
                        <p className="text-gray-300">
                          <span className="font-semibold">Time:</span> {req.time || "Not specified"} [
                          <span className="text-amber-400">{req.status}</span>]
                        </p>
                      </div>
                      <div className="flex space-x-3 flex-shrink-0">
                        <button
                          onClick={() => approveRequest("classesRequests", req.id)}
                          disabled={isProcessing("classesRequests", req.id)}
                          className={`px-5 py-2 rounded-lg font-medium transition-all duration-300 flex items-center ${
                            isProcessing("classesRequests", req.id)
                              ? 'bg-gray-500 cursor-not-allowed text-gray-300'
                              : 'bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white'
                          }`}
                        >
                          {isProcessing("classesRequests", req.id) ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Approving...
                            </>
                          ) : (
                            'Approve'
                          )}
                        </button>
                        <button
                          onClick={() => declineRequest("classesRequests", req.id)}
                          disabled={isProcessing("classesRequests", req.id)}
                          className={`px-5 py-2 rounded-lg font-medium transition-all duration-300 ${
                            isProcessing("classesRequests", req.id)
                              ? 'bg-gray-500 cursor-not-allowed text-gray-300'
                              : 'bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white'
                          }`}
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
              Pending Credit Requests ({creditRequests.length})
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
                      <div className="flex-1">
                        <p className="text-xl font-medium text-gray-100">
                          <span className="font-bold">{req.displayName}</span>
                        </p>
                        <p className="text-gray-300">
                          <span className="font-semibold">Classes:</span> {req.amount} [
                          <span className="text-amber-400">{req.status}</span>]
                        </p>
                        <p className="text-gray-300">
                          <span className="font-semibold">Message:</span>{" "}
                          {req.message || "No message sent"}
                        </p>
                        <p className="text-red-400 text-sm mt-1">
                          *Accept if sufficient fees for {req.amount} classes have been paid.
                        </p>
                      </div>
                      <div className="flex space-x-3 flex-shrink-0">
                        <button
                          onClick={() => approveRequest("creditRequests", req.id)}
                          disabled={isProcessing("creditRequests", req.id)}
                          className={`px-5 py-2 rounded-lg font-medium transition-all duration-300 flex items-center ${
                            isProcessing("creditRequests", req.id)
                              ? 'bg-gray-500 cursor-not-allowed text-gray-300'
                              : 'bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white'
                          }`}
                        >
                          {isProcessing("creditRequests", req.id) ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Approving...
                            </>
                          ) : (
                            'Approve'
                          )}
                        </button>
                        <button
                          onClick={() => declineRequest("creditRequests", req.id)}
                          disabled={isProcessing("creditRequests", req.id)}
                          className={`px-5 py-2 rounded-lg font-medium transition-all duration-300 ${
                            isProcessing("creditRequests", req.id)
                              ? 'bg-gray-500 cursor-not-allowed text-gray-300'
                              : 'bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white'
                          }`}
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
                  required
                />
              </div>
              <div>
                <label htmlFor="dateTime" className="block text-gray-300 font-medium mb-1">
                  Date and Time
                </label>
                <DatePicker
                  id="dateTime"
                  selected={concertData.date && concertData.time ? new Date(`${concertData.date}T${concertData.time}`) : null}
                  onChange={handleDateChange}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="yyyy-MM-dd HH:mm"
                  placeholderText="Select date and time"
                  minDate={new Date()} // Prevent past dates
                  className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-300"
                  required
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
                  required
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
                onChange={handleNoticeChange}
                placeholder="Enter notice text..."
                className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-y transition-all duration-300"
                rows="4"
                maxLength={1000}
              />
              <div className="text-right text-sm text-gray-400 mt-1">
                {noticeText.length}/1000
              </div>
              <button
                onClick={postNotice}
                disabled={!noticeText.trim()}
                className={`mt-4 w-full px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  !noticeText.trim()
                    ? 'bg-gray-600 cursor-not-allowed text-gray-400'
                    : 'bg-gradient-to-r from-amber-400 to-pink-500 text-white hover:from-amber-500 hover:to-pink-600'
                }`}
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
              Users and Edits
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