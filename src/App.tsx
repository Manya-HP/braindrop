import { useState } from "react";
import { useNotes } from "./hooks/useNotes";
import NoteCard from "./components/NoteCard/NoteCard";
import Header from "./components/Header/Header";
import CategoryTabs from "./components/CategoryTabs/CategoryTabs";

import "./styles/global.css";
import type { Category } from "./types/note";
import CalendarStrip from "./components/calendarScript/CalendarStrip";

export default function App() {
  const { notes, filter, setFilter, addNote, deleteNote, togglePin } =
    useNotes();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] =
    useState<Exclude<Category, "All">>("Shopping list");

  const handleAddNote = async () => {
    if (newTitle.trim() && newContent.trim()) {
      await addNote(newTitle, newContent, newCategory);
      setNewTitle("");
      setNewContent("");
      setNewCategory("Shopping list");
      setIsModalOpen(false);
    }
  };

  return (
    <div className="container">
      <Header
        search={filter.search}
        setSearch={(value) => setFilter({ ...filter, search: value })}
      />

      <CalendarStrip
        selectedDate={filter.selectedDate}
        setSelectedDate={(date) => setFilter({ ...filter, selectedDate: date })}
      />

      <CategoryTabs
        active={filter.category}
        setActive={(category) => setFilter({ ...filter, category: category })}
      />

      <div className="grid">
        {notes.length === 0 && (
          <p className="empty">
            {filter.search
              ? "No notes match your search"
              : "No notes for this day"}
          </p>
        )}

        {notes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            onDelete={deleteNote}
            onTogglePin={togglePin}
          />
        ))}
      </div>

      <button className="fab" onClick={() => setIsModalOpen(true)}>
        +
      </button>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Add New Note</h2>
            <input
              type="text"
              placeholder="Title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              autoFocus
            />
            <textarea
              placeholder="Content (use new lines for lists)"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
            />
            <select
              value={newCategory}
              onChange={(e) =>
                setNewCategory(e.target.value as Exclude<Category, "All">)
              }
            >
              <option value="Shopping list">🛒 Shopping list</option>
              <option value="Lecture notes">📚 Lecture notes</option>
              <option value="Grocery list">🥬 Grocery list</option>
              <option value="Work">💼 Work</option>
              <option value="Personal">👤 Personal</option>
              <option value="Ideas">💡 Ideas</option>
            </select>
            <div className="modal-actions">
              <button onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button onClick={handleAddNote}>Add Note</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
