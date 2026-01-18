"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import {
  collection,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../../firebaseConfig";

// PDF
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

/* ───────────────────────────────────────────── */
/* Helpers                                      */
/* ───────────────────────────────────────────── */

const formatDate = (ts) => {
  if (!ts) return "—";

  if (typeof ts === "object" && ts.seconds) {
    return new Date(ts.seconds * 1000).toLocaleDateString();
  }

  const d = new Date(ts);
  return isNaN(d.getTime()) ? "—" : d.toLocaleDateString();
};

/* ───────────────────────────────────────────── */
/* PDF Table Configuration                      */
/* ───────────────────────────────────────────── */

const PDF_TABLE_CONFIG = {
  creditRequests: {
    headers: [
      "Request Date",
      "User",
      "Amount",
      "Payment Method",
      "Status",
    ],
    mapRow: (item, userNames) => [
      formatDate(item.createdAt),
      userNames.get(item.targetUserId) || "Unknown",
      item.amount ?? "—",
      item.paymentMethod ?? "—",
      item.status ?? "—",
    ],
  },

  classesRequests: {
    headers: [
      "Student Name",
      "Requested Date",
      "Requested Time",
      "Class Type",
      "Status",
    ],
    mapRow: (item, userNames) => [
      userNames.get(item.uid || item.userId) || "Unknown",
      item.date || "—",
      item.time || "—",
      item.classType || item.instrument || "—",
      item.status || "Pending",
    ],
  },
};

const KNOWN_COLLECTIONS = [
  "users",
  "classesRequests",
  "creditRequests",
  "guestlist",
  "notices",
  "upcomingConcerts",
];

/* ───────────────────────────────────────────── */
/* Component                                   */
/* ───────────────────────────────────────────── */

export default function DatabaseBrowser() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [docs, setDocs] = useState([]);
  const [filteredDocs, setFilteredDocs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [editingDoc, setEditingDoc] = useState(null);
  const [editJson, setEditJson] = useState("");

  /* ───────── Auth ───────── */
  useEffect(() => {
    const unsub = onAuthStateChanged(getAuth(), (u) => {
      if (!u) {
        router.replace("/");
        return;
      }
      setUser(u);
    });
    return () => unsub();
  }, [router]);

  /* ───────── Firestore subscribe ───────── */
  useEffect(() => {
    if (!selectedCollection || !user) return;

    setLoading(true);
    setError(null);

    const q = query(
      collection(db, selectedCollection),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        const items = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        setDocs(items);
        setFilteredDocs(items);
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [selectedCollection, user]);

  /* ───────── Search ───────── */
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredDocs(docs);
      return;
    }

    const term = searchTerm.toLowerCase();
    setFilteredDocs(
      docs.filter((d) =>
        JSON.stringify(d).toLowerCase().includes(term)
      )
    );
  }, [searchTerm, docs]);

  /* ───────── CRUD ───────── */
  const handleDelete = async (id) => {
    if (!confirm(`Delete document ${id}?`)) return;
    await deleteDoc(doc(db, selectedCollection, id));
  };

  const startEdit = (item) => {
    setEditingDoc(item);
    setEditJson(JSON.stringify({ ...item, id: undefined }, null, 2));
  };

  const saveEdit = async () => {
    const parsed = JSON.parse(editJson);
    await updateDoc(
      doc(db, selectedCollection, editingDoc.id),
      parsed
    );
    setEditingDoc(null);
  };

  /* ───────── PDF Export ───────── */
  const generateSummaryPDF = async () => {
    if (!selectedCollection || docs.length === 0) {
      alert("No data to export");
      return;
    }

    const userNames = new Map();
    const uids = new Set();

    docs.forEach((item) => {
      if (item.uid) uids.add(item.uid);
      if (item.userId) uids.add(item.userId);
      if (item.targetUserId) uids.add(item.targetUserId);
    });

    await Promise.all(
      [...uids].map(async (uid) => {
        try {
          const snap = await getDoc(doc(db, "users", uid));
          if (snap.exists()) {
            userNames.set(
              uid,
              snap.data().displayName || "Unknown"
            );
          }
        } catch (e) {
          console.error("Failed to fetch user:", uid, e);
        }
      })
    );

    const pdfDoc = new jsPDF();

    pdfDoc.setFontSize(18);
    pdfDoc.setTextColor(66, 139, 202);
    pdfDoc.text(`Collection: ${selectedCollection}`, 14, 20);

    pdfDoc.setFontSize(11);
    pdfDoc.setTextColor(0);
    pdfDoc.text(`Total documents: ${docs.length}`, 14, 30);
    pdfDoc.text(
      `Generated: ${new Date().toLocaleString()}`,
      14,
      37
    );

    const tableConfig = PDF_TABLE_CONFIG[selectedCollection];

    let head = [];
    let body = [];

    if (tableConfig) {
      head = [tableConfig.headers];
      body = docs.map((item) =>
        tableConfig.mapRow(item, userNames)
      );
    } else {
      const keys = Array.from(
        new Set(docs.flatMap((d) => Object.keys(d)))
      ).filter((k) => k !== "id");

      head = [keys.map((k) => k.toUpperCase())];
      body = docs.map((item) =>
        keys.map((k) => {
          const v = item[k];
          if (v === null || v === undefined) return "—";
          if (typeof v === "object")
            return JSON.stringify(v).slice(0, 80);
          return String(v).slice(0, 80);
        })
      );
    }

    autoTable(pdfDoc, {
      startY: 45,
      head,
      body,
      theme: "grid",
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: {
        fillColor: [66, 139, 202],
        textColor: 255,
      },
      alternateRowStyles: { fillColor: [245, 247, 250] },
    });

    pdfDoc.save(
      `${selectedCollection}_summary_${new Date()
        .toISOString()
        .split("T")[0]}.pdf`
    );
  };

  /* ───────── UI ───────── */
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Authenticating...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6">
      <h1 className="text-3xl font-bold text-amber-400 mb-6">
        Database Browser
      </h1>

      <div className="flex flex-wrap gap-3 mb-6">
        {KNOWN_COLLECTIONS.map((c) => (
          <button
            key={c}
            onClick={() => {
              setSelectedCollection(c);
              setSearchTerm("");
            }}
            className={`px-4 py-2 rounded ${
              selectedCollection === c
                ? "bg-amber-600 text-black"
                : "bg-gray-800"
            }`}
          >
            {c}
          </button>
        ))}

        {selectedCollection && (
          <button
            onClick={generateSummaryPDF}
            className="ml-auto bg-blue-600 px-4 py-2 rounded"
          >
            Export PDF
          </button>
        )}
      </div>

      <input
        className="w-full mb-4 p-2 bg-gray-800 rounded"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {filteredDocs.map((d) => (
        <div
          key={d.id}
          className="border border-gray-800 p-4 rounded mb-2"
        >
          <pre className="text-xs overflow-auto">
            {JSON.stringify(d, null, 2)}
          </pre>
          <div className="mt-2 flex gap-3">
            <button
              onClick={() => startEdit(d)}
              className="text-amber-400"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(d.id)}
              className="text-red-400"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
