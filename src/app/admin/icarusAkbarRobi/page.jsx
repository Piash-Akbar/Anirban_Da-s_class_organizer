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
} from "firebase/firestore";

import { getAuth, onAuthStateChanged } from "firebase/auth";

import { db } from "../../firebaseConfig"; // ← adjust path if needed

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
          Real-time • Search • Edit • Delete • Use carefully
        </p>
      </header>

      {/* Collection buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        {KNOWN_COLLECTIONS.map((name) => (
          <button
            key={name}
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

      {/* Edit Modal */}
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