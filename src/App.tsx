import "./App.css";
import { useEffect, useState } from "react";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
  serverTimestamp
} from "firebase/firestore";

type Note = {
  id: string;
  content: string;
  category: string;
  createdAt?: any;
};

const categories = ["All", "Work", "Personal", "Ideas"];

function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  // 🔄 REALTIME FETCH (removed orderBy to avoid crash)
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "notes"), (snapshot) => {
      const data: Note[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Note, "id">)
      }));

      // sort manually (safe)
      data.sort((a, b) => {
        return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0);
      });

      setNotes(data);
    });

    return () => unsubscribe();
  }, []);

  // ➕ ADD NOTE
  const addNote = async () => {
    if (!input.trim()) return;

    try {
      await addDoc(collection(db, "notes"), {
        content: input,
        category: "Work",
        createdAt: serverTimestamp()
      });

      setInput("");
    } catch (err) {
      console.error("Error adding:", err);
    }
  };

  // ❌ DELETE
  const deleteNote = async (id: string) => {
    await deleteDoc(doc(db, "notes", id));
  };

  // ✏️ EDIT
  const editNote = async (id: string, oldText: string) => {
    const newText = prompt("Edit note:", oldText);
    if (!newText) return;

    await updateDoc(doc(db, "notes", id), {
      content: newText
    });
  };

  // 🔍 FILTER
  const filteredNotes = notes.filter((note) => {
    const matchSearch = note.content
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchCategory =
      activeCategory === "All" || note.category === activeCategory;

    return matchSearch && matchCategory;
  });

  return (
    <div className="app">
      <h1>🧠 BrainDrop</h1>

      {/* SEARCH */}
      <input
        className="search"
        placeholder="Search notes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* CATEGORY */}
      <div className="categories">
        {categories.map((cat) => (
          <button
            key={cat}
            className={cat === activeCategory ? "active" : ""}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* INPUT */}
      <div className="inputBox">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Drop your thoughts..."
        />
        <button onClick={addNote}>+</button>
      </div>

      {/* EMPTY STATE */}
      {filteredNotes.length === 0 && (
        <p className="empty">No notes found</p>
      )}

      {/* GRID */}
      <div className="grid">
        {filteredNotes.map((note) => (
          <div className="card" key={note.id}>
            <p>{note.content}</p>

            <small>
              {note.createdAt
                ? new Date(note.createdAt.seconds * 1000).toLocaleString()
                : "Saving..."}
            </small>

            <div className="actions">
              <button onClick={() => editNote(note.id, note.content)}>
                ✏️
              </button>
              <button onClick={() => deleteNote(note.id)}>
                ❌
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;