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
  updateDoc,
  getDocs,
  writeBatch,
} from "firebase/firestore";

import { getAuth, onAuthStateChanged } from "firebase/auth";

import { db } from "../../firebaseConfig"; // ← adjust path if needed

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const KNOWN_COLLECTIONS = [
  "users",
  "classesRequests",
  "creditRequests",
  "guestlist",
  "notices",
  "upcomingConcerts",
  // add more if needed
];

export default function DatabaseBrowser() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [docs, setDocs] = useState([]);
  const [filteredDocs, setFilteredDocs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Edit modal state
  const [editingDoc, setEditingDoc] = useState(null);
  const [editJson, setEditJson] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), (currentUser) => {
      if (!currentUser) {
        router.replace("/");
        return;
      }
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (!selectedCollection || !user) return;

    setLoading(true);
    setError(null);

    const q = query(collection(db, selectedCollection), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        setDocs(items);
        setFilteredDocs(items);
        setLoading(false);
      },
      (err) => {
        console.error("Firestore error:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [selectedCollection, user]);

  // Client-side search
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredDocs(docs);
      return;
    }

    const term = searchTerm.toLowerCase();
    const results = docs.filter((item) => {
      const str = JSON.stringify(item).toLowerCase();
      return str.includes(term);
    });

    setFilteredDocs(results);
  }, [searchTerm, docs]);

  const handleDelete = async (docId) => {
    if (!confirm(`Delete document ${docId}?`)) return;
    try {
      await deleteDoc(doc(db, selectedCollection, docId));
    } catch (err) {
      alert("Delete failed: " + err.message);
    }
  };

  const startEdit = (item) => {
    setEditingDoc(item);
    setEditJson(JSON.stringify({ ...item, id: undefined }, null, 2));
  };

  const saveEdit = async () => {
    if (!editingDoc || !selectedCollection) return;

    try {
      let updatedData;
      try {
        updatedData = JSON.parse(editJson);
      } catch {
        alert("Invalid JSON format");
        return;
      }

      await updateDoc(doc(db, selectedCollection, editingDoc.id), updatedData);
      setEditingDoc(null);
      setEditJson("");
    } catch (err) {
      alert("Update failed: " + err.message);
    }
  };

  const generateSummaryPDF = () => {
    if (!selectedCollection || docs.length === 0) {
      alert("No data to export");
      return;
    }

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.setTextColor(66, 139, 202);
    doc.text(`Collection: ${selectedCollection}`, 14, 20);

    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`Total documents: ${docs.length}`, 14, 30);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 38);

    let head = [];
    let body = [];

    if (selectedCollection === "creditRequests") {
      head = [["Date", "Name", "Amount", "Payment Method", "Message", "Status", "Proof"]];

      body = docs.map((item) => [
        item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "—",
        item.displayName || "Unknown",
        item.amount || "—",
        item.paymentMethod || "—",
        (item.message || "—").substring(0, 80) + (item.message?.length > 80 ? "..." : ""),
        item.status || "—",
        item.proof ? item.proof.substring(0, 60) + "..." : "—",
      ]);
    } 
    else if (selectedCollection === "classesRequests") {
      head = [["Name", "Date", "Time", "Status"]];

      body = docs.map((item) => [
        item.displayName || "Unknown",
        item.date || "—",
        item.time || "—",
        item.status || "—",
      ]);
    } 
    else {
      head = [["Document ID", "Preview Data"]];
      body = docs.slice(0, 10).map((item) => [
        item.id.substring(0, 12) + "...",
        JSON.stringify(item, null, 2).substring(0, 200) + (JSON.stringify(item).length > 200 ? "..." : ""),
      ]);

      if (docs.length > 10) {
        body.push(["...", `(showing first 10 of ${docs.length} documents)`]);
      }
    }

    autoTable(doc, {
      startY: 50,
      head: head,
      body: body,
      theme: "grid",
      styles: { fontSize: 9, cellPadding: 4, overflow: "linebreak", lineWidth: 0.1, lineColor: [44, 62, 80] },
      headStyles: { fillColor: [66, 139, 202], textColor: [255, 255, 255], fontStyle: "bold" },
      alternateRowStyles: { fillColor: [245, 247, 250] },
      columnStyles: selectedCollection === "creditRequests" ? {
        0: { cellWidth: 30 },
        1: { cellWidth: 40 },
        2: { cellWidth: 25 },
        3: { cellWidth: 40 },
        4: { cellWidth: 50 },
        5: { cellWidth: 30 },
        6: { cellWidth: 45 }
      } : selectedCollection === "classesRequests" ? {
        0: { cellWidth: 60 },
        1: { cellWidth: 40 },
        2: { cellWidth: 30 },
        3: { cellWidth: 40 }
      } : {
        0: { cellWidth: 40 },
        1: { cellWidth: "auto" }
      },
      margin: { top: 50, left: 14, right: 14 }
    });

    const finalY = doc.lastAutoTable.finalY || 50;
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(
      "Generated from admin panel • For full details use the application",
      14,
      finalY + 20
    );

    doc.save(`${selectedCollection}_summary_${new Date().toISOString().split("T")[0]}.pdf`);
  };

  // Bulk delete all documents in selected collection (only for classesRequests & creditRequests)
  const deleteAllDocuments = async () => {
    if (
      !selectedCollection ||
      !["classesRequests", "creditRequests"].includes(selectedCollection)
    ) {
      return;
    }

    const count = docs.length;

    if (!confirm(`DANGER: This will DELETE ALL ${count} documents in ${selectedCollection} permanently!`)) {
      return;
    }

    const confirm2 = prompt(`Type "DELETE ALL ${count}" to confirm:`);

    if (confirm2 !== `DELETE ALL ${count}`) {
      alert("Bulk deletion cancelled.");
      return;
    }

    if (!confirm("Final confirmation: This action is IRREVERSIBLE. Proceed?")) {
      return;
    }

    try {
      const batch = writeBatch(db);
      const colRef = collection(db, selectedCollection);
      const snapshot = await getDocs(colRef);

      snapshot.docs.forEach((d) => {
        batch.delete(d.ref);
      });

      await batch.commit();
      alert(`Successfully deleted all ${snapshot.size} documents from ${selectedCollection}`);
    } catch (err) {
      alert("Bulk delete failed: " + err.message);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">
        <div className="text-xl">Authenticating...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-amber-400">
          Database Browser
        </h1>
        <p className="text-gray-400 mt-2">
          Real-time • Search • Edit • Delete • Bulk Delete • PDF Export
        </p>
      </header>

      {/* Collection buttons + PDF button for each */}
      <div className="flex flex-wrap gap-3 mb-6">
        {KNOWN_COLLECTIONS.map((name) => (
          <div key={name} className="flex items-center gap-2">
            <button
              onClick={() => {
                setSelectedCollection(name);
                setSearchTerm("");
              }}
              className={`
                px-5 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${selectedCollection === name ? "bg-amber-600 text-black" : "bg-gray-800 hover:bg-gray-700"}
              `}
            >
              {name}
            </button>

            <button
              onClick={() => {
                setSelectedCollection(name);
                setTimeout(generateSummaryPDF, 300);
              }}
              className="px-3 py-2 bg-blue-600/80 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition"
              disabled={loading}
              title="Export summary as PDF"
            >
              PDF
            </button>
          </div>
        ))}
      </div>

      {selectedCollection && (
        <>
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-4">
            <h2 className="text-2xl font-semibold flex-1">
              {selectedCollection} <span className="text-gray-500 text-lg">({filteredDocs.length} / {docs.length})</span>
            </h2>

            <input
              type="text"
              placeholder="Search in all fields..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 w-full sm:w-80"
            />
          </div>

          {/* Bulk Delete Button – only for classesRequests & creditRequests */}
          {["classesRequests", "creditRequests"].includes(selectedCollection) && docs.length > 0 && (
            <div className="mb-8">
              <button
                onClick={deleteAllDocuments}
                className="bg-red-700 hover:bg-red-800 text-white px-6 py-3 rounded-lg font-medium transition shadow-lg"
              >
                ⚠️ DELETE ALL {docs.length} DOCUMENTS IN THIS COLLECTION
              </button>
              <p className="text-xs text-red-400 mt-2">
                This button is only shown for class/credit requests. Use with extreme caution.
              </p>
            </div>
          )}

          {loading && <div className="text-center py-12 text-gray-400">Loading...</div>}

          {error && (
            <div className="bg-red-900/40 border border-red-700 p-4 rounded-lg mb-6 text-red-200">
              {error}
            </div>
          )}

          {!loading && !error && filteredDocs.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              {searchTerm ? "No matching documents" : "Collection is empty"}
            </div>
          )}

          {filteredDocs.length > 0 && (
            <div className="overflow-x-auto border border-gray-800 rounded-lg bg-gray-900/40">
              <table className="w-full text-sm">
                <thead className="bg-gray-800 sticky top-0">
                  <tr>
                    <th className="p-4 text-left font-medium">ID</th>
                    <th className="p-4 text-left font-medium">Preview</th>
                    <th className="p-4 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocs.map((item) => (
                    <tr
                      key={item.id}
                      className="border-t border-gray-800 hover:bg-gray-800/60 transition-colors"
                    >
                      <td className="p-4 font-mono text-blue-300">{item.id.substring(0, 12)}...</td>

                      <td className="p-4">
                        <div className="grid grid-cols-[auto,1fr] gap-x-6 gap-y-1 max-w-4xl">
                          {Object.entries(item)
                            .filter(([k]) => k !== "id")
                            .slice(0, 8)
                            .map(([key, val]) => (
                              <div key={key} className="contents">
                                <div className="text-right text-gray-500 font-medium">{key}:</div>
                                <div className="font-mono text-gray-300 break-all">
                                  {JSON.stringify(val).substring(0, 140) +
                                    (JSON.stringify(val).length > 140 ? "..." : "")}
                                </div>
                              </div>
                            ))}
                        </div>
                      </td>

                      <td className="p-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => startEdit(item)}
                          className="text-amber-400 hover:text-amber-300 px-3 py-1.5 rounded hover:bg-amber-950/30 text-xs font-medium mr-2 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-400 hover:text-red-300 px-3 py-1.5 rounded hover:bg-red-950/30 text-xs font-medium transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {!selectedCollection && (
        <div className="text-center py-20 text-gray-500 text-lg">
          Select a collection to browse
        </div>
      )}

      {editingDoc && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setEditingDoc(null)}
        >
          <div
            className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-amber-400">
                  Edit Document: {editingDoc.id.substring(0, 12)}...
                </h3>
                <button
                  onClick={() => setEditingDoc(null)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>

              <textarea
                value={editJson}
                onChange={(e) => setEditJson(e.target.value)}
                className="w-full h-96 p-4 bg-gray-800 text-gray-200 font-mono text-sm rounded border border-gray-700 focus:outline-none focus:border-amber-500 resize-none"
                spellCheck={false}
              />

              <div className="mt-6 flex justify-end gap-4">
                <button
                  onClick={() => setEditingDoc(null)}
                  className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded transition"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEdit}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded transition"
                >
                  Save Changes
                </button>
              </div>

              <p className="mt-4 text-xs text-gray-500">
                Edit as JSON • Be careful with field types and structure
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}