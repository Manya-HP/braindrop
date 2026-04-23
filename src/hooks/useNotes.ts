import { useState, useEffect } from "react";
import { db } from "../firebase/config";
import {
  collection,
  onSnapshot,
  query,
  addDoc,
  serverTimestamp,
  deleteDoc,
  doc,
  updateDoc,
  orderBy,
} from "firebase/firestore";
import type { Category, Note, FilterState } from "../types/note";

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [filter, setFilter] = useState<FilterState>({
    search: "",
    category: "All",
    selectedDate: new Date(),
  });

  useEffect(() => {
    const q = query(collection(db, "notes"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Note[];
      setNotes(fetched);
    });
    return () => unsubscribe();
  }, []);

  const addNote = async (
    title: string,
    content: string,
    category: Exclude<Category, "All">,
  ) => {
    if (!title.trim() || !content.trim()) return null;

    const newNote = {
      title: title.trim(),
      content: content.trim(),
      category: category,
      createdAt: serverTimestamp(),
      pinned: false,
    };

    try {
      const docRef = await addDoc(collection(db, "notes"), newNote);

      // 👉 ADD THIS LINE HERE
      console.log("Saved with ID:", docRef.id);

      return docRef.id;
    } catch (error) {
      console.error("Error adding note:", error);
      return null;
    }
  };

  const deleteNote = async (id: string) => {
    await deleteDoc(doc(db, "notes", id));
  };

  const editNote = async (id: string, updates: Partial<Note>) => {
    await updateDoc(doc(db, "notes", id), updates);
  };

  const togglePin = async (id: string, currentPinned: boolean) => {
    await updateDoc(doc(db, "notes", id), { pinned: !currentPinned });
  };

  const filteredNotes = notes.filter((note) => {
    // Search filter
    const matchesSearch =
      note.title?.toLowerCase().includes(filter.search.toLowerCase()) ||
      note.content?.toLowerCase().includes(filter.search.toLowerCase());

    // Category filter
    const matchesCategory =
      filter.category === "All" || note.category === filter.category;

    // Date filter - check if note was created on selected date
    let matchesDate = false;
    if (note.createdAt?.toDate) {
      const noteDate = note.createdAt.toDate();
      matchesDate =
        noteDate.toDateString() === filter.selectedDate.toDateString();
    } else {
      // Fallback for notes without proper date
      matchesDate = true;
    }

    return matchesSearch && matchesCategory && matchesDate;
  });

  // Sort: pinned notes first, then by creation date (newest first)
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;

    // If both have createdAt
    if (a.createdAt?.toDate && b.createdAt?.toDate) {
      return b.createdAt.toDate().getTime() - a.createdAt.toDate().getTime();
    }
    return 0;
  });

  return {
    notes: sortedNotes,
    filter,
    setFilter,
    addNote,
    deleteNote,
    editNote,
    togglePin,
  };
}
